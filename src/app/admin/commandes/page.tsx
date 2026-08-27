"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  User,
  Plus,
  Send,
  Store,
  ArrowRight,
} from "lucide-react";
import { orders as initialOrders, partners } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";

export default function AdminCommandesPage() {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState("");

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            deliveredAt: newStatus === "LIVREE" ? new Date().toISOString() : ord.deliveredAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
  };

  const handleSaveComment = (orderId: string) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            comment: tempComment.toUpperCase(),
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    setEditingCommentId(null);
    setTempComment("");
  };

  const filteredOrders = ordersList.filter((ord) => {
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
          <p className="text-xs text-slate-400 mt-1">
            Interface de confirmation téléphonique et assignation aux livreurs pour l&apos;ensemble des boutiques.
          </p>
        </div>

        {selectedPartner !== "ALL" && (
          <Link
            href={`/admin/partenaires/${selectedPartner}`}
            className="px-4 py-2 rounded-xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Store className="w-4 h-4" />
            <span>Ouvrir l&apos;espace dédié de cette boutique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#090e22] border border-slate-800 p-4 rounded-3xl shadow-xl">
        {/* Partner Select */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Building className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-[#06b6d4]"
          >
            <option value="ALL">Toutes les Boutiques E-commerce</option>
            {partners
              .filter((p) => p.isApproved)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} ({p.fullName})
                </option>
              ))}
          </select>
        </div>

        {/* Status Select */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-[#06b6d4]"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="A_RAPPELER">A rappeler (Urgent)</option>
            <option value="EN_ATTENTE">En attente d&apos;appel</option>
            <option value="CONFIRMEE">Confirmée par la closeuse</option>
            <option value="EN_COURS">En cours de livraison</option>
            <option value="LIVREE">Livrée avec succès</option>
            <option value="REFUSEE">Refusée par le client</option>
            <option value="ANNULEE">Annulée</option>
            <option value="RETOURNEE">Retournée</option>
          </select>
        </div>

        {/* Search */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un client, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#06b6d4]"
          />
        </div>
      </div>

      {/* ORDERS LIST / CLOSING CARDS */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#090e22] border border-slate-800 p-12 rounded-3xl text-center text-slate-500 text-sm">
            Aucune commande ne correspond aux filtres.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const partner = partners.find((p) => p.id === ord.partnerId);
            const isEditingThisComment = editingCommentId === ord.id;

            return (
              <div
                key={ord.id}
                className="bg-[#090e22] border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  {/* Client & Partner info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-white">{ord.clientName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[11px]">
                        {ord.orderNumber}
                      </span>
                      {partner && (
                        <Link
                          href={`/admin/partenaires/${partner.id}`}
                          className="px-2.5 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] hover:underline text-[10px] font-bold border border-[#06b6d4]/30"
                        >
                          Boutique: {partner.companyName}
                        </Link>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                      <span>📍 {ord.address}</span>
                      <span>📦 {ord.products} (Qté: {ord.quantity})</span>
                      <span className="text-white font-bold">💰 {ord.totalPrice.toLocaleString("fr-FR")} F CFA</span>
                    </p>
                  </div>

                  {/* Direct Call & WhatsApp Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${ord.clientPhone}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Appeler ({ord.clientPhone})
                    </a>

                    <a
                      href={`https://wa.me/229${ord.clientPhone.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#25d366]/20 border border-[#25d366]/30 hover:bg-[#25d366]/30 text-[#25d366] text-xs font-bold flex items-center gap-2 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* CLOSING CONTROL BAR */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Status Dropdown */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                      Statut :
                    </label>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider focus:outline-none transition-all cursor-pointer ${
                        ord.status === "LIVREE"
                          ? "bg-emerald-600 text-white"
                          : ord.status === "A_RAPPELER"
                          ? "bg-amber-500 text-white"
                          : ord.status === "EN_COURS"
                          ? "bg-blue-600 text-white"
                          : ord.status === "CONFIRMEE"
                          ? "bg-[#06b6d4] text-white"
                          : ord.status === "EN_ATTENTE"
                          ? "bg-yellow-600 text-white"
                          : ord.status === "REFUSEE"
                          ? "bg-rose-600 text-white"
                          : ord.status === "RETOURNEE"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      <option value="EN_ATTENTE">🟡 EN ATTENTE D&apos;APPEL</option>
                      <option value="A_RAPPELER">🟠 A RAPPELER</option>
                      <option value="CONFIRMEE">🔵 CONFIRMÉE</option>
                      <option value="EN_COURS">🚚 EN COURS DE LIVRAISON</option>
                      <option value="LIVREE">🟢 LIVRÉE</option>
                      <option value="REFUSEE">🔴 REFUSÉE</option>
                      <option value="ANNULEE">⚪ ANNULÉE</option>
                      <option value="RETOURNEE">🟣 RETOURNÉE</option>
                    </select>
                  </div>

                  {/* Comment Field (Inline Editing) */}
                  <div className="md:col-span-8">
                    {isEditingThisComment ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempComment}
                          onChange={(e) => setTempComment(e.target.value)}
                          placeholder="Note de closing (ex: ELLE A ETE LIVREE, CLIENT OCCUPÉ)..."
                          className="w-full px-3 py-2 bg-slate-900 border border-[#06b6d4] rounded-xl text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveComment(ord.id)}
                          className="p-2 rounded-xl bg-[#06b6d4] hover:bg-cyan-600 text-white shrink-0"
                          title="Enregistrer note"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingCommentId(ord.id);
                          setTempComment(ord.comment || "");
                        }}
                        className="p-2 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 flex items-center justify-between cursor-pointer group"
                      >
                        <span className="font-semibold uppercase truncate">
                          💬 {ord.comment || "Ajouter une note de closing..."}
                        </span>
                        <span className="text-[10px] text-[#06b6d4] group-hover:underline shrink-0 ml-2">
                          Modifier
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
