"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Zap,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Ticket,
  Truck,
  Download,
} from "lucide-react";
import { orders } from "@/lib/mock-data";

export default function FinancesPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("252400");
  const [payoutMethod, setPayoutMethod] = useState<"MTN" | "MOOV" | "WAVE">("MTN");

  const deliveredOrdersCount = 38;
  const totalOrdersCount = 77;
  const caTotal = 358800;
  const commissions = 106400; // 38 * 2800
  const revenuNet = 252400; // 358800 - 106400

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setShowPayoutModal(false);
    setTimeout(() => setPayoutSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Finances & Commissions</h2>
          <p className="text-xs text-emerald-300/70 mt-0.5">Récapitulatif de vos revenus et reversements par ENO LIVRAISON</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Smartphone className="w-4 h-4" />
          <span>Demander un reversement Mobile Money</span>
        </button>
      </div>

      {/* Payout Success Toast Notification */}
      {payoutSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Demande de virement de {Number(payoutAmount).toLocaleString("fr-FR")} F CFA envoyée vers votre compte {payoutMethod} MoMo !</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Traité sous 30 min</span>
        </div>
      )}

      {/* 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires total */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-emerald-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-emerald-300/70">Chiffre d&apos;affaires total</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {caTotal.toLocaleString("fr-FR")} <span className="text-xs font-normal text-emerald-300/70">F</span>
            </p>
          </div>
        </div>

        {/* Commissions prélevées */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-emerald-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-emerald-300/70">Commissions prélevées</p>
            <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-0.5">
              -{commissions.toLocaleString("fr-FR")} <span className="text-xs font-normal text-rose-300">F</span>
            </p>
            <p className="text-[11px] text-emerald-300/60 mt-0.5">2 800 F / produit livré</p>
          </div>
        </div>

        {/* Revenu net */}
        <div className="bg-[#091b14] border border-emerald-600/40 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <Star className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-emerald-300/70">Revenu net</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">
              {revenuNet.toLocaleString("fr-FR")} <span className="text-xs font-normal text-emerald-300">F</span>
            </p>
          </div>
        </div>

        {/* Commandes livrées */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-emerald-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-emerald-300/70">Commandes livrées</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {deliveredOrdersCount} <span className="text-sm text-emerald-400 font-normal">/ {totalOrdersCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* DÉTAIL DES FRAIS PAR LIVRAISON */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <CreditCard className="w-4 h-4" />
          <span>Détail des frais par livraison</span>
        </div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl">
            <p className="text-[11px] text-emerald-300/70 font-medium">Frais service closing</p>
            <p className="text-xl font-bold text-amber-400 mt-1">800 F</p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl">
            <p className="text-[11px] text-emerald-300/70 font-medium">Frais livraison</p>
            <p className="text-xl font-bold text-blue-400 mt-1">2 000 F</p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl">
            <p className="text-[11px] text-emerald-300/70 font-medium">Total / produit</p>
            <p className="text-xl font-bold text-rose-400 mt-1">2 800 F</p>
          </div>
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl">
            <p className="text-[11px] text-emerald-300/70 font-medium">Total frais service</p>
            <p className="text-xl font-bold text-white mt-1">30 400 F</p>
            <p className="text-[10px] text-emerald-300/60 mt-0.5">38 livraisons × 800 F</p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl">
            <p className="text-[11px] text-emerald-300/70 font-medium">Total frais livraison</p>
            <p className="text-xl font-bold text-white mt-1">76 000 F</p>
            <p className="text-[10px] text-emerald-300/60 mt-0.5">38 livraisons × 2 000 F</p>
          </div>
        </div>
      </div>

      {/* HISTORIQUE DES COMMISSIONS TABLE */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-emerald-900/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Historique des commissions</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">Par commande livrée</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-800 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Relevé</span>
          </button>
        </div>

        <div className="overflow-x-auto dark-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-emerald-950/60 border-b border-emerald-900/60 text-emerald-300/70 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4 text-center">Produits</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Net</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-medium">
              {orders.slice(0, 8).map((ord) => {
                const isDelivered = ord.status === "LIVREE";
                return (
                  <tr key={ord.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-300">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{ord.clientName}</p>
                      <p className="text-[11px] text-emerald-300/70">{ord.clientPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-white">{ord.totalPrice.toLocaleString("fr-FR")} F</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-200">{ord.quantity}</td>
                    <td className="py-3.5 px-4 font-black">
                      {isDelivered ? <span className="text-rose-400">-2800 F</span> : <span className="text-emerald-300/60">—</span>}
                    </td>
                    <td className="py-3.5 px-4 font-black">
                      {isDelivered ? <span className="text-emerald-400">5000 F</span> : <span className="text-emerald-300/60">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isDelivered ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {isDelivered ? "LIVRÉE" : "A RAPPELER"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300/70">24/08/2026</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE MONEY PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reversement Mobile Money</h3>
                  <p className="text-xs text-emerald-300/70">Transférer votre solde net vers MoMo</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-emerald-300/70 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200/80 uppercase">Mode de Réception</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("MTN")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "MTN"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                        : "bg-emerald-950 border-emerald-800 text-emerald-300/70"
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("MOOV")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "MOOV"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500"
                        : "bg-emerald-950 border-emerald-800 text-emerald-300/70"
                    }`}
                  >
                    Moov
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("WAVE")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "WAVE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                        : "bg-emerald-950 border-emerald-800 text-emerald-300/70"
                    }`}
                  >
                    Wave
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200/80 uppercase">Montant du Virement (FCFA)</label>
                <input
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:border-[#16a34a]"
                />
                <p className="text-[11px] text-emerald-300/70">Compte Mobile Money : <span className="text-white font-bold">+229 01 97 36 29 06</span></p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md"
                >
                  Confirmer le virement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
