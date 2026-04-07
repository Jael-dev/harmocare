"use client";

import { createContext, useContext, useState, useEffect } from "react";

const COOKIE_KEY = "harmocares_waitlist";

const WaitlistContext = createContext<{
  joined: boolean;
  setJoined: (v: boolean) => void;
}>({ joined: false, setJoined: () => {} });

export function useWaitlist() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [joined, setJoinedState] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`)
    );
    if (match && match[1] === "true") {
      setJoinedState(true);
    }
  }, []);

  function setJoined(v: boolean) {
    setJoinedState(v);
    if (v) {
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${COOKIE_KEY}=true; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  }

  return (
    <WaitlistContext.Provider value={{ joined, setJoined }}>
      {children}
    </WaitlistContext.Provider>
  );
}
