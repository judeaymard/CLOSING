"use client";

import React, { useState } from "react";
import {
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Banknote,
  Navigation,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Package,
  X,
} from "lucide-react";
import { useOperations } from "@/lib/store";

export default function AdminLivreursPage() {
  const {
    currentRole,
    activeLivreur,
    livreurs,
    orders,
    assignOrderToLivreur,
    markOrderDelivered,
    markOrderFailed,
    addLivreur,
  } = useOperations();

  const [selectedDriverId, setSelectedDriverId] = useState<string>(activeLivreur.id);
  const [failModalOrderId, setFailModalOrderId] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<string>("Client absent au rendez-vous");

  // Add Driver Modal State
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("+229 01 ");
  const [driverZone, setDriverZone] = useState("Cotonou Centre • Akpakpa");
  const [driverVehicle, setDriverVehicle] = useState("Moto Yamaha YB-125");

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !driverPhone) return;
    addLivreur({
      name: driverName,
      phone: driverPhone,
      zone: driverZone,
      vehicle: driverVehicle,
    });
    setDriverName("");
    setDriverPhone("+229 01 ");
    setShowAddDriverModal(false);
  };

  // Filter orders for the active livreur or selected driver
  const targetDriverId = currentRole === "LIVREUR" ? activeLivreur.id : selectedDriverId;
  const targetDriver = livreurs.find((l) => l.id === targetDriverId) || activeLivreur;

  const driverAssignedOrders = orders.filter((o) => o.assignedLivreurId === targetDriver.id);
  const activeDeliveries = driverAssignedOrders.filter((o) => o.status !== "LIVREE" && o.status !== "ANNULEE");
  const deliveredToday = driverAssignedOrders.filter((o) => o.status === "LIVREE");

  // Orders waiting for driver assignment (for PDG / Closeuse view)
  const unassignedOrders = orders.filter(
    (o) => (o.status === "CONFIRMEE" || o.status === "EN_ATTENTE") && !o.assignedLivreurId
  );

  const totalCashCollectedAll = livreurs.reduce((acc, l) => acc + l.cashCollectedToday, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 🛵 VUE LIVREUR : TOURNÉE DU JOUR (Mobile-First) */}
      {currentRole === "LIVREUR" ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Caisse Card */}
          <div className="p-5 rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-[#07130e] border border-emerald-700 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Ma Caisse Cash COD en Sacoche
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                {targetDriver.cashCollectedToday.toLocaleString("fr-FR")} F CFA
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {deliveredToday.length} colis livrés & encaissés aujourd&apos;hui
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Banknote className="w-6 h-6" />
            </div>
          </div>

          {/* Active Deliveries List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-400" />
                <span>Colis à Livrer ({activeDeliveries.length})</span>
              </h2>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                Zone : {targetDriver.zone.split("•")[0]}
              </span>
            </div>

            {activeDeliveries.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-200/60">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">Tournée terminée !</p>
                <p className="text-xs text-emerald-300/70 mt-1">Tous les colis assignés ont été livrés.</p>
              </div>
            ) : (
              activeDeliveries.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-[#0d261c] border border-emerald-900 shadow-md space-y-4 hover:border-emerald-700 transition-all"
                >
                  {/* Header Colis */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-emerald-900/60">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {ord.orderNumber}
                      </span>
                      <h3 className="text-base font-black text-white mt-1.5">{ord.clientName}</h3>
                      <p className="text-xs text-emerald-200/80 flex items-center gap-1.5 mt-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{ord.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-emerald-300">À encaisser</span>
                      <p className="text-lg font-black text-emerald-400">
                        {ord.totalPrice.toLocaleString("fr-FR")} F
                      </p>
                    </div>
                  </div>

                  {/* Articles & Note */}
                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-900/50 text-xs text-emerald-100 space-y-1">
                    <p className="font-bold text-white">📦 {ord.products} ({ord.quantity}x)</p>
                    {ord.closingNotes && (
                      <p className="text-[11px] text-amber-300 italic">
                        📝 Note Closeuse : {ord.closingNotes}
                      </p>
                    )}
                    {ord.deliveryTimeSlot && (
                      <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Créneau convenu : <strong>{ord.deliveryTimeSlot}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Contact Client Direct Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${ord.clientPhone.replace(/\s+/g, "")}`}
                      className="py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Appeler ({ord.clientPhone})</span>
                    </a>

                    <a
                      href={`https://wa.me/${ord.clientPhone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(ord.clientName)}%2C%20je%20suis%20le%20livreur%20ENO%20LIVRAISON%20pour%20votre%20colis.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Action Validation Livraison */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2">
                    <button
                      onClick={() => markOrderDelivered(ord.id)}
                      className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Colis Livré & Encaissé ({ord.totalPrice.toLocaleString("fr-FR")} F)</span>
                    </button>

                    <button
                      onClick={() => setFailModalOrderId(ord.id)}
                      className="py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 font-bold text-xs transition-colors"
                    >
                      Report / Problème
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* 👔 VUE PDG & CLOSEUSES : SUPERVISION DE LA FLOTTE & ATTRIBUTION */
        <div className="space-y-8">
          {/* Header Stats Flotte */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0d261c] border border-emerald-900 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Total Cash Encaissé Flotte</span>
              <p className="text-2xl font-black text-white">{totalCashCollectedAll.toLocaleString("fr-FR")} F CFA</p>
              <p className="text-xs text-emerald-300/70">À récupérer auprès des livreurs ce soir</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0d261c] border border-emerald-900 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Livreurs Déployés</span>
              <p className="text-2xl font-black text-emerald-300">{livreurs.length} coursiers actifs</p>
              <p className="text-xs text-emerald-300/70">Cotonou, Calavi, Porto-Novo</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0d261c] border border-emerald-900 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Colis en Attente de Dispatch</span>
              <p className="text-2xl font-black text-amber-400">{unassignedOrders.length} colis</p>
              <p className="text-xs text-amber-300/70">À affecter aux livreurs de zone</p>
            </div>
          </div>

          {/* Cards des Livreurs */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-400" />
                <span>Flotte de Livreurs & Caisse Journalière ({livreurs.length})</span>
              </h2>

              <button
                onClick={() => setShowAddDriverModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>+ Enregistrer un Nouveau Livreur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {livreurs.map((liv) => (
                <div
                  key={liv.id}
                  className={`p-5 rounded-3xl border transition-all space-y-4 ${
                    selectedDriverId === liv.id
                      ? "bg-[#0f2d21] border-emerald-500 shadow-lg"
                      : "bg-[#091b14] border-emerald-900/60 hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <h3 className="font-black text-white text-sm">{liv.name}</h3>
                      </div>
                      <p className="text-xs text-emerald-300/80 font-mono mt-0.5">{liv.phone}</p>
                      <p className="text-[11px] text-emerald-400/90 mt-1 font-semibold">{liv.zone}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {liv.vehicle}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-900/60 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Livrés Aujourd&apos;hui</span>
                      <p className="text-base font-black text-white">{liv.deliveredTodayCount} colis</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Cash en main</span>
                      <p className="text-base font-black text-emerald-400">{liv.cashCollectedToday.toLocaleString("fr-FR")} F</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDriverId(liv.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDriverId === liv.id
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-950 border border-emerald-800 text-emerald-200 hover:bg-emerald-900"
                    }`}
                  >
                    {selectedDriverId === liv.id ? "Tournée Sélectionnée" : "Voir sa Tournée"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Attribution des Colis Confirmés */}
          {unassignedOrders.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#0d261c] border border-emerald-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Affectation Rapide aux Livreurs</h3>
                  <p className="text-xs text-emerald-300/80">Commandes confirmées prêtes pour départ en livraison</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                  {unassignedOrders.length} à dispatcher
                </span>
              </div>

              <div className="space-y-2.5">
                {unassignedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-[#091b14] border border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-black">{ord.clientName}</strong>
                        <span className="text-emerald-400 font-mono">({ord.orderNumber})</span>
                      </div>
                      <p className="text-emerald-200/70 mt-0.5">
                        📍 {ord.address} • 📦 {ord.products} • <strong>{ord.totalPrice.toLocaleString("fr-FR")} F CFA</strong>
                      </p>
                    </div>

                    {/* Attribution Dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            assignOrderToLivreur(ord.id, e.target.value);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="" disabled>Attribuer à un coursier...</option>
                        {livreurs.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.zone.split("•")[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL SIGNALEMENT PROBLÈME LIVREUR */}
      {failModalOrderId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-800 rounded-3xl p-6 max-w-md w-full space-y-4 animate-fade-in-up">
            <h3 className="text-base font-black text-white">Signaler un Incident de Livraison</h3>
            <p className="text-xs text-emerald-200/80">Indiquez la raison pour laquelle le colis n&apos;a pas pu être remis :</p>

            <select
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-xs font-bold text-white"
            >
              <option value="Client injoignable au téléphone">Client injoignable au téléphone</option>
              <option value="Client absent au lieu de rendez-vous">Client absent au lieu de rendez-vous</option>
              <option value="Client demande de reporter à demain">Client demande de reporter à demain</option>
              <option value="Client refuse la commande (problème prix/article)">Client refuse la commande</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFailModalOrderId(null)}
                className="px-4 py-2 rounded-xl border border-emerald-800 text-xs font-bold text-emerald-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  markOrderFailed(failModalOrderId, failReason);
                  setFailModalOrderId(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Enregistrer le Rapport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION DE NOUVEAU LIVREUR */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div>
                <h3 className="text-base font-black text-white">Enregistrer un Nouveau Livreur</h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">Création de compte coursier et affectation de zone</p>
              </div>
              <button
                onClick={() => setShowAddDriverModal(false)}
                className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Nom Complet du Livreur *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Moussa KANHOUN"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Téléphone WhatsApp / Appel *</label>
                <input
                  type="text"
                  required
                  placeholder="+229 01 97 00 00 00"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Zone Principale Couverte</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cotonou Centre • Akpakpa • Fidjrossè"
                  value={driverZone}
                  onChange={(e) => setDriverZone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Véhicule / Moyen de Déplacement</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Moto TVS HLX 150 (Casque & Sacoche)"
                  value={driverVehicle}
                  onChange={(e) => setDriverVehicle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-xs font-bold text-emerald-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  Créer le Compte Livreur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
