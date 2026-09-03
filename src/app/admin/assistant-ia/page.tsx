"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Zap,
  Sliders,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function AdminAssistantIAPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [handoverThreshold, setHandoverThreshold] = useState("15 min");

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Assistant IA & Réponses Automatisées</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuration du chatbot de support e-commerçants et des règles de transfert vers les agents humains.
          </p>
        </div>

        <Link
          href="/admin/conversations"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors self-start sm:self-center"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ouvrir les Conversations</span>
        </Link>
      </div>

      {/* 3 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Statut du Bot IA</span>
          <p className="text-2xl font-black text-emerald-600">Actif (24/7)</p>
          <p className="text-[11px] text-slate-400">Réponse instantanée aux questions fréquentes</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Taux de Résolution IA</span>
          <p className="text-2xl font-black text-slate-900">68%</p>
          <p className="text-[11px] text-slate-400">Sans intervention humaine</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Transferts Closeuses</span>
          <p className="text-2xl font-black text-slate-900">32%</p>
          <p className="text-[11px] text-slate-400">Demandes complexes ou retraits</p>
        </div>
      </div>

      {/* Settings Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <h3 className="text-base font-black text-slate-900">Règles d&apos;Automatisation</h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Accueil & Qualification Automatique</p>
              <p className="text-slate-500 text-[11px]">L&apos;IA répond automatiquement dès qu&apos;un nouveau message est reçu d&apos;un e-commerçant.</p>
            </div>
            <button
              onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                autoReplyEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {autoReplyEnabled ? "Activé" : "Désactivé"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Transfert Agent Humain sur Demande</p>
              <p className="text-slate-500 text-[11px]">Dès que le marchand clique sur &quot;Parler à un agent&quot;, le fil passe en priorité haute.</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
              Actif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
