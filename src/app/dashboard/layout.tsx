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
  Headphones,
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row antialiased selection:bg-[#16a34a] selection:text-white font-sans">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-white border-r border-slate-200/80 p-5 shrink-0 min-h-screen sticky top-0 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="space-y-5">
          {/* ENO Brand Header with Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/80 transition-colors"
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
              <span className="text-sm font-black text-slate-900 block tracking-tight leading-none">
                ENO <span className="text-[#16a34a]">LIVRAISON</span>
              </span>
              <span className="text-[9px] uppercase font-black text-emerald-600 block tracking-wider truncate mt-1">
                Vos colis, notre priorité
              </span>
            </div>
          </Link>

          {/* Partner profile header */}
          <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-600/20 shrink-0">
              {currentPartner.companyName.charAt(0)}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">{currentPartner.companyName}</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Boutique certifiée ENO"></span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{currentPartner.fullName}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-[#16a34a] text-white shadow-md shadow-emerald-600/20 font-black"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-[#16a34a]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          {/* Direct Agency Assistance */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-700">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" /> Assistance Agences
              </span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Direct
              </span>
            </div>
            <div className="space-y-0.5 text-[11px] text-slate-600">
              <p>📍 Cotonou : <strong className="text-slate-900 font-bold">01 64 29 18 84</strong></p>
              <p>📍 Lokossa : <strong className="text-slate-900 font-bold">01 67 51 00 82</strong></p>
            </div>
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 rounded-xl bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-colors mt-2"
            >
              WhatsApp Support Direct
            </a>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-40 shadow-sm">
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
            <p className="text-xs font-bold text-slate-900">{currentPartner.companyName}</p>
            <p className="text-[10px] text-emerald-600 font-bold">ENO LIVRAISON</p>
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
            className="p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
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
                    <p className="text-sm font-bold text-slate-900">{currentPartner.companyName}</p>
                    <p className="text-xs text-emerald-600 font-semibold">ENO LIVRAISON</p>
                  </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1.5">
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
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
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
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200/80 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <h1 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">{getPageTitle()}</h1>
            <p className="text-[11px] text-slate-500 font-semibold capitalize">
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
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all shadow-sm"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#16a34a]" : ""}`} />
            </button>

            <button
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all relative shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#16a34a]"></span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle commande</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global New Order Modal */}
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
