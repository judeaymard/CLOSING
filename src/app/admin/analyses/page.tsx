"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function AdminAnalysesPage() {
  const { orders, period, setPeriod } = useOperations();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Analyses de Performance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicateurs avancés de conversion télévente, délais d&apos;acheminement et satisfaction client.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-center shrink-0">
          {(
            [
              { id: "TODAY", label: "Aujourd'hui" },
              { id: "7D", label: "7 jours" },
              { id: "30D", label: "30 jours" },
              { id: "YEAR", label: "Cette année" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === t.id
                  ? "bg-white text-slate-900 shadow-2xs font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Délai Moyen Closing</span>
          <p className="text-3xl font-black text-slate-900">14 min</p>
          <p className="text-[11px] text-emerald-600 font-bold">-3 min vs moyenne</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Délai Moyen Livraison</span>
          <p className="text-3xl font-black text-slate-900">2h 45m</p>
          <p className="text-[11px] text-slate-400">Sur Cotonou & Calavi</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Taux de Satisfaction</span>
          <p className="text-3xl font-black text-emerald-600">96.4%</p>
          <p className="text-[11px] text-slate-400">Avis clients finaux</p>
        </div>
      </div>
    </div>
  );
}
