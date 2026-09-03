"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Headset,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Plus,
  Search,
  X,
  Clock,
  Shield,
} from "lucide-react";
import { useOperations } from "@/lib/store";

export default function AdminCloseusesPage() {
  const { closeuses, addCloseuse } = useOperations();
  const [showAddModal, setShowAddModal] = useState(false);
  const [closerName, setCloserName] = useState("");
  const [closerEmail, setCloserEmail] = useState("");
  const [closerPhone, setCloserPhone] = useState("+229 01 ");
  const [createdInfo, setCreatedInfo] = useState<{ name: string; email: string; code: string } | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closerName || !closerPhone || !closerEmail) return;
    const created = addCloseuse({ name: closerName, email: closerEmail, phone: closerPhone });
    setCreatedInfo({
      name: created.name,
      email: created.email,
      code: created.temporaryCode || "315792",
    });
    setCloserName("");
    setCloserEmail("");
    setCloserPhone("+229 01 ");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pôle Télévente & Closeuses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervision de la conversion téléphonique, attribution des appels et comptes opératrices.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Closeuse</span>
        </button>
      </div>

      {/* Grid of Closers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {closeuses.map((c, idx) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Appels aujourd&apos;hui :</span>
                  <span className="font-bold text-slate-900">{c.callsTodayCount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Commandes confirmées :</span>
                  <span className="font-bold text-slate-900">{c.confirmedTodayCount}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span className="text-slate-400 font-bold">Taux de Conversion :</span>
                  <span className="font-black text-emerald-600">{c.conversionRate}%</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/commandes"
              className="text-xs font-bold text-slate-900 hover:underline pt-2 inline-block"
            >
              Voir la file closing →
            </Link>
          </div>
        ))}
      </div>

      {/* Modal Ajout Closeuse */}
      {showAddModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Ajouter une Closeuse</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdInfo ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="text-xs font-bold text-emerald-900">Compte créé avec succès !</p>
                <p className="text-xs text-emerald-800">
                  Code d&apos;activation temporaire pour <strong>{createdInfo.name}</strong> :
                </p>
                <div className="text-xl font-mono font-black text-emerald-900 bg-white p-3 rounded-xl border border-emerald-300 text-center tracking-widest">
                  {createdInfo.code}
                </div>
                <button
                  onClick={() => {
                    setCreatedInfo(null);
                    setShowAddModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer mt-2"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={closerName}
                    onChange={(e) => setCloserName(e.target.value)}
                    placeholder="Ex: Flora AGBODJAN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={closerEmail}
                    onChange={(e) => setCloserEmail(e.target.value)}
                    placeholder="flora@eno-livraison.bj"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={closerPhone}
                    onChange={(e) => setCloserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Créer l&apos;accès
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
