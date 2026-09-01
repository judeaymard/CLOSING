"use client";

import React, { useState } from "react";
import { X, User, Calendar, Truck, CheckCircle2, Package } from "lucide-react";
import { Order, Product } from "@/lib/types";
import { products, generateOrderNumber } from "@/lib/mock-data";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (order: Order) => void;
}

export default function NewOrderModal({ isOpen, onClose, onOrderCreated }: NewOrderModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [region, setRegion] = useState("Cotonou");
  const [zone, setZone] = useState("");
  const [orderDate, setOrderDate] = useState("2026-08-26");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const commission = 2800; // 800F service + 2000F livraison

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const newOrder: Order = {
      id: "ord_" + Date.now(),
      orderNumber: generateOrderNumber(),
      clientName: clientName.toUpperCase(),
      clientPhone,
      region,
      address: zone ? `${zone.toUpperCase()}, ${region}` : region,
      city: region,
      products: selectedProduct.name,
      quantity,
      totalPrice: selectedProduct.price * quantity,
      deliveryFee: 2000,
      serviceFee: 800,
      status: "EN_ATTENTE",
      comment: "NOUVELLE COMMANDE ENREGISTRÉE (ENO LIVRAISON)",
      availability: deliveryDate,
      availabilityLocation: deliveryLocation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partnerId: "p1",
    };

    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-600/20">
              +
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Nouvelle commande</h3>
              <p className="text-xs text-slate-500">Enregistrez une commande client au Bénin pour ENO LIVRAISON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section: Informations client */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider">
              <User className="w-4 h-4" /> Informations client (Bénin)
            </div>

            <div className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Nom complet du client *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
              />

              <input
                type="tel"
                required
                placeholder="Téléphone Bénin (ex: +229 97 00 00 00) *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
                >
                  <option value="Cotonou">Cotonou</option>
                  <option value="Abomey-Calavi">Abomey-Calavi</option>
                  <option value="Porto-Novo">Porto-Novo</option>
                  <option value="Parakou">Parakou</option>
                  <option value="Bohicon">Bohicon</option>
                  <option value="Ouidah">Ouidah</option>
                  <option value="Natitingou">Natitingou</option>
                  <option value="Autre ville Bénin">Autre ville Bénin</option>
                </select>

                <input
                  type="text"
                  placeholder="Zone (Quartier: Cadjehoun...)"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Date de commande */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Date de commande
            </div>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
            />
          </div>

          {/* Section: Disponibilité pour la livraison */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider">
              <Truck className="w-4 h-4" /> Disponibilité pour la livraison
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="date"
                placeholder="jj/mm/aaaa"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
              />
              <input
                type="text"
                placeholder="Lieu (ex: Face Étoile Rouge)"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Section: Sélectionner les produits */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider">
              <Package className="w-4 h-4" /> Sélectionner le produit
            </div>

            <div className="space-y-2">
              {products.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedProduct.id === prod.id
                      ? "bg-emerald-50/70 border-emerald-500 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#16a34a] border border-slate-200 shadow-xs">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase">{prod.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {prod.price} F CFA • Stock : <span className="text-emerald-700 font-bold">{prod.remainingStock}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-medium text-slate-500">Qté:</span>
                    <input
                      type="number"
                      min={1}
                      max={prod.remainingStock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission ENO LIVRAISON */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-900 block">Commission ENO LIVRAISON</span>
              <span className="text-[10px] text-emerald-700">Closing 800F + Livraison terrain 2000F</span>
            </div>
            <span className="text-sm font-black text-[#16a34a]">{commission * quantity} F CFA</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" /> Enregistrer la commande
          </button>
        </form>
      </div>
    </div>
  );
}
