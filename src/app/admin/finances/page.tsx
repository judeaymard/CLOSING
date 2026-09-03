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
  Copy,
  Check,
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
  } = useOperations();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalDeliveredOrders = orders.filter((o) => o.status === "LIVREE");
  const totalCashCollected = totalDeliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyCommissions = totalDeliveredOrders.length * 2800;
  const totalNetPartners = totalCashCollected - totalAgencyCommissions;

  const pendingRequests = payoutRequests.filter((p) => p.status === "PENDING");
  const approvedRequests = payoutRequests.filter((p) => p.status === "APPROVED");

  return (
    <div className="space-y-8 animate-fade-in-up font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Finances & Validation des Retraits</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Supervision du Cash On Delivery (COD), commissions logistiques ENO et arbitrage des demandes de retraits marchands.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{pendingRequests.length} retrait(s) en attente d&apos;approbation</span>
          </div>
        )}
      </div>

      {/* 3 SUMMARY CARDS - Noir Ébène */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Encaissé */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Cash Encaissé (COD)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{formatCFA(totalCashCollected)}</p>
          <p className="text-[11px] text-zinc-500">{totalDeliveredOrders.length} colis livrés et encaissés</p>
        </div>

        {/* Commissions Agence */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Revenu Agence ENO</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 tracking-tight">{formatCFA(totalAgencyCommissions)}</p>
          <p className="text-[11px] text-zinc-500">800 F Closing + 2 000 F Livraison / colis</p>
        </div>

        {/* Total à reverser */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Boutiques Partenaires</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{formatCFA(totalNetPartners)}</p>
          <p className="text-[11px] text-zinc-500">Fonds disponibles des marchands après prestation</p>
        </div>
      </div>

      {/* ⚡ SECTION VALIDATION DES DEMANDES DE RETRAIT (PDG ACTION) */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Arbitrage des Retraits</span>
              {pendingRequests.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {pendingRequests.length} en attente
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  0 en attente
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Validez les demandes soumises par les marchands (Mobile Money, Wave & Crypto USDT / Binance Pay).
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">Toutes les demandes ont été traitées !</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Aucune demande de retrait en attente de validation pour le moment.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const isCrypto = req.operator === "USDT_TRC20" || req.operator === "BINANCE_PAY";
              const isMTN = req.operator === "MTN";
              const isMoov = req.operator === "MOOV";

              return (
                <div key={req.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#18181e] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCrypto ? "bg-amber-400 text-slate-950 font-black shadow-md" : isMTN ? "bg-yellow-400 text-slate-950" : isMoov ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                    }`}>
                      {req.operator === "USDT_TRC20" ? "USDT" : req.operator === "BINANCE_PAY" ? "PAY" : req.operator}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{req.partnerName}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {formatCFA(req.amount)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                        {isCrypto ? (
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300 font-bold">
                              {req.operator === "USDT_TRC20" ? "Adresse Tron (TRC-20) :" : "Binance Pay ID / Email :"}
                            </span>
                            <code className="bg-black px-2 py-0.5 rounded-md text-[11px] font-mono text-amber-300 border border-zinc-800">
                              {req.cryptoAddress || req.phone}
                            </code>
                            <button
                              onClick={() => handleCopy(req.cryptoAddress || req.phone, req.id)}
                              className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                              title="Copier l'adresse"
                            >
                              {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <span>
                            Vers : <strong>{req.operator} Money ({req.phone})</strong>
                          </span>
                        )}
                        <span>• Demandé le {req.requestedAt}</span>
                        <span className="text-[10px] font-mono text-zinc-500">Réf : {req.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => rejectPayout(req.id)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-rose-500/60 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => approvePayout(req.id)}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Confirmer le Virement</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* HISTORIQUE DES DERNIERS RETRAITS VALIDÉS */}
      {approvedRequests.length > 0 && (
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Historique des Retraits Validés
          </h3>
          <div className="divide-y divide-zinc-800/80">
            {approvedRequests.map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-white">{app.partnerName}</p>
                    <p className="text-[11px] text-zinc-500">{app.operator} • {app.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-400">{formatCFA(app.amount)}</p>
                  <p className="text-[10px] text-zinc-500">Effectué</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
