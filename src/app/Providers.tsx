"use client";
import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AuthSessionProps {
  session?: Session | null;
  children: React.ReactNode;
}
const queryClient = new QueryClient();

export const NextAuthSessionProvider = ({
  children,
  session,
}: AuthSessionProps) => (
  <SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </SessionProvider>
);
