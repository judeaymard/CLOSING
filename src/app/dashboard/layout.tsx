"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    if (pathname.includes("/finances")) return "Finances & Reversements";
    if (pathname.includes("/boutique")) return "Boutique en ligne";
    if (pathname.includes("/profil")) return "Mon Profil";
    return "Espace Partenaire";
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
              <span className="text-sm font-black text-white block tracking-tight">
                ENO <span className="text-[#22c55e]">LIVRAISON</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider truncate">
                Vos colis, notre priorité
              </span>
            </div>
          </Link>

          {/* Partner profile header */}
          <div className="flex items-center gap-3 p-3 bg-emerald-950/40 rounded-2xl border border-emerald-900/40">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-600/20">
              {currentPartner.companyName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentPartner.companyName}</h4>
              <p className="text-[10px] text-emerald-200/60 truncate">{currentPartner.fullName}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {NAV_ITEMS.map((item) => {
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
        <div className="space-y-3 pt-4 border-t border-emerald-900/60">
          {/* Direct Agency Assistance */}
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400">
              <span>Assistance Agences</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <p>📍 Cotonou : <strong className="text-white font-mono">01 64 29 18 84</strong></p>
              <p>📍 Lokossa : <strong className="text-white font-mono">01 67 51 00 82</strong></p>
            </div>
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-1.5 rounded-xl bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-[10px] transition-colors mt-2"
            >
              WhatsApp Support
            </a>
          </div>

          {/* Active Account Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Boutique certifiée ENO</span>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-200/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
            <p className="text-xs font-bold text-white">{currentPartner.companyName}</p>
            <p className="text-[10px] text-emerald-400 font-bold">ENO LIVRAISON</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-emerald-950 text-emerald-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
                    <p className="text-sm font-bold text-white">{currentPartner.companyName}</p>
                    <p className="text-xs text-emerald-400">ENO LIVRAISON</p>
                  </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-emerald-300">
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
                          ? "bg-[#16a34a] text-white"
                          : "text-emerald-200/70 hover:text-white hover:bg-emerald-900/40"
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
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#22c55e]"></span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
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
