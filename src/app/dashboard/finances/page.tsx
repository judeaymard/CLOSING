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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Finances & Commissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">Récapitulatif de vos revenus et reversements par ENO LIVRAISON</p>
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
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            <span>Demande de virement de {Number(payoutAmount).toLocaleString("fr-FR")} F CFA envoyée vers votre compte {payoutMethod} MoMo !</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase font-bold">Traité sous 30 min</span>
        </div>
      )}

      {/* 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires total */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Chiffre d&apos;affaires total</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {caTotal.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-400">F CFA</span>
            </p>
          </div>
        </div>

        {/* Commissions prélevées */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Commissions prélevées</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">
              -{commissions.toLocaleString("fr-FR")} <span className="text-xs font-normal text-rose-400">F CFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">2 800 F / produit livré</p>
          </div>
        </div>

        {/* Revenu net */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16a34a] flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <Star className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Revenu net disponible</p>
            <p className="text-xl sm:text-2xl font-black text-[#16a34a] mt-0.5">
              {revenuNet.toLocaleString("fr-FR")} <span className="text-xs font-normal text-emerald-600">F CFA</span>
            </p>
          </div>
        </div>

        {/* Commandes livrées */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Commandes livrées</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {deliveredOrdersCount} <span className="text-sm text-slate-400 font-normal">/ {totalOrdersCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* DÉTAIL DES FRAIS PAR LIVRAISON */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <CreditCard className="w-4 h-4 text-[#16a34a]" />
          <span>Détail des frais par livraison</span>
        </div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <p className="text-[11px] text-slate-500 font-medium">Frais service closing</p>
            <p className="text-xl font-black text-amber-600 mt-1">800 F</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <p className="text-[11px] text-slate-500 font-medium">Frais livraison</p>
            <p className="text-xl font-black text-blue-600 mt-1">2 000 F</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <p className="text-[11px] text-slate-500 font-medium">Total déduit / produit</p>
            <p className="text-xl font-black text-slate-900 mt-1">2 800 F</p>
          </div>
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <p className="text-[11px] text-slate-500 font-medium">Total frais service closing</p>
            <p className="text-xl font-black text-slate-900 mt-1">30 400 F CFA</p>
            <p className="text-[10px] text-slate-400 mt-0.5">38 livraisons × 800 F</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <p className="text-[11px] text-slate-500 font-medium">Total frais livraison</p>
            <p className="text-xl font-black text-slate-900 mt-1">76 000 F CFA</p>
            <p className="text-[10px] text-slate-400 mt-0.5">38 livraisons × 2 000 F</p>
          </div>
        </div>
      </div>

      {/* HISTORIQUE DES COMMISSIONS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historique des commissions</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Par commande livrée</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Relevé</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.slice(0, 8).map((ord) => {
                const isDelivered = ord.status === "LIVREE";
                return (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#16a34a]">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{ord.clientName}</p>
                      <p className="text-[11px] text-slate-500">{ord.clientPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{ord.totalPrice.toLocaleString("fr-FR")} F</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{ord.quantity}</td>
                    <td className="py-3.5 px-4 font-black">
                      {isDelivered ? <span className="text-rose-600">-2 800 F</span> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-3.5 px-4 font-black">
                      {isDelivered ? <span className="text-[#16a34a]">5 000 F</span> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isDelivered
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {isDelivered ? "LIVRÉE" : "À RAPPELER"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">24/08/2026</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE MONEY PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reversement Mobile Money</h3>
                  <p className="text-xs text-slate-500">Transférer votre solde net vers MoMo</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Mode de Réception</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("MTN")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "MTN"
                        ? "bg-amber-50 text-amber-800 border-amber-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("MOOV")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "MOOV"
                        ? "bg-blue-50 text-blue-800 border-blue-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Moov Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("WAVE")}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      payoutMethod === "WAVE"
                        ? "bg-cyan-50 text-cyan-800 border-cyan-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Wave
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Montant du Virement (FCFA)</label>
                <input
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                />
                <p className="text-[11px] text-slate-500">Compte Mobile Money : <span className="text-slate-900 font-bold">+229 01 97 36 29 06</span></p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20"
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
