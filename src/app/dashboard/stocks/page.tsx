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
              Stockage 100% Offert • ENO LIVRAISON
            </span>
          </div>
          <p className="text-xs text-emerald-300/70 mt-1">
            Entrepôts sécurisés sous surveillance 24h/24 à Cotonou et Calavi.
          </p>
        </div>

        <button
          onClick={() => setShowRestockModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Déposer / Réapprovisionner du Stock</span>
        </button>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stock initial */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-300 flex items-center justify-center border border-emerald-800">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-300/70 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900">
              Entrepôt Total
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider">Stock initial déposé</p>
            <p className="text-3xl font-black text-white mt-1">
              {totalInitial} <span className="text-xs font-semibold text-emerald-300/70">unités</span>
            </p>
          </div>
        </div>

        {/* Stock restant */}
        <div className="bg-[#091b14] border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Disponible
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider">Stock restant actuel</p>
            <p className="text-3xl font-black text-[#22c55e] mt-1">
              {totalRemaining} <span className="text-xs font-semibold text-emerald-300">unités</span>
            </p>
          </div>
        </div>

        {/* Produits livrés */}
        <div className="bg-[#091b14] border border-emerald-600/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Livrés Clients
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider">Colis remis au client</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {totalDelivered} <span className="text-xs font-semibold text-emerald-300">unités</span>
            </p>
          </div>
        </div>

        {/* Taux d'écoulement */}
        <div className="bg-[#091b14] border border-purple-500/40 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
              Performance
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider">Taux d&apos;écoulement</p>
            <p className="text-3xl font-black text-purple-400 mt-1">{flowRate}%</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 bg-[#091b14] border border-emerald-900/60 p-4 rounded-3xl shadow-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-2xl text-xs text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a]"
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
              className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-2xl space-y-5 hover:border-emerald-500/50 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-[#22c55e] flex items-center justify-center shrink-0 shadow-md">
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
                    <span className="text-emerald-300/70">Progression Écoulement</span>
                    <span className="text-[#22c55e]">{percentage}% restant</span>
                  </div>
                  <div className="w-full bg-emerald-950 h-2.5 rounded-full overflow-hidden border border-emerald-900">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? "bg-rose-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-emerald-900/60 text-center">
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-900/60">
                  <p className="text-[10px] font-extrabold text-emerald-300/70 uppercase">Initial</p>
                  <p className="text-base font-black text-white mt-0.5">{prod.initialStock}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-900/60">
                  <p className="text-[10px] font-extrabold text-emerald-300/70 uppercase">Restant</p>
                  <p className="text-base font-black text-[#22c55e] mt-0.5">{prod.remainingStock}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-900/60">
                  <p className="text-[10px] font-extrabold text-emerald-300/70 uppercase">Livrés</p>
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
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Nouveau Dépôt de Stock</h3>
                  <p className="text-xs text-emerald-300/70">Ajouter un produit à entreposer chez ENO LIVRAISON</p>
                </div>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-emerald-300/70 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200/80 uppercase">Nom du Produit</label>
                <input
                  type="text"
                  required
                  placeholder="EX: ROULEAU DE COLORIAGE"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Prix de Vente (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="7800"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Quantité Déposée</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-5 py-3 rounded-2xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
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
