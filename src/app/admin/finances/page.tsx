"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Building,
  DollarSign,
  ArrowRight,
  Store,
  Clock,
  Smartphone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function AdminFinancesPage() {
  const {
    orders,
    partners,
    payoutRequests,
    approvePayout,
    rejectPayout,
    currentRole,
  } = useOperations();

  const totalDeliveredOrders = orders.filter((o) => o.status === "LIVREE");
  const totalCashCollected = totalDeliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyCommissions = totalDeliveredOrders.length * 2800;
  const totalNetPartners = totalCashCollected - totalAgencyCommissions;

  const pendingRequests = payoutRequests.filter((p) => p.status === "PENDING");
  const approvedRequests = payoutRequests.filter((p) => p.status === "APPROVED");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Finances & Validation des Retraits</h2>
          <p className="text-xs text-emerald-300/70 mt-1">
            Supervision du Cash On Delivery collecté, commissions logistiques ENO et arbitrage des demandes de virement Mobile Money.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
            <Clock className="w-4 h-4" />
            <span>{pendingRequests.length} demande(s) de retrait en attente d&apos;approbation</span>
          </div>
        )}
      </div>

      {/* 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Encaissé */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Total Cash Encaissé (COD)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{formatCFA(totalCashCollected)}</p>
          <p className="text-[11px] text-emerald-300/60">{totalDeliveredOrders.length} colis livrés et encaissés</p>
        </div>

        {/* Commissions Agence */}
        <div className="bg-[#091b14] border border-emerald-700/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Revenu Agence ENO</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#22c55e]">{formatCFA(totalAgencyCommissions)}</p>
          <p className="text-[11px] text-emerald-300/60">800 F Closing + 2 000 F Livraison / colis</p>
        </div>

        {/* Total à reverser */}
        <div className="bg-[#091b14] border border-emerald-600/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Boutiques Partenaires</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">{formatCFA(totalNetPartners)}</p>
          <p className="text-[11px] text-emerald-300/60">Fonds nets des marchands après prestation</p>
        </div>
      </div>

      {/* ⚡ SECTION VALIDATION DES DEMANDES DE RETRAIT (PDG ACTION) */}
      <div className="bg-[#091b14] border border-emerald-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">Demandes de Retrait Mobile Money</h3>
            </div>
            <p className="text-xs text-emerald-300/70 mt-0.5">
              Demandes soumises par les marchands depuis leur espace tableau de bord
            </p>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full self-start sm:self-auto">
            {pendingRequests.length} en attente
          </span>
        </div>

        <div className="p-6 space-y-3">
          {payoutRequests.length === 0 ? (
            <div className="p-8 text-center text-emerald-400/60 text-xs">
              Aucune demande de retrait enregistrée.
            </div>
          ) : (
            payoutRequests.map((req) => {
              const isPending = req.status === "PENDING";
              const isApproved = req.status === "APPROVED";

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isPending
                      ? "bg-amber-950/20 border-amber-700/80 shadow-md"
                      : isApproved
                      ? "bg-[#0c241a] border-emerald-900"
                      : "bg-rose-950/20 border-rose-900 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isPending
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : isApproved
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      }`}
                    >
                      {req.operator}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm font-black">{req.partnerName}</strong>
                        <span className="text-xs text-emerald-400 font-mono font-bold">
                          {req.amount.toLocaleString("fr-FR")} F CFA
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-0.5">
                        Vers : <strong>{req.operator} Money ({req.countryCode} {req.phone})</strong> • Demandé à {new Date(req.requestedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {req.txReference && (
                        <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Réf Transaction : {req.txReference}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions / Statut */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => approvePayout(req.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Valider & Transférer ({req.amount.toLocaleString("fr-FR")} F)</span>
                        </button>
                        <button
                          onClick={() => rejectPayout(req.id)}
                          className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs"
                        >
                          Rejeter
                        </button>
                      </>
                    ) : isApproved ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Virement Validé & Reversé</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold">
                        Demande Rejetée
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SOLDES PAR PARTENAIRE */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-900/60">
          <h3 className="text-base font-bold text-white">Soldes Marchands par Boutique</h3>
          <p className="text-xs text-emerald-300/70 mt-0.5">Calcul automatique des encaissements COD et commissions déduites</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-emerald-950/60 border-b border-emerald-900/60 text-emerald-300/70 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-5">Boutique</th>
                <th className="py-4 px-5">Responsable</th>
                <th className="py-4 px-5 text-center">Colis Livrés</th>
                <th className="py-4 px-5">Total Encaissé</th>
                <th className="py-4 px-5">Frais Prestation</th>
                <th className="py-4 px-5">Net Disponible</th>
                <th className="py-4 px-5 text-right">Espace Partenaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-medium">
              {partners.map((ptn) => {
                const ptnDelivered = orders.filter((o) => o.partnerId === ptn.id && o.status === "LIVREE");
                const collected = ptnDelivered.reduce((acc, curr) => acc + curr.totalPrice, 0);
                const comm = ptnDelivered.length * 2800;
                const net = Math.max(0, collected - comm);

                return (
                  <tr key={ptn.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-4 px-5 font-black text-white">{ptn.companyName}</td>
                    <td className="py-4 px-5 text-emerald-200/80">{ptn.fullName}</td>
                    <td className="py-4 px-5 text-center font-bold text-emerald-300">{ptnDelivered.length}</td>
                    <td className="py-4 px-5 font-bold text-white">{formatCFA(collected)}</td>
                    <td className="py-4 px-5 text-[#A84232] font-semibold">-{formatCFA(comm)}</td>
                    <td className="py-4 px-5 font-black text-emerald-400 text-sm">{formatCFA(net)}</td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href="/dashboard"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Store className="w-3 h-3" />
                        <span>Voir</span>
                      </Link>
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
