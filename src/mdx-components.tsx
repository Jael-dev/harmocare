import type { MDXComponents } from "mdx/types";
import { BlogHero } from "@/components/mdx/BlogHero";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    BlogHero,
    ...components,
  };
}
