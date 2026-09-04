"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Landmark,
  BadgeDollarSign,
  Bike,
  FileText,
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  ChevronDown,
  Sparkles,
  Users,
  Headset,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { UserRole } from "@/lib/types";

export default function TresorerieLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    switchRole,
    activeTreasuryManager,
    alerts,
    codRemittances,
  } = useOperations();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const pendingRemittancesCount = codRemittances.filter((r) => r.status === "PENDING_VALIDATION").length;

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
    if (role === "PDG") router.push("/admin");
    else if (role === "CLOSEUSE") router.push("/admin/closeuses");
    else if (role === "LIVREUR") router.push("/admin/livreurs");
    else if (role === "PARTNER") router.push("/dashboard");
    else if (role === "TREASURY_MANAGER") router.push("/tresorerie");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* 👑 HEADER PRINCIPAL DU RESPONSABLE DE TRÉSORERIE */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <Link href="/tresorerie" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:bg-slate-800 transition-colors">
              <Landmark className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900 tracking-tight">ENO LIVRAISON</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                  CAISSE & TRÉSORERIE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Guichet & Contrôle des Fonds COD</p>
            </div>
          </Link>
        </div>

        {/* Right Info & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Hub Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeTreasuryManager?.zone || "Hub Central Cadjehoun"}</span>
          </div>

          {/* Pending Alert Badge */}
          {pendingRemittancesCount > 0 && (
            <Link
              href="/tresorerie#remises"
              className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{pendingRemittancesCount} remise(s) à valider</span>
            </Link>
          )}

          {/* 🔄 ROLE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                {activeTreasuryManager?.firstName?.charAt(0) || "T"}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {activeTreasuryManager?.name || "Responsable Trésorerie"}
                </span>
                <span className="block text-[10px] text-emerald-700 font-semibold leading-tight">
                  Trésorier Connecté
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Changer d&apos;Espace (Pair Programming)
                </div>

                <button
                  onClick={() => handleRoleChange("PDG")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-900" />
                    <span>PDG / Super Admin</span>
                  </div>
                  <span className="text-[10px] text-slate-400">/admin</span>
                </button>

                <button
                  onClick={() => handleRoleChange("TREASURY_MANAGER")}
                  className="w-full text-left px-4 py-2 bg-emerald-50 text-emerald-950 font-bold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span>Responsable Trésorerie</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Actif</span>
                </button>

                <button
                  onClick={() => handleRoleChange("CLOSEUSE")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Headset className="w-4 h-4 text-blue-600" />
                    <span>Pôle Closeuses</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange("LIVREUR")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-amber-600" />
                    <span>Flotte Livreurs</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange("PARTNER")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>E-commerçant</span>
                  </div>
                  <span className="text-[10px] text-slate-400">/dashboard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 px-4 sm:px-8 py-4 text-center text-xs text-slate-500">
        <p>ENO LIVRAISON © 2027 — Espace Sécurisé Responsable de Trésorerie & Contrôle COD</p>
      </footer>
    </div>
  );
}
