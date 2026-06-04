"use client";

import { useEffect, useState } from "react";
import { getSession, SessionUser } from "@/lib/api";

export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getSession()?.user || null);
  }, []);

  return user;
}
