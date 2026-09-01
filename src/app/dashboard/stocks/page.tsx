"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Boxes,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { products, currentPartner } from "@/lib/mock-data";

export default function StocksPage() {
  const partnerProducts = products.filter((p) => p.partnerId === currentPartner.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockSuccess, setRestockSuccess] = useState(false);

  // Form State
  const [restockProductId, setRestockProductId] = useState(partnerProducts[0]?.id || "");
  const [restockQuantity, setRestockQuantity] = useState(50);
  const [restockWarehouse, setRestockWarehouse] = useState("Cotonou - Akpakpa");

  // Calculations
  const totalInitial = partnerProducts.reduce((acc, p) => acc + p.initialStock, 0);
  const totalRemaining = partnerProducts.reduce((acc, p) => acc + p.remainingStock, 0);
  const totalDelivered = partnerProducts.reduce((acc, p) => acc + p.deliveredCount, 0);
  const flowRate = totalInitial > 0 ? Math.round((totalDelivered / totalInitial) * 100) : 0;

  const filteredProducts = partnerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRestockSuccess(true);
    setShowRestockModal(false);
    setTimeout(() => setRestockSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up w-full max-w-full min-w-0">
      {/* 🏛️ HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-[#EAE6DD] min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-[#787163] truncate">
            <span>Entrepôts ENO</span>
            <span>•</span>
            <span className="text-[#0D5940]">Stockage 100% Offert • Cotonou & Calavi</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#141A17] tracking-tight mt-1 truncate">
            Inventaire & Entrepôts
          </h2>
          <p className="text-xs text-[#787163] mt-1 leading-normal">
            Vos marchandises sont gardées sous scellé et surveillance continue sans frais de location.
          </p>
        </div>

        <button
          onClick={() => setShowRestockModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#141A17] hover:bg-[#0D5940] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span>Déposer du Stock</span>
        </button>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {restockSuccess && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#0D5940] text-[#0D5940] text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#0D5940] shrink-0" />
            <span className="truncate">Demande de dépôt enregistrée. L&apos;équipe entrepôt ENO est notifiée.</span>
          </div>
          <span className="text-[10px] bg-[#FAF9F5] border border-[#EAE6DD] text-[#0D5940] px-2.5 py-0.5 rounded-full uppercase font-bold shrink-0">
            En attente de réception
          </span>
        </div>
      )}

      {/* 📊 4 STATS CARDS (Perfectly synchronized baselines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        {/* Stock initial */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">
              Stock Initial Déposé
            </span>
            <Boxes className="w-4 h-4 text-[#8C8474] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {totalInitial} <span className="text-xs font-semibold text-[#787163]">unités</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Total confié à ENO</p>
          </div>
        </div>

        {/* Stock restant */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D5940] truncate">
              Disponible Immédiat
            </span>
            <Package className="w-4 h-4 text-[#0D5940] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#0D5940] tracking-tight">
              {totalRemaining} <span className="text-xs font-semibold text-[#787163]">unités</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Prêt pour expédition rapide</p>
          </div>
        </div>

        {/* Produits livrés */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">
              Colis Livrés
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#0D5940] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {totalDelivered} <span className="text-xs font-semibold text-[#787163]">remis</span>
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Encaissés aux acheteurs</p>
          </div>
        </div>

        {/* Taux d'écoulement */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-2 min-w-0">
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">
              Taux d&apos;Écoulement
            </span>
            <TrendingUp className="w-4 h-4 text-[#C5A059] shrink-0" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {flowRate}%
            </p>
            <p className="text-xs text-[#5C5649] mt-0.5 truncate">Vitesse de rotation du stock</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border border-[#EAE6DD] p-3.5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full min-w-0">
        <div className="relative flex-1 sm:max-w-md min-w-0">
          <Search className="w-3.5 h-3.5 text-[#8C8474] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une référence en stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs text-[#141A17] placeholder:text-[#8C8474] focus:outline-none focus:border-[#0D5940] focus:bg-white"
          />
        </div>
        <span className="text-xs text-[#787163] font-medium shrink-0">
          {filteredProducts.length} référence(s) répertoriée(s)
        </span>
      </div>

      {/* PRODUCTS LIST GRID (Aligned cards with equal heights) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
        {filteredProducts.map((prod) => {
          const isLowStock = prod.remainingStock < 15;
          const percentage = Math.round((prod.remainingStock / prod.initialStock) * 100);

          return (
            <div
              key={prod.id}
              className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4 hover:border-[#0D5940]/40 transition-all flex flex-col justify-between h-full min-w-0"
            >
              <div className="space-y-4 min-w-0">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-[#141A17] uppercase tracking-tight truncate">{prod.name}</h3>
                    <p className="text-base font-black text-[#0D5940] mt-0.5">
                      {prod.price.toLocaleString("fr-FR")} F CFA
                    </p>
                  </div>

                  {isLowStock ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#A84232]/30 text-[#A84232] text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" /> Faible
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#0D5940]/30 text-[#0D5940] text-[10px] font-bold uppercase shrink-0">
                      Optimal
                    </span>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#5C5649]">
                    <span>Réserve entrepôt</span>
                    <span className="font-bold text-[#141A17]">{percentage}% restant</span>
                  </div>
                  <div className="w-full bg-[#FAF9F5] border border-[#EAE6DD] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? "bg-[#A84232]" : "bg-[#0D5940]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EAE6DD] text-center w-full">
                <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EAE6DD] min-w-0">
                  <p className="text-[10px] font-bold text-[#787163] uppercase truncate">Déposé</p>
                  <p className="text-xs sm:text-sm font-black text-[#141A17] mt-0.5">{prod.initialStock}</p>
                </div>
                <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EAE6DD] min-w-0">
                  <p className="text-[10px] font-bold text-[#0D5940] uppercase truncate">Restant</p>
                  <p className="text-xs sm:text-sm font-black text-[#0D5940] mt-0.5">{prod.remainingStock}</p>
                </div>
                <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EAE6DD] min-w-0">
                  <p className="text-[10px] font-bold text-[#787163] uppercase truncate">Livrés</p>
                  <p className="text-xs sm:text-sm font-black text-[#141A17] mt-0.5">{prod.deliveredCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESTOCK MODAL */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-[#141A17]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE6DD] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DD]">
              <div>
                <h3 className="text-base font-black text-[#141A17]">Déposer du Stock en Entrepôt</h3>
                <p className="text-xs text-[#787163] mt-0.5">Dépôt gratuit à Cotonou ou Calavi</p>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] text-[#8C8474] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A17] uppercase">Produit à Réapprovisionner</label>
                <select
                  value={restockProductId}
                  onChange={(e) => setRestockProductId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white"
                >
                  {partnerProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Reste : {p.remainingStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A17] uppercase">Quantité à Déposer (Unités)</label>
                <input
                  type="number"
                  min={1}
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A17] uppercase">Entrepôt de Destination</label>
                <select
                  value={restockWarehouse}
                  onChange={(e) => setRestockWarehouse(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white"
                >
                  <option value="Cotonou - Akpakpa">Cotonou - Akpakpa (Hub Central)</option>
                  <option value="Abomey-Calavi - Arconville">Abomey-Calavi - Arconville (Hub Nord)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE6DD] text-xs font-bold text-[#5C5649] hover:bg-[#FAF9F5]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0D5940] hover:bg-[#093D2C] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Valider la Réception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
