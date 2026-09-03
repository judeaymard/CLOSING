"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { OperationsProvider } from "@/lib/store";
import SupportChatWidget from "@/components/SupportChatWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChat = pathname !== "/partenaire" && pathname !== "/";

  return (
    <OperationsProvider>
      {children}
      {showChat && <SupportChatWidget />}
    </OperationsProvider>
  );
}
