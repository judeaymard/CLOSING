"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Bike,
  Headset,
  TrendingUp,
  BadgeDollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Shield,
  Zap,
  MapPin,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA, formatPrice } from "@/lib/mock-data";

export default function AdminCommandCenterPage() {
  const {
    orders,
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

  // Computed metrics
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
  const netAgencyProfit = Math.round(totalAgencyRevenue * 0.65);

  const pendingPayouts = payoutRequests.filter((p) => p.status === "PENDING");
  const totalPendingPayoutAmount = pendingPayouts.reduce((acc, p) => acc + p.amount, 0);

  const urgentConversations = conversations.filter((c) => c.status === "URGENT" || c.unreadCount > 0);
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredOrders.length / (deliveredOrders.length + returnedOrders.length || 1)) * 100) : 92;

  // Pipeline stages configuration
  const pipelineStages = [
    { id: "new", label: "Nouvelles", count: pendingOrders.length, color: "bg-amber-400", href: "/admin/commandes" },
    { id: "closing", label: "À Rappeler", count: callbackOrders.length, color: "bg-orange-400", href: "/admin/commandes" },
    { id: "confirmed", label: "Confirmées", count: confirmedOrders.length, color: "bg-blue-400", href: "/admin/commandes" },
    { id: "delivery", label: "En Livraison", count: inDeliveryOrders.length, color: "bg-purple-400", href: "/admin/livreurs" },
    { id: "delivered", label: "Livrées", count: deliveredOrders.length, color: "bg-emerald-400", href: "/admin/commandes" },
    { id: "returned", label: "Retours", count: returnedOrders.length, color: "bg-rose-400", href: "/admin/commandes" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* 🔴 NIVEAU 1 : ALERTES & ARBITRAGES (Si action requise) */}
      {(pendingPayouts.length > 0 || alerts.length > 0) && (
        <div className="bg-[#18150a] border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">
                {pendingPayouts.length > 0
                  ? `${pendingPayouts.length} demande(s) de retrait en attente d'arbitrage (${formatCFA(totalPendingPayoutAmount)})`
                  : alerts[0]?.title}
              </p>
              <p className="text-[11px] text-amber-200/60">
                Action requise pour débloquer les fonds marchands vers Mobile Money ou USDT.
              </p>
            </div>
          </div>
          <Link
            href="/admin/finances"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-colors self-start sm:self-center shrink-0 shadow-md"
          >
            <span>Arbitrer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 👑 HEADER EXÉCUTIF & SÉLECTEUR DE PÉRIODE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bonjour, Jude 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Supervision opérationnelle et financière en temps réel du réseau ENO LIVRAISON.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-[#09090b] p-1 rounded-2xl border border-zinc-800 self-start sm:self-center shrink-0">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === t.id
                  ? "bg-white text-black shadow-md font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 NIVEAU 2 : AGENCY PULSE & 4 KPI STRATÉGIQUES */}
      <div className="space-y-4">
        {/* Agency Pulse Bar */}
        <div className="bg-[#14141a] text-white rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">L&apos;agence est active</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-300">
                <strong className="text-emerald-400">{deliveredOrders.length} colis livrés</strong> sur {totalOrdersCount} commandes traitées
              </span>
            </div>
          </div>

          {/* Micro Activity Ticker */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-300 bg-black/40 border border-zinc-800 px-3.5 py-1.5 rounded-xl max-w-md min-w-0">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-[11px]">
              {activities[0]?.title} — {activities[0]?.description}
            </span>
            <span className="text-[10px] text-zinc-500 shrink-0">{activities[0]?.time}</span>
          </div>
        </div>

        {/* 4 Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Commandes */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Commandes Traitées</span>
              <Package className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{totalOrdersCount}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4%</span>
              <span className="text-zinc-500 font-normal">vs hier</span>
            </div>
          </div>

          {/* Card 2: Livraisons Réussies */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Taux de Succès</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{deliverySuccessRate}%</p>
            <p className="text-[11px] text-zinc-400 font-medium">
              {deliveredOrders.length} colis remis et encaissés
            </p>
          </div>

          {/* Card 3: COD Total Collecté */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Cash Collecté (COD)</span>
              <BadgeDollarSign className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{formatCFA(totalDeliveredCOD)}</p>
            <p className="text-[11px] text-zinc-400 font-medium">
              En caisse coursiers
            </p>
          </div>

          {/* Card 4: Revenu Net Agence */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Bénéfice Net Agence</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">{formatCFA(netAgencyProfit)}</p>
            <p className="text-[11px] text-zinc-500 font-medium">
              Après commissions coursiers & télévente
            </p>
          </div>
        </div>
      </div>

      {/* 🔄 NIVEAU 3 : PIPELINE DES COMMANDES & FLUX OPÉRATIONNEL */}
      <div className="bg-[#121217] p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white tracking-tight">Pipeline Global des Commandes</h3>
            <p className="text-xs text-zinc-400">Cycle de vie des {totalOrdersCount} commandes en cours</p>
          </div>
          <Link
            href="/admin/commandes"
            className="text-xs font-bold text-white hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Ouvrir la file complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Clean Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage) => {
            const percentage = totalOrdersCount > 0 ? Math.round((stage.count / totalOrdersCount) * 100) : 0;

            return (
              <Link
                key={stage.id}
                href={stage.href}
                className="p-3.5 rounded-2xl border border-zinc-800 bg-[#0e0e12] hover:bg-zinc-800/60 transition-all text-left block group shadow-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">
                    {stage.label}
                  </span>
                </div>
                <p className="text-xl font-black text-white">{stage.count}</p>
                <span className="text-[10px] text-zinc-500 font-medium mt-0.5 block">
                  {percentage}% du volume
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 👥 NIVEAU 4 : PERFORMANCE D'ÉQUIPE & TRÉSORERIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Closeuses Leaderboard */}
        <div className="bg-[#121217] p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Headset className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-black text-white">Pôle Télévente</h3>
            </div>
            <Link href="/admin/commandes" className="text-[11px] font-bold text-zinc-400 hover:text-white">
              Gérer →
            </Link>
          </div>

          <div className="space-y-2">
            {closeuses.map((c, idx) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#0e0e12] border border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-bold text-xs text-zinc-500 w-4">#{idx + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-500">{c.callsTodayCount} appels</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs">
                    {c.conversionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Livreurs Leaderboard */}
        <div className="bg-[#121217] p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white">Flotte Coursiers</h3>
            </div>
            <Link href="/admin/livreurs" className="text-[11px] font-bold text-zinc-400 hover:text-white">
              Flotte →
            </Link>
          </div>

          <div className="space-y-2">
            {livreurs.slice(0, 3).map((l, idx) => (
              <div key={l.id} className="p-3 rounded-xl bg-[#0e0e12] border border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-bold text-xs text-zinc-500 w-4">#{idx + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {l.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{l.name}</p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{l.zone}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-white">{l.deliveredTodayCount} livrés</p>
                  <p className="text-[10px] text-emerald-400 font-bold">{formatPrice(l.cashCollectedToday)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trésorerie & Répartition */}
        <div className="bg-[#121217] p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">Répartition Trésorerie</h3>
            </div>
            <Link href="/admin/finances" className="text-[11px] font-bold text-zinc-400 hover:text-white">
              Finances →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Encaissé (COD) :</span>
              <span className="font-black text-white">{formatCFA(totalDeliveredCOD)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Net Dû aux Marchands :</span>
              <span className="font-black text-purple-400">{formatCFA(totalNetMerchants)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Commissions ENO :</span>
              <span className="font-black text-emerald-400">{formatCFA(totalAgencyRevenue)}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex mt-2 border border-zinc-800">
              <div className="bg-purple-500 h-full" style={{ width: "64%" }} title="Marchands (64%)"></div>
              <div className="bg-emerald-500 h-full" style={{ width: "36%" }} title="Agence (36%)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
