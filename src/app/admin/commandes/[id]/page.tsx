"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Bike,
  Headset,
  Phone,
  Copy,
  Check,
  MapPin,
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BadgeDollarSign,
  TrendingUp,
  UserCheck,
  Sparkles,
  ExternalLink,
  Shield,
  FileText,
  X,
  ChevronRight,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";
import { OrderStatus } from "@/lib/types";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    orders,
    partners,
    closeuses,
    livreurs,
    updateOrderStatus,
    assignOrderToCloseuse,
    assignOrderToLivreur,
    markOrderDelivered,
    markOrderFailed,
  } = useOperations();

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showCloserModal, setShowCloserModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<OrderStatus>("CONFIRMEE");
  const [statusComment, setStatusComment] = useState("");

  const order = orders.find((o) => o.id === resolvedParams.id) || orders[0];
  const partner = partners.find((p) => p.id === order?.partnerId || p.companyName === order?.partnerName);
  const partnerOrdersCount = orders.filter((o) => o.partnerId === partner?.id || o.partnerName === order?.partnerName).length;

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm font-bold text-slate-900">Commande introuvable.</p>
        <Link href="/admin/commandes" className="text-xs text-slate-500 hover:underline mt-2 inline-block">
          ← Retour à la liste des commandes
        </Link>
      </div>
    );
  }

  // Financial breakdown calculation
  const subtotal = Math.max(0, order.totalPrice - 2000);
  const deliveryFee = 2000;
  const closingFee = 800;
  const driverShare = 1200;
  const netMerchantAmount = Math.max(0, order.totalPrice - deliveryFee - closingFee);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(order.clientPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, selectedNewStatus, statusComment);
    setShowStatusModal(false);
    setStatusComment("");
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "LIVREE":
        return { label: "Livrée & Encaissée", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "EN_COURS":
        return { label: "En Cours de Livraison", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "CONFIRMEE":
        return { label: "Confirmée (Prête)", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "A_RAPPELER":
        return { label: "À Rappeler", color: "bg-orange-100 text-orange-800 border-orange-200" };
      case "RETOURNEE":
      case "REFUSEE":
        return { label: "Retour / Refus", color: "bg-rose-100 text-rose-800 border-rose-200" };
      case "ANNULEE":
        return { label: "Annulée", color: "bg-slate-100 text-slate-700 border-slate-200" };
      case "EN_ATTENTE":
      default:
        return { label: "Nouvelle Commande", color: "bg-amber-100 text-amber-800 border-amber-200" };
    }
  };

  const badge = getStatusBadge(order.status);

  // Traceability Timeline
  const timeline = [
    {
      time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "10:32",
      title: "Commande enregistrée sur le réseau",
      author: order.partnerName || "E-commerçant",
      icon: Package,
    },
    ...(order.assignedCloseuseName
      ? [
          {
            time: "10:45",
            title: `Attribuée à la closeuse ${order.assignedCloseuseName}`,
            author: "Système Direction",
            icon: Headset,
          },
        ]
      : []),
    ...(order.status === "CONFIRMEE" || order.status === "EN_COURS" || order.status === "LIVREE"
      ? [
          {
            time: "11:18",
            title: "Client contacté et commande confirmée",
            author: order.assignedCloseuseName || "Pôle Closing",
            icon: CheckCircle2,
          },
        ]
      : []),
    ...(order.assignedLivreurName
      ? [
          {
            time: "14:30",
            title: `Colis assigné au coursier ${order.assignedLivreurName}`,
            author: "Dispatch Logistique",
            icon: Bike,
          },
        ]
      : []),
    ...(order.status === "LIVREE"
      ? [
          {
            time: order.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "16:45",
            title: `Commande livrée et ${formatCFA(order.totalPrice)} encaissés en COD`,
            author: order.assignedLivreurName || "Livreur",
            icon: BadgeDollarSign,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Top Breadcrumb & Back button */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/admin/commandes" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Toutes les Commandes</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="font-mono text-slate-900 font-bold">{order.orderNumber}</span>
      </div>

      {/* 👑 EXECUTIVE HEADER OF THE ORDER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {order.orderNumber}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enregistrée le {order.createdAt} pour <strong>{order.partnerName}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Changer Statut
          </button>

          {order.status !== "LIVREE" && (
            <button
              onClick={() => markOrderDelivered(order.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider Livraison & Encaissement</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. INFORMATIONS CLIENT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              Informations Client
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Nom & Prénom</span>
                <p className="text-sm font-bold text-slate-900">{order.clientName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Numéro de Téléphone</span>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-slate-900">{order.clientPhone}</p>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Copier le numéro"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Ville & Zone de Livraison</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.city}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Adresse & Repère</span>
                <p className="text-sm font-bold text-slate-900">{order.address}</p>
              </div>
            </div>

            {order.comment && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Instructions & Remarques :</span>
                <p className="text-slate-600">{order.comment}</p>
              </div>
            )}
          </div>

          {/* 2. PRODUITS COMMANDÉS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              Articles Commandés
            </h3>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                    <Package className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{order.products}</h4>
                    <p className="text-[11px] text-slate-400">Quantité: {order.quantity || 1}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900">{order.quantity || 1} unité(s)</span>
                  <p className="text-xs font-mono font-bold text-slate-900">{formatCFA(subtotal)}</p>
                </div>
              </div>
            </div>

            {/* 3. DÉCOMPOSITION FINANCIÈRE COMPLÈTE */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Sous-total articles</span>
                <span className="font-mono text-slate-800">{formatCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Frais de livraison standard</span>
                <span className="font-mono text-slate-800">+{formatCFA(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Prestation closing (facturée au marchand)</span>
                <span className="font-mono text-slate-800">-{formatCFA(closingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Part reversée au coursier</span>
                <span className="font-mono text-slate-800">-{formatCFA(driverShare)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
                <span>Solde net revenant à l&apos;e-commerçant</span>
                <span className="font-mono text-emerald-600">{formatCFA(netMerchantAmount)}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex justify-between items-center text-sm font-bold mt-2">
                <span>Montant Total COD à Encaisser</span>
                <span className="font-mono text-base font-black text-emerald-400">{formatCFA(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* 4. TIMELINE DE TRAÇABILITÉ IMMUABLE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              Historique & Traçabilité Immuable
            </h3>

            <div className="space-y-4 pt-1">
              {timeline.map((ev, idx) => {
                const Icon = ev.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{ev.title}</p>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{ev.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Opérateur : {ev.author}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ACTEUR 1 : CLOSEUSE */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pôle Télévente / Closeuse
              </span>
              <button
                onClick={() => setShowCloserModal(true)}
                className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
              >
                {order.assignedCloseuseName ? "Changer" : "Attribuer"}
              </button>
            </div>

            {order.assignedCloseuseName ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {order.assignedCloseuseName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{order.assignedCloseuseName}</h4>
                  <span className="text-[10px] text-emerald-700 font-semibold">Télévente assignée</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 mb-2">Aucune closeuse assignée</p>
                <button
                  onClick={() => setShowCloserModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Attribuer une Closeuse
                </button>
              </div>
            )}
          </div>

          {/* ACTEUR 2 : LIVREUR */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Flotte / Coursier Assigné
              </span>
              <button
                onClick={() => setShowDriverModal(true)}
                className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
              >
                {order.assignedLivreurName ? "Changer" : "Attribuer"}
              </button>
            </div>

            {order.assignedLivreurName ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{order.assignedLivreurName}</h4>
                  <span className="text-[10px] text-purple-700 font-semibold">{order.deliveryTimeSlot || "Créneau standard"}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 mb-2">Aucun coursier assigné</p>
                <button
                  onClick={() => setShowDriverModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Attribuer un Livreur
                </button>
              </div>
            )}
          </div>

          {/* MARCHAND PARTENAIRE */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Boutique E-commerçant
            </span>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                {(order.partnerName || "E").charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{order.partnerName}</h4>
                <p className="text-[11px] text-slate-400">{partner?.fullName || "Responsable boutique"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total commandes :</span>
              <span className="font-bold text-slate-900">{partnerOrdersCount}</span>
            </div>

            <Link
              href="/admin/partenaires"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:underline pt-1"
            >
              <span>Fiche complète partenaire</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 📝 MODAL ATTRIBUTION CLOSEUSE */}
      {showCloserModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Attribuer une Closeuse</h3>
              <button onClick={() => setShowCloserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {closeuses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    assignOrderToCloseuse(order.id, c.id);
                    setShowCloserModal(false);
                  }}
                  className="w-full p-3 rounded-2xl text-left bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.phone}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{c.conversionRate}% conversion</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📝 MODAL ATTRIBUTION LIVREUR */}
      {showDriverModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Attribuer un Coursier</h3>
              <button onClick={() => setShowDriverModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {livreurs.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    assignOrderToLivreur(order.id, l.id);
                    setShowDriverModal(false);
                  }}
                  className="w-full p-3 rounded-2xl text-left bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{l.name}</h4>
                      <p className="text-[10px] text-slate-400">Zone : {l.zone}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-700">{l.assignedOrdersCount} colis</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📝 MODAL CHANGEMENT DE STATUT */}
      {showStatusModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Mettre à Jour le Statut</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nouveau Statut</label>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value="EN_ATTENTE">Nouvelle Commande</option>
                  <option value="A_RAPPELER">À Rappeler</option>
                  <option value="CONFIRMEE">Confirmée (Prête)</option>
                  <option value="EN_COURS">En Cours de Livraison</option>
                  <option value="LIVREE">Livrée & Encaissée</option>
                  <option value="RETOURNEE">Retournée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Motif / Commentaire</label>
                <input
                  type="text"
                  placeholder="Ex: Confirmation client effectuée par téléphone"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
