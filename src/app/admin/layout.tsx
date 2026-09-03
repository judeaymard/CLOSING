"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bike,
  Boxes,
  Users,
  MessageSquare,
  BadgeDollarSign,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  ExternalLink,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import SpotlightSearchModal from "@/components/admin/SpotlightSearchModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { orders, payoutRequests, conversations, alerts } = useOperations();

  const pendingPayoutsCount = payoutRequests.filter((p) => p.status === "PENDING").length;
  const urgentConversationsCount = conversations.filter((c) => c.status === "URGENT" || c.unreadCount > 0).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "EN_ATTENTE").length;

  const totalNotifications = pendingPayoutsCount + urgentConversationsCount + alerts.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getPageMeta = () => {
    if (pathname === "/admin") return { title: "Command Center", subtitle: "Vue d'ensemble et pilotage" };
    if (pathname.includes("/commandes")) return { title: "Commandes & Closing", subtitle: "Traitement et télévente" };
    if (pathname.includes("/livreurs")) return { title: "Flotte Coursiers", subtitle: "Tournées et encaissements COD" };
    if (pathname.includes("/partenaires")) return { title: "E-commerçants", subtitle: "Portefeuille marchands" };
    if (pathname.includes("/stocks")) return { title: "Entrepôt & Stocks", subtitle: "Inventaire et dépôts" };
    if (pathname.includes("/finances")) return { title: "Finances & Retraits", subtitle: "Arbitrage et trésorerie" };
    if (pathname.includes("/conversations")) return { title: "Communication Hub", subtitle: "Support et télévente" };
    return { title: "Espace Direction", subtitle: "Supervision des opérations" };
  };

  const navSections = [
    {
      title: "Général",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "Opérations",
      items: [
        { label: "Commandes", href: "/admin/commandes", icon: Package, badge: pendingOrdersCount, badgeColor: "bg-slate-900 text-white" },
        { label: "Flotte Livreurs", href: "/admin/livreurs", icon: Bike },
        { label: "Stocks Entrepôt", href: "/admin/stocks", icon: Boxes },
      ],
    },
    {
      title: "Équipe & Réseau",
      items: [
        { label: "E-commerçants", href: "/admin/partenaires", icon: Users },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Conversations",
          href: "/admin/conversations",
          icon: MessageSquare,
          badge: urgentConversationsCount > 0 ? urgentConversationsCount : undefined,
          badgeColor: "bg-slate-900 text-white",
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          label: "Retraits & Trésorerie",
          href: "/admin/finances",
          icon: BadgeDollarSign,
          badge: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined,
          badgeColor: "bg-amber-500 text-slate-950 font-black",
        },
      ],
    },
  ];

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* 🔍 Spotlight Modal */}
      <SpotlightSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* 🚀 COMPACT & CLEAN SIDEBAR (Desktop) */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/90 shrink-0 h-screen sticky top-0 transition-all duration-200 z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
          sidebarCollapsed ? "w-16 p-2" : "w-56 lg:w-60 p-3.5"
        }`}
      >
        {/* 1. Header Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
              <Image
                src="/images/eno_livraison_logo.png"
                alt="Logo ENO"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-black tracking-tight text-slate-900 block leading-tight">
                  ENO LIVRAISON
                </span>
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                  Command Center
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Agrandir" : "Réduire"}
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* 2. Compact PDG Badge */}
        {!sidebarCollapsed && (
          <div className="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                JS
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-slate-900 truncate leading-tight">Jude S.</h4>
                <p className="text-[9px] text-slate-500 truncate leading-tight">Direction Générale</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="En ligne"></span>
          </div>
        )}

        {/* 3. Navigation Links (Compact & Continuous) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pt-1">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-0.5">
              {!sidebarCollapsed && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 block">
                  {sec.title}
                </span>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sidebarCollapsed ? "p-2 justify-center" : "px-2.5 py-1.5"
                      } ${
                        isActive
                          ? "bg-slate-900 text-white font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Bottom Compact Actions */}
        <div className="pt-2 mt-2 border-t border-slate-200/80 space-y-0.5 shrink-0">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              sidebarCollapsed ? "p-2 justify-center" : "px-2.5 py-1.5"
            }`}
            title="Portail Marchand"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span>Portail Marchand</span>}
          </Link>

          <button
            onClick={() => router.push("/partenaire")}
            className={`flex items-center gap-2 w-full rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
              sidebarCollapsed ? "p-2 justify-center" : "px-2.5 py-1.5"
            }`}
            title="Déconnexion"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 bg-white">
            <Image src="/images/eno_livraison_logo.png" alt="ENO" fill className="object-contain" />
          </div>
          <div>
            <span className="font-black text-xs text-slate-900 block leading-none">ENO COMMAND</span>
            <span className="text-[9px] font-semibold text-slate-500">Super Admin</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-900">Menu Command Center</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded-lg text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9px] font-bold uppercase text-slate-400 px-2 block">{sec.title}</span>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                          isActive ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏛️ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-6 py-3 items-center justify-between sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Breadcrumb & Title */}
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
              <span>ENO LIVRAISON</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-700">{pageMeta.title}</span>
            </div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">
              {pageMeta.title}
            </h1>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 text-xs font-medium w-72 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-left text-[11px]">Rechercher (colis, marchand...)</span>
            <kbd className="text-[9px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalNotifications}
                </span>
              )}
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Portail Marchand</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 flex-1 mt-12 md:mt-0">{children}</main>
      </div>
    </div>
  );
}
