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
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Gestion des Stocks</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Stockage 100% Offert • ENO LIVRAISON
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Entrepôts sécurisés sous surveillance 24h/24 à Cotonou et Abomey-Calavi.
          </p>
        </div>

        <button
          onClick={() => setShowRestockModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Déposer du Stock</span>
        </button>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stock initial */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Boxes className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Total Entrepôt
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock initial déposé</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalInitial} <span className="text-xs font-medium text-slate-400">unités</span>
            </p>
          </div>
        </div>

        {/* Stock restant */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center border border-emerald-100">
              <Boxes className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Disponible
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock restant actuel</p>
            <p className="text-2xl sm:text-3xl font-black text-[#16a34a] mt-1">
              {totalRemaining} <span className="text-xs font-medium text-emerald-600">unités</span>
            </p>
          </div>
        </div>

        {/* Produits livrés */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Livrés Clients
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Colis remis au client</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalDelivered} <span className="text-xs font-medium text-slate-400">unités</span>
            </p>
          </div>
        </div>

        {/* Taux d'écoulement */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Performance
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux d&apos;écoulement</p>
            <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">{flowRate}%</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white"
          />
        </div>
      </div>

      {/* PRODUCTS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => {
          const isLowStock = prod.remainingStock < 15;
          const percentage = Math.round((prod.remainingStock / prod.initialStock) * 100);

          return (
            <div
              key={prod.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#16a34a] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{prod.name}</h3>
                      <p className="text-xs font-black text-[#16a34a] mt-0.5">
                        {prod.price.toLocaleString()} F CFA
                      </p>
                    </div>
                  </div>

                  {isLowStock ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" /> Stock Faible
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase shrink-0">
                      Stock Optimal
                    </span>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-500">Progression</span>
                    <span className="text-slate-800">{percentage}% restant</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? "bg-rose-500" : "bg-gradient-to-r from-[#16a34a] to-emerald-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Initial</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{prod.initialStock}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Restant</p>
                  <p className="text-sm font-black text-[#16a34a] mt-0.5">{prod.remainingStock}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Livrés</p>
                  <p className="text-sm font-black text-slate-800 mt-0.5">{prod.deliveredCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESTOCK MODAL */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nouveau Dépôt de Stock</h3>
                  <p className="text-xs text-slate-500">Ajouter un produit à entreposer chez ENO LIVRAISON</p>
                </div>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Nom du Produit</label>
                <input
                  type="text"
                  required
                  placeholder="EX: ROULEAU DE COLORIAGE"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Prix Vente (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="7800"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Quantité Déposée</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20"
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
