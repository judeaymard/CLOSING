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
  Plus,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA, formatPrice } from "@/lib/mock-data";

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
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhone, setDriverPhone] = useState("+229 01 ");
  const [driverZone, setDriverZone] = useState("Cotonou Centre • Akpakpa");
  const [driverVehicle, setDriverVehicle] = useState("Moto Yamaha YB-125");
  const [createdDriverInfo, setCreatedDriverInfo] = useState<{ name: string; email: string; code: string } | null>(null);

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !driverPhone || !driverEmail) return;
    const created = addLivreur({
      name: driverName,
      email: driverEmail,
      phone: driverPhone,
      zone: driverZone,
      vehicle: driverVehicle,
    });
    setCreatedDriverInfo({
      name: created.name,
      email: created.email,
      code: created.temporaryCode || "849201",
    });
    setDriverName("");
    setDriverEmail("");
    setDriverPhone("+229 01 ");
  };

  const targetDriverId = currentRole === "LIVREUR" ? activeLivreur.id : selectedDriverId;
  const targetDriver = livreurs.find((l) => l.id === targetDriverId) || activeLivreur;

  const driverAssignedOrders = orders.filter((o) => o.assignedLivreurId === targetDriver.id);
  const activeDeliveries = driverAssignedOrders.filter((o) => o.status !== "LIVREE" && o.status !== "ANNULEE");
  const deliveredToday = driverAssignedOrders.filter((o) => o.status === "LIVREE");

  const unassignedOrders = orders.filter(
    (o) => (o.status === "CONFIRMEE" || o.status === "EN_ATTENTE") && !o.assignedLivreurId
  );

  const totalCashCollectedAll = livreurs.reduce((acc, l) => acc + l.cashCollectedToday, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Flotte de Coursiers & Caisse Terrain</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des tournées par zone, encaissements COD en sacoche et attribution rapide des colis.
          </p>
        </div>

        <button
          onClick={() => setShowAddDriverModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Livreur</span>
        </button>
      </div>

      {/* 3 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Cash En Sacoche (COD)</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatCFA(totalCashCollectedAll)}</p>
          <p className="text-[11px] text-slate-500 font-medium">À collecter auprès des livreurs ce soir</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Coursiers Déployés</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{livreurs.length} actifs</p>
          <p className="text-[11px] text-slate-500 font-medium">Cotonou, Calavi, Porto-Novo</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Colis à Assigner</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{unassignedOrders.length} colis</p>
          <p className="text-[11px] text-slate-500 font-medium">Prêts pour dispatch de zone</p>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-900">Coursiers en Service ({livreurs.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {livreurs.map((liv) => {
            const isSelected = selectedDriverId === liv.id;
            return (
              <div
                key={liv.id}
                onClick={() => setSelectedDriverId(liv.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
                    : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                      {liv.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{liv.name}</h4>
                      <p className="text-[11px] text-slate-400">{liv.phone}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    En tournée
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Zone :</span>
                    <span className="font-bold text-slate-900">{liv.zone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Véhicule :</span>
                    <span>{liv.vehicle}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Colis livrés :</span>
                    <span className="font-bold text-slate-900">{liv.deliveredTodayCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-bold">Caisse Sacoche :</span>
                    <span className="font-black text-emerald-600 font-mono">{formatPrice(liv.cashCollectedToday)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Driver Assigned Orders Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Tournée de {targetDriver.name} ({driverAssignedOrders.length} colis assignés)
            </h3>
            <p className="text-xs text-slate-500">Zone : {targetDriver.zone}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Réf & Client</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Montant COD</th>
                <th className="py-3 px-4">Créneau</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {driverAssignedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Aucun colis assigné pour ce coursier.
                  </td>
                </tr>
              ) : (
                driverAssignedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {ord.orderNumber} • {ord.clientName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{ord.city} • {ord.address}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatCFA(ord.totalPrice)}</td>
                    <td className="py-3 px-4 text-slate-500">{ord.deliveryTimeSlot || "Après-midi"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === "LIVREE" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ord.status !== "LIVREE" && (
                        <button
                          onClick={() => markOrderDelivered(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                        >
                          Valider Livraison
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🛵 MODAL AJOUT LIVREUR */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Ajouter un Nouveau Livreur</h3>
              <button onClick={() => setShowAddDriverModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdDriverInfo ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="text-xs font-bold text-emerald-900">Livreur créé avec succès !</p>
                <p className="text-xs text-emerald-800">
                  Transmettez ce code d&apos;activation temporaire à <strong>{createdDriverInfo.name}</strong> :
                </p>
                <div className="text-xl font-mono font-black text-emerald-900 bg-white p-3 rounded-xl border border-emerald-300 text-center tracking-widest">
                  {createdDriverInfo.code}
                </div>
                <button
                  onClick={() => {
                    setCreatedDriverInfo(null);
                    setShowAddDriverModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer mt-2"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateDriver} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Ex: Marius SOSSOU"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    placeholder="marius@eno-livraison.bj"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Zone Couverte</label>
                  <input
                    type="text"
                    value={driverZone}
                    onChange={(e) => setDriverZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDriverModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Créer le compte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
