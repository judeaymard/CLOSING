"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Wallet,
  Store,
  User,
  LogOut,
  Bell,
  RefreshCw,
  Plus,
  Truck,
  Menu,
  X,
} from "lucide-react";
import { currentPartner } from "@/lib/mock-data";
import NewOrderModal from "@/components/dashboard/NewOrderModal";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Commandes", href: "/dashboard/commandes", icon: ShoppingCart },
  { label: "Stocks", href: "/dashboard/stocks", icon: Boxes },
  { label: "Finances", href: "/dashboard/finances", icon: Wallet },
  { label: "Boutique en ligne", href: "/dashboard/boutique", icon: Store },
  { label: "Mon Profil", href: "/dashboard/profil", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Tableau de bord";
    if (pathname.includes("/commandes")) return "Mes commandes";
    if (pathname.includes("/stocks")) return "Gestion des stocks";
    if (pathname.includes("/finances")) return "Finances & Commissions";
    if (pathname.includes("/boutique")) return "Boutique en ligne";
    if (pathname.includes("/profil")) return "Mon Profil";
    return "Espace Partenaire";
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-white flex flex-col md:flex-row antialiased selection:bg-[#06b6d4] selection:text-white">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#090e22] border-r border-slate-800 p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Partner profile header */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-[#06b6d4] flex items-center justify-center text-white font-black text-base shadow-lg shadow-cyan-500/20">
              A
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{currentPartner.companyName}</h4>
              <p className="text-[11px] text-slate-400 truncate">{currentPartner.email}</p>
            </div>
          </div>

          {/* Platform brand small badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <Truck className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[11px] font-black tracking-wider text-slate-300 uppercase">
              scms<span className="text-[#06b6d4]">livraison</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-[#06b6d4]/20 to-[#06b6d4]/5 text-[#06b6d4] border border-[#06b6d4]/30 shadow-md shadow-cyan-500/5"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#06b6d4]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          {/* Active Account Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Compte actif</span>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden flex items-center justify-between bg-[#090e22] border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#06b6d4] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-xs font-bold text-white">{currentPartner.companyName}</p>
            <p className="text-[10px] text-slate-400">scmslivraison</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl bg-[#06b6d4] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#090e22] h-full p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06b6d4] flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{currentPartner.companyName}</p>
                    <p className="text-xs text-slate-400">{currentPartner.email}</p>
                  </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                        isActive
                          ? "bg-[#06b6d4] text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
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
        <header className="h-20 bg-[#090e22]/80 backdrop-blur border-b border-slate-800/80 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg lg:text-xl font-black text-white tracking-tight">{getPageTitle()}</h1>
            <p className="text-[11px] text-slate-400 capitalize">
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
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-all shadow-sm"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#06b6d4]" : ""}`} />
            </button>

            <button
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-all relative shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#06b6d4]"></span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle commande</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global New Order Modal */}
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
