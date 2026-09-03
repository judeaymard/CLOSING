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
  RotateCcw,
  Sparkles,
  Store,
  AlertCircle,
  Package,
  Bike,
  Headset,
  Briefcase,
  Smartphone,
  Banknote,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { ORDER_STATUS_CONFIG } from "@/lib/types";
import { formatCFA } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const {
    orders,
    partners,
    products,
    livreurs,
    closeuses,
    payoutRequests,
    currentRole,
    activeCloseuse,
    activeLivreur,
    approvePayout,
  } = useOperations();

  const pendingPartners = partners.filter((p) => !p.isApproved);
  const pendingOrders = orders.filter((o) => o.status === "EN_ATTENTE" || o.status === "A_RAPPELER");
  const inDeliveryOrders = orders.filter((o) => o.status === "EN_COURS");
  const deliveredOrders = orders.filter((o) => o.status === "LIVREE");

  const totalCashCollected = deliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyCommissions = deliveredOrders.length * 2800;
  const pendingPayouts = payoutRequests.filter((p) => p.status === "PENDING");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 👔 VUE 1 : BANNIÈRES & ACTIONS PDG */}
      {currentRole === "PDG" && (
        <>
          {/* PENDING PAYOUTS ALERT */}
          {pendingPayouts.length > 0 && (
            <div className="p-5 rounded-3xl bg-linear-to-r from-amber-950 via-[#1c1407] to-amber-900/40 border-2 border-amber-500/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-200">
                    {pendingPayouts.length} demande(s) de retrait en attente d&apos;approbation Mobile Money
                  </h3>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    Total : <strong>{pendingPayouts.reduce((acc, p) => acc + p.amount, 0).toLocaleString("fr-FR")} F CFA</strong> à débloquer pour les partenaires.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/finances"
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Arbitrer les retraits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* GLOBAL HERO CARD */}
          <div className="bg-linear-to-r from-[#091b14] via-[#0d261c] to-[#15803d] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-900/60 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" /> Direction Générale ENO LIVRAISON
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {orders.length} colis gérés • {deliveredOrders.length} livrés avec succès
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                Supervision en temps réel des encaissements COD, des centres d&apos;appels et des tournées coursiers.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/commandes"
                className="px-5 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl font-bold text-xs shadow-xl transition-all flex items-center gap-2"
              >
                <span>File de Closing ({pendingOrders.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 4 GLOBAL NETWORK KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-emerald-200/70">
                <span className="text-xs font-bold uppercase tracking-wider">Total Cash Encaissé</span>
                <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">{formatCFA(totalCashCollected)}</p>
              <p className="text-[11px] text-emerald-300/60">Fonds collectés sur le terrain</p>
            </div>

            <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-emerald-200/70">
                <span className="text-xs font-bold uppercase tracking-wider">Marge Agence ENO</span>
                <TrendingUp className="w-4 h-4 text-[#22c55e]" />
              </div>
              <p className="text-3xl font-black text-[#22c55e]">{formatCFA(totalAgencyCommissions)}</p>
              <p className="text-[11px] text-emerald-300/60">2 800 F par colis livré</p>
            </div>

            <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-emerald-200/70">
                <span className="text-xs font-bold uppercase tracking-wider">Flotte Livreurs</span>
                <Bike className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white">{livreurs.length} coursiers</p>
              <p className="text-[11px] text-emerald-300/60">{inDeliveryOrders.length} colis en route</p>
            </div>

            <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-emerald-200/70">
                <span className="text-xs font-bold uppercase tracking-wider">Boutiques Partenaires</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">{partners.length} e-commerces</p>
              <p className="text-[11px] text-emerald-300/60">Bénin & International</p>
            </div>
          </div>
        </>
      )}

      {/* 📞 VUE 2 : ESPACE CLOSEUSES */}
      {currentRole === "CLOSEUSE" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-950 via-[#0d261c] to-emerald-900 border border-emerald-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Espace Télévente</span>
              <h2 className="text-2xl font-black text-white mt-1">Bonjour {activeCloseuse.name} 👋</h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Vous avez <strong>{pendingOrders.length} commandes en attente</strong> de confirmation aujourd&apos;hui.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800 shrink-0">
              <div className="text-center">
                <p className="text-xs text-emerald-400 font-bold uppercase">Appels faits</p>
                <p className="text-xl font-black text-white">{activeCloseuse.callsTodayCount}</p>
              </div>
              <div className="w-px h-8 bg-emerald-800"></div>
              <div className="text-center">
                <p className="text-xs text-emerald-400 font-bold uppercase">Taux Succès</p>
                <p className="text-xl font-black text-[#22c55e]">{activeCloseuse.conversionRate}%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-white">Commandes à Traiter en Priorité</h3>
            <Link
              href="/admin/commandes"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Voir toute la file ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 🛵 VUE 3 : ESPACE LIVREUR */}
      {currentRole === "LIVREUR" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-[#0d261c] via-emerald-950 to-[#07130e] border border-emerald-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Coursier Terrain</span>
              <h2 className="text-2xl font-black text-white mt-1">{activeLivreur.name}</h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Zone assignée : <strong>{activeLivreur.zone}</strong> • Véhicule : {activeLivreur.vehicle}
              </p>
            </div>

            <Link
              href="/admin/livreurs"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Bike className="w-4 h-4" />
              <span>Ouvrir ma tournée mobile</span>
            </Link>
          </div>
        </div>
      )}

      {/* DERNIÈRES COMMANDES DU RÉSEAU */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-900/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Flux des Commandes Réseau</h3>
            <p className="text-xs text-emerald-300/70 mt-0.5">Activité en direct des boutiques partenaires</p>
          </div>

          <Link
            href="/admin/commandes"
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Livre complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-[#0c241a] border-b border-emerald-900/80 text-emerald-400 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Réf & Boutique</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Destination</th>
                <th className="py-3.5 px-5">Montant COD</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5">Coursier Assigné</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-medium text-emerald-100">
              {orders.slice(0, 6).map((ord) => {
                const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                  label: ord.status,
                  color: "text-emerald-300",
                  bg: "bg-emerald-950",
                };

                return (
                  <tr key={ord.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-emerald-400">{ord.orderNumber}</span>
                      <p className="text-[10px] text-emerald-400/70">{ord.partnerName || "Afrimarket"}</p>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-white">{ord.clientName}</td>
                    <td className="py-3.5 px-5 text-emerald-200/80">{ord.address}</td>
                    <td className="py-3.5 px-5 font-black text-emerald-400">{ord.totalPrice.toLocaleString("fr-FR")} F</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-700/60 ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-emerald-300">
                      {ord.assignedLivreurName ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-300">
                          <Bike className="w-3 h-3 text-emerald-400" />
                          <span>{ord.assignedLivreurName}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600">Non assigné</span>
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
