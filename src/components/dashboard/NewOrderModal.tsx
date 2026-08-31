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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[#091b14] border border-emerald-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
              +
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nouvelle commande</h3>
              <p className="text-xs text-emerald-300/70">Enregistrez une commande client au Bénin pour ENO LIVRAISON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto dark-scrollbar">
          {/* Section: Informations client */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#22c55e] uppercase tracking-wider">
              <User className="w-4 h-4" /> Informations client (Bénin)
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom du client *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a] transition-colors"
              />

              <input
                type="tel"
                required
                placeholder="Téléphone Bénin (ex: +229 97 00 00 00) *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a] transition-colors"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#16a34a] transition-colors"
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
                  placeholder="Zone exacte (Quartier: Cadjehoun, Akpakpa...)"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Date de commande */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#22c55e] uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Date de commande
            </div>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#16a34a] transition-colors"
            />
          </div>

          {/* Section: Disponibilité pour la livraison */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#22c55e] uppercase tracking-wider">
              <Truck className="w-4 h-4" /> Disponibilité pour la livraison
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                placeholder="jj/mm/aaaa"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#16a34a] transition-colors"
              />
              <input
                type="text"
                placeholder="Lieu (ex: Face Etoile Rouge Cotonou)"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-sm text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a] transition-colors"
              />
            </div>
          </div>

          {/* Section: Sélectionner les produits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#22c55e] uppercase tracking-wider">
              <Package className="w-4 h-4" /> Sélectionner les produits
            </div>

            <div className="space-y-2">
              {products.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedProduct.id === prod.id
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-emerald-950/40 border-emerald-900/60 text-emerald-300/70 hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 flex items-center justify-center text-[#22c55e] border border-emerald-800">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{prod.name}</p>
                      <p className="text-[11px] text-emerald-300/70">
                        {prod.price} F • Stock restant : <span className="text-emerald-400 font-bold">{prod.remainingStock}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Qté:</span>
                    <input
                      type="number"
                      min={1}
                      max={prod.remainingStock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 px-2 py-1 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white text-center focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission ENO LIVRAISON */}
          <div className="bg-emerald-950/50 border border-emerald-900/60 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200">Commission ENO LIVRAISON</span>
            <span className="text-sm font-black text-[#22c55e]">{commission * quantity} F CFA</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" /> Enregistrer la commande
          </button>
        </form>
      </div>
    </div>
  );
}
