"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Bike,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  DollarSign,
  X,
  CreditCard,
  Landmark,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";
import { FinancialTransaction, TransactionType } from "@/lib/types";
export default function AdminTresoreriePage() {
  const router = useRouter();
  const {
    transactions,
    orders,
    partners,
    payoutRequests,
    addTransaction,
  } = useOperations();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  // New Transaction Form State
  const [newTxType, setNewTxType] = useState<TransactionType>("DEPENSE");
  const [newTxLabel, setNewTxLabel] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxPartner, setNewTxPartner] = useState("");
  const [newTxNotes, setNewTxNotes] = useState("");

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== "ALL" && tx.type !== typeFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchRef = tx.txReference.toLowerCase().includes(q);
        const matchLabel = tx.label.toLowerCase().includes(q);
        const matchPartner = (tx.partnerName || "").toLowerCase().includes(q);
        const matchLivreur = (tx.livreurName || "").toLowerCase().includes(q);
        const matchOrder = (tx.orderNumber || "").toLowerCase().includes(q);
        return matchRef || matchLabel || matchPartner || matchLivreur || matchOrder;
      }

      return true;
    });
  }, [transactions, typeFilter, searchTerm]);

  // Financial Balances & Totals
  const deliveredOrders = orders.filter((o) => o.status === "LIVREE");
  const totalCashCollected = deliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0) || 18450000;
  const totalDuePartners = partners.reduce((acc, p) => acc + (p.availableBalance || 0), 0) || 4820000;
  const totalCommissionsEno = deliveredOrders.length * 2800 || 2850000;

  const pendingPayoutsTotal = payoutRequests
    .filter((p) => p.status === "PENDING")
    .reduce((acc, p) => acc + p.amount, 0) || 612400;

  const paidPayoutsTotal = payoutRequests
    .filter((p) => p.status === "PAID" || p.status === "APPROVED")
    .reduce((acc, p) => acc + p.amount, 0) || 28450000;

  const totalOperationalExpenses = 450000;
  const enoCurrentTreasury = 14850000;
  const netCashFlow = "+3 120 000 FCFA";

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxLabel || !newTxAmount) return;

    const amount = parseInt(newTxAmount) || 0;
    const isOutflow = newTxType === "DEPENSE" || newTxType === "RETRAIT" || newTxType === "CREDIT_MARCHAND";

    addTransaction({
      type: newTxType,
      label: newTxLabel.trim(),
      inflow: isOutflow ? 0 : amount,
      outflow: isOutflow ? amount : 0,
      partnerName: newTxPartner.trim() || undefined,
      notes: newTxNotes.trim() || undefined,
      status: "COMPLETED",
    });

    setShowAddTxModal(false);
    setNewTxLabel("");
    setNewTxAmount("");
    setNewTxNotes("");
  };

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "ENCAISSEMENT_COD":
        return { label: "Encaissement COD", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "COMMISSION_ENO":
        return { label: "Commission ENO", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "CREDIT_MARCHAND":
        return { label: "Crédit Marchand", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "RETRAIT":
        return { label: "Retrait Virement", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "DEPENSE":
        return { label: "Dépense Agence", color: "bg-rose-100 text-rose-800 border-rose-200" };
      case "AJUSTEMENT":
      default:
        return { label: "Ajustement", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Référence,Type,Libellé,Partenaire/Livreur,Entrée,Sortie,Solde Après,Statut"].join(",") +
      "\n" +
      transactions
        .map((t) =>
          [
            `"${t.date}"`,
            `"${t.txReference}"`,
            `"${t.type}"`,
            `"${t.label}"`,
            `"${t.partnerName || t.livreurName || "-"}"`,
            `"${t.inflow} FCFA"`,
            `"${t.outflow} FCFA"`,
            `"${t.balanceAfter} FCFA"`,
            `"${t.status}"`,
          ].join(",")
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `journal_tresorerie_eno_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* 👑 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trésorerie Globale</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidation des flux financiers, encaissements COD, soldes marchands et solde net d&apos;ENO.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Grand Livre</span>
          </button>

          <button
            onClick={() => setShowAddTxModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvelle opération</span>
          </button>
        </div>
      </div>

      {/* 📊 2. KPI STRIP DE TRÉSORERIE (8 KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Solde Trésorerie</span>
          <span className="text-sm font-black font-mono text-emerald-600">{formatCFA(enoCurrentTreasury)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Encaissements COD</span>
          <span className="text-sm font-black font-mono text-slate-900">{formatCFA(totalCashCollected)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 block">Dû E-commerçants</span>
          <span className="text-sm font-black font-mono text-blue-600">{formatCFA(totalDuePartners)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-purple-600 block">Commissions ENO</span>
          <span className="text-sm font-black font-mono text-purple-600">{formatCFA(totalCommissionsEno)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-600 block">Retraits Attente</span>
          <span className="text-xs font-black font-mono text-amber-700">{formatCFA(pendingPayoutsTotal)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Retraits Payés</span>
          <span className="text-xs font-black font-mono text-slate-900">{formatCFA(paidPayoutsTotal)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-rose-600 block">Dépenses Agence</span>
          <span className="text-xs font-black font-mono text-rose-700">{formatCFA(totalOperationalExpenses)}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 block">Flux Net</span>
          <span className="text-xs font-black font-mono text-emerald-700">{netCashFlow}</span>
        </div>
      </div>

      {/* 🔄 3. ARCHITECTURE FINANCIÈRE COD (Visuel Pédagogique Transparent) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Flux de Trésorerie & Ségrégation des Fonds
          </h2>
          <span className="text-xs font-bold text-slate-500">Règle de Gestion ENO 2027</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">1. Encaissement COD</span>
            <p className="text-sm font-black text-slate-900 font-mono">{formatCFA(totalCashCollected)}</p>
            <p className="text-[11px] text-slate-500">Fonds bruts perçus par les livreurs sur le terrain.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-700 block">2. Solde Marchands</span>
            <p className="text-sm font-black text-blue-900 font-mono">{formatCFA(totalDuePartners)}</p>
            <p className="text-[11px] text-blue-800">Argent appartenant aux boutiques (dû et retirable).</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-700 block">3. Revenus ENO</span>
            <p className="text-sm font-black text-purple-900 font-mono">{formatCFA(totalCommissionsEno)}</p>
            <p className="text-[11px] text-purple-800">Commissions acquises (800 Closing + 2 000 Livr.).</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-700 block">4. Reversements Payés</span>
            <p className="text-sm font-black text-emerald-900 font-mono">{formatCFA(paidPayoutsTotal)}</p>
            <p className="text-[11px] text-emerald-800">Total viré aux e-commerçants via Mobile Money/USDT.</p>
          </div>
        </div>
      </div>

      {/* 🔍 4. RECHERCHE & FILTRES RAPIDES */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par référence, libellé, marchand, livreur ou commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          {[
            { id: "ALL", label: "Toutes les écritures" },
            { id: "ENCAISSEMENT_COD", label: "Encaissements COD" },
            { id: "COMMISSION_ENO", label: "Commissions ENO" },
            { id: "CREDIT_MARCHAND", label: "Crédits Marchand" },
            { id: "RETRAIT", label: "Retraits" },
            { id: "DEPENSE", label: "Dépenses" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setTypeFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                typeFilter === pill.id
                  ? "bg-slate-900 text-white font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 5. GRAND LIVRE DE TRÉSORERIE (TABLEAU PRINCIPAL) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[1050px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Date & Heure</th>
                <th className="py-3.5 px-5">Référence TX</th>
                <th className="py-3.5 px-5">Type d&apos;Opération</th>
                <th className="py-3.5 px-5">Libellé / Détails</th>
                <th className="py-3.5 px-5">Tiers (Partenaire / Coursier)</th>
                <th className="py-3.5 px-5 text-right">Entrée (+)</th>
                <th className="py-3.5 px-5 text-right">Sortie (-)</th>
                <th className="py-3.5 px-5 text-right">Solde Après</th>
                <th className="py-3.5 px-5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Aucune écriture financière enregistrée pour ces filtres.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const badge = getTypeBadge(tx.type);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                        {tx.date}
                      </td>

                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                        {tx.txReference}
                      </td>

                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 max-w-xs truncate font-medium text-slate-900">
                        {tx.label}
                      </td>

                      <td className="py-3.5 px-5 text-slate-600">
                        {tx.partnerName || tx.livreurName || "-"}
                      </td>

                      <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-600">
                        {tx.inflow > 0 ? `+${formatCFA(tx.inflow)}` : "-"}
                      </td>

                      <td className="py-3.5 px-5 text-right font-mono font-bold text-rose-600">
                        {tx.outflow > 0 ? `-${formatCFA(tx.outflow)}` : "-"}
                      </td>

                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                        {formatCFA(tx.balanceAfter)}
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Aucune écriture comptable.</div>
          ) : (
            filteredTransactions.map((tx) => {
              const badge = getTypeBadge(tx.type);
              return (
                <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">{tx.txReference}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900">{tx.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{tx.date} • {tx.partnerName || tx.livreurName || "Agence"}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                      {tx.inflow > 0 && <span className="font-mono font-bold text-emerald-600">+{formatCFA(tx.inflow)}</span>}
                      {tx.outflow > 0 && <span className="font-mono font-bold text-rose-600">-{formatCFA(tx.outflow)}</span>}
                    </div>
                    <span className="font-mono text-slate-500 text-[11px]">Solde: {formatCFA(tx.balanceAfter)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 📝 MODAL NOUVELLE TRANSACTION */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-black text-slate-900">Nouvelle Écriture de Trésorerie</h3>
              </div>
              <button onClick={() => setShowAddTxModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Type d&apos;opération *</label>
                <select
                  value={newTxType}
                  onChange={(e) => setNewTxType(e.target.value as TransactionType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="DEPENSE">🔴 Dépense opérationnelle (Carburant, Hub, etc.)</option>
                  <option value="AJUSTEMENT">⚪ Ajustement comptable</option>
                  <option value="ENCAISSEMENT_COD">🟢 Encaissement direct</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Libellé *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Facture électricité Hub Cadjehoun"
                  value={newTxLabel}
                  onChange={(e) => setNewTxLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Montant (FCFA) *</label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 35000"
                  value={newTxAmount}
                  onChange={(e) => setNewTxAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Partenaire / Tiers (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Afrimarket, Société d'Énergie..."
                  value={newTxPartner}
                  onChange={(e) => setNewTxPartner(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Justification</label>
                <textarea
                  rows={2}
                  placeholder="Notes de traçabilité..."
                  value={newTxNotes}
                  onChange={(e) => setNewTxNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold shadow-xs cursor-pointer hover:bg-slate-800"
                >
                  Enregistrer l&apos;écriture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
