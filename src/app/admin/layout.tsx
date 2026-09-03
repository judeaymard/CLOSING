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
  Bike,
  Headset,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  Lock,
  KeyRound,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { UserRole } from "@/lib/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Force Password Change States
  const [tempCodeInput, setTempCodeInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const {
    currentRole,
    switchRole,
    activeLivreur,
    activeCloseuse,
    livreurs,
    closeuses,
    orders,
    payoutRequests,
    changePassword,
  } = useOperations();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Dynamic Navigation depending on role
  const getNavItems = () => {
    if (currentRole === "LIVREUR") {
      return [
        { label: "Ma Tournée du Jour", href: "/admin/livreurs", icon: Bike, badge: orders.filter((o) => o.assignedLivreurId === activeLivreur.id && o.status !== "LIVREE").length },
        { label: "Toutes les Livraisons", href: "/admin/commandes", icon: PhoneCall },
        { label: "Vue Générale", href: "/admin", icon: LayoutDashboard },
      ];
    }
    if (currentRole === "CLOSEUSE") {
      return [
        { label: "File de Closing", href: "/admin/commandes", icon: PhoneCall, badge: orders.filter((o) => o.status === "EN_ATTENTE" || o.status === "A_RAPPELER").length },
        { label: "Dispatch Livreurs", href: "/admin/livreurs", icon: Bike },
        { label: "Stocks Produits", href: "/admin/stocks", icon: Boxes },
        { label: "Vue Générale", href: "/admin", icon: LayoutDashboard },
      ];
    }
    // PDG / Default
    return [
      { label: "Vue Générale", href: "/admin", icon: LayoutDashboard },
      { label: "Closing & Commandes", href: "/admin/commandes", icon: PhoneCall, badge: orders.filter((o) => o.status === "EN_ATTENTE").length },
      { label: "Flotte Livreurs & Caisse", href: "/admin/livreurs", icon: Bike },
      { label: "Boutiques Partenaires", href: "/admin/partenaires", icon: Users },
      { label: "Gestion des Stocks", href: "/admin/stocks", icon: Boxes },
      { label: "Finances & Retraits", href: "/admin/finances", icon: BadgeDollarSign, badge: payoutRequests.filter((p) => p.status === "PENDING").length },
    ];
  };

  const getPageTitle = () => {
    if (pathname === "/admin") {
      if (currentRole === "PDG") return "Direction Générale & Supervision";
      if (currentRole === "CLOSEUSE") return `Espace Télévente • ${activeCloseuse.name}`;
      if (currentRole === "LIVREUR") return `Espace Coursier Terrain • ${activeLivreur.name}`;
      return "Tableau de bord Opérations";
    }
    if (pathname.includes("/commandes")) return "Traitement & Closing des Commandes";
    if (pathname.includes("/livreurs")) return "Gestion de la Flotte & Caisse Terrain";
    if (pathname.includes("/partenaires")) return "Boutiques E-commerce Partenaires";
    if (pathname.includes("/stocks")) return "Entrepôts & Stocks Globaux";
    if (pathname.includes("/finances")) return "Finances, COD & Validation des Retraits";
    return "Espace Agence ENO";
  };

  const isMustChangePassword =
    (currentRole === "LIVREUR" && activeLivreur?.mustChangePassword) ||
    (currentRole === "CLOSEUSE" && activeCloseuse?.mustChangePassword);

  const activeUserEmail =
    currentRole === "LIVREUR"
      ? activeLivreur?.email
      : currentRole === "CLOSEUSE"
      ? activeCloseuse?.email
      : "";

  const activeUserName =
    currentRole === "LIVREUR"
      ? activeLivreur?.name
      : currentRole === "CLOSEUSE"
      ? activeCloseuse?.name
      : "";

  const expectedTempCode =
    currentRole === "LIVREUR"
      ? activeLivreur?.temporaryCode
      : currentRole === "CLOSEUSE"
      ? activeCloseuse?.temporaryCode
      : "";

  const handleSubmitNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError(null);

    if (tempCodeInput.trim() !== expectedTempCode && tempCodeInput.trim().length < 4) {
      setChangePassError("Le code d'activation reçu par email est incorrect.");
      return;
    }

    if (newPassword.length < 4) {
      setChangePassError("Le nouveau mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePassError("Les deux mots de passe saisis ne correspondent pas.");
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      changePassword(newPassword);
      setIsChangingPass(false);
      setTempCodeInput("");
      setNewPassword("");
      setConfirmPassword("");
    }, 600);
  };

  const navItems = getNavItems();
  const pendingPayoutsCount = payoutRequests.filter((p) => p.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#07130e] text-white flex flex-col md:flex-row antialiased selection:bg-[#16a34a] selection:text-white relative">
      {/* 🔒 ÉCRAN BLOQUANT D'ACTIVATION & CHANGEMENT DE MOT DE PASSE OBLIGATOIRE */}
      {isMustChangePassword && (
        <div className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
          <div className="bg-[#091b14] border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-3xl bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 animate-pulse text-emerald-300" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                🔒 Première Connexion Sécurisée
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                Activez votre Espace Collaborateur
              </h2>
              <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md mx-auto">
                Bienvenue <strong>{activeUserName}</strong> ! Pour des raisons de sécurité de la caisse et des données clients, vous devez définir votre nouveau mot de passe personnel avant de débloquer votre accès.
              </p>
            </div>

            {/* Indication Email */}
            <div className="p-3.5 rounded-2xl bg-[#0c241a] border border-emerald-800/80 text-xs flex items-center justify-between text-left gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-emerald-400 uppercase font-bold">Code envoyé à :</p>
                  <p className="text-xs text-white font-mono font-bold truncate">{activeUserEmail}</p>
                </div>
              </div>
              {expectedTempCode && (
                <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700 shrink-0 font-mono">
                  Code test : <strong>{expectedTempCode}</strong>
                </span>
              )}
            </div>

            {changePassError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs font-bold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{changePassError}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmitNewPassword} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Code temporaire reçu par Email *</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempCodeInput}
                  onChange={(e) => setTempCodeInput(e.target.value)}
                  placeholder={`Ex: ${expectedTempCode || "849201"}`}
                  className="w-full p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-emerald-400">
                    2. Nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-emerald-400">
                    3. Confirmer mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isChangingPass ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sécurisation & Déblocage...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Activer Mon Compte & Débloquer l&apos;Accès</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#091b14] border-r border-emerald-950 p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-5">
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
                ADMINISTRATION & OPS
              </p>
            </div>
          </Link>

          {/* 👑 ROLE SWITCHER SELECTOR */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full p-2.5 rounded-2xl bg-[#0c241a] border border-emerald-800/60 text-left transition-all hover:border-emerald-500/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center shrink-0 text-emerald-400">
                  {currentRole === "PDG" && <Briefcase className="w-4 h-4" />}
                  {currentRole === "CLOSEUSE" && <Headset className="w-4 h-4" />}
                  {currentRole === "LIVREUR" && <Bike className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Poste Actif
                  </p>
                  <p className="text-xs font-black text-white truncate">
                    {currentRole === "PDG" && "👔 PDG (Direction)"}
                    {currentRole === "CLOSEUSE" && `📞 ${activeCloseuse.name}`}
                    {currentRole === "LIVREUR" && `🛵 ${activeLivreur.name}`}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Role Menu */}
            {roleMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-[#081711] border border-emerald-700 shadow-2xl space-y-1 animate-fade-in-up">
                <p className="text-[9px] font-black uppercase text-emerald-500/80 px-2 py-1">
                  Changer de Session
                </p>

                {/* 1. PDG */}
                <button
                  onClick={() => {
                    switchRole("PDG");
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-all ${
                    currentRole === "PDG" ? "bg-emerald-600 text-white" : "text-emerald-100 hover:bg-emerald-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>PDG (Super Admin)</span>
                  </div>
                  {currentRole === "PDG" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                {/* 2. Closeuses */}
                {closeuses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      switchRole("CLOSEUSE", cls.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-all ${
                      currentRole === "CLOSEUSE" && activeCloseuse.id === cls.id
                        ? "bg-emerald-600 text-white"
                        : "text-emerald-100 hover:bg-emerald-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Headset className="w-3.5 h-3.5" />
                      <span>Closeuse • {cls.name}</span>
                    </div>
                    {currentRole === "CLOSEUSE" && activeCloseuse.id === cls.id && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}

                {/* 3. Livreurs */}
                {livreurs.map((liv) => (
                  <button
                    key={liv.id}
                    onClick={() => {
                      switchRole("LIVREUR", liv.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-all ${
                      currentRole === "LIVREUR" && activeLivreur.id === liv.id
                        ? "bg-emerald-600 text-white"
                        : "text-emerald-100 hover:bg-emerald-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-3.5 h-3.5" />
                      <span className="truncate">Livreur • {liv.name.split(" ")[0]}</span>
                    </div>
                    {currentRole === "LIVREUR" && activeLivreur.id === liv.id && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick link to partner view */}
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-200 text-xs font-semibold border border-emerald-900/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#22c55e]" />
              Espace Partenaire Client
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
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
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && item.badge === undefined && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-emerald-900/60">
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-900/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400">
              <span>Réseau ENO Live</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-200">
              {orders.filter((o) => o.status === "LIVREE").length} colis livrés aujourd&apos;hui
            </p>
            {pendingPayoutsCount > 0 && (
              <p className="text-[11px] text-amber-300 font-bold">
                ⚠️ {pendingPayoutsCount} retrait(s) en attente
              </p>
            )}
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

      {/* MOBILE HEADER */}
      <div className="md:hidden flex flex-col bg-[#091b14] border-b border-emerald-950 sticky top-0 z-40">
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
              <span className="font-black text-xs text-white">ENO OPS</span>
              <span className="text-[10px] text-emerald-400 block font-bold">
                {currentRole === "PDG" ? "👔 PDG" : currentRole === "CLOSEUSE" ? `📞 ${activeCloseuse.name}` : `🛵 ${activeLivreur.name}`}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-xs font-bold text-emerald-200 flex items-center gap-1"
            >
              <span>Rôle</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 border border-emerald-800"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        {roleMenuOpen && (
          <div className="p-3 bg-[#081711] border-t border-emerald-800 space-y-1 text-xs">
            <button
              onClick={() => {
                switchRole("PDG");
                setRoleMenuOpen(false);
              }}
              className={`w-full p-2 rounded-lg text-left font-bold ${currentRole === "PDG" ? "bg-emerald-600 text-white" : "text-emerald-200"}`}
            >
              👔 PDG (Super Admin)
            </button>
            <button
              onClick={() => {
                switchRole("CLOSEUSE", "cls-1");
                setRoleMenuOpen(false);
              }}
              className={`w-full p-2 rounded-lg text-left font-bold ${currentRole === "CLOSEUSE" ? "bg-emerald-600 text-white" : "text-emerald-200"}`}
            >
              📞 Closeuse (Inès)
            </button>
            <button
              onClick={() => {
                switchRole("LIVREUR", "liv-1");
                setRoleMenuOpen(false);
              }}
              className={`w-full p-2 rounded-lg text-left font-bold ${currentRole === "LIVREUR" ? "bg-emerald-600 text-white" : "text-emerald-200"}`}
            >
              🛵 Livreur (Rachad - Cotonou)
            </button>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <nav className="p-4 space-y-1.5 border-t border-emerald-950 bg-[#091b14]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${
                    isActive ? "bg-emerald-600 text-white font-black" : "text-emerald-200 hover:bg-emerald-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a1f17] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-[#091b14] border-b border-emerald-950/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">{getPageTitle()}</h1>
            <p className="text-xs text-emerald-400/80">
              {currentRole === "PDG" && "Hub Central Cotonou & Lokossa • Super Admin"}
              {currentRole === "CLOSEUSE" && `Session : ${activeCloseuse.name} • ${activeCloseuse.callsTodayCount} appels aujourd'hui`}
              {currentRole === "LIVREUR" && `Session : ${activeLivreur.name} • ${activeLivreur.zone}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-emerald-950 border border-emerald-900 text-emerald-300 hover:text-white transition-all ${
                isRefreshing ? "rotate-180 text-emerald-400" : ""
              }`}
              title="Rafraîchir les flux"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/40 border border-emerald-700 text-xs font-bold text-emerald-200"
            >
              <Store className="w-3.5 h-3.5 text-[#22c55e]" />
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
