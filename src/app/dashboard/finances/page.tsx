"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Download,
  X,
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
  const commissions = 106400; // 38 * 2800 F
  const revenuNet = 252400; // 358800 - 106400

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setShowPayoutModal(false);
    setTimeout(() => setPayoutSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up w-full max-w-full min-w-0">
      {/* 🏛️ HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-[#EAE6DD] min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-[#787163] truncate">
            <span>Livre de Caisse</span>
            <span>•</span>
            <span className="text-[#0D5940]">Comptabilité 100% Transparente</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#141A17] tracking-tight mt-1 truncate">
            Coffre & Reversements
          </h2>
          <p className="text-xs text-[#787163] mt-1 leading-normal">
            Suivi des encaissements physiques Cash On Delivery et virement immédiat de vos fonds.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#0D5940] hover:bg-[#093D2C] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Smartphone className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>Demande de retrait</span>
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Payout Success Toast Notification */}
      {payoutSuccess && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#0D5940] text-[#0D5940] text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#0D5940] shrink-0" />
            <span className="truncate">
              Demande de virement de {Number(payoutAmount).toLocaleString("fr-FR")} F CFA transmise vers votre compte {payoutMethod} MoMo !
            </span>
          </div>
          <span className="text-[10px] bg-[#FAF9F5] border border-[#EAE6DD] text-[#0D5940] px-2.5 py-0.5 rounded-full uppercase font-bold shrink-0">
            Traité sous 30 min
          </span>
        </div>
      )}

      {/* 💎 4 SUMMARY NOBLE CARDS (Synchronized baselines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        {/* Solde Net Disponible */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D5940] truncate">
              Net Disponible
            </span>
            <Wallet className="w-4 h-4 text-[#0D5940] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#0D5940] tracking-tight">
              {revenuNet.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-[#787163]">F CFA</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Prêt pour virement immédiat</p>
          </div>
        </div>

        {/* Chiffre d'affaires brut */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">
              CA Brut Encaissé
            </span>
            <TrendingUp className="w-4 h-4 text-[#8C8474] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {caTotal.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-[#787163]">F CFA</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Total collecté par les livreurs</p>
          </div>
        </div>

        {/* Frais Logistiques Déduits */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84232] truncate">
              Frais ENO Déduits
            </span>
            <span className="text-[10px] font-bold text-[#A84232] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#EAE6DD] shrink-0">
              -2 800 F / colis
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#A84232] tracking-tight">
              -{commissions.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-[#787163]">F CFA</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">800 F Closing + 2 000 F Livraison</p>
          </div>
        </div>

        {/* Taux de Conversion */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">
              Colis Encaissés
            </span>
            <span className="text-[10px] font-bold text-[#0D5940] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#EAE6DD] shrink-0">
              Succès
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {deliveredOrdersCount} <span className="text-xs font-semibold text-[#787163]">/ {totalOrdersCount}</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Cash collecté sans incident</p>
          </div>
        </div>
      </div>

      {/* 📜 DÉTAIL DES FRAIS PAR LIVRAISON (Equal heights) */}
      <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(20,26,23,0.03)] space-y-4 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="text-sm sm:text-base font-black text-[#141A17] tracking-tight truncate">
            Barème Tarifaire Transparent
          </h3>
          <span className="text-[10px] font-bold text-[#0D5940] uppercase tracking-wider bg-[#FAF9F5] border border-[#EAE6DD] px-2.5 py-1 rounded-full shrink-0">
            Zéro Frais Caché
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
          <div className="bg-[#FAF9F5] border border-[#EAE6DD] p-4 rounded-2xl flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold text-[#787163] uppercase tracking-wider truncate">Service Closing Téléphonique</p>
            <div className="mt-2">
              <p className="text-lg sm:text-xl font-black text-[#141A17]">800 F CFA</p>
              <p className="text-[11px] text-[#5C5649] mt-0.5">Appel sous 15 min & confirmation client</p>
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-[#EAE6DD] p-4 rounded-2xl flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold text-[#787163] uppercase tracking-wider truncate">Livraison Express Urbaine</p>
            <div className="mt-2">
              <p className="text-lg sm:text-xl font-black text-[#141A17]">2 000 F CFA</p>
              <p className="text-[11px] text-[#5C5649] mt-0.5">Déploiement livreur Cotonou & Calavi</p>
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-[#EAE6DD] p-4 rounded-2xl flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold text-[#0D5940] uppercase tracking-wider truncate">Total Retenu par Commande</p>
            <div className="mt-2">
              <p className="text-lg sm:text-xl font-black text-[#0D5940]">2 800 F CFA</p>
              <p className="text-[11px] text-[#5C5649] mt-0.5">Facturé uniquement si le client paie</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 HISTORIQUE DU LIVRE FINANCIER (Safe horizontal table) */}
      <div className="bg-white border border-[#EAE6DD] rounded-3xl shadow-[0_2px_12px_rgba(20,26,23,0.03)] overflow-hidden w-full min-w-0">
        <div className="p-4 sm:p-6 border-b border-[#EAE6DD] flex items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-[#141A17] tracking-tight truncate">
              Journal des Commissions & Reversements
            </h3>
            <p className="text-xs text-[#787163] mt-0.5 truncate">
              Détail ligne par ligne pour chaque commande livrée.
            </p>
          </div>

          <button className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#141A17] text-xs font-bold border border-[#EAE6DD] flex items-center gap-1.5 transition-all shadow-2xs shrink-0">
            <Download className="w-3.5 h-3.5 text-[#0D5940] shrink-0" />
            <span className="hidden sm:inline">Relevé PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-[#FAF9F5] border-b border-[#EAE6DD] text-[#787163] font-bold uppercase tracking-[0.15em] text-[10px]">
              <tr>
                <th className="py-3 px-5">Réf.</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Encaissé COD</th>
                <th className="py-3 px-5">Frais ENO</th>
                <th className="py-3 px-5">Net Marchand</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DD]/60 font-medium text-[#141A17]">
              {orders.slice(0, 8).map((ord) => {
                const isDelivered = ord.status === "LIVREE";
                return (
                  <tr key={ord.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#0D5940]">{ord.orderNumber}</td>
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-[#141A17]">{ord.clientName}</p>
                      <p className="text-[11px] text-[#787163]">{ord.clientPhone}</p>
                    </td>
                    <td className="py-3.5 px-5 font-black text-[#141A17]">
                      {ord.totalPrice.toLocaleString("fr-FR")} F CFA
                    </td>
                    <td className="py-3.5 px-5 font-bold">
                      {isDelivered ? <span className="text-[#A84232]">-2 800 F</span> : <span className="text-[#8C8474]">—</span>}
                    </td>
                    <td className="py-3.5 px-5 font-black">
                      {isDelivered ? (
                        <span className="text-[#0D5940]">
                          {(ord.totalPrice - 2800).toLocaleString("fr-FR")} F
                        </span>
                      ) : (
                        <span className="text-[#8C8474]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isDelivered
                            ? "bg-[#FAF9F5] text-[#0D5940] border-[#0D5940]/30"
                            : "bg-[#FAF9F5] text-[#A84232] border-[#A84232]/30"
                        }`}
                      >
                        {isDelivered ? "ENCAISSÉE" : "À RAPPELER"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#787163]">24/08/2026</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 MODAL DE RETRAIT DE BÉNÉFICES */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-[#141A17]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE6DD] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DD]">
              <div>
                <h3 className="text-base font-black text-[#141A17]">Retrait de vos Bénéfices</h3>
                <p className="text-xs text-[#787163] mt-0.5">Vos gains sont versés sur votre compte Mobile Money</p>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] text-[#8C8474] flex items-center justify-center hover:text-[#141A17]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              {/* Compte Mobile Money du Profil */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DD] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163]">
                    Compte MoMo de versement
                  </span>
                  <span className="text-[10px] font-bold text-[#0D5940] bg-white border border-[#EAE6DD] px-2 py-0.5 rounded-md">
                    Certifié
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0D5940] text-white flex items-center justify-center font-black text-xs">
                      {payoutMethod.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#141A17]">{payoutMethod} Money</p>
                      <p className="text-[11px] text-[#787163] font-medium">+229 01 97 36 29 06</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(["MTN", "MOOV", "WAVE"] as const).map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setPayoutMethod(net)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                          payoutMethod === net
                            ? "bg-[#0D5940] text-white"
                            : "bg-white text-[#787163] border border-[#EAE6DD] hover:text-[#141A17]"
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Montant à retirer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#787163]">
                    Montant à retirer
                  </label>
                  <span className="text-[11px] text-[#787163]">
                    Disponible : <strong className="text-[#0D5940]">252 400 F</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={payoutAmount}
                    max="252400"
                    min="1000"
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#EAE6DD] rounded-2xl text-xl font-black text-[#0D5940] focus:outline-none focus:border-[#0D5940] focus:bg-white transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#787163]">
                    F CFA
                  </span>
                </div>

                {/* Raccourcis de retrait */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPayoutAmount("50000")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-white border border-[#EAE6DD] text-[11px] font-bold text-[#141A17] transition-all"
                  >
                    50 000 F
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount("100000")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-white border border-[#EAE6DD] text-[11px] font-bold text-[#141A17] transition-all"
                  >
                    100 000 F
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount("252400")}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#0D5940] text-[11px] font-bold text-[#0D5940] transition-all"
                  >
                    Tout retirer (252 400 F)
                  </button>
                </div>
              </div>

              {/* Engagement de versement */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] text-[11px] text-[#5C5649] flex items-center justify-between">
                <span>Délai de versement :</span>
                <span className="font-bold text-[#0D5940]">Moins de 30 minutes sans frais</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE6DD] text-xs font-bold text-[#5C5649] hover:bg-[#FAF9F5]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0D5940] hover:bg-[#093D2C] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <span>Confirmer le Retrait de {Number(payoutAmount || 0).toLocaleString("fr-FR")} F CFA</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
