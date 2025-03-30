"use client";

import { SessionProvider } from "next-auth/react";
import { ToastManager } from "./Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastManager>{children}</ToastManager>
    </SessionProvider>
  );
}
