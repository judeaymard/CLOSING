"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  Filter,
  MessageSquare,
  Phone,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Sparkles,
  MapPin,
} from "lucide-react";
import { orders, currentPartner } from "@/lib/mock-data";
import { ORDER_STATUS_CONFIG } from "@/lib/types";
import NewOrderModal from "@/components/dashboard/NewOrderModal";

export default function CommandesPage() {
  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status counters
  const totalCount = partnerOrders.length;
  const deliveredCount = partnerOrders.filter((o) => o.status === "LIVREE").length;
  const recallCount = partnerOrders.filter((o) => o.status === "A_RAPPELER").length;
  const inProgressCount = partnerOrders.filter((o) => o.status === "EN_COURS").length;
  const refusedCount = partnerOrders.filter((o) => o.status === "REFUSEE").length;

  const filteredOrders = partnerOrders.filter((ord) => {
    const matchesSearch =
      ord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.clientPhone.includes(searchTerm) ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || ord.status === selectedStatus;
    const matchesDate = !selectedDate || ord.createdAt.startsWith(selectedDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExportCSV = () => {
    const headers = "N° Commande,Client,Téléphone,Adresse,Produits,Quantité,Prix Total,Statut,Date\n";
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.clientName}","${o.clientPhone}","${o.address}","${o.products}",${o.quantity},${o.totalPrice},"${o.status}","${o.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `commandes-scmslivraison-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Mes Commandes</h2>
            <span className="px-3 py-1 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/30 text-[#06b6d4] text-xs font-extrabold">
              {filteredOrders.length} enregistrée(s)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos demandes de closing, livraisons et historiques clients au Bénin.
          </p>
        </div>

        {/* Top Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#06b6d4]" />
            <span>Exporter CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Commande</span>
          </button>
        </div>
      </div>

      {/* 📊 STATUS COUNTER PILLS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Tous */}
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "ALL"
              ? "bg-[#06b6d4]/15 border-[#06b6d4] shadow-lg shadow-cyan-500/10"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>Toutes</span>
            <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" />
          </div>
          <p className="text-2xl font-black text-white">{totalCount}</p>
        </button>

        {/* Livrées */}
        <button
          onClick={() => setSelectedStatus("LIVREE")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "LIVREE"
              ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
            <span>Livrées</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{deliveredCount}</p>
        </button>

        {/* A Rappeler */}
        <button
          onClick={() => setSelectedStatus("A_RAPPELER")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "A_RAPPELER"
              ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
            <span>À rappeler</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-amber-400">{recallCount}</p>
        </button>

        {/* En Cours */}
        <button
          onClick={() => setSelectedStatus("EN_COURS")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "EN_COURS"
              ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/10"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
            <span>En cours</span>
            <Truck className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-blue-400">{inProgressCount}</p>
        </button>

        {/* Refusées */}
        <button
          onClick={() => setSelectedStatus("REFUSEE")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "REFUSEE"
              ? "bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/10"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold mb-1">
            <span>Refusées</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-rose-400">{refusedCount}</p>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#090e22] border border-slate-800 p-4 rounded-3xl shadow-xl">
        {/* Date Filter */}
        <div className="sm:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#06b6d4] transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-[#06b6d4] transition-colors"
          >
            <option value="ALL">Tous les statuts de commande</option>
            <option value="LIVREE">Livrée (COD Encaissé)</option>
            <option value="A_RAPPELER">À rappeler (Relance Closeuse)</option>
            <option value="EN_COURS">En cours de livraison</option>
            <option value="CONFIRMEE">Confirmée par Téléphone</option>
            <option value="EN_ATTENTE">En attente de prise en charge</option>
            <option value="REFUSEE">Refusée client</option>
            <option value="ANNULEE">Annulée</option>
            <option value="RETOURNEE">Retournée entrepôt</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom client, téléphone, N° commande ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#06b6d4] transition-colors"
          />
        </div>
      </div>

      {/* ORDERS DATA TABLE */}
      <div className="bg-[#090e22] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto dark-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">N° Commande</th>
                <th className="py-4 px-4">Client & Contact</th>
                <th className="py-4 px-4">Adresse & Ville</th>
                <th className="py-4 px-4">Produits</th>
                <th className="py-4 px-3 text-center">Qté</th>
                <th className="py-4 px-4">Prix Total</th>
                <th className="py-4 px-4">Frais Liv. / Service</th>
                <th className="py-4 px-4">Statut Closing</th>
                <th className="py-4 px-4">Note Closeuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-500 text-sm">
                    Aucune commande ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                    label: ord.status,
                    bg: "bg-slate-800",
                    color: "text-slate-300",
                  };
                  const isDelivered = ord.status === "LIVREE";
                  const isRecall = ord.status === "A_RAPPELER";

                  return (
                    <tr key={ord.id} className="hover:bg-slate-900/60 transition-colors group">
                      {/* Date */}
                      <td className="py-4 px-4 font-bold text-slate-300">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(ord.createdAt))}
                      </td>

                      {/* Order Number */}
                      <td className="py-4 px-4 font-mono text-[#06b6d4] font-extrabold">{ord.orderNumber}</td>

                      {/* Client */}
                      <td className="py-4 px-4">
                        <p className="font-extrabold text-white">{ord.clientName}</p>
                        <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#06b6d4]" />
                          {ord.clientPhone}
                        </p>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#06b6d4] shrink-0" />
                          <span>{ord.address}</span>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="py-4 px-4 text-white uppercase font-bold">{ord.products}</td>

                      {/* Quantity */}
                      <td className="py-4 px-3 text-center font-black text-[#06b6d4]">{ord.quantity}</td>

                      {/* Total Price */}
                      <td className="py-4 px-4 font-black text-emerald-400 text-sm">
                        {ord.totalPrice.toLocaleString()} F CFA
                      </td>

                      {/* Fees */}
                      <td className="py-4 px-4 text-[11px]">
                        <p className="text-slate-300 font-bold">Liv: {ord.deliveryFee} F</p>
                        <p className="text-slate-400">Serv: {ord.serviceFee} F</p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border shadow-sm ${
                            isDelivered
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : isRecall
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDelivered ? "bg-emerald-400" : isRecall ? "bg-amber-400 animate-pulse" : "bg-blue-400"
                            }`}
                          ></span>
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Comment */}
                      <td className="py-4 px-4 text-slate-400 text-xs italic">
                        {ord.comment ? (
                          <span className="flex items-center gap-1.5 font-semibold text-slate-300 not-italic">
                            <MessageSquare className="w-3.5 h-3.5 text-[#06b6d4]" />
                            {ord.comment}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global New Order Modal */}
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
