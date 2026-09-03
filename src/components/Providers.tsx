"use client";

import React from "react";
import { OperationsProvider } from "@/lib/store";
import SupportChatWidget from "@/components/SupportChatWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OperationsProvider>
      {children}
      <SupportChatWidget />
    </OperationsProvider>
  );
}
