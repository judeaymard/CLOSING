"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  CheckCircle,
  Clock,
  TrendingUp,
  Boxes,
  Users,
  BadgeDollarSign,
  ArrowRight,
  Truck,
  Store,
  Package,
  Bike,
  Briefcase,
  Smartphone,
  Shield,
  Layers,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { ORDER_STATUS_CONFIG } from "@/lib/types";
import { formatCFA } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const {
    orders,
    partners,
    livreurs,
    closeuses,
    payoutRequests,
  } = useOperations();

  const pendingOrders = orders.filter((o) => o.status === "EN_ATTENTE" || o.status === "A_RAPPELER");
  const inDeliveryOrders = orders.filter((o) => o.status === "EN_COURS");
  const deliveredOrders = orders.filter((o) => o.status === "LIVREE");

  const totalCashCollected = deliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyCommissions = deliveredOrders.length * 2800;
  const pendingPayouts = payoutRequests.filter((p) => p.status === "PENDING");

  return (
    <div className="space-y-8 animate-fade-in-up font-sans">
      {/* ⚠️ PENDING PAYOUTS ALERT */}
      {pendingPayouts.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#18181c] border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-300">
                {pendingPayouts.length} demande(s) de retrait en attente d&apos;approbation
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Total : <strong className="text-white">{pendingPayouts.reduce((acc, p) => acc + p.amount, 0).toLocaleString("fr-FR")} F CFA</strong> à débloquer pour les partenaires.
              </p>
            </div>
          </div>

          <Link
            href="/admin/finances"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Arbitrer les retraits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 👑 EXECUTIVE HERO CARD (Noir Ébène & Halo Subtil) */}
      <div className="bg-[#121216] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-zinc-800 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Direction Générale ENO LIVRAISON
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {orders.length} colis sous gestion • {deliveredOrders.length} livrés avec succès
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Supervision en temps réel des encaissements COD, des centres d&apos;appels et de la flotte coursiers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/commandes"
            className="px-5 py-3 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>File de Closing ({pendingOrders.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 GLOBAL NETWORK KPI CARDS - Noir Ébène */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cash Encaissé */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Cash Encaissé</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{formatCFA(totalCashCollected)}</p>
          <p className="text-[11px] text-zinc-500">Fonds collectés sur le terrain (COD)</p>
        </div>

        {/* Marge Agence */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Marge Agence ENO</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 tracking-tight">{formatCFA(totalAgencyCommissions)}</p>
          <p className="text-[11px] text-zinc-500">2 800 F par colis livré</p>
        </div>

        {/* Flotte Livreurs */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Flotte Livreurs</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{livreurs.length} coursiers</p>
          <p className="text-[11px] text-zinc-500">{inDeliveryOrders.length} colis en cours de livraison</p>
        </div>

        {/* Boutiques Partenaires */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Boutiques Partenaires</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{partners.length} e-commerces</p>
          <p className="text-[11px] text-zinc-500">Bénin & Afrique connectés</p>
        </div>
      </div>

      {/* 📦 DERNIÈRES COMMANDES DU RÉSEAU */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Flux des Commandes Réseau</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Activité en direct de toutes les boutiques partenaires</p>
          </div>

          <Link
            href="/admin/commandes"
            className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1"
          >
            <span>Livre complet ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-[#0e0e12] border-b border-zinc-800 text-zinc-400 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Réf & Boutique</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Destination</th>
                <th className="py-3.5 px-5">Montant COD</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5">Coursier Assigné</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium text-zinc-200">
              {orders.slice(0, 6).map((ord) => {
                const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                  label: ord.status,
                  color: "text-zinc-300",
                  bg: "bg-zinc-800",
                };

                return (
                  <tr key={ord.id} className="hover:bg-[#18181e] transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                      <p className="text-[10px] text-zinc-500">{ord.partnerName || "Afrimarket"}</p>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-white">{ord.clientName}</td>
                    <td className="py-3.5 px-5 text-zinc-400">{ord.address}</td>
                    <td className="py-3.5 px-5 font-black text-white">{ord.totalPrice.toLocaleString("fr-FR")} F</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-zinc-700/60 ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-zinc-300">
                      {ord.assignedLivreurName ? (
                        <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                          <Bike className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{ord.assignedLivreurName}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-600">Non assigné</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
