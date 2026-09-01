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
    link.setAttribute("download", `commandes-eno-livraison-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Mes Commandes</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              {filteredOrders.length} enregistrée(s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos demandes de closing, livraisons et historiques clients au Bénin avec ENO LIVRAISON.
          </p>
        </div>

        {/* Top Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#16a34a]" />
            <span>Exporter CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
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
              ? "bg-emerald-50/80 border-emerald-500 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Toutes</span>
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
        </button>

        {/* Livrées */}
        <button
          onClick={() => setSelectedStatus("LIVREE")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "LIVREE"
              ? "bg-emerald-50/80 border-emerald-500 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-1">
            <span>Livrées</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-[#16a34a]">{deliveredCount}</p>
        </button>

        {/* A Rappeler */}
        <button
          onClick={() => setSelectedStatus("A_RAPPELER")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "A_RAPPELER"
              ? "bg-amber-50/80 border-amber-500 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold mb-1">
            <span>À rappeler</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-amber-600">{recallCount}</p>
        </button>

        {/* En Cours */}
        <button
          onClick={() => setSelectedStatus("EN_COURS")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "EN_COURS"
              ? "bg-blue-50/80 border-blue-500 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold mb-1">
            <span>En cours</span>
            <Truck className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-blue-600">{inProgressCount}</p>
        </button>

        {/* Refusées */}
        <button
          onClick={() => setSelectedStatus("REFUSEE")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStatus === "REFUSEE"
              ? "bg-rose-50/80 border-rose-500 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-bold mb-1">
            <span>Refusées</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-rose-600">{refusedCount}</p>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        {/* Date Filter */}
        <div className="sm:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4 text-[#16a34a]" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4 text-[#16a34a]" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
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
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher client, téléphone, N° commande, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ORDERS DATA TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">N° Commande</th>
                <th className="py-3.5 px-4">Client & Contact</th>
                <th className="py-3.5 px-4">Adresse & Ville</th>
                <th className="py-3.5 px-4">Produits</th>
                <th className="py-3.5 px-3 text-center">Qté</th>
                <th className="py-3.5 px-4">Prix Total</th>
                <th className="py-3.5 px-4">Frais Liv. / Serv.</th>
                <th className="py-3.5 px-4">Statut Closing</th>
                <th className="py-3.5 px-4">Note Closeuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400 text-sm">
                    Aucune commande ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                    label: ord.status,
                    bg: "bg-slate-100",
                    color: "text-slate-700",
                  };
                  const isDelivered = ord.status === "LIVREE";
                  const isRecall = ord.status === "A_RAPPELER";
                  const isRefused = ord.status === "REFUSEE";

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(ord.createdAt))}
                      </td>

                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#16a34a]">{ord.orderNumber}</td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{ord.clientName}</p>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#16a34a]" />
                          {ord.clientPhone}
                        </p>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                          <span>{ord.address}</span>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4 text-slate-900 uppercase font-semibold">{ord.products}</td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-900">{ord.quantity}</td>

                      {/* Total Price */}
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                        {ord.totalPrice.toLocaleString()} F CFA
                      </td>

                      {/* Fees */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <p className="text-slate-800 font-bold">Liv: {ord.deliveryFee} F</p>
                        <p className="text-slate-500">Serv: {ord.serviceFee} F</p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border shadow-2xs ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isRecall
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : isRefused
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDelivered
                                ? "bg-emerald-500"
                                : isRecall
                                ? "bg-amber-500 animate-pulse"
                                : isRefused
                                ? "bg-rose-500"
                                : "bg-blue-500"
                            }`}
                          ></span>
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Comment */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {ord.comment ? (
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <MessageSquare className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                            <span className="truncate max-w-[200px]">{ord.comment}</span>
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
