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
  Bell,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  Store,
} from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { label: "Vue Générale", href: "/admin", icon: LayoutDashboard },
  { label: "Closing & Commandes", href: "/admin/commandes", icon: PhoneCall },
  { label: "Boutiques Partenaires", href: "/admin/partenaires", icon: Users },
  { label: "Gestion des Stocks", href: "/admin/stocks", icon: Boxes },
  { label: "Finances & Reversements", href: "/admin/finances", icon: BadgeDollarSign },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Tableau de bord Agence & Closeuses";
    if (pathname.includes("/commandes")) return "Gestion & Closing des Commandes";
    if (pathname.includes("/partenaires")) return "Boutiques E-commerce Partenaires";
    if (pathname.includes("/stocks")) return "Entrepôt & Stocks Globaux";
    if (pathname.includes("/finances")) return "Finances & Reversements Agence";
    return "Espace Agence ENO";
  };

  return (
    <div className="min-h-screen bg-[#07130e] text-white flex flex-col md:flex-row antialiased selection:bg-[#16a34a] selection:text-white">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#091b14] border-r border-emerald-950 p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* ENO Brand Header with Logo */}
          <Link href="/" className="flex items-center gap-3 p-2 bg-[#0d261c] rounded-2xl border border-emerald-900/60 shadow-sm">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 bg-white shrink-0">
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
                <span className="text-xs font-black text-white">ENO LIVRAISON</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                ADMINISTRATION AGENCE
              </p>
            </div>
          </Link>

          {/* Quick link to partner view */}
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-200 text-xs font-semibold border border-emerald-900/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#22c55e]" />
              Voir Vue Partenaire
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              Afrimarket
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20 font-black"
                      : "text-emerald-100/70 hover:text-white hover:bg-emerald-900/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-emerald-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-emerald-900/60">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-200">Agences ENO</span>
              <span className="text-[9px] bg-emerald-500/20 text-[#22c55e] px-1.5 py-0.5 rounded font-black">2 Pôles</span>
            </div>
            <p className="text-[10px] text-emerald-300/80">📍 Cotonou : +229 01 64 29 18 84</p>
            <p className="text-[10px] text-emerald-300/80">📍 Lokossa : +229 01 67 51 00 82</p>
          </div>

          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-200/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden flex items-center justify-between bg-[#091b14] border-b border-emerald-950 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-white">
            <Image
              src="/images/eno_livraison_logo.png"
              alt="Logo ENO LIVRAISON"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-white">ADMIN ENO LIVRAISON</p>
            <p className="text-[10px] text-emerald-400">Centre Closing & Dispatch</p>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-emerald-950 text-emerald-200"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#091b14] h-full p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 bg-white">
                    <Image
                      src="/images/eno_livraison_logo.png"
                      alt="Logo ENO LIVRAISON"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Centre Closing</p>
                    <p className="text-xs text-emerald-400">Admin ENO LIVRAISON</p>
                  </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-emerald-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                        isActive ? "bg-[#16a34a] text-white" : "text-emerald-200/70 hover:text-white hover:bg-emerald-900/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => router.push("/partenaire")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#091b14]/80 backdrop-blur border-b border-emerald-950 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg lg:text-xl font-black text-white tracking-tight">{getPageTitle()}</h1>
            <p className="text-[11px] text-emerald-400 font-semibold capitalize">
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date())}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="w-10 h-10 rounded-2xl bg-[#0d261c] border border-emerald-900/60 hover:bg-emerald-900/40 text-emerald-300 flex items-center justify-center transition-all shadow-sm"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#22c55e]" : ""}`} />
            </button>

            <button
              className="w-10 h-10 rounded-2xl bg-[#0d261c] border border-emerald-900/60 hover:bg-emerald-900/40 text-emerald-300 flex items-center justify-center transition-all relative shadow-sm"
              title="Alertes"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            <Link
              href="/admin/commandes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Traiter les appels</span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
