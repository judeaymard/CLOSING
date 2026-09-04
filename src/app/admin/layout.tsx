"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bike,
  RotateCcw,
  Users,
  Headset,
  MessageSquare,
  Bot,
  BadgeDollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Search,
  ChevronRight,
  LogOut,
  ExternalLink,
  ChevronLeft,
  Menu,
  X,
  Truck,
  Sparkles,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import SpotlightSearchModal from "@/components/admin/SpotlightSearchModal";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

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
    if (pathname === "/admin/commandes") return { title: "Commandes & Closing", subtitle: "Traitement et télévente" };
    if (pathname === "/admin/livraisons") return { title: "Livraisons en Direct", subtitle: "Supervision des tournées" };
    if (pathname === "/admin/retours") return { title: "Retours & Litiges", subtitle: "Gestion des non-livrés" };
    if (pathname === "/admin/attributions") return { title: "Automatisation des Attributions", subtitle: "Distribution intelligente" };
    if (pathname.startsWith("/admin/partenaires")) return { title: "E-commerçants", subtitle: "Portefeuille marchands" };
    if (pathname === "/admin/closeuses") return { title: "Pôle Closeuses", subtitle: "Télévente et conversion" };
    if (pathname === "/admin/livreurs") return { title: "Flotte Coursiers", subtitle: "Livreurs et caisse terrain" };
    if (pathname === "/admin/conversations") return { title: "Communication Hub", subtitle: "Support e-commerçants" };
    if (pathname === "/admin/assistant-ia") return { title: "Assistant IA", subtitle: "Automatisation du support" };
    if (pathname === "/admin/tresorerie" || pathname === "/admin/finances") return { title: "Trésorerie", subtitle: "Vision financière globale et flux de trésorerie" };
    if (pathname === "/admin/commissions") return { title: "Commissions", subtitle: "Revenus et commissions perçus par ENO" };
    if (pathname === "/admin/retraits") return { title: "Retraits", subtitle: "Reversements et demandes des e-commerçants" };
    if (pathname === "/admin/tresoriers") return { title: "Responsables Trésorerie", subtitle: "Équipe financière et caisses" };
    if (pathname === "/admin/audit" || pathname === "/pdg/audit") return { title: "Audit & Activité", subtitle: "Traçabilité centralisée des actions de la plateforme" };
    if (pathname === "/admin/analyses") return { title: "Analyses de Performance", subtitle: "Indicateurs opérationnels" };
    if (pathname === "/admin/rapports") return { title: "Rapports & Exports", subtitle: "Téléchargement de données" };
    if (pathname === "/admin/notifications") return { title: "Centre de Notifications", subtitle: "Alertes et signaux" };
    if (pathname === "/admin/parametres") return { title: "Paramètres", subtitle: "Configuration plateforme" };
    return { title: "Espace Direction", subtitle: "Supervision des opérations" };
  };

  const navSections: NavSection[] = [
    {
      title: "VUE GÉNÉRALE",
      items: [
        { id: "nav-dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "OPÉRATIONS",
      items: [
        { id: "nav-commandes", label: "Commandes", href: "/admin/commandes", icon: Package, badge: pendingOrdersCount, badgeColor: "bg-slate-900 text-white" },
        { id: "nav-livraisons", label: "Livraisons", href: "/admin/livraisons", icon: Truck },
        { id: "nav-retours", label: "Retours", href: "/admin/retours", icon: RotateCcw },
        { id: "nav-attributions", label: "Attributions", href: "/admin/attributions", icon: Sparkles },
      ],
    },
    {
      title: "ÉQUIPE & RÉSEAU",
      items: [
        { id: "nav-partenaires", label: "E-commerçants", href: "/admin/partenaires", icon: Users },
        { id: "nav-closeuses", label: "Closeuses", href: "/admin/closeuses", icon: Headset },
        { id: "nav-livreurs", label: "Livreurs", href: "/admin/livreurs", icon: Bike },
        { id: "nav-tresoriers", label: "Responsables Trésorerie", href: "/admin/tresoriers", icon: ShieldCheck },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        {
          id: "nav-conversations",
          label: "Conversations",
          href: "/admin/conversations",
          icon: MessageSquare,
          badge: urgentConversationsCount > 0 ? urgentConversationsCount : undefined,
          badgeColor: "bg-slate-900 text-white",
        },
        { id: "nav-assistant-ia", label: "Assistant IA", href: "/admin/assistant-ia", icon: Bot },
      ],
    },
    {
      title: "FINANCES",
      items: [
        {
          id: "nav-tresorerie",
          label: "Trésorerie",
          href: "/admin/tresorerie",
          icon: BadgeDollarSign,
        },
        {
          id: "nav-commissions",
          label: "Commissions",
          href: "/admin/commissions",
          icon: TrendingUp,
        },
        {
          id: "nav-retraits",
          label: "Retraits",
          href: "/admin/retraits",
          icon: Landmark,
          badge: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined,
          badgeColor: "bg-amber-500 text-slate-950 font-black",
        },
      ],
    },
    {
      title: "ANALYSES",
      items: [
        { id: "nav-analyses", label: "Performances", href: "/admin/analyses", icon: BarChart3 },
        { id: "nav-rapports", label: "Rapports", href: "/admin/rapports", icon: FileText },
      ],
    },
    {
      title: "SYSTÈME & SÉCURITÉ",
      items: [
        { id: "nav-audit", label: "Audit & Activité", href: "/admin/audit", icon: ShieldAlert },
        {
          id: "nav-notifications",
          label: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
          badge: totalNotifications > 0 ? totalNotifications : undefined,
          badgeColor: "bg-rose-500 text-white font-bold",
        },
        { id: "nav-parametres", label: "Paramètres", href: "/admin/parametres", icon: Settings },
      ],
    },
  ];

  const pageMeta = getPageMeta();
  const isConversations = pathname === "/admin/conversations" || pathname === "/pdg/conversations";

  return (
    <div className={`bg-[#F8FAFC] text-slate-900 flex font-sans antialiased selection:bg-slate-900 selection:text-white ${
      isConversations ? "h-screen h-[100dvh] overflow-hidden" : "min-h-screen"
    }`}>
      {/* 🔍 Spotlight Search Modal */}
      <SpotlightSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* 🚀 COMPACT & INDEPENDENT SIDEBAR (Desktop) */}
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
          <div className="my-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between shrink-0">
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

        {/* 3. Navigation Links (Each item 100% strictly independent) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pt-1">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-0.5 block">
                  {sec.title}
                </span>
              )}
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  // Exact match ONLY: guarantees no other item is ever active
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.id} className="block">
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl text-xs font-semibold transition-all cursor-pointer block ${
                          sidebarCollapsed ? "p-2 justify-center" : "px-3 py-2"
                        } ${
                          isActive
                            ? "bg-slate-900 text-white font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Bottom Actions */}
        <div className="pt-2 mt-2 border-t border-slate-200/80 space-y-1 shrink-0">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
              sidebarCollapsed ? "p-2 justify-center" : "px-3 py-1.5"
            }`}
            title="Accès Portail Marchand"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span className="text-[11px]">Espace Marchand</span>}
          </Link>

          <button
            onClick={() => router.push("/partenaire")}
            className={`flex items-center gap-2 w-full rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
              sidebarCollapsed ? "p-2 justify-center" : "px-3 py-1.5"
            }`}
            title="Déconnexion"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span className="text-[11px]">Déconnexion</span>}
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

            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <span className="text-[9px] font-bold uppercase text-slate-400 px-2 block">{sec.title}</span>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
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
      <div className={`flex-1 flex flex-col min-w-0 ${isConversations ? "h-screen h-[100dvh] overflow-hidden" : ""}`}>
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-6 py-3 items-center justify-between sticky top-0 z-20 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 text-xs font-medium w-80 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-left text-[11px]">Rechercher (colis #CMD, marchand, coursier...)</span>
            <kbd className="text-[9px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-3 relative">
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

            {/* Notification Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-900">Centre d&apos;Alertes Direction</h4>
                    <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                      {totalNotifications}
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
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
                        <p className="text-xs font-bold text-amber-900">
                          {pendingPayoutsCount} demande(s) de retrait en attente d&apos;arbitrage
                        </p>
                        <p className="text-[11px] text-amber-700">Déblocage des fonds marchands.</p>
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
                        <p className="text-xs font-bold text-slate-900">
                          {urgentConversationsCount} conversation(s) marchands prioritaires
                        </p>
                        <p className="text-[11px] text-slate-500">Réponse attendue par les partenaires.</p>
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
                        <p className="text-xs font-bold text-slate-900">{a.title}</p>
                        <p className="text-[11px] text-slate-500">{a.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content Body */}
        <main className={`flex-1 ${
          isConversations
            ? "flex flex-col min-h-0 overflow-hidden p-2 sm:p-3 lg:p-3.5 mt-12 md:mt-0"
            : "p-4 sm:p-6 lg:p-8 mt-12 md:mt-0"
        }`}>{children}</main>
      </div>
    </div>
  );
}
