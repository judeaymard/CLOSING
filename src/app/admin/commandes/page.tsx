"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  User,
  Plus,
  Send,
  Store,
  ArrowRight,
  Phone,
  Clock,
  Bike,
  Headset,
  MapPin,
  X,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { OrderStatus, ORDER_STATUS_CONFIG } from "@/lib/types";

export default function AdminCommandesPage() {
  const {
    orders,
    partners,
    livreurs,
    closeuses,
    currentRole,
    activeCloseuse,
    updateOrderStatus,
    logClosingCall,
    assignOrderToLivreur,
    addCloseuse,
  } = useOperations();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Call Logging Modal State
  const [activeCallOrder, setActiveCallOrder] = useState<any | null>(null);
  const [callNote, setCallNote] = useState("");
  const [callStatus, setCallStatus] = useState<OrderStatus>("CONFIRMEE");
  const [assignedDriver, setAssignedDriver] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("14h00 - 16h00");

  // Add Closer Modal State
  const [showAddCloserModal, setShowAddCloserModal] = useState(false);
  const [closerName, setCloserName] = useState("");
  const [closerPhone, setCloserPhone] = useState("+229 01 ");

  const handleCreateCloser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closerName || !closerPhone) return;
    addCloseuse({ name: closerName, phone: closerPhone });
    setCloserName("");
    setCloserPhone("+229 01 ");
    setShowAddCloserModal(false);
  };

  const openCallModal = (order: any) => {
    setActiveCallOrder(order);
    setCallNote(order.closingNotes || "");
    setCallStatus(order.status === "EN_ATTENTE" ? "CONFIRMEE" : order.status);
    setAssignedDriver(order.assignedLivreurId || livreurs[0]?.id || "");
    setTimeSlot(order.deliveryTimeSlot || "14h00 - 16h00");
  };

  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCallOrder) return;

    logClosingCall(
      activeCallOrder.id,
      callNote,
      callStatus,
      callStatus === "CONFIRMEE" || callStatus === "EN_COURS" ? assignedDriver : undefined,
      timeSlot
    );
    setActiveCallOrder(null);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesPartner = selectedPartner === "ALL" || ord.partnerId === selectedPartner;
    const matchesStatus = selectedStatus === "ALL" || ord.status === selectedStatus;
    const matchesSearch =
      ord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.clientPhone.includes(searchTerm) ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPartner && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Closing & Gestion des Commandes</h2>
          <p className="text-xs text-emerald-300/70 mt-1">
            File de confirmation téléphonique, enregistrement des notes de closing et dispatch livreurs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
            {filteredOrders.length} commande(s) active(s)
          </span>

          <button
            onClick={() => setShowAddCloserModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+ Ajouter une Closeuse</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#091b14] border border-emerald-900/60 p-4 rounded-3xl shadow-xl">
        {/* Partner Select */}
        <div className="sm:col-span-4">
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL">🏢 Toutes les Boutiques Partenaires</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.companyName} ({p.fullName})
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div className="sm:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL">📌 Tous les Statuts</option>
            <option value="EN_ATTENTE">🟡 En attente de confirmation</option>
            <option value="CONFIRMEE">🔵 Confirmée par Closeuse</option>
            <option value="EN_COURS">🚴 En livraison coursier</option>
            <option value="LIVREE">🟢 Livrée & Encaissée</option>
            <option value="A_RAPPELER">🟠 À rappeler</option>
            <option value="REFUSEE">🔴 Refusée / Annulée</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-4 relative">
          <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher client, N°, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-white placeholder:text-emerald-500/60 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* TABLE DES COMMANDES */}
      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[850px]">
            <thead className="bg-[#0c241a] border-b border-emerald-900/80 text-emerald-400 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Réf & Boutique</th>
                <th className="py-3.5 px-5">Client & Contact</th>
                <th className="py-3.5 px-5">Destination & Articles</th>
                <th className="py-3.5 px-5">Montant COD</th>
                <th className="py-3.5 px-5">Statut Actuel</th>
                <th className="py-3.5 px-5">Suivi Closing & Livreur</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 text-emerald-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-emerald-400/60">
                    Aucune commande trouvée pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                    label: ord.status,
                    color: "text-emerald-300",
                    bg: "bg-emerald-950",
                  };

                  return (
                    <tr key={ord.id} className="hover:bg-emerald-950/40 transition-colors">
                      {/* Ref & Boutique */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-emerald-400">{ord.orderNumber}</span>
                        <p className="text-[10px] text-emerald-300/70 font-semibold mt-0.5">
                          {ord.partnerName || "Afrimarket"}
                        </p>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-5">
                        <p className="font-black text-white">{ord.clientName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${ord.clientPhone.replace(/\s+/g, "")}`}
                            className="text-[11px] font-mono text-emerald-300 hover:text-white flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{ord.clientPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${ord.clientPhone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded"
                          >
                            WA
                          </a>
                        </div>
                      </td>

                      {/* Destination & Product */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{ord.address}</span>
                        </p>
                        <p className="text-[11px] text-emerald-300/70 mt-0.5">
                          📦 {ord.products} ({ord.quantity}x)
                        </p>
                      </td>

                      {/* Montant COD */}
                      <td className="py-4 px-5">
                        <span className="font-black text-sm text-emerald-400">
                          {ord.totalPrice.toLocaleString("fr-FR")} F
                        </span>
                        <p className="text-[10px] text-emerald-500/80">Cash On Delivery</p>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-700/60 ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Note & Livreur */}
                      <td className="py-4 px-5 max-w-xs">
                        {ord.closingNotes ? (
                          <p className="text-[11px] text-emerald-200 truncate font-semibold">
                            💬 {ord.closingNotes}
                          </p>
                        ) : (
                          <span className="text-[10px] text-emerald-500/60">Pas encore qualifié</span>
                        )}
                        {ord.assignedLivreurName && (
                          <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <Bike className="w-3 h-3" />
                            <span>Coursier : {ord.assignedLivreurName}</span>
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => openCallModal(ord)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 ml-auto"
                        >
                          <Headset className="w-3.5 h-3.5" />
                          <span>Closing & Appel</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📞 MODAL DE CLOSING & APPEL CLIENT */}
      {activeCallOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Closing Téléphonique • {activeCallOrder.orderNumber}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">{activeCallOrder.clientName}</h3>
              </div>
              <button
                onClick={() => setActiveCallOrder(null)}
                className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Call & WhatsApp Shortcuts */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Numéro Client</p>
                <p className="text-sm font-mono font-black text-white">{activeCallOrder.clientPhone}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeCallOrder.clientPhone.replace(/\s+/g, "")}`}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Lancer l&apos;appel</span>
                </a>
                <a
                  href={`https://wa.me/${activeCallOrder.clientPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <form onSubmit={handleSaveCall} className="space-y-4 text-xs">
              {/* Statut suite à l'appel */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-emerald-400">Résultat de l&apos;Appel</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "CONFIRMEE", label: "✅ Confirmée (Prêt)", color: "text-emerald-300" },
                    { id: "A_RAPPELER", label: "🟠 Injoignable / Rappeler", color: "text-orange-300" },
                    { id: "EN_COURS", label: "🚴 Partir en livraison direct", color: "text-blue-300" },
                    { id: "REFUSEE", label: "❌ Commande Refusée / Fausse", color: "text-red-300" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setCallStatus(st.id as OrderStatus)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        callStatus === st.id
                          ? "bg-emerald-700/80 border-emerald-400 text-white shadow-xs"
                          : "bg-emerald-950 border-emerald-900 text-emerald-200 hover:border-emerald-700"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note de closing */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-emerald-400">Note de Closing (Visible par le Partenaire)</label>
                <textarea
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="Ex: Client confirme sa présence à domicile pour 15h30. Avoir la monnaie sur 20 000 F..."
                  rows={2}
                  className="w-full p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 placeholder:text-emerald-600"
                  required
                ></textarea>
              </div>

              {/* Attribution Livreur si Confirmée */}
              {(callStatus === "CONFIRMEE" || callStatus === "EN_COURS") && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-900">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-emerald-400">Attribuer au Livreur</label>
                    <select
                      value={assignedDriver}
                      onChange={(e) => setAssignedDriver(e.target.value)}
                      className="w-full p-2 bg-emerald-900 border border-emerald-700 rounded-xl text-xs font-bold text-white"
                    >
                      {livreurs.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.zone.split("•")[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-emerald-400">Créneau Convenu</label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder="15h00 - 17h00"
                      className="w-full p-2 bg-emerald-900 border border-emerald-700 rounded-xl text-xs font-bold text-white"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCallOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-800 text-xs font-bold text-emerald-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
                >
                  Enregistrer & Mettre à jour en Direct
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION DE NOUVELLE CLOSEUSE */}
      {showAddCloserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div>
                <h3 className="text-base font-black text-white">Enregistrer une Nouvelle Closeuse</h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">Accès au centre d&apos;appels & qualification des leads</p>
              </div>
              <button
                onClick={() => setShowAddCloserModal(false)}
                className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCloser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Nom & Prénom de la Closeuse *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Flora DOSSOU"
                  value={closerName}
                  onChange={(e) => setCloserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-emerald-400">Numéro WhatsApp / Téléphonique Professionnel *</label>
                <input
                  type="text"
                  required
                  placeholder="+229 01 97 00 00 00"
                  value={closerPhone}
                  onChange={(e) => setCloserPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCloserModal(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-xs font-bold text-emerald-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  Créer le Compte Closeuse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
