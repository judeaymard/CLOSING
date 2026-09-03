"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Smartphone,
  ShieldCheck,
  XCircle,
  Copy,
  Check,
  TrendingUp,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function AdminFinancesPage() {
  const {
    orders,
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Finances & Validation des Retraits</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervision du Cash On Delivery (COD), commissions agence et arbitrage des demandes de reversements marchands.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start sm:self-center">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingRequests.length} demande(s) en attente d&apos;approbation</span>
          </div>
        )}
      </div>

      {/* 3 SUMMARY CARDS - Design System 2027 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Encaissé */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cash Encaissé (COD)</span>
            <BadgeDollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{formatCFA(totalCashCollected)}</p>
          <p className="text-[11px] text-slate-500 font-medium">{totalDeliveredOrders.length} colis livrés et encaissés</p>
        </div>

        {/* Commissions Agence */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Revenu Prestations Agence</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">{formatCFA(totalAgencyCommissions)}</p>
          <p className="text-[11px] text-slate-500 font-medium">800 F Closing + 2 000 F Livraison / colis</p>
        </div>

        {/* Total à reverser */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Dû aux Marchands</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{formatCFA(totalNetPartners)}</p>
          <p className="text-[11px] text-slate-500 font-medium">Fonds disponibles pour retraits marchands</p>
        </div>
      </div>

      {/* ⚡ SECTION ARBITRAGE DES DEMANDES DE RETRAIT */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>Arbitrage des Retraits</span>
              {pendingRequests.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {pendingRequests.length} en attente
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  0 en attente
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Validez les virements soumis par les marchands (Mobile Money & Crypto USDT TRC-20 / Binance Pay).
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingRequests.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Toutes les demandes ont été traitées !</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Aucun retrait en attente d&apos;arbitrage pour le moment.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const isCrypto = req.operator === "USDT_TRC20" || req.operator === "BINANCE_PAY";
              const isMTN = req.operator === "MTN";
              const isMoov = req.operator === "MOOV";

              return (
                <div key={req.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCrypto ? "bg-slate-900 text-amber-400" : isMTN ? "bg-amber-400 text-slate-950" : isMoov ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                    }`}>
                      {req.operator === "USDT_TRC20" ? "USDT" : req.operator === "BINANCE_PAY" ? "PAY" : req.operator}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{req.partnerName}</span>
                        <span className="text-xs font-mono font-black text-emerald-600">
                          {formatCFA(req.amount)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {isCrypto ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-bold">
                              {req.operator === "USDT_TRC20" ? "Adresse Tron (TRC-20) :" : "ID Binance :"}
                            </span>
                            <code className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-800 border border-slate-200">
                              {req.cryptoAddress || req.phone}
                            </code>
                            <button
                              onClick={() => handleCopy(req.cryptoAddress || req.phone, req.id)}
                              className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                              title="Copier l'adresse"
                            >
                              {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <span>
                            Vers : <strong>{req.operator} Money ({req.phone})</strong>
                          </span>
                        )}
                        <span>• Demandé le {req.requestedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => rejectPayout(req.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => approvePayout(req.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Confirmer Virement</span>
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
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Historique des Retraits Validés
          </h3>
          <div className="divide-y divide-slate-100">
            {approvedRequests.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{app.partnerName}</p>
                    <p className="text-[11px] text-slate-400">{app.operator} • {app.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900">{formatCFA(app.amount)}</p>
                  <p className="text-[10px] text-slate-400">Effectué</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
