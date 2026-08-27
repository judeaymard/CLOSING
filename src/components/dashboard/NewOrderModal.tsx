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
      comment: "NOUVELLE COMMANDE ENREGISTRÉE (BÉNIN)",
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
      <div className="bg-[#0f172a] border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              +
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nouvelle commande</h3>
              <p className="text-xs text-gray-400">Enregistrez une commande client au Bénin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto dark-scrollbar">
          {/* Section: Informations client */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <User className="w-4 h-4" /> Informations client (Bénin)
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom du client *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />

              <input
                type="tel"
                required
                placeholder="Téléphone Bénin (ex: +229 97 00 00 00) *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
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
                  className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Date de commande */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Date de commande
            </div>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Section: Disponibilité pour la livraison */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Truck className="w-4 h-4" /> Disponibilité pour la livraison
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                placeholder="jj/mm/aaaa"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Lieu (ex: Face Etoile Rouge Cotonou)"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e293b]/70 border border-gray-700/70 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Section: Sélectionner les produits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Package className="w-4 h-4" /> Sélectionner les produits
            </div>

            <div className="space-y-2">
              {products.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedProduct.id === prod.id
                      ? "bg-orange-500/10 border-orange-500 text-white"
                      : "bg-[#1e293b]/40 border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-orange-400">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{prod.name}</p>
                      <p className="text-[11px] text-gray-400">
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
                      className="w-14 px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white text-center focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission SCMS Livraison */}
          <div className="bg-[#1e1b18] border border-orange-900/40 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-orange-300">Commission SCMS Livraison</span>
            <span className="text-sm font-black text-orange-400">{commission * quantity} F CFA</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" /> Enregistrer la commande
          </button>
        </form>
      </div>
    </div>
  );
}
