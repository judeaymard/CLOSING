"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Table,
  Filter,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function AdminRapportsPage() {
  const { orders } = useOperations();
  const [reportType, setReportType] = useState("FINANCIAL");
  const [downloading, setDownloading] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Rapports d&apos;Activité & Exports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération et téléchargement des rapports comptables, logistiques et télévente en format CSV / Excel.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? "Exportation en cours..." : "Télécharger le Rapport Excel"}</span>
        </button>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Rapport Financier & COD</h3>
          </div>
          <p className="text-xs text-slate-500">
            Encaissements collectés par coursier, reversements marchands et commissions prélevées.
          </p>
          <button
            onClick={handleExport}
            className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Générer (CSV)</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Rapport des Livraisons</h3>
          </div>
          <p className="text-xs text-slate-500">
            Historique complet des tournées, taux de succès par zone géographique et délais de remise.
          </p>
          <button
            onClick={handleExport}
            className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Générer (CSV)</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Rapport Pôle Télévente</h3>
          </div>
          <p className="text-xs text-slate-500">
            Volumes d&apos;appels traités, taux de confirmation par opératrice et motifs de refus client.
          </p>
          <button
            onClick={handleExport}
            className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Générer (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
