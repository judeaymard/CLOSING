"use client";

import React, { useState } from "react";
import {
  Package,
  Boxes,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
} from "lucide-react";
import { products, currentPartner } from "@/lib/mock-data";

export default function StocksPage() {
  const partnerProducts = products.filter((p) => p.partnerId === currentPartner.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");

  const filteredProducts = partnerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInitial = partnerProducts.reduce((acc, p) => acc + p.initialStock, 0);
  const totalRemaining = partnerProducts.reduce((acc, p) => acc + p.remainingStock, 0);
  const totalDelivered = partnerProducts.reduce((acc, p) => acc + p.deliveredCount, 0);
  const flowRate = totalInitial > 0 ? Math.round((totalDelivered / totalInitial) * 100) : 0;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;

    partnerProducts.push({
      id: `prod_${Date.now()}`,
      name: newProdName.toUpperCase(),
      price: Number(newProdPrice),
      initialStock: Number(newProdStock),
      remainingStock: Number(newProdStock),
      deliveredCount: 0,
      partnerId: currentPartner.id,
    });

    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    setShowRestockModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Gestion des Stocks</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Stockage 100% Offert
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Entrepôts sécurisés sous surveillance 24h/24.
          </p>
        </div>

        <button
          onClick={() => setShowRestockModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Déposer / Réapprovisionner du Stock</span>
        </button>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stock initial */}
        <div className="bg-[#090e22] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full">
              Entrepôt Total
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock initial déposé</p>
            <p className="text-3xl font-black text-white mt-1">
              {totalInitial} <span className="text-xs font-semibold text-slate-400">unités</span>
            </p>
          </div>
        </div>

        {/* Stock restant */}
        <div className="bg-[#090e22] border border-[#06b6d4]/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-[#06b6d4]/20 text-[#06b6d4] flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-[#06b6d4] bg-[#06b6d4]/10 px-2.5 py-1 rounded-full">
              Disponible
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock restant actuel</p>
            <p className="text-3xl font-black text-[#06b6d4] mt-1">
              {totalRemaining} <span className="text-xs font-semibold text-cyan-300">unités</span>
            </p>
          </div>
        </div>

        {/* Produits livrés */}
        <div className="bg-[#090e22] border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Livrés Clients
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Colis remis au client</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {totalDelivered} <span className="text-xs font-semibold text-emerald-300">unités</span>
            </p>
          </div>
        </div>

        {/* Taux d'écoulement */}
        <div className="bg-[#090e22] border border-purple-500/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
              Performance
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux d&apos;écoulement</p>
            <p className="text-3xl font-black text-purple-400 mt-1">{flowRate}%</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 bg-[#090e22] border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#06b6d4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#06b6d4]"
          />
        </div>
      </div>

      {/* PRODUCTS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const isLowStock = prod.remainingStock < 15;
          const percentage = Math.round((prod.remainingStock / prod.initialStock) * 100);

          return (
            <div
              key={prod.id}
              className="bg-[#090e22] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 hover:border-[#06b6d4]/50 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-[#06b6d4] flex items-center justify-center shrink-0 shadow-md">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">{prod.name}</h3>
                      <p className="text-xs font-extrabold text-emerald-400 mt-0.5">
                        {prod.price.toLocaleString()} F CFA
                      </p>
                    </div>
                  </div>

                  {isLowStock ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stock Faible
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                      Stock Optimal
                    </span>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Progression Écoulement</span>
                    <span className="text-[#06b6d4]">{percentage}% restant</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? "bg-rose-500" : "bg-gradient-to-r from-cyan-500 to-emerald-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-800 text-center">
                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Initial</p>
                  <p className="text-base font-black text-white mt-0.5">{prod.initialStock}</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Restant</p>
                  <p className="text-base font-black text-[#06b6d4] mt-0.5">{prod.remainingStock}</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Livrés</p>
                  <p className="text-base font-black text-emerald-400 mt-0.5">{prod.deliveredCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESTOCK MODAL */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090e22] border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Nouveau Dépôt de Stock</h3>
                  <p className="text-xs text-slate-400">Ajouter un produit à entreposer</p>
                </div>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Nom du Produit</label>
                <input
                  type="text"
                  required
                  placeholder="EX: ROULEAU DE COLORIAGE"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Prix de Vente (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="7800"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Quantité Déposée</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Enregistrer le dépôt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
