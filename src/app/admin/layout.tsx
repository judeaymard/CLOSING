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
  Shield,
  AlertTriangle,
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
    if (pathname === "/admin") return { title: "Command Center", subtitle: "Vue d'ensemble et pilotage en temps réel" };
    if (pathname.includes("/commandes")) return { title: "Opérations & Closing", subtitle: "Traitement des commandes et télévente" };
    if (pathname.includes("/livreurs")) return { title: "Flotte Coursiers", subtitle: "Suivi des tournées et caisse terrain (COD)" };
    if (pathname.includes("/partenaires")) return { title: "Boutiques E-commerce", subtitle: "Portefeuille marchands et partenariats" };
    if (pathname.includes("/stocks")) return { title: "Entrepôts & Stocks", subtitle: "Inventaire et dépôts logistiques" };
    if (pathname.includes("/finances")) return { title: "Centre Financier", subtitle: "Arbitrage des retraits et reversements marchands" };
    if (pathname.includes("/conversations")) return { title: "Hub de Communication", subtitle: "Messagerie marchands, IA et support agents" };
    return { title: "Espace Direction ENO", subtitle: "Supervision des opérations" };
  };

  const navSections = [
    {
      title: "Vue Générale",
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
      {/* 🔍 Global Spotlight Search Modal */}
      <SpotlightSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* 🚀 SIDEBAR (Desktop) — 2027 Calm & Ultra-Clean SaaS */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200/80 shrink-0 min-h-screen sticky top-0 transition-all duration-300 z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
          sidebarCollapsed ? "w-20 p-3" : "w-64 lg:w-72 p-5"
        }`}
      >
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              <div className="relative w-9 h-9 rounded-2xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
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
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-tight text-slate-900 leading-tight">
                      ENO LIVRAISON
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Command Center
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 👑 PDG Executive Identity Pill */}
          {!sidebarCollapsed ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                  JS
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">Jude SINABEROGUI</h4>
                  <p className="text-[10px] text-slate-500 truncate">Direction Générale • HQ</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="En ligne"></span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs" title="Jude (Super Admin)">
                JS
              </div>
            </div>
          )}

          {/* Nav Sections */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                    {sec.title}
                  </span>
                )}
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          sidebarCollapsed ? "p-3 justify-center" : "px-3.5 py-2.5"
                        } ${
                          isActive
                            ? "bg-slate-900 text-white font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                        }`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-800"
                            }`}
                          />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                        </div>
                        {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
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

        {/* Bottom Actions */}
        <div className="space-y-1 pt-4 border-t border-slate-200/80">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              sidebarCollapsed ? "p-3 justify-center" : "px-3 py-2"
            }`}
            title={sidebarCollapsed ? "Vue Marchand" : undefined}
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            {!sidebarCollapsed && <span>Portail Marchand</span>}
          </Link>

          <button
            onClick={() => router.push("/partenaire")}
            className={`flex items-center gap-2.5 w-full rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
              sidebarCollapsed ? "p-3 justify-center" : "px-3 py-2"
            }`}
            title={sidebarCollapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-200 bg-white">
            <Image src="/images/eno_livraison_logo.png" alt="ENO" fill className="object-contain" />
          </div>
          <div>
            <span className="font-black text-xs text-slate-900 block leading-none">ENO COMMAND</span>
            <span className="text-[9px] font-semibold text-slate-500">Super Admin</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-black text-slate-900">Navigation Command Center</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block">{sec.title}</span>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                          isActive ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
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
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-6 lg:px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Breadcrumb & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>ENO LIVRAISON</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-700">{pageMeta.title}</span>
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
              {pageMeta.title}
            </h1>
          </div>

          {/* Center Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/60 text-xs font-medium w-80 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-left">Recherche globale (colis, marchand...)</span>
            <kbd className="text-[10px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-3 relative">
            {/* Notification Bell with Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900">Centre d&apos;Alertes</h4>
                      <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {totalNotifications}
                      </span>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {pendingPayoutsCount > 0 && (
                      <Link
                        href="/admin/finances"
                        onClick={() => setNotificationsOpen(false)}
                        className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 hover:bg-amber-100/80 transition-colors block"
                      >
                        <BadgeDollarSign className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-amber-900">
                            {pendingPayoutsCount} demande(s) de retrait en attente
                          </p>
                          <p className="text-[11px] text-amber-700">Arbitrage requis pour débloquer les fonds marchands.</p>
                        </div>
                      </Link>
                    )}

                    {urgentConversationsCount > 0 && (
                      <Link
                        href="/admin/conversations"
                        onClick={() => setNotificationsOpen(false)}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 hover:bg-slate-100 transition-colors block"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-slate-900">
                            {urgentConversationsCount} message(s) prioritaire(s)
                          </p>
                          <p className="text-[11px] text-slate-500">Des e-commerçants attendent une réponse rapide.</p>
                        </div>
                      </Link>
                    )}

                    {alerts.map((a) => (
                      <Link
                        key={a.id}
                        href={a.actionHref}
                        onClick={() => setNotificationsOpen(false)}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 hover:bg-slate-100 transition-colors block"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-slate-900">{a.title}</p>
                          <p className="text-[11px] text-slate-500">{a.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Link to Merchant Portal */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Portail Marchand</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 mt-14 md:mt-0">{children}</main>
      </div>
    </div>
  );
}
