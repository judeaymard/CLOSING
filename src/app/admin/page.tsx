"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Bike,
  Headset,
  TrendingUp,
  TrendingDown,
  BadgeDollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
  Users,
  ChevronRight,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  PhoneCall,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA, formatPrice } from "@/lib/mock-data";
import { PeriodFilter } from "@/lib/types";

export default function AdminCommandCenterPage() {
  const {
    orders,
    partners,
    closeuses,
    livreurs,
    payoutRequests,
    conversations,
    activities,
    alerts,
    period,
    setPeriod,
    resolveAlert,
  } = useOperations();

  const [activePipelineStep, setActivePipelineStep] = useState<string | null>(null);

  // Computed metrics based on period
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "EN_ATTENTE");
  const callbackOrders = orders.filter((o) => o.status === "A_RAPPELER");
  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMEE");
  const inDeliveryOrders = orders.filter((o) => o.status === "EN_COURS");
  const deliveredOrders = orders.filter((o) => o.status === "LIVREE");
  const returnedOrders = orders.filter((o) => o.status === "RETOURNEE" || o.status === "REFUSEE");

  const totalDeliveredCOD = deliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyRevenue = deliveredOrders.length * 2800; // 800 F closing + 2000 F livraison
  const totalNetMerchants = totalDeliveredCOD - totalAgencyRevenue;
  const netAgencyProfit = Math.round(totalAgencyRevenue * 0.65); // Marge nette après charges coursiers

  const pendingPayouts = payoutRequests.filter((p) => p.status === "PENDING");
  const totalPendingPayoutAmount = pendingPayouts.reduce((acc, p) => acc + p.amount, 0);

  const urgentConversations = conversations.filter((c) => c.status === "URGENT" || c.unreadCount > 0);

  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredOrders.length / (deliveredOrders.length + returnedOrders.length || 1)) * 100) : 92;

  // Pipeline stages configuration
  const pipelineStages = [
    { id: "new", label: "Nouvelles", count: pendingOrders.length, color: "bg-amber-500", text: "text-amber-700", bgLight: "bg-amber-50" },
    { id: "closing", label: "À Rappeler", count: callbackOrders.length, color: "bg-orange-500", text: "text-orange-700", bgLight: "bg-orange-50" },
    { id: "confirmed", label: "Confirmées", count: confirmedOrders.length, color: "bg-blue-500", text: "text-blue-700", bgLight: "bg-blue-50" },
    { id: "delivery", label: "En Livraison", count: inDeliveryOrders.length, color: "bg-purple-500", text: "text-purple-700", bgLight: "bg-purple-50" },
    { id: "delivered", label: "Livrées & Encaissées", count: deliveredOrders.length, color: "bg-emerald-500", text: "text-emerald-700", bgLight: "bg-emerald-50" },
    { id: "returned", label: "Retours / Litiges", count: returnedOrders.length, color: "bg-rose-500", text: "text-rose-700", bgLight: "bg-rose-50" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* 👑 1. EXECUTIVE HERO HEADER & PERIOD SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#2563EB] text-xs font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Mission Control • ENO LIVRAISON HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bonjour, Jude 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Voici un aperçu en temps réel de l&apos;activité de votre agence aujourd&apos;hui.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start lg:self-center shrink-0">
          {(
            [
              { id: "TODAY", label: "Aujourd'hui" },
              { id: "7D", label: "7 jours" },
              { id: "30D", label: "30 jours" },
              { id: "YEAR", label: "Cette année" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === t.id
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 2. AGENCY PULSE — ACTIVITÉ EN TEMPS RÉEL */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0e1726] to-[#1e1b4b] rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Agency Pulse • Opérations en direct
            </span>
          </div>
          <p className="text-lg sm:text-xl font-black tracking-tight text-white">
            L&apos;agence est active • <span className="text-emerald-400">{deliveredOrders.length} livraisons</span> finalisées avec succès
          </p>
        </div>

        {/* Live Activity Stream Snippet */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 max-w-lg min-w-0">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div className="min-w-0 text-xs">
            <p className="font-bold text-white truncate">
              {activities[0]?.title || "Activité continue du réseau"}
            </p>
            <p className="text-slate-300 text-[11px] truncate">
              {activities[0]?.description || "Supervision en direct des coursiers et closeuses"}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
            {activities[0]?.time || "En direct"}
          </span>
        </div>
      </div>

      {/* 📊 3. TOP 6 INDICATEURS CLÉS (CARDS AVEC HAUTE HIÉRARCHIE VISUELLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Commandes Aujourd'hui */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Commandes traitées</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{totalOrdersCount}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4%</span>
              <span className="text-slate-400 font-normal">vs hier</span>
            </div>
          </div>
        </div>

        {/* Card 2: Livraisons Réussies (Taux de succès) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Livraisons Réussies</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{deliveredOrders.length}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-bold">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {deliverySuccessRate}% Taux de succès
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Revenus Générés (COD Total) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenus Collectés (COD)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCFA(totalDeliveredCOD)}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.5%</span>
              <span className="text-slate-400 font-normal">flux e-commerce</span>
            </div>
          </div>
        </div>

        {/* Card 4: Marge Nette Agence */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bénéfice Net Agence</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#059669] tracking-tight">{formatCFA(netAgencyProfit)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Après commissions coursiers & télévente</p>
          </div>
        </div>

        {/* Card 5: Retraits en Attente (Actionable) */}
        <Link
          href="/admin/finances"
          className="bg-white p-6 rounded-3xl border-2 border-amber-300 hover:border-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.08)] space-y-3 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Retraits en Attente</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-amber-900 tracking-tight">{pendingPayouts.length} demande(s)</p>
              <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-amber-800 font-bold mt-1">
              {formatCFA(totalPendingPayoutAmount)} à débloquer
            </p>
          </div>
        </Link>

        {/* Card 6: Conversations & Support Hub */}
        <Link
          href="/admin/conversations"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 hover:border-purple-300 transition-all block group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversations Marchands</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{conversations.length}</p>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-[#7C3AED] font-bold mt-1">
              {urgentConversations.length} fil(s) nécessitant une réponse
            </p>
          </div>
        </Link>
      </div>

      {/* 🔄 4. VISUAL ORDERS PIPELINE (CYCLE DE VIE INTERACTIF) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Pipeline Global des Commandes</h3>
            <p className="text-xs text-slate-500">Flux d&apos;acheminement en temps réel des {totalOrdersCount} colis de l&apos;agence</p>
          </div>
          <Link
            href="/admin/commandes"
            className="text-xs font-black text-[#2563EB] hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Ouvrir la file complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Step Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage) => {
            const isSelected = activePipelineStep === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActivePipelineStep(isSelected ? null : stage.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2563EB] bg-blue-50/60 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></span>
                  <span className="text-[11px] font-extrabold uppercase tracking-tight text-slate-500 truncate">
                    {stage.label}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">{stage.count}</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                  {totalOrdersCount > 0 ? Math.round((stage.count / totalOrdersCount) * 100) : 0}% du total
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 💰 5. MONEY OVERVIEW — CENTRE FINANCIER & RÉPARTITION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Money Breakdown Summary */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Vue Financière & Trésorerie</h3>
              <p className="text-xs text-slate-500">Ventilation du cash collecté et des reversements</p>
            </div>
            <Link
              href="/admin/finances"
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors"
            >
              Détails Trésorerie →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Cash Encaissé (COD)</span>
              <p className="text-xl font-black text-slate-900">{formatCFA(totalDeliveredCOD)}</p>
              <p className="text-[10px] text-slate-500">Collecté par les coursiers</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Revenu Brut Agence</span>
              <p className="text-xl font-black text-emerald-800">{formatCFA(totalAgencyRevenue)}</p>
              <p className="text-[10px] text-emerald-700">Prestations closing + livraison</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-1">
              <span className="text-[11px] font-bold text-purple-600 uppercase">Fonds Dus Marchands</span>
              <p className="text-xl font-black text-purple-900">{formatCFA(totalNetMerchants)}</p>
              <p className="text-[10px] text-purple-700">Disponibles au retrait</p>
            </div>
          </div>

          {/* Progress Bar Visualization */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Répartition Trésorerie (Marchands 64% • Agence 36%)</span>
              <span>Total : {formatCFA(totalDeliveredCOD)}</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="bg-[#7C3AED] h-full" style={{ width: "64%" }} title="Net Marchands (64%)"></div>
              <div className="bg-[#10B981] h-full" style={{ width: "36%" }} title="Marge Agence (36%)"></div>
            </div>
          </div>
        </div>

        {/* ⚠️ 6. CENTRE D'ALERTES « NÉCESSITE VOTRE ATTENTION » */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Nécessite votre attention</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
              {alerts.length + (pendingPayouts.length > 0 ? 1 : 0)}
            </span>
          </div>

          <div className="space-y-3">
            {pendingPayouts.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <BadgeDollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{pendingPayouts.length} retraits en attente d&apos;arbitrage</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-800">
                  {formatCFA(totalPendingPayoutAmount)} à reverser aux e-commerçants.
                </p>
                <Link
                  href="/admin/finances"
                  className="inline-flex items-center gap-1 text-xs font-black text-amber-900 hover:underline pt-1"
                >
                  <span>Arbitrer maintenant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {alerts.map((al) => (
              <div key={al.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{al.title}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{al.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={al.actionHref}
                    className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <span>{al.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => resolveAlert(al.id)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 👥 7. TEAM PERFORMANCE LEADERBOARDS (CLOSEUSES & LIVREURS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closeuses Leaderboard */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
                <Headset className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Pôle Télévente & Closing</h3>
                <p className="text-[11px] text-slate-400">Classement de performance des opératrices</p>
              </div>
            </div>
            <Link href="/admin/commandes" className="text-xs font-bold text-[#7C3AED] hover:underline">
              Gestion Pôle →
            </Link>
          </div>

          <div className="space-y-2.5">
            {closeuses.map((c, idx) => (
              <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-xs text-slate-400">#{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.callsTodayCount} appels aujourd&apos;hui</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    {c.conversionRate}% succès
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.confirmedTodayCount} confirmées</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Livreurs Leaderboard */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Flotte Coursiers Terrain</h3>
                <p className="text-[11px] text-slate-400">Suivi des tournées par zone géographique</p>
              </div>
            </div>
            <Link href="/admin/livreurs" className="text-xs font-bold text-[#2563EB] hover:underline">
              Voir Flotte →
            </Link>
          </div>

          <div className="space-y-2.5">
            {livreurs.slice(0, 3).map((l, idx) => (
              <div key={l.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-xs text-slate-400">#{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                    {l.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{l.name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{l.zone}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">{l.deliveredTodayCount} livrés</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{formatPrice(l.cashCollectedToday)} COD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
