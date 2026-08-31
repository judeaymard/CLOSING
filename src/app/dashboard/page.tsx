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
} from "lucide-react";
import { currentPartner, orders } from "@/lib/mock-data";
import { ORDER_STATUS_CONFIG } from "@/lib/types";

export default function DashboardOverviewPage() {
  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner.id);
  const recentOrders = partnerOrders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 🚀 HIGH-TECH INNOVATIVE DASHBOARD BANNER */}
      <div className="bg-gradient-to-r from-[#091b14] via-[#0d261c] to-[#07130e] rounded-[2.5rem] p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-emerald-600/10 border border-emerald-900/60 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#16a34a]/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Left Info Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-[#86efac] text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> ENO LIVRAISON • ESPACE E-COMMERÇANT
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {currentPartner.companyName}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/70 font-normal mt-2 leading-relaxed max-w-lg">
              {partnerOrders.length} commandes enregistrées • Stockage 100% OFFERT dans nos entrepôts de Cotonou & Abomey-Calavi.
            </p>
          </div>

          {/* Quick Action CTAs inside banner */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard/commandes"
              className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Nouvelle Commande
            </Link>
            <Link
              href="/dashboard/stocks"
              className="px-5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-100 text-xs font-bold border border-emerald-800/80 transition-all flex items-center gap-2 backdrop-blur"
            >
              <Package className="w-4 h-4 text-[#22c55e]" /> Entrepôt & Stock
            </Link>
          </div>
        </div>

        {/* Right Column: Photo Frame + Glass Counter Widget (5 cols) */}
        <div className="lg:col-span-5 relative z-10 flex items-center justify-center lg:justify-end">
          <div className="relative group perspective-1000">
            {/* Photo Frame */}
            <div className="w-64 h-40 sm:w-72 sm:h-44 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(22,163,74,0.3)] relative transform transition-all duration-500 group-hover:rotate-1 group-hover:scale-105 bg-slate-950">
              <Image
                src="/images/african_delivery_rider.jpg"
                alt="Logistique ENO LIVRAISON"
                fill
                className="object-cover object-center opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091b14] via-transparent to-transparent"></div>
              
              {/* Photo Caption Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-900/60">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Livreurs ENO Cotonou & Calavi
                </span>
                <span className="text-emerald-200/70">Express &lt; 2h</span>
              </div>
            </div>

            {/* Overlaid Floating Glass Counter Badge */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 bg-[#091b14]/90 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-bounce-slow">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-[#22c55e] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300/70">
                  Livrées aujourd&apos;hui
                </p>
                <p className="text-2xl font-black text-white leading-none mt-1">
                  0 <span className="text-xs font-semibold text-emerald-400">colis</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 SECTION: AUJOURD'HUI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-200">Activités d&apos;Aujourd&apos;hui</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-900">
            Temps réel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chiffre d'affaires */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Chiffre d&apos;affaires</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">0 <span className="text-xs font-bold text-emerald-300/70">F CFA</span></p>
          </div>

          {/* Revenu net */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Revenu net</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#22c55e] tracking-tight">0 <span className="text-xs font-bold text-emerald-300/70">F CFA</span></p>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Nombre de commandes</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">0 <span className="text-xs font-bold text-emerald-300/70">colis</span></p>
          </div>

          {/* Taux confirmation */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,163,74,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Percent className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux confirmation</span>
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-400 tracking-tight">0%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-emerald-500 h-full w-[0%] rounded-full"></div>
            </div>
          </div>

          {/* Taux livraison */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(22,163,74,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux livraison</span>
              </div>
            </div>
            <p className="text-2xl font-black text-[#22c55e] tracking-tight">0%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-[#16a34a] h-full w-[0%] rounded-full"></div>
            </div>
          </div>

          {/* Taux retour */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-rose-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(244,63,94,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux retour</span>
              </div>
            </div>
            <p className="text-2xl font-black text-rose-400 tracking-tight">0%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-rose-500 h-full w-[0%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 SECTION: CE MOIS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-200">Synthèse du Mois</h3>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% de croissance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chiffre d'affaires */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Chiffre d&apos;affaires</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +14%
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">343 200 <span className="text-xs font-bold text-emerald-300/70">F CFA</span></p>
          </div>

          {/* Revenu net */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Revenu net</span>
              </div>
              <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Net Partner
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#22c55e] tracking-tight">242 400 <span className="text-xs font-bold text-emerald-300/70">F CFA</span></p>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(22,163,74,0.15)] group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Nombre de commandes</span>
              </div>
              <span className="text-[10px] font-black text-emerald-200 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                61 total
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">61 <span className="text-xs font-bold text-emerald-300/70">colis</span></p>
          </div>

          {/* Taux confirmation */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(22,163,74,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Percent className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux confirmation</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Objectif &gt;50%
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-400 tracking-tight">59.0%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-emerald-500 h-full w-[59%] rounded-full shadow-[0_0_8px_#10b981]"></div>
            </div>
          </div>

          {/* Taux livraison */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(22,163,74,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux livraison</span>
              </div>
              <span className="text-[10px] font-black text-[#22c55e] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Parfait
              </span>
            </div>
            <p className="text-2xl font-black text-[#22c55e] tracking-tight">100.0%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-[#16a34a] h-full w-[100%] rounded-full shadow-[0_0_10px_#16a34a]"></div>
            </div>
          </div>

          {/* Taux retour */}
          <div className="bg-gradient-to-br from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/70 hover:border-rose-500/40 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(244,63,94,0.15)] group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-200/80 uppercase tracking-wider">Taux retour</span>
              </div>
            </div>
            <p className="text-2xl font-black text-rose-400 tracking-tight">27.9%</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-emerald-950">
              <div className="bg-rose-500 h-full w-[28%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 TWO BOTTOM PANELS: Stock Entrepôt & Commandes Récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* 📦 Stock Entrepôt Mini Widget (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/60 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#22c55e] flex items-center justify-center shrink-0 shadow-sm">
                  <Boxes className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-white text-sm truncate">Stock Entrepôt ENO</h4>
                  <p className="text-[10px] text-emerald-300/70 truncate">Cotonou & Calavi</p>
                </div>
              </div>
              <Link
                href="/dashboard/stocks"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0 whitespace-nowrap"
              >
                <span>Voir tout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual Capacity Gauge Meter */}
            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs gap-2">
                <span className="font-extrabold text-emerald-100 whitespace-nowrap">Capacité Utilisée</span>
                <span className="font-black text-[#22c55e] whitespace-nowrap">58 / 100 unités</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-emerald-950">
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-full w-[58%] rounded-full shadow-[0_0_10px_#16a34a]"></div>
              </div>
              <p className="text-[10px] text-emerald-300/70 text-right whitespace-nowrap">Stockage 100% Offert</p>
            </div>

            {/* 3 Glass Mini Metric Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between gap-2 transition-all hover:border-emerald-700">
                <span className="text-xs font-semibold text-emerald-200/70 whitespace-nowrap">Total Restant</span>
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                  58 unités
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between gap-2 transition-all hover:border-emerald-700">
                <span className="text-xs font-semibold text-emerald-200/70 whitespace-nowrap">Valeur Stock</span>
                <span className="text-xs font-black text-[#22c55e] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                  452 400 F CFA
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between gap-2 transition-all hover:border-emerald-700">
                <span className="text-xs font-semibold text-emerald-200/70 whitespace-nowrap">Produits Actifs</span>
                <span className="text-xs font-bold text-white bg-emerald-900/40 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                  1 produit(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🛒 Commandes Récentes Panel (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#091b14] via-[#0d261c] to-[#091b14] border border-emerald-900/60 rounded-[2rem] p-6 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
            <div>
              <h4 className="font-extrabold text-white text-base tracking-tight">Commandes récentes</h4>
              <p className="text-xs text-emerald-200/70">Dernières commandes enregistrées sur ENO LIVRAISON</p>
            </div>

            <Link
              href="/dashboard/commandes"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shrink-0 self-start sm:self-auto"
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
                  className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(22,163,74,0.12)] flex items-center justify-between gap-4 group"
                >
                  {/* Left Column: ID + Client + Location */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {ord.id}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-extrabold text-white truncate tracking-tight">
                          {ord.clientName}
                        </h5>
                        <span
                          className={`sm:hidden text-[9px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            isRecall
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : isDelivered
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : `${statusCfg.bg} ${statusCfg.color} border-emerald-800`
                          }`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/60 font-normal truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#22c55e] shrink-0" />
                        <span className="truncate">{ord.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Status Badge (Desktop) */}
                  <div className="shrink-0 hidden sm:flex items-center">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full border whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm ${
                        isRecall
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : isDelivered
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : `${statusCfg.bg} ${statusCfg.color} border-emerald-800`
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isRecall
                            ? "bg-amber-400 animate-pulse"
                            : isDelivered
                            ? "bg-emerald-400"
                            : "bg-green-400"
                        }`}
                      ></span>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Right Column: Price + Product + Action CTA */}
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-black text-emerald-400 tracking-tight whitespace-nowrap">
                        {ord.totalPrice.toLocaleString()} F CFA
                      </p>
                      <p className="text-[10px] text-emerald-200/60 font-semibold truncate max-w-[120px] hidden sm:block">
                        {ord.products}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/commandes"
                      className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-[#16a34a] text-emerald-200 hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-sm"
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
