"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { OperationsProvider } from "@/lib/store";
import SupportChatWidget from "@/components/SupportChatWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Le widget de support client s'affiche sur le portail marchand et les pages de suivi public, sans encombrer l'espace admin
  const showChat = pathname.startsWith("/dashboard") || pathname.startsWith("/suivi");

  return (
    <OperationsProvider>
      {children}
      {showChat && <SupportChatWidget />}
    </OperationsProvider>
  );
}
