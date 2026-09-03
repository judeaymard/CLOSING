"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Building,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function AdminParametresPage() {
  const [agencyName, setAgencyName] = useState("ENO LIVRAISON");
  const [closingFee, setClosingFee] = useState("800");
  const [deliveryFee, setDeliveryFee] = useState("2000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Paramètres de la Plateforme</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuration globale des tarifs de prestation, agences régionales et sécurité.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paramètres enregistrés !</span>
          </span>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Identité de l&apos;Agence</h3>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Raison Sociale</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Tarification des Prestations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Frais Closing par Colis (FCFA)</label>
              <input
                type="number"
                value={closingFee}
                onChange={(e) => setClosingFee(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Frais Livraison Standard (FCFA)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
}
