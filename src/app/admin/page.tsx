"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  CheckCircle,
  Clock,
  TrendingUp,
  Boxes,
  Users,
  BadgeDollarSign,
  ArrowRight,
  Truck,
  RotateCcw,
  Sparkles,
  Store,
  AlertCircle,
  Package,
} from "lucide-react";
import { orders, partners, products, formatCFA } from "@/lib/mock-data";
import { ORDER_STATUS_CONFIG } from "@/lib/types";

export default function AdminDashboardPage() {
  const pendingPartners = partners.filter((p) => !p.isApproved);
  const activePartners = partners.filter((p) => p.isApproved);

  const pendingOrders = orders.filter(
    (o) => o.status === "A_RAPPELER" || o.status === "EN_ATTENTE" || o.status === "EN_COURS"
  );
  const deliveredOrders = orders.filter((o) => o.status === "LIVREE");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 🚀 BANNER 1: PENDING PARTNER ONBOARDING ALERTS */}
      {pendingPartners.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#1e1708] to-amber-900/40 border-2 border-amber-500/40 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-200">
                {pendingPartners.length} nouveau{pendingPartners.length > 1 ? "x" : ""} profil{pendingPartners.length > 1 ? "s" : ""} e-commerçant{pendingPartners.length > 1 ? "s" : ""} en attente de validation
              </h3>
              <p className="text-xs text-amber-300/80">
                Validez leur compte et enregistrez leurs produits déposés dans l&apos;entrepôt ENO LIVRAISON.
              </p>
            </div>
          </div>

          <Link
            href="/admin/partenaires"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Voir les demandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 🚀 BANNER 2: CLOSING ALERT BANNER */}
      <div className="bg-gradient-to-r from-[#091b14] via-[#0d261c] to-[#15803d] rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-emerald-600/10 border border-emerald-900/60 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" /> Centre d&apos;appels & Closing ENO Cotonou
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {pendingOrders.length} commandes nécessitent une action
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Relances téléphoniques sous 15 min, confirmation d&apos;adresse et assignation aux livreurs en zone.
          </p>
        </div>

        <Link
          href="/admin/commandes"
          className="px-6 py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl font-bold text-xs shadow-xl transition-all shrink-0 flex items-center gap-2"
        >
          <span>Ouvrir la liste de closing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 GLOBAL NETWORK KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Commandes */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Total Réseau</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{orders.length}</p>
          <p className="text-[11px] text-emerald-300/60">Toutes boutiques confondues</p>
        </div>

        {/* Commandes Livrées */}
        <div className="bg-[#091b14] border border-emerald-800/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Livrées avec succès</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">{deliveredOrders.length}</p>
          <p className="text-[11px] text-emerald-300/60">
            Taux de succès : {Math.round((deliveredOrders.length / orders.length) * 100)}%
          </p>
        </div>

        {/* Commissions Agence */}
        <div className="bg-[#091b14] border border-emerald-700/40 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Commissions Agence</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#22c55e]">
            {(deliveredOrders.length * 2800).toLocaleString("fr-FR")} F
          </p>
          <p className="text-[11px] text-emerald-300/60">2 800 F (service + livraison)</p>
        </div>

        {/* Boutiques Actives */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-xs font-bold uppercase tracking-wider">Partenaires Actifs</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-300">{activePartners.length}</p>
          <p className="text-[11px] text-emerald-300/60">Boutiques e-commerce connectées</p>
        </div>
      </div>

      {/* TWO MAIN SECTIONS */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Urgent Calling Queue (7 cols) */}
        <div className="lg:col-span-7 bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#22c55e]" />
              <h3 className="font-bold text-white text-sm">File d&apos;appels prioritaire (Closing)</h3>
            </div>
            <Link
              href="/admin/commandes"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Gérer tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingOrders.slice(0, 4).map((ord) => {
              const ptn = partners.find((p) => p.id === ord.partnerId);
              return (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-white text-sm">{ord.clientName}</p>
                      {ptn && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-900/40 text-emerald-200 border border-emerald-800">
                          {ptn.companyName}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16a34a] text-white uppercase">
                        {ord.status === "A_RAPPELER" ? "A RAPPELER" : ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/70">
                      📞 {ord.clientPhone} • {ord.address} • {ord.products} ({ord.totalPrice} F)
                    </p>
                    {ord.comment && (
                      <p className="text-[11px] text-emerald-300 font-semibold">Note: {ord.comment}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${ord.clientPhone}`}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Appeler
                    </a>
                    <Link
                      href="/admin/commandes"
                      className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-bold"
                    >
                      Closer
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Store Direct Access (5 cols) */}
        <div className="lg:col-span-5 bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
            <div>
              <h3 className="font-bold text-white text-sm">Espaces Boutiques Partenaires</h3>
              <p className="text-[11px] text-emerald-300/70">Accès direct à la gestion par e-commerçant</p>
            </div>
            <Link
              href="/admin/partenaires"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Gérer tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activePartners.map((ptn) => {
              const ptnOrders = orders.filter((o) => o.partnerId === ptn.id);
              const ptnProducts = products.filter((p) => p.partnerId === ptn.id);

              return (
                <Link
                  key={ptn.id}
                  href={`/admin/partenaires/${ptn.id}`}
                  className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 hover:border-emerald-500 block transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {ptn.companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">
                          {ptn.companyName}
                        </p>
                        <p className="text-[11px] text-emerald-300/70">{ptn.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-300/70 font-semibold bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-900">
                        {ptnOrders.length} cmd / {ptnProducts.length} prod
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
