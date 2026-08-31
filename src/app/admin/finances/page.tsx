"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BadgeDollarSign, Wallet, ArrowUpRight, CheckCircle2, Building, DollarSign, ArrowRight, Store } from "lucide-react";
import { partners, orders, formatCFA } from "@/lib/mock-data";

export default function AdminFinancesPage() {
  const [payoutsDone, setPayoutsDone] = useState<Record<string, boolean>>({});

  const totalDeliveredOrders = orders.filter((o) => o.status === "LIVREE");
  const totalCashCollected = totalDeliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalAgencyCommissions = totalDeliveredOrders.length * 2800;
  const totalNetToPay = totalCashCollected - totalAgencyCommissions;

  const handleMarkAsPaid = (partnerId: string) => {
    setPayoutsDone((prev) => ({ ...prev, [partnerId]: true }));
  };

  const activePartners = partners.filter((p) => p.isApproved);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Finances & Reversements Agence</h2>
        <p className="text-xs text-emerald-300/70 mt-1">
          Gestion des encaissements terrain (Cash on Delivery), commissions prélevées (2 800 F / colis) et reversements MoMo aux boutiques par ENO LIVRAISON.
        </p>
      </div>

      {/* 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Encaissé */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Cash Encaissé (COD)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{formatCFA(totalCashCollected)}</p>
          <p className="text-[11px] text-emerald-300/60">{totalDeliveredOrders.length} commandes livrées & encaissées</p>
        </div>

        {/* Commissions Agence */}
        <div className="bg-[#091b14] border border-emerald-700/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Commissions Agence</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#22c55e]">
            {formatCFA(totalAgencyCommissions)}
          </p>
          <p className="text-[11px] text-emerald-300/60">800 F (Closing) + 2 000 F (Livraison) / colis</p>
        </div>

        {/* Total à reverser */}
        <div className="bg-[#091b14] border border-emerald-600/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Net Dû aux Partenaires</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">{formatCFA(totalNetToPay)}</p>
          <p className="text-[11px] text-emerald-300/60">Montant total à transférer par Mobile Money</p>
        </div>
      </div>

      {/* REVERSEMENTS PAR PARTENAIRE TABLE */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-900/60">
          <h3 className="text-base font-bold text-white">Soldes & Reversements par Boutique</h3>
          <p className="text-xs text-emerald-300/70 mt-0.5">Calcul automatique des parts e-commerçants avec accès direct à leur bilan</p>
        </div>

        <div className="overflow-x-auto dark-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-emerald-950/60 border-b border-emerald-900/60 text-emerald-300/70 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4">Boutique</th>
                <th className="py-4 px-4">Responsable</th>
                <th className="py-4 px-4 text-center">Commandes Livrées</th>
                <th className="py-4 px-4">Montant Collecté</th>
                <th className="py-4 px-4">Commissions Agence</th>
                <th className="py-4 px-4">Net Partenaire</th>
                <th className="py-4 px-4 text-right">Espace & Reversement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-medium">
              {activePartners.map((ptn) => {
                const ptnDelivered = orders.filter((o) => o.partnerId === ptn.id && o.status === "LIVREE");
                const collected = ptnDelivered.reduce((acc, curr) => acc + curr.totalPrice, 0);
                const comm = ptnDelivered.length * 2800;
                const net = Math.max(0, collected - comm);
                const isPaid = payoutsDone[ptn.id];

                return (
                  <tr key={ptn.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="py-4 px-4 font-black text-white">
                      <Link
                        href={`/admin/partenaires/${ptn.id}`}
                        className="hover:text-emerald-400 flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>{ptn.companyName}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-emerald-200">{ptn.fullName}</td>
                    <td className="py-4 px-4 text-center font-bold text-white">{ptnDelivered.length}</td>
                    <td className="py-4 px-4 font-bold text-white">{formatCFA(collected)}</td>
                    <td className="py-4 px-4 font-bold text-[#22c55e]">-{formatCFA(comm)}</td>
                    <td className="py-4 px-4 font-black text-emerald-400 text-sm">
                      {formatCFA(net)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Reversé
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(ptn.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                          >
                            Marquer reversé
                          </button>
                        )}

                        <Link
                          href={`/admin/partenaires/${ptn.id}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-800"
                        >
                          <span>Détails</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
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
