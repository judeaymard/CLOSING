"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Wallet,
  Store,
  User,
  LogOut,
  RefreshCw,
  Plus,
  Menu,
  X,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import { currentPartner } from "@/lib/mock-data";
import NewOrderModal from "@/components/dashboard/NewOrderModal";

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { label: "Expéditions", href: "/dashboard/commandes", icon: Package },
  { label: "Stocks Entrepôt", href: "/dashboard/stocks", icon: Boxes },
  { label: "Coffre & Finances", href: "/dashboard/finances", icon: Wallet },
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
    }, 500);
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Registre Général";
    if (pathname.includes("/commandes")) return "Livre des Expéditions";
    if (pathname.includes("/stocks")) return "Inventaire & Entrepôts";
    if (pathname.includes("/finances")) return "Coffre & Reversements";
    if (pathname.includes("/boutique")) return "Connexion E-commerce";
    if (pathname.includes("/profil")) return "Identité Partenaire";
    return "Portail Marchand";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141A17] flex flex-col md:flex-row antialiased selection:bg-[#0D5940] selection:text-white font-sans">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#FAF9F5] border-r border-[#EAE6DD] p-6 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-3 group py-1"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D9D3C7] bg-white shrink-0 shadow-2xs transition-transform group-hover:scale-105">
              <Image
                src="/images/eno_livraison_logo.png"
                alt="Logo ENO LIVRAISON"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="text-xs font-black tracking-[0.15em] uppercase text-[#141A17] block">
                ENO <span className="text-[#0D5940]">LIVRAISON</span>
              </span>
              <span className="text-[10px] text-[#787163] tracking-wide block">
                Portail Marchand Bénin
              </span>
            </div>
          </Link>

          {/* Partner Identity Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EAE6DD] shadow-[0_2px_8px_rgba(20,26,23,0.03)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D5940] text-white flex items-center justify-center font-black text-sm tracking-tight shrink-0 shadow-xs">
                {currentPartner.companyName.charAt(0)}
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-[#141A17] truncate tracking-tight">
                    {currentPartner.companyName}
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D5940] shrink-0" title="Certifié ENO"></span>
                </div>
                <p className="text-[11px] text-[#787163] truncate mt-0.5">
                  ID: #ENO-{currentPartner.id.slice(0, 6)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8474] px-3 pb-1">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-[#0D5940] border border-[#EAE6DD] shadow-2xs font-extrabold"
                      : "text-[#5C5649] hover:text-[#141A17] hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#0D5940]" : "text-[#8C8474]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D5940]"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="space-y-3 pt-4 border-t border-[#EAE6DD]">
          {/* Direct Support */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EAE6DD] text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#0D5940]">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" /> Ligne Directe Agence
              </span>
              <span className="text-[9px] text-[#0D5940] font-bold bg-[#FAF9F5] border border-[#EAE6DD] px-1.5 py-0.5 rounded-md">
                24h/24
              </span>
            </div>
            <div className="text-[11px] text-[#5C5649] space-y-0.5 font-medium">
              <p>Cotonou : <span className="font-bold text-[#141A17]">01 64 29 18 84</span></p>
              <p>Lokossa : <span className="font-bold text-[#141A17]">01 67 51 00 82</span></p>
            </div>
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#141A17] hover:bg-[#0D5940] text-white font-bold text-[11px] transition-colors mt-1"
            >
              <span>WhatsApp Dédié</span>
              <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
            </a>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => router.push("/partenaire")}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8C8474] hover:text-rose-700 hover:bg-rose-50/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Quitter la session</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-[#FAF9F5] border-b border-[#EAE6DD] p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[#D9D3C7] bg-white">
            <Image
              src="/images/eno_livraison_logo.png"
              alt="Logo ENO LIVRAISON"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-black text-[#141A17]">{currentPartner.companyName}</p>
            <p className="text-[10px] text-[#0D5940] font-bold">ENO LIVRAISON</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0D5940] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Expédier</span>
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-white border border-[#EAE6DD] text-[#141A17]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#141A17]/40 backdrop-blur-xs flex">
          <div className="w-72 bg-[#FAF9F5] h-full p-6 flex flex-col justify-between shadow-2xl border-r border-[#EAE6DD]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D9D3C7] bg-white">
                    <Image
                      src="/images/eno_livraison_logo.png"
                      alt="Logo ENO LIVRAISON"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#141A17]">{currentPartner.companyName}</p>
                    <p className="text-[10px] text-[#0D5940] font-bold">Portail Marchand</p>
                  </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-[#8C8474]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
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
                          ? "bg-white text-[#0D5940] border border-[#EAE6DD] shadow-2xs font-black"
                          : "text-[#5C5649] hover:bg-white/60"
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
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50/60"
            >
              <LogOut className="w-4 h-4" />
              <span>Quitter la session</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE6DD] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base lg:text-lg font-black text-[#141A17] tracking-tight">{getPageTitle()}</h1>
            <p className="text-[11px] text-[#8C8474] font-medium capitalize">
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="w-9 h-9 rounded-xl bg-white border border-[#EAE6DD] hover:bg-[#FAF9F5] text-[#5C5649] flex items-center justify-center transition-all shadow-2xs"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0D5940]" : ""}`} />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141A17] hover:bg-[#0D5940] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Nouvelle Expédition</span>
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
