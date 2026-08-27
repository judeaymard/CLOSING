"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Boxes, Package, Plus, Minus, Building, Check, Store, ArrowRight, X } from "lucide-react";
import { products as initialProducts, partners, formatCFA } from "@/lib/mock-data";
import { Product } from "@/lib/types";

export default function AdminStocksPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedPartner, setSelectedPartner] = useState<string>("ALL");

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetPartnerId, setTargetPartnerId] = useState(partners[0].id);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");

  const adjustStock = (productId: string, delta: number) => {
    setProductList((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const newRemaining = Math.max(0, prod.remainingStock + delta);
          return {
            ...prod,
            remainingStock: newRemaining,
          };
        }
        return prod;
      })
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: newProdName.toUpperCase(),
      price: parseInt(newProdPrice) || 5000,
      initialStock: parseInt(newProdStock) || 10,
      remainingStock: parseInt(newProdStock) || 10,
      deliveredCount: 0,
      partnerId: targetPartnerId,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProductList((prev) => [...prev, newProd]);
    setShowAddModal(false);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
  };

  const filteredProducts = productList.filter(
    (prod) => selectedPartner === "ALL" || prod.partnerId === selectedPartner
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Entrepôt & Stocks Globaux</h2>
          <p className="text-xs text-slate-400 mt-1">
            Contrôle physique des stocks déposés par les e-commerçants dans les locaux SCMS à Cotonou et Calavi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un produit</span>
          </button>

          {selectedPartner !== "ALL" && (
            <Link
              href={`/admin/partenaires/${selectedPartner}`}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-[#06b6d4]" />
              <span>Ouvrir l&apos;espace dédié</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-[#090e22] border border-slate-800 p-4 rounded-3xl shadow-xl max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Building className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-[#06b6d4]"
          >
            <option value="ALL">Toutes les boutiques e-commerce</option>
            {partners
              .filter((p) => p.isApproved)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} ({p.fullName})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const partner = partners.find((p) => p.id === prod.partnerId);

          return (
            <div
              key={prod.id}
              className="bg-[#090e22] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#06b6d4]/20 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                    <Package className="w-6 h-6" />
                  </div>
                  {partner && (
                    <Link
                      href={`/admin/partenaires/${partner.id}`}
                      className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-800 flex items-center gap-1"
                    >
                      <span>{partner.companyName}</span>
                      <ArrowRight className="w-3 h-3 text-[#06b6d4]" />
                    </Link>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">{prod.name}</h3>
                  <p className="text-sm font-bold text-[#06b6d4] mt-0.5">{formatCFA(prod.price)}</p>
                </div>

                {/* Stock Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Initial</p>
                    <p className="font-bold text-white mt-0.5">{prod.initialStock}</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Restant</p>
                    <p className="font-bold text-emerald-400 mt-0.5">{prod.remainingStock}</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Livrés</p>
                    <p className="font-bold text-[#06b6d4] mt-0.5">{prod.deliveredCount}</p>
                  </div>
                </div>
              </div>

              {/* Quick stock adjust */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Ajuster :</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustStock(prod.id, -1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                    title="-1 unité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustStock(prod.id, 1)}
                    className="w-8 h-8 rounded-lg bg-[#06b6d4] hover:bg-cyan-600 text-white flex items-center justify-center transition-colors"
                    title="+1 unité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustStock(prod.id, 10)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                    title="+10 unités"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ➕ MODAL AJOUT PRODUIT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090e22] border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">Nouveau Produit en Entrepôt</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Boutique propriétaire
                </label>
                <select
                  value={targetPartnerId}
                  onChange={(e) => setTargetPartnerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#06b6d4]"
                >
                  {partners
                    .filter((p) => p.isApproved)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.companyName} ({p.fullName})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Nom du produit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HUILE DE BEAUTÉ 100ML"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Prix de vente (F CFA)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 6000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Quantité déposée
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#06b6d4] text-white text-xs font-bold shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
