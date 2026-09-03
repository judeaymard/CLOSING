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
  Package,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { OrderStatus, ORDER_STATUS_CONFIG } from "@/lib/types";
import { formatCFA } from "@/lib/mock-data";

export default function AdminCommandesPage() {
  const {
    orders,
    partners,
    livreurs,
    closeuses,
    logClosingCall,
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
  const [closerEmail, setCloserEmail] = useState("");
  const [closerPhone, setCloserPhone] = useState("+229 01 ");
  const [createdCloserInfo, setCreatedCloserInfo] = useState<{ name: string; email: string; code: string } | null>(null);

  const handleCreateCloser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closerName || !closerPhone || !closerEmail) return;
    const created = addCloseuse({ name: closerName, email: closerEmail, phone: closerPhone });
    setCreatedCloserInfo({
      name: created.name,
      email: created.email,
      code: created.temporaryCode || "315792",
    });
    setCloserName("");
    setCloserEmail("");
    setCloserPhone("+229 01 ");
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
      ord.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPartner && matchesStatus && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === "EN_ATTENTE").length;
  const callbackCount = orders.filter((o) => o.status === "A_RAPPELER").length;
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMEE").length;
  const inDeliveryCount = orders.filter((o) => o.status === "EN_COURS").length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Opérations & Closing des Commandes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            File de traitement, confirmation par télévente et dispatch vers les livreurs de zone.
          </p>
        </div>

        <button
          onClick={() => setShowAddCloserModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Closeuse</span>
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase">À Confirmer (Nouveau)</span>
          <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-orange-700 uppercase">Clients à Rappeler</span>
          <p className="text-2xl font-black text-slate-900">{callbackCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-blue-700 uppercase">Confirmées (Prêtes)</span>
          <p className="text-2xl font-black text-slate-900">{confirmedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-purple-700 uppercase">En Cours Livraison</span>
          <p className="text-2xl font-black text-slate-900">{inDeliveryCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
        <div className="sm:col-span-4">
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
          >
            <option value="ALL">Toutes les Boutiques Partenaires</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.companyName} ({p.fullName})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="EN_ATTENTE">En attente de confirmation</option>
            <option value="CONFIRMEE">Confirmée par Closeuse</option>
            <option value="EN_COURS">En livraison coursier</option>
            <option value="LIVREE">Livrée & Encaissée</option>
            <option value="A_RAPPELER">À rappeler</option>
            <option value="REFUSEE">Refusée / Annulée</option>
          </select>
        </div>

        <div className="sm:col-span-4 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher client, N°, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[850px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Réf & Boutique</th>
                <th className="py-3.5 px-5">Client & Contact</th>
                <th className="py-3.5 px-5">Destination & Articles</th>
                <th className="py-3.5 px-5">Montant COD</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5">Closing & Livreur</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Aucune commande trouvée pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                    label: ord.status,
                    color: "text-slate-700",
                    bg: "bg-slate-100",
                  };

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{ord.partnerName || "Afrimarket"}</div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{ord.clientName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{ord.clientPhone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">{ord.products}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{ord.city} • {ord.address}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-mono font-black text-slate-900">{formatCFA(ord.totalPrice)}</div>
                        <div className="text-[10px] text-slate-400">Dont 2 800 F Prestation</div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <Headset className="w-3 h-3 text-slate-400" />
                          <span>{ord.assignedCloseuseName || "Non assigné"}</span>
                        </div>
                        {ord.assignedLivreurName && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Bike className="w-3 h-3 text-slate-400" />
                            <span>{ord.assignedLivreurName}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => openCallModal(ord)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Closing & Livreur</span>
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

      {/* 📞 MODAL DE CLOSING & ATTRIBUTION LIVREUR */}
      {activeCallOrder && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Closing Téléphonique</h3>
                <p className="text-xs text-slate-500">Commande {activeCallOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setActiveCallOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-900">Client : {activeCallOrder.clientName}</p>
              <p className="text-slate-600">Téléphone : <strong>{activeCallOrder.clientPhone}</strong></p>
              <p className="text-slate-600">Articles : {activeCallOrder.products} ({formatCFA(activeCallOrder.totalPrice)})</p>
              <p className="text-slate-600">Ville : {activeCallOrder.city} • {activeCallOrder.address}</p>
            </div>

            <form onSubmit={handleSaveCall} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issue de l&apos;Appel</label>
                <select
                  value={callStatus}
                  onChange={(e) => setCallStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value="CONFIRMEE">🟢 Confirmée — Prête pour livraison</option>
                  <option value="A_RAPPELER">🟠 À rappeler (Injoignable / Occupé)</option>
                  <option value="REFUSEE">🔴 Refusée par le client</option>
                  <option value="ANNULEE">⚪ Annulée</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes du Closing</label>
                <textarea
                  rows={2}
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="Ex: Client disponible de 14h à 16h au carrefour IITA..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              {(callStatus === "CONFIRMEE" || callStatus === "EN_COURS") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Livreur Assigné</label>
                    <select
                      value={assignedDriver}
                      onChange={(e) => setAssignedDriver(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    >
                      {livreurs.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Créneau Horaire</label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCallOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Enregistrer & Assigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎧 MODAL AJOUT CLOSEUSE */}
      {showAddCloserModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Ajouter une Opératrice Télévente</h3>
              <button onClick={() => setShowAddCloserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdCloserInfo ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="text-xs font-bold text-emerald-900">Opératrice créée avec succès !</p>
                <p className="text-xs text-emerald-800">
                  Transmettez ce code d&apos;activation temporaire à <strong>{createdCloserInfo.name}</strong> :
                </p>
                <div className="text-xl font-mono font-black text-emerald-900 bg-white p-3 rounded-xl border border-emerald-300 text-center tracking-widest">
                  {createdCloserInfo.code}
                </div>
                <button
                  onClick={() => {
                    setCreatedCloserInfo(null);
                    setShowAddCloserModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer mt-2"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateCloser} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={closerName}
                    onChange={(e) => setCloserName(e.target.value)}
                    placeholder="Ex: Flora AGBODJAN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={closerEmail}
                    onChange={(e) => setCloserEmail(e.target.value)}
                    placeholder="flora@eno-livraison.bj"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Numéro Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={closerPhone}
                    onChange={(e) => setCloserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCloserModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Créer l&apos;accès
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
