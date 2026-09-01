"use client";

import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  ShoppingCart,
  Percent,
  Truck,
  RotateCcw,
  Boxes,
  ArrowRight,
  Sparkles,
  Plus,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { currentPartner, orders } from "@/lib/mock-data";
import { ORDER_STATUS_CONFIG } from "@/lib/types";

export default function DashboardOverviewPage() {
  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner.id);
  const recentOrders = partnerOrders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 🚀 EXECUTIVE HERO BANNER */}
      <div className="bg-gradient-to-r from-[#0f291e] via-[#133d2b] to-[#0f291e] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-emerald-950/10 border border-emerald-800/40 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left Info Column (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#86efac] text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> ENO LIVRAISON • ESPACE E-COMMERÇANT
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Bonjour, {currentPartner.companyName} 👋
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-normal mt-1.5 leading-relaxed max-w-xl">
              {partnerOrders.length} commandes enregistrées • Stockage 100% OFFERT dans nos entrepôts de Cotonou & Abomey-Calavi • Closing sous 15 min.
            </p>
          </div>

          {/* Quick Action CTAs inside banner */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/dashboard/commandes"
              className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Nouvelle Commande
            </Link>
            <Link
              href="/dashboard/stocks"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 backdrop-blur"
            >
              <Package className="w-4 h-4 text-[#86efac]" /> Entrepôt & Stock
            </Link>
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25d366] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Headphones className="w-4 h-4" /> Support Agence Direct
            </a>
          </div>
        </div>

        {/* Right Column: Sleek Mini Metric Widget (4 cols) */}
        <div className="lg:col-span-4 relative z-10 flex items-center justify-start lg:justify-end">
          <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">Réseau Actif</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Bénin 24/7
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-emerald-100/70 font-medium">Livrées aujourd&apos;hui</p>
              <p className="text-3xl font-black text-white leading-none">
                0 <span className="text-xs font-semibold text-emerald-300">colis</span>
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/80">
              <span>Taux de livraison global</span>
              <strong className="text-white font-bold">100.0%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 SECTION: ACTIVITÉS D'AUJOURD'HUI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Activités d&apos;Aujourd&apos;hui</h3>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5"></span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Temps réel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chiffre d'affaires */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Chiffre d&apos;affaires</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              0 <span className="text-xs font-bold text-slate-400">F CFA</span>
            </p>
          </div>

          {/* Revenu net */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenu net</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#16a34a] tracking-tight">
              0 <span className="text-xs font-bold text-emerald-600">F CFA</span>
            </p>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de commandes</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              0 <span className="text-xs font-bold text-slate-400">colis</span>
            </p>
          </div>

          {/* Taux confirmation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Percent className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux confirmation</span>
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">0%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[0%] rounded-full"></div>
            </div>
          </div>

          {/* Taux livraison */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux livraison</span>
              </div>
            </div>
            <p className="text-2xl font-black text-[#16a34a] tracking-tight">0%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#16a34a] h-full w-[0%] rounded-full"></div>
            </div>
          </div>

          {/* Taux retour */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux retour</span>
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 tracking-tight">0%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[0%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 SECTION: SYNTHÈSE DU MOIS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Synthèse du Mois</h3>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% de croissance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chiffre d'affaires */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Chiffre d&apos;affaires</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +14%
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              343 200 <span className="text-xs font-bold text-slate-500">F CFA</span>
            </p>
          </div>

          {/* Revenu net */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenu net</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Net Partenaire
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#16a34a] tracking-tight">
              242 400 <span className="text-xs font-bold text-emerald-600">F CFA</span>
            </p>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de commandes</span>
              </div>
              <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                61 total
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              61 <span className="text-xs font-bold text-slate-500">colis</span>
            </p>
          </div>

          {/* Taux confirmation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Percent className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux confirmation</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Objectif &gt;50%
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">59.0%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[59%] rounded-full"></div>
            </div>
          </div>

          {/* Taux livraison */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux livraison</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Parfait
              </span>
            </div>
            <p className="text-2xl font-black text-[#16a34a] tracking-tight">100.0%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#16a34a] h-full w-[100%] rounded-full"></div>
            </div>
          </div>

          {/* Taux retour */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Taux retour</span>
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 tracking-tight">27.9%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[28%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 TWO BOTTOM PANELS: Stock Entrepôt & Commandes Récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* 📦 Stock Entrepôt Mini Widget (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm space-y-6">
          <div className="space-y-5">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                  <Boxes className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">Stock Entrepôt ENO</h4>
                  <p className="text-[10px] text-slate-500 truncate">Cotonou & Calavi</p>
                </div>
              </div>
              <Link
                href="/dashboard/stocks"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap"
              >
                <span>Voir tout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual Capacity Gauge Meter */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap">Capacité Utilisée</span>
                <span className="font-black text-[#16a34a] whitespace-nowrap">58 / 100 unités</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#16a34a] to-emerald-400 h-full w-[58%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500 text-right whitespace-nowrap font-medium">Stockage 100% Offert</p>
            </div>

            {/* 3 Mini Metric Cards */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Total Restant</span>
                <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                  58 unités
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Valeur Stock</span>
                <span className="text-xs font-black text-[#16a34a] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap">
                  452 400 F CFA
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Produits Actifs</span>
                <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                  1 produit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🛒 Commandes Récentes Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-base tracking-tight">Commandes récentes</h4>
              <p className="text-xs text-slate-500">Dernières commandes enregistrées sur ENO LIVRAISON</p>
            </div>

            <Link
              href="/dashboard/commandes"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto"
            >
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Orders List */}
          <div className="space-y-3">
            {recentOrders.map((ord) => {
              const statusCfg = ORDER_STATUS_CONFIG[ord.status];
              const isRecall = ord.status === "A_RAPPELER";
              const isDelivered = ord.status === "LIVREE";

              return (
                <div
                  key={ord.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-500/50 hover:bg-white transition-all flex items-center justify-between gap-4 group"
                >
                  {/* Left Column: ID + Client + Location */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {ord.id.slice(-3)}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight">
                          {ord.clientName}
                        </h5>
                        <span
                          className={`sm:hidden text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            isRecall
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#16a34a] shrink-0" />
                        <span className="truncate">{ord.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Products & Price (Desktop) */}
                  <div className="hidden md:block text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900">{ord.products}</p>
                    <p className="text-xs font-black text-[#16a34a]">
                      {ord.totalPrice.toLocaleString("fr-FR")} F CFA
                    </p>
                  </div>

                  {/* Right Column: Status Badge & CTA (Desktop) */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                        isRecall
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : isDelivered
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {statusCfg.label}
                    </span>

                    <Link
                      href="/dashboard/commandes"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#16a34a] text-slate-700 hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      <span>Détails</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
