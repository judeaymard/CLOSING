"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Boxes,
  BadgeDollarSign,
  LogOut,
  RefreshCw,
  Menu,
  X,
  Store,
  Bike,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { useOperations } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { orders, payoutRequests } = useOperations();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const navItems = [
    { label: "Vue Générale", href: "/admin", icon: LayoutDashboard },
    {
      label: "Closing & Commandes",
      href: "/admin/commandes",
      icon: PhoneCall,
      badge: orders.filter((o) => o.status === "EN_ATTENTE").length,
    },
    { label: "Flotte Livreurs & Caisse", href: "/admin/livreurs", icon: Bike },
    { label: "Boutiques Partenaires", href: "/admin/partenaires", icon: Users },
    { label: "Gestion des Stocks", href: "/admin/stocks", icon: Boxes },
    {
      label: "Finances & Retraits",
      href: "/admin/finances",
      icon: BadgeDollarSign,
      badge: payoutRequests.filter((p) => p.status === "PENDING").length,
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin") return "Direction Générale & Supervision";
    if (pathname.includes("/commandes")) return "Traitement & Closing des Commandes";
    if (pathname.includes("/livreurs")) return "Gestion de la Flotte & Caisse Terrain";
    if (pathname.includes("/partenaires")) return "Boutiques E-commerce Partenaires";
    if (pathname.includes("/stocks")) return "Entrepôts & Stocks Globaux";
    if (pathname.includes("/finances")) return "Finances, COD & Validation des Retraits";
    return "Espace Direction ENO";
  };

  const pendingPayoutsCount = payoutRequests.filter((p) => p.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col md:flex-row antialiased selection:bg-[#16a34a] selection:text-white font-sans">
      {/* 🖤 SIDEBAR (Desktop) - Noir Ébène Pur */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#0e0e12] border-r border-zinc-800/80 p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* ENO Brand Header */}
          <Link
            href="/"
            className="flex items-center gap-3 p-2.5 bg-[#141418] rounded-2xl border border-zinc-800 shadow-sm group transition-colors hover:border-zinc-700"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 bg-white shrink-0 shadow-sm">
              <Image
                src="/images/eno_livraison_logo.png"
                alt="Logo ENO LIVRAISON"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-tight">ENO LIVRAISON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                Direction Générale
              </p>
            </div>
          </Link>

          {/* 👑 Carte Profil PDG Authentique */}
          <div className="p-3.5 rounded-2xl bg-[#141418] border border-zinc-800/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-emerald-500/80 text-emerald-400 flex items-center justify-center font-black text-sm shadow-md shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-white truncate">PDG & Direction</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold truncate mt-0.5">
                Super Administrateur • Cotonou HQ
              </p>
            </div>
          </div>

          {/* Espace Partenaire Rapide */}
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141418] hover:bg-[#1a1a20] text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portail Marchand</span>
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
              Afrimarket
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-white text-black font-black shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-black" : "text-zinc-400 group-hover:text-emerald-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && item.badge === undefined && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-zinc-800/80">
          <div className="p-3.5 rounded-2xl bg-[#141418] border border-zinc-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-400">
              <span>Opérations ENO Live</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-zinc-200">
              {orders.filter((o) => o.status === "LIVREE").length} colis livrés aujourd&apos;hui
            </p>
            {pendingPayoutsCount > 0 && (
              <p className="text-[11px] text-amber-400 font-bold">
                ⚠️ {pendingPayoutsCount} retrait(s) à valider
              </p>
            )}
          </div>

          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex flex-col bg-[#0e0e12] border-b border-zinc-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-white">
              <Image
                src="/images/eno_livraison_logo.png"
                alt="Logo ENO"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-xs text-white">ENO DIRECTION</span>
              <span className="text-[10px] text-zinc-400 block font-bold">Super Admin</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <nav className="p-4 space-y-1.5 border-t border-zinc-800 bg-[#0e0e12]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${
                    isActive ? "bg-white text-black font-black" : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* 🖤 MAIN CONTENT AREA - Noir Ébène Pur */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-[#0e0e12] border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-zinc-400">
              Hub Central Cotonou & Lokossa • Direction Générale
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-[#141418] border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer ${
                isRefreshing ? "rotate-180 text-emerald-400" : ""
              }`}
              title="Rafraîchir les flux"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141418] hover:bg-[#1a1a20] border border-zinc-800 text-xs font-bold text-zinc-300"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vue Partenaire</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
