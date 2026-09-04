"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  Bike,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  UserCheck,
  Eye,
  Layers,
  Banknote,
  Vault,
  X,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";
import { DriverCodFinancialSummary, CodRemittance } from "@/lib/types";

export default function TresorerieDashboardPage() {
  const {
    livreurs,
    codCollections,
    codRemittances,
    activeTreasuryManager,
    getDriverCodFunds,
    receiveDriverRemittance,
  } = useOperations();

  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickRemittanceModal, setShowQuickRemittanceModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("liv-1");
  const [receivedAmountInput, setReceivedAmountInput] = useState<string>("");
  const [remittanceNotesInput, setRemittanceNotesInput] = useState<string>("");
  const [discrepancyReasonInput, setDiscrepancyReasonInput] = useState<string>("");
  const [selectedOrderBreakdownDriver, setSelectedOrderBreakdownDriver] = useState<DriverCodFinancialSummary | null>(null);

  // Selected driver funds calculation (Single Source of Truth)
  const selectedDriverFunds = useMemo(() => {
    return getDriverCodFunds(selectedDriverId);
  }, [selectedDriverId, getDriverCodFunds]);

  // Executive KPIs for Treasury Manager
  const allDriversSummaries = useMemo(() => {
    return livreurs.map((l) => getDriverCodFunds(l.id));
  }, [livreurs, getDriverCodFunds]);

  const totalFundsToReceive = allDriversSummaries.reduce((s, d) => s + d.fundsToRemit, 0);
  const driversWithFundsCount = allDriversSummaries.filter((d) => d.fundsToRemit > 0).length;
  const pendingRemittancesCount = codRemittances.filter((r) => r.status === "PENDING_VALIDATION").length;
  const discrepanciesCount = codRemittances.filter(
    (r) => r.status === "DISCREPANCY_DETECTED" || (r.discrepancyAmount && r.discrepancyAmount > 0)
  ).length;

  // Today's validated remittances
  const todayRemittances = useMemo(() => {
    return codRemittances.filter((r) => r.status === "VALIDATED" || r.status === "DISCREPANCY_DETECTED");
  }, [codRemittances]);

  const totalReceivedToday = useMemo(() => {
    return todayRemittances.reduce((s, r) => s + (r.receivedAmount || r.amountDeclared || r.amountExpected), 0);
  }, [todayRemittances]);

  // Filtered expected remittances list
  const filteredDriverSummaries = useMemo(() => {
    return allDriversSummaries.filter((d) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return d.livreurName.toLowerCase().includes(q) || d.statusLabel.toLowerCase().includes(q);
    });
  }, [allDriversSummaries, searchTerm]);

  // Quick remittance open helper
  const handleOpenRemittanceForDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    const summary = getDriverCodFunds(driverId);
    setReceivedAmountInput(summary.fundsToRemit.toString());
    setRemittanceNotesInput("");
    setDiscrepancyReasonInput("");
    setShowQuickRemittanceModal(true);
  };

  // Submit remittance workflow (< 1 min)
  const handleSubmitRemittance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivedAmountInput) return;

    const receivedAmt = parseInt(receivedAmountInput) || 0;
    receiveDriverRemittance({
      livreurId: selectedDriverId,
      receivedAmount: receivedAmt,
      receivedBy: activeTreasuryManager?.name || "Jean-Baptiste AGOSSOU",
      receivedById: activeTreasuryManager?.id || "tm-1",
      notes: remittanceNotesInput.trim() || undefined,
      discrepancyReason: discrepancyReasonInput.trim() || undefined,
    });

    setShowQuickRemittanceModal(false);
    setReceivedAmountInput("");
    setRemittanceNotesInput("");
    setDiscrepancyReasonInput("");
  };

  // Discrepancy calculation for modal
  const inputAmt = parseInt(receivedAmountInput) || 0;
  const currentDiscrepancy = selectedDriverFunds.fundsToRemit - inputAmt;

  // Unremitted collections for the breakdown modal
  const selectedDriverUnremittedCollections = useMemo(() => {
    if (!selectedOrderBreakdownDriver) return [];
    return codCollections.filter(
      (c) =>
        c.livreurId === selectedOrderBreakdownDriver.livreurId &&
        c.remittanceStatus !== "VALIDATED"
    );
  }, [selectedOrderBreakdownDriver, codCollections]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. EXECUTIVE BANNER & GREETING */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Session Caisse Active
            </span>
            <span className="text-slate-400 text-xs font-semibold">
              {activeTreasuryManager?.zone || "Hub Central Cotonou"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bonjour, {activeTreasuryManager?.name || "Jean-Baptiste AGOSSOU"} 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Espace opérationnel de trésorerie terrain : enregistrez les dépôts d&apos;espèces COD en moins d&apos;une minute, contrôlez les écarts de caisse et assurez la sécurité du coffre-fort.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => {
              if (livreurs.length > 0) {
                handleOpenRemittanceForDriver(livreurs[0].id);
              }
            }}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Banknote className="w-4 h-4 text-slate-950" />
            <span>+ Enregistrer une remise physique</span>
          </button>
        </div>

        {/* Background icon */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Vault className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* 2. 5 EXECUTIVE STATS / KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* KPI 1: Fonds à recevoir */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fonds à recevoir</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {formatCFA(totalFundsToReceive)}
          </div>
          <div className="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>En attente chez les livreurs</span>
          </div>
        </div>

        {/* KPI 2: Livreurs concernés */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Livreurs avec fonds</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {driversWithFundsCount} <span className="text-xs font-normal text-slate-400">/ {livreurs.length}</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Actuellement en tournée
          </div>
        </div>

        {/* KPI 3: Remises en attente de pointage */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remises en attente</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {pendingRemittancesCount}
          </div>
          <div className="text-[11px] font-medium text-purple-600 mt-1">
            À contrôler physiquement
          </div>
        </div>

        {/* KPI 4: Écarts à examiner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Écarts signalés</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-600 tracking-tight">
            {discrepanciesCount}
          </div>
          <div className="text-[11px] font-medium text-rose-500 mt-1">
            Requiert arbitrage PDG
          </div>
        </div>

        {/* KPI 5: Encaissé aujourd'hui */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Encaissé au coffre</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Vault className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 tracking-tight">
            {formatCFA(totalReceivedToday)}
          </div>
          <div className="text-[11px] font-medium text-emerald-600 mt-1">
            Validé aujourd&apos;hui
          </div>
        </div>
      </div>

      {/* 3. SECTION PRINCIPALE : TABLEAU DES REMISES ATTENDUES PAR LIVREUR */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Fonds COD Détenus par les Livreurs (Calcul Strict Single Source of Truth)
            </h2>
            <p className="text-xs text-slate-500">
              Chaque montant correspond exactement à la somme des commandes livrées non encore validées au coffre-fort.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher livreur..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 w-48 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Table Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4 rounded-l-xl">Livreur</th>
                <th className="py-3 px-4">Zone / Hub</th>
                <th className="py-3 px-4 text-right">💰 Fonds à remettre</th>
                <th className="py-3 px-4 text-center">Colis Livrés</th>
                <th className="py-3 px-4">Dernière remise</th>
                <th className="py-3 px-4">Échéance / Plafond</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDriverSummaries.map((summary) => {
                const driver = livreurs.find((l) => l.id === summary.livreurId);
                const hasFunds = summary.fundsToRemit > 0;

                return (
                  <tr key={summary.livreurId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Livreur */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {summary.livreurName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{summary.livreurName}</p>
                          <p className="text-[10px] text-slate-400">{driver?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {driver?.zone || "Cotonou Centre"}
                      </span>
                    </td>

                    {/* Fonds à remettre */}
                    <td className="py-3.5 px-4 text-right">
                      {hasFunds ? (
                        <div>
                          <span className="font-black text-slate-900 text-sm">
                            {formatCFA(summary.fundsToRemit)}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            Plafond : {formatCFA(summary.ceilingThreshold)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          0 FCFA (À jour)
                        </span>
                      )}
                    </td>

                    {/* Colis */}
                    <td className="py-3.5 px-4 text-center">
                      {summary.unremittedOrdersCount > 0 ? (
                        <button
                          onClick={() => setSelectedOrderBreakdownDriver(summary)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[11px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          title="Voir le détail des colis concernés"
                        >
                          <Layers className="w-3 h-3 text-slate-500" />
                          <span>{summary.unremittedOrdersCount} colis</span>
                          <Eye className="w-3 h-3 text-slate-400" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0 colis</span>
                      )}
                    </td>

                    {/* Dernière remise */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {summary.lastRemittanceDate ? (
                        <span className="font-semibold text-slate-700">{summary.lastRemittanceDate}</span>
                      ) : (
                        <span className="text-slate-400 italic">Aucune remise</span>
                      )}
                    </td>

                    {/* Échéance / Statut */}
                    <td className="py-3.5 px-4">
                      {summary.statusLevel === "URGENT" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          Plafond Dépassé
                        </span>
                      )}
                      {summary.statusLevel === "ATTENTION" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Proche Plafond
                        </span>
                      )}
                      {summary.statusLevel === "NORMAL" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Normal ({summary.nextRemittanceDeadline || "18:00"})
                        </span>
                      )}
                      {summary.statusLevel === "ZERO" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          ✓ Aucun fonds
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenRemittanceForDriver(summary.livreurId)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Encaisser</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredDriverSummaries.map((summary) => (
            <div key={summary.livreurId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{summary.livreurName}</h4>
                  <p className="text-[10px] text-slate-400">Échéance : {summary.nextRemittanceDeadline || "18:00"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">{formatCFA(summary.fundsToRemit)}</p>
                  <p className="text-[10px] text-slate-500">{summary.unremittedOrdersCount} colis</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => setSelectedOrderBreakdownDriver(summary)}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Détail colis ({summary.unremittedOrdersCount})</span>
                </button>

                <button
                  onClick={() => handleOpenRemittanceForDriver(summary.livreurId)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Encaisser</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION HISTORIQUE DES REMISES ET JOURNAL D'AUDIT */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-700" />
              Journal des Remises Enregistrées &amp; Pointages Coffre-fort
            </h2>
            <p className="text-xs text-slate-500">
              Historique immuable avec horodatage, agent trésorier signataire et justification obligatoire des écarts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4 rounded-l-xl">Réf. Remise</th>
                <th className="py-3 px-4">Date &amp; Heure</th>
                <th className="py-3 px-4">Livreur</th>
                <th className="py-3 px-4 text-right">Attendu</th>
                <th className="py-3 px-4 text-right">Reçu en Espèces</th>
                <th className="py-3 px-4 text-center">Écart</th>
                <th className="py-3 px-4">Reçu par</th>
                <th className="py-3 px-4 rounded-r-xl">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codRemittances.map((remittance) => {
                const isDiscrepancy =
                  remittance.status === "DISCREPANCY_DETECTED" ||
                  (remittance.discrepancyAmount && remittance.discrepancyAmount > 0);

                return (
                  <tr key={remittance.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
                      {remittance.reference}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {remittance.receivedAt || remittance.createdAt}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {remittance.livreurName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      {formatCFA(remittance.amountExpected)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatCFA(remittance.receivedAmount || remittance.amountDeclared)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isDiscrepancy ? (
                        <div className="inline-flex items-center gap-1 text-rose-600 font-black text-[11px] bg-rose-50 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          - {formatCFA(remittance.discrepancyAmount || 0)}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                          0 FCFA
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{remittance.receivedBy || "Jean-Baptiste AGOSSOU"}</span>
                      </div>
                      {remittance.discrepancyReason && (
                        <p className="text-[10px] text-rose-500 font-medium italic mt-0.5">
                          Motif : &quot;{remittance.discrepancyReason}&quot;
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isDiscrepancy ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                          Écart Détecté
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Validé au Coffre
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL 1 : ENREGISTREMENT RAPIDE DE REMISE PHYSIQUE (< 1 MIN) */}
      {showQuickRemittanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Enregistrement Remise Physique</h3>
                  <p className="text-xs text-slate-500">Workflow rapide de réception caisse &lt; 1 minute</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickRemittanceModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRemittance} className="space-y-4">
              {/* Step 1: Choix du livreur */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Livreur effectuant le versement</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedDriverId(id);
                    const sum = getDriverCodFunds(id);
                    setReceivedAmountInput(sum.fundsToRemit.toString());
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  {livreurs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {formatCFA(getDriverCodFunds(l.id).fundsToRemit)} à remettre
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Récapitulatif attendu */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Montant COD théorique attendu :</span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatCFA(selectedDriverFunds.fundsToRemit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Colis livrés rattachés :</span>
                  <span className="font-bold text-slate-700">
                    {selectedDriverFunds.unremittedOrdersCount} commande(s)
                  </span>
                </div>
              </div>

              {/* Step 3: Montant Reçu en Espèces */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Montant effectivement compté &amp; reçu (FCFA)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Billets / Espèces</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={receivedAmountInput}
                    onChange={(e) => setReceivedAmountInput(e.target.value)}
                    placeholder="Ex: 150000"
                    className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-300 font-mono font-black text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Dynamic Comparison & Écart Badge */}
              {receivedAmountInput !== "" && (
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    currentDiscrepancy === 0
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                      : "bg-rose-50/80 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      {currentDiscrepancy === 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>
                        {currentDiscrepancy === 0
                          ? "Montant conforme (0 FCFA d'écart)"
                          : `Écart de caisse détecté : ${formatCFA(Math.abs(currentDiscrepancy))}`}
                      </span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {currentDiscrepancy > 0 ? "Manquant livreur" : currentDiscrepancy < 0 ? "Surplus" : "Exact"}
                    </span>
                  </div>

                  {currentDiscrepancy !== 0 && (
                    <div className="mt-3 space-y-1.5 pt-2 border-t border-rose-200">
                      <label className="text-[11px] font-bold text-rose-900 block">
                        Justification obligatoire de l&apos;écart *
                      </label>
                      <input
                        type="text"
                        required
                        value={discrepancyReasonInput}
                        onChange={(e) => setDiscrepancyReasonInput(e.target.value)}
                        placeholder="Ex: Le livreur a rendu la monnaie / Virement partiel du client..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Notes facultatives */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Notes ou observations (facultatif)</label>
                <input
                  type="text"
                  value={remittanceNotesInput}
                  onChange={(e) => setRemittanceNotesInput(e.target.value)}
                  placeholder="Remarques particulières..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Signatory footer info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Trésorier récepteur : <strong>{activeTreasuryManager?.name || "Jean-Baptiste AGOSSOU"}</strong></span>
                <span>Horodatage automatique</span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickRemittanceModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Vault className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Valider et verser au coffre-fort</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2 : DÉTAIL DES COLIS CONCERNÉS PAR UN LIVREUR */}
      {selectedOrderBreakdownDriver && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Colis en attente de remise — {selectedOrderBreakdownDriver.livreurName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total : {formatCFA(selectedOrderBreakdownDriver.fundsToRemit)} sur {selectedOrderBreakdownDriver.unremittedOrdersCount} commande(s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderBreakdownDriver(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedDriverUnremittedCollections.length > 0 ? (
                selectedDriverUnremittedCollections.map((col) => (
                  <div
                    key={col.orderId}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900">{col.orderNumber}</span>
                      <p className="text-[11px] text-slate-600 font-medium">{col.clientName} ({col.clientPhone})</p>
                      <p className="text-[10px] text-slate-400">Marchand : {col.partnerName} • Livré le {col.deliveredAt}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-xs">{formatCFA(col.collectedAmount)}</span>
                      <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Non versé au coffre</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun colis en attente de remise pour ce coursier.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
              <span className="text-xs font-bold text-slate-700">
                Total à percevoir : {formatCFA(selectedOrderBreakdownDriver.fundsToRemit)}
              </span>
              <button
                onClick={() => {
                  const id = selectedOrderBreakdownDriver.livreurId;
                  setSelectedOrderBreakdownDriver(null);
                  handleOpenRemittanceForDriver(id);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Encaisser ces fonds maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
