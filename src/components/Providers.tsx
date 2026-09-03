"use client";

import React from "react";
import { OperationsProvider } from "@/lib/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <OperationsProvider>{children}</OperationsProvider>;
}
