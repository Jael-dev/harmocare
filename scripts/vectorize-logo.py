"""
Vectorize the Harmocare logo using potrace for clean SVG output.
Uses potrace with backend=svg and proper scaling so all elements share
the same coordinate system.
"""

import subprocess
import numpy as np
from PIL import Image
import tempfile
import os
import re

INPUT = "/Users/macbook/Desktop/Projects/Harmocare/Images/Logo Design/logo.png"
OUTPUT = "/Users/macbook/code/harmocare/public/logo.svg"

def create_mask_bmp(pixels, h, w, color_low, color_high):
    """Create a BMP mask for pixels in a color range."""
    mask = np.ones((h, w), dtype=bool)
    for c in range(3):
        mask &= (pixels[:,:,c] >= color_low[c]) & (pixels[:,:,c] <= color_high[c])
    bw = np.where(mask, 0, 255).astype(np.uint8)
    return Image.fromarray(bw, mode='L')

def trace_to_svg_string(mask_img):
    """Trace with potrace, return raw SVG string."""
    with tempfile.NamedTemporaryFile(suffix='.bmp', delete=False) as f:
        bmp_path = f.name
        bw = mask_img.point(lambda x: 0 if x < 128 else 255, '1')
        bw.save(bmp_path)

    with tempfile.NamedTemporaryFile(suffix='.svg', delete=False) as f:
        svg_path = f.name

    try:
        # Use -u 1 so 1 potrace unit = 1 pixel
        subprocess.run([
            'potrace', bmp_path,
            '-b', 'svg',
            '-s',
            '-o', svg_path,
            '-t', '10',         # suppress speckles under 10px
            '-a', '1.0',        # corner threshold
            '-O', '0.2',        # curve optimization tolerance
            '--flat',
            '-u', '1',          # 1 unit = 1 pixel
        ], check=True, capture_output=True)

        with open(svg_path, 'r') as f:
            return f.read()
    finally:
        os.unlink(bmp_path)
        os.unlink(svg_path)

def main():
    img = Image.open(INPUT).convert("RGBA")

    # Composite onto the beige background
    bg = Image.new("RGBA", img.size, (248, 244, 240, 255))
    bg.paste(img, mask=img.split()[3])
    img_rgb = bg.convert("RGB")

    pixels = np.array(img_rgb)
    h, w = pixels.shape[:2]
    print(f"Image size: {w}x{h}")

    # --- Trace purple layer ---
    purple_mask = create_mask_bmp(pixels, h, w, [120, 100, 160], [200, 175, 225])
    purple_svg_raw = trace_to_svg_string(purple_mask)

    # Extract the <g> block with transform and paths
    # potrace with -u 1 gives viewBox="0 0 W H" and
    # transform="translate(0,H) scale(1,-1)" (flips Y axis)
    # We keep the <g> with its transform so paths render correctly.
    g_match = re.search(r'(<g\s+transform="[^"]*"[^>]*>.*?</g>)', purple_svg_raw, re.DOTALL)
    purple_group = g_match.group(1) if g_match else ""
    # Set the fill color
    purple_group = purple_group.replace('fill="#000000"', 'fill="#9B8BBE"')
    purple_group = purple_group.replace("fill='#000000'", 'fill="#9B8BBE"')
    purple_group = re.sub(r'stroke="none"', 'stroke="none" fill="#9B8BBE"', purple_group, count=1)

    # --- Peach dot: detect as circle ---
    peach_mask_arr = np.ones((h, w), dtype=bool)
    for c, (lo, hi) in enumerate(zip([210, 150, 130], [250, 200, 185])):
        peach_mask_arr &= (pixels[:,:,c] >= lo) & (pixels[:,:,c] <= hi)

    peach_count = np.sum(peach_mask_arr)
    peach_elem = ""
    if peach_count > 20:
        ys, xs = np.where(peach_mask_arr)
        cx = (np.min(xs) + np.max(xs)) / 2
        cy = (np.min(ys) + np.max(ys)) / 2
        rx = (np.max(xs) - np.min(xs)) / 2
        ry = (np.max(ys) - np.min(ys)) / 2
        r = (rx + ry) / 2
        peach_elem = f'  <circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="#E8A68A" />'
        print(f"Peach circle: cx={cx:.1f}, cy={cy:.1f}, r={r:.1f}")

    # --- Build clean SVG ---
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
{purple_group}
{peach_elem}
</svg>
'''

    with open(OUTPUT, 'w') as f:
        f.write(svg)

    size = os.path.getsize(OUTPUT)
    print(f"SVG saved to {OUTPUT} ({size/1024:.1f} KB)")

    # Also save debug
    with open("/tmp/potrace_raw.svg", "w") as f:
        f.write(purple_svg_raw)
    print("Debug: /tmp/potrace_raw.svg")

if __name__ == "__main__":
    main()
