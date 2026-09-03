"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  RotateCw,
  Hand,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Headset,
  Package,
  MessageSquare,
  Shield,
  Sliders,
  Play,
  ArrowRight,
  Info,
  Check,
  Zap,
  Users,
  Settings,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";
import { AssignmentMode } from "@/lib/types";

export default function AdminAttributionsPage() {
  const {
    orders,
    conversations,
    closeuses,
    assignmentConfig,
    assignmentLogs,
    closerAvailability,
    updateAssignmentConfig,
    updateCloserAvailability,
    simulateAssignment,
    triggerAutoAssignItem,
  } = useOperations();

  const [savedToast, setSavedToast] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    winner: any;
    reason: string;
    modeUsed: AssignmentMode;
    breakdown: any[];
  } | null>(null);

  // Unassigned queues
  const unassignedOrders = orders.filter((o) => !o.assignedCloseuseName && o.status === "EN_ATTENTE");
  const unassignedConversations = conversations.filter((c) => !c.assignedAgentName && c.status === "UNASSIGNED");

  const handleModeChange = (type: "orders" | "conversations", mode: AssignmentMode) => {
    if (type === "orders") {
      updateAssignmentConfig({ ordersMode: mode });
    } else {
      updateAssignmentConfig({ conversationsMode: mode });
    }
    showSaved();
  };

  const showSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const runSimulation = (type: "ORDER" | "CONVERSATION") => {
    const result = simulateAssignment(type);
    setSimulationResult(result);
  };

  const getCloserActiveLoad = (closerId: string, closerName: string) => {
    return orders.filter(
      (o) =>
        (o.assignedCloseuseId === closerId || o.assignedCloseuseName === closerName) &&
        (o.status === "EN_ATTENTE" || o.status === "A_RAPPELER" || o.status === "CONFIRMEE")
    ).length;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* 👑 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Automatisation des Attributions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              Moteur Actif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez la manière dont les commandes et conversations sont distribuées à votre équipe.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paramètres mis à jour !</span>
          </div>
        )}
      </div>

      {/* 📦 1. ATTRIBUTION DES COMMANDES */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Mode d&apos;Attribution des Commandes</h2>
              <p className="text-xs text-slate-500">Règle appliquée dès qu&apos;une nouvelle commande est enregistrée.</p>
            </div>
          </div>
        </div>

        {/* 3 Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 : Automatique intelligente */}
          <div
            onClick={() => handleModeChange("orders", "SMART_AUTO")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              assignmentConfig.ordersMode === "SMART_AUTO"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm">
                  <Sparkles className={`w-4 h-4 ${assignmentConfig.ordersMode === "SMART_AUTO" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span>Automatique Intelligente</span>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  assignmentConfig.ordersMode === "SMART_AUTO" ? "border-emerald-400 bg-emerald-400" : "border-slate-300"
                }`}>
                  {assignmentConfig.ordersMode === "SMART_AUTO" && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${assignmentConfig.ordersMode === "SMART_AUTO" ? "text-slate-300" : "text-slate-500"}`}>
                Distribue automatiquement les commandes aux closeuses disponibles en fonction de leur charge de travail active.
              </p>
            </div>

            <div className={`pt-3 border-t text-[11px] space-y-1 ${
              assignmentConfig.ordersMode === "SMART_AUTO" ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}>
              <p>• Priorité à la charge la plus faible</p>
              <p>• Round Robin en cas d&apos;égalité</p>
              <p>• Respect de la capacité max (15)</p>
            </div>
          </div>

          {/* Card 2 : Round Robin */}
          <div
            onClick={() => handleModeChange("orders", "ROUND_ROBIN")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              assignmentConfig.ordersMode === "ROUND_ROBIN"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm">
                  <RotateCw className="w-4 h-4 text-blue-500" />
                  <span>Round Robin</span>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  assignmentConfig.ordersMode === "ROUND_ROBIN" ? "border-blue-400 bg-blue-400" : "border-slate-300"
                }`}>
                  {assignmentConfig.ordersMode === "ROUND_ROBIN" && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${assignmentConfig.ordersMode === "ROUND_ROBIN" ? "text-slate-300" : "text-slate-500"}`}>
                Distribue les commandes à tour de rôle équitablement entre les closeuses éligibles.
              </p>
            </div>

            <div className={`pt-3 border-t text-[11px] space-y-1 ${
              assignmentConfig.ordersMode === "ROUND_ROBIN" ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}>
              <p>• Tour de rôle chronologique</p>
              <p>• Pointeur de rotation persistant</p>
              <p>• Ignore les agents indisponibles</p>
            </div>
          </div>

          {/* Card 3 : Manuelle */}
          <div
            onClick={() => handleModeChange("orders", "MANUAL")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              assignmentConfig.ordersMode === "MANUAL"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm">
                  <Hand className="w-4 h-4 text-amber-500" />
                  <span>Attribution Manuelle</span>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  assignmentConfig.ordersMode === "MANUAL" ? "border-amber-400 bg-amber-400" : "border-slate-300"
                }`}>
                  {assignmentConfig.ordersMode === "MANUAL" && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${assignmentConfig.ordersMode === "MANUAL" ? "text-slate-300" : "text-slate-500"}`}>
                Aucune attribution automatique. Les commandes arrivent dans la file d&apos;attente pour affectation par le PDG.
              </p>
            </div>

            <div className={`pt-3 border-t text-[11px] space-y-1 ${
              assignmentConfig.ordersMode === "MANUAL" ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}>
              <p>• Contrôle total de la Direction</p>
              <p>• File d&apos;attente centralisée</p>
              <p>• Affectation manuelle 1-click</p>
            </div>
          </div>
        </div>
      </div>

      {/* 💬 2. ATTRIBUTION DES CONVERSATIONS */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Mode d&apos;Attribution des Conversations</h2>
              <p className="text-xs text-slate-500">Distribution des messages entrants et tickets d&apos;assistance marchands.</p>
            </div>
          </div>
        </div>

        {/* 3 Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleModeChange("conversations", "SMART_AUTO")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              assignmentConfig.conversationsMode === "SMART_AUTO"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Automatique Intelligente</span>
              <span className={`w-3 h-3 rounded-full border-2 ${assignmentConfig.conversationsMode === "SMART_AUTO" ? "border-emerald-400 bg-emerald-400" : "border-slate-300"}`}></span>
            </div>
            <p className={`text-[11px] ${assignmentConfig.conversationsMode === "SMART_AUTO" ? "text-slate-300" : "text-slate-500"}`}>
              Priorité à l&apos;opératrice la moins sollicitée avec passage prioritaire des urgences.
            </p>
          </div>

          <div
            onClick={() => handleModeChange("conversations", "ROUND_ROBIN")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              assignmentConfig.conversationsMode === "ROUND_ROBIN"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Round Robin</span>
              <span className={`w-3 h-3 rounded-full border-2 ${assignmentConfig.conversationsMode === "ROUND_ROBIN" ? "border-blue-400 bg-blue-400" : "border-slate-300"}`}></span>
            </div>
            <p className={`text-[11px] ${assignmentConfig.conversationsMode === "ROUND_ROBIN" ? "text-slate-300" : "text-slate-500"}`}>
              Rotation stricte à tour de rôle entre les opératrices connectées.
            </p>
          </div>

          <div
            onClick={() => handleModeChange("conversations", "MANUAL")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              assignmentConfig.conversationsMode === "MANUAL"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Attribution Manuelle</span>
              <span className={`w-3 h-3 rounded-full border-2 ${assignmentConfig.conversationsMode === "MANUAL" ? "border-amber-400 bg-amber-400" : "border-slate-300"}`}></span>
            </div>
            <p className={`text-[11px] ${assignmentConfig.conversationsMode === "MANUAL" ? "text-slate-300" : "text-slate-500"}`}>
              Les messages restent dans la boîte générale jusqu&apos;à affectation par le PDG.
            </p>
          </div>
        </div>
      </div>

      {/* 🟢 3. DISPONIBILITÉ & CHARGE DES CLOSEUSES (MONITORING TEMPS RÉEL) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">Disponibilité & Capacité des Closeuses</h2>
            <p className="text-xs text-slate-500">Contrôlez l&apos;éligibilité de chaque opératrice à recevoir des attributions automatiques.</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Capacité Max : {assignmentConfig.maxCapacityPerCloser} commandes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {closeuses.map((c) => {
            const status = closerAvailability[c.id] || "AVAILABLE";
            const currentLoad = getCloserActiveLoad(c.id, c.name);
            const loadPercent = Math.min(100, Math.round((currentLoad / assignmentConfig.maxCapacityPerCloser) * 100));

            return (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.phone}</p>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <select
                    value={status}
                    onChange={(e) => updateCloserAvailability(c.id, e.target.value as any)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                      status === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : status === "BUSY"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    <option value="AVAILABLE">🟢 Disponible</option>
                    <option value="BUSY">🟠 Occupée</option>
                    <option value="UNAVAILABLE">🔴 Indisponible</option>
                  </select>
                </div>

                {/* Load Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Charge active :</span>
                    <span className="font-bold text-slate-900">
                      {currentLoad} / {assignmentConfig.maxCapacityPerCloser} commandes
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${loadPercent}%` }}
                      className={`h-full rounded-full transition-all ${
                        loadPercent > 80 ? "bg-rose-500" : loadPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🧪 4. SIMULATEUR D'ATTRIBUTION INTERACTIF */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">Simulateur d&apos;Attribution</h2>
            <p className="text-xs text-slate-500">Testez en direct l&apos;algorithme pour comprendre quelle opératrice recevrait la prochaine commande.</p>
          </div>

          <button
            onClick={() => runSimulation("ORDER")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-center"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Tester une attribution</span>
          </button>
        </div>

        {simulationResult ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Résultat de la simulation :</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                Mode : {simulationResult.modeUsed}
              </span>
            </div>

            {simulationResult.winner ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {simulationResult.winner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950">
                    → Attribuée à {simulationResult.winner.name}
                  </h4>
                  <p className="text-[11px] text-emerald-800">{simulationResult.reason}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                {simulationResult.reason}
              </div>
            )}

            {/* Breakdown table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              {simulationResult.breakdown.map((b, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <span>{b.closer.name}</span>
                  <span className="font-mono font-bold text-slate-900">{b.load} actives</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Cliquez sur « Tester une attribution » pour lancer le calcul algorithmique instantané.
          </p>
        )}
      </div>

      {/* 📥 5. FILE D'ATTENTE & JOURNAL DES ATTRIBUTIONS (2 Colonnes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File d'attente (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-black text-slate-900">File d&apos;Attente ({unassignedOrders.length})</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Non attribuées
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            {unassignedOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Aucune commande en attente.</p>
            ) : (
              unassignedOrders.map((ord) => (
                <div key={ord.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                    <p className="text-[11px] text-slate-500">{ord.clientName} • {formatCFA(ord.totalPrice)}</p>
                  </div>
                  <button
                    onClick={() => triggerAutoAssignItem(ord.id, "ORDER")}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] cursor-pointer hover:bg-slate-800"
                  >
                    Distribuer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Journal des Attributions (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-black text-slate-900">Journal des Attributions Automatiques</h3>
            <span className="text-xs text-slate-400">Transparence totale</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {assignmentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
                    <span className="font-bold text-slate-900 font-mono">{log.itemRef}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="font-bold text-emerald-700">{log.assignedToCloserName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{log.reason}</p>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                  {log.modeUsed}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⚙️ 6. PARAMÈTRES AVANCÉS */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Paramètres Avancés du Moteur</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Capacité Maximale par Opératrice</p>
              <p className="text-slate-500 text-[11px]">Seuil au-delà duquel les nouvelles commandes sont déviées.</p>
            </div>
            <input
              type="number"
              value={assignmentConfig.maxCapacityPerCloser}
              onChange={(e) => updateAssignmentConfig({ maxCapacityPerCloser: parseInt(e.target.value) || 15 })}
              className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Redistribution Automatique</p>
              <p className="text-slate-500 text-[11px]">Si une closeuse reste inactive plus de 30 min sur un colis non traité.</p>
            </div>
            <button
              onClick={() => updateAssignmentConfig({ autoRedistribute: !assignmentConfig.autoRedistribute })}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                assignmentConfig.autoRedistribute ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {assignmentConfig.autoRedistribute ? "Activé" : "Désactivé"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
