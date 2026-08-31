"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Phone,
  Mail,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  BadgeDollarSign,
  Plus,
  Boxes,
  PhoneCall,
  Search,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Send,
  Sparkles,
} from "lucide-react";
import {
  partners as initialPartners,
  products as initialProducts,
  orders as initialOrders,
  formatCFA,
} from "@/lib/mock-data";
import { ORDER_STATUS_CONFIG, OrderStatus, Product, Order } from "@/lib/types";

export default function DedicatedPartnerPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = (params?.id as string) || "p1";

  const [partnersList, setPartnersList] = useState(initialPartners);
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"commandes" | "stocks" | "finances" | "profil">("commandes");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");

  const [showRestockModal, setShowRestockModal] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState("");

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const partner = partnersList.find((p) => p.id === partnerId) || partnersList[0];
  const partnerOrders = orderList.filter((o) => o.partnerId === partner.id);
  const partnerProducts = productList.filter((p) => p.partnerId === partner.id);

  // Stats
  const deliveredOrders = partnerOrders.filter((o) => o.status === "LIVREE");
  const pendingOrders = partnerOrders.filter(
    (o) => o.status === "A_RAPPELER" || o.status === "EN_ATTENTE" || o.status === "EN_COURS"
  );
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalCommissions = deliveredOrders.length * 2800; // 800F closing + 2000F delivery
  const netPayable = Math.max(0, totalRevenue - totalCommissions);

  // Add Product Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductStock) return;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: newProductName.toUpperCase(),
      price: parseInt(newProductPrice),
      initialStock: parseInt(newProductStock),
      remainingStock: parseInt(newProductStock),
      deliveredCount: 0,
      partnerId: partner.id,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProductList((prev) => [...prev, newProd]);
    setShowAddProductModal(false);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductStock("");
  };

  // Restock Handler
  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRestockModal || !restockQty) return;

    const qty = parseInt(restockQty);
    setProductList((prev) =>
      prev.map((p) =>
        p.id === showRestockModal.id
          ? {
              ...p,
              initialStock: p.initialStock + qty,
              remainingStock: p.remainingStock + qty,
            }
          : p
      )
    );
    setShowRestockModal(null);
    setRestockQty("");
  };

  // Order status updater
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = partnerOrders.filter((o) => {
    const matchesStatus = orderStatusFilter === "ALL" || o.status === orderStatusFilter;
    const matchesSearch =
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientPhone.includes(searchTerm) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 🔙 TOP BREADCRUMB & SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-900/60">
        <Link
          href="/admin/partenaires"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300/80 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la liste de toutes les boutiques
        </Link>

        {/* Quick Boutique Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-300/70 font-semibold">Changer de boutique :</span>
          <select
            value={partner.id}
            onChange={(e) => router.push(`/admin/partenaires/${e.target.value}`)}
            className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#16a34a]"
          >
            {partnersList
              .filter((p) => p.isApproved)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} ({p.fullName})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* 🏪 DEDICATED STORE HERO HEADER */}
      <div className="bg-gradient-to-r from-[#091b14] via-[#0d261c] to-[#091b14] border-2 border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Store Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#16a34a] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-600/20 shrink-0">
              {partner.companyName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {partner.companyName}
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Boutique Partenaire Active
                </span>
              </div>

              <p className="text-xs text-emerald-200/80 font-medium">
                Gérant : <span className="text-white font-bold">{partner.fullName}</span> • Inscrit depuis le{" "}
                {partner.createdAt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300/70 pt-1">
                <a
                  href={`tel:${partner.phone}`}
                  className="flex items-center gap-1.5 text-emerald-200 hover:text-emerald-300 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#25d366]" />
                  <span>{partner.phone}</span>
                </a>
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>{partner.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{partner.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </button>

            <a
              href={`https://wa.me/${partner.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-[#25d366] hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 📊 4 KPI CARDS DEDICATED TO THIS PARTNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Commandes */}
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">Commandes Totales</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{partnerOrders.length}</p>
          <p className="text-[10px] text-emerald-300/60">
            {pendingOrders.length} en cours / closing
          </p>
        </div>

        {/* Livrées avec succès */}
        <div className="bg-[#091b14] border border-emerald-800/40 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">Livrées & Encaissées</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{deliveredOrders.length}</p>
          <p className="text-[10px] text-emerald-300/60">
            Taux de succès :{" "}
            {partnerOrders.length > 0
              ? Math.round((deliveredOrders.length / partnerOrders.length) * 100)
              : 0}
            %
          </p>
        </div>

        {/* Commissions Agence ENO */}
        <div className="bg-[#091b14] border border-emerald-700/40 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">Commissions Agence</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#22c55e]">{formatCFA(totalCommissions)}</p>
          <p className="text-[10px] text-emerald-300/60">2 800 F / colis livré</p>
        </div>

        {/* Solde Net à Reverser */}
        <div className="bg-[#091b14] border border-amber-900/40 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">Solde Net Partenaire</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{formatCFA(netPayable)}</p>
          <button
            onClick={() => {
              setPayoutAmount(netPayable.toString());
              setShowPayoutModal(true);
              setPayoutSuccess(false);
            }}
            className="text-[10px] font-extrabold text-emerald-400 hover:underline"
          >
            Effectuer un reversement MoMo →
          </button>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("commandes")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "commandes"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Commandes & Closing ({partnerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stocks")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "stocks"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stocks & Produits ({partnerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("finances")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "finances"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <BadgeDollarSign className="w-4 h-4" />
          <span>Finances & Reversements</span>
        </button>

        <button
          onClick={() => setActiveTab("profil")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "profil"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profil & Paramètres</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 1: COMMANDES & CLOSING DE CETTE BOUTIQUE */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "commandes" && (
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white">
                Commandes de {partner.companyName}
              </h3>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Traitement des appels de confirmation et suivi de livraison en direct par ENO LIVRAISON.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["ALL", "A_RAPPELER", "EN_ATTENTE", "LIVREE", "CONFIRMEE"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                    orderStatusFilter === st
                      ? "bg-[#16a34a] text-white"
                      : "bg-emerald-950/60 text-emerald-300/70 hover:text-white"
                  }`}
                >
                  {st === "ALL" ? "Toutes" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
            <input
              type="text"
              placeholder="Rechercher par client, téléphone ou N°..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/50 border border-emerald-900 rounded-2xl text-xs text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a]"
            />
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-emerald-300/60 text-xs">
              Aucune commande trouvée pour cette sélection.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-900/60 text-emerald-300/70 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-bold">N° Commande</th>
                    <th className="py-3 px-4 font-bold">Client</th>
                    <th className="py-3 px-4 font-bold">Téléphone</th>
                    <th className="py-3 px-4 font-bold">Adresse / Zone</th>
                    <th className="py-3 px-4 font-bold">Produit</th>
                    <th className="py-3 px-4 font-bold">Prix Total</th>
                    <th className="py-3 px-4 font-bold">Statut</th>
                    <th className="py-3 px-4 font-bold text-right">Action Closing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40 font-medium">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-emerald-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#22c55e]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-white font-bold">{ord.clientName}</td>
                      <td className="py-3.5 px-4 text-emerald-200 font-mono">{ord.clientPhone}</td>
                      <td className="py-3.5 px-4 text-emerald-300/70">{ord.address}</td>
                      <td className="py-3.5 px-4 text-emerald-200">{ord.products}</td>
                      <td className="py-3.5 px-4 text-white font-bold">
                        {ord.totalPrice.toLocaleString("fr-FR")} F
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ORDER_STATUS_CONFIG[ord.status]?.bg || "bg-emerald-950"
                          } ${ORDER_STATUS_CONFIG[ord.status]?.color || "text-emerald-300"}`}
                        >
                          {ORDER_STATUS_CONFIG[ord.status]?.label || ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`tel:${ord.clientPhone}`}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="Appeler le client"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="px-2 py-1 bg-emerald-950 border border-emerald-800 rounded-lg text-[11px] text-white focus:outline-none focus:border-[#16a34a]"
                          >
                            <option value="A_RAPPELER">A Rappeler</option>
                            <option value="CONFIRMEE">Confirmée</option>
                            <option value="EN_COURS">En cours de livraison</option>
                            <option value="LIVREE">Livrée (Encaissée)</option>
                            <option value="REFUSEE">Refusée</option>
                            <option value="ANNULEE">Annulée</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 2: STOCKS & PRODUITS DE CETTE BOUTIQUE */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "stocks" && (
        <div className="space-y-6">
          <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white">
                Catalogue & Entrepôt de {partner.companyName}
              </h3>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Produits confiés, niveau des stocks et réapprovisionnements en temps réel.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un autre produit pour cette boutique</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-emerald-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#22c55e] uppercase">
                        Produit e-commerce
                      </span>
                      <h4 className="text-base font-black text-white">{prod.name}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-white font-bold text-xs">
                      {formatCFA(prod.price)}
                    </span>
                  </div>

                  {/* Stock Levels */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-900/60 text-center">
                    <div>
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Initial</p>
                      <p className="text-sm font-black text-white mt-0.5">{prod.initialStock}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Restant</p>
                      <p className="text-sm font-black text-emerald-400 mt-0.5">
                        {prod.remainingStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Livrés</p>
                      <p className="text-sm font-black text-[#22c55e] mt-0.5">{prod.deliveredCount}</p>
                    </div>
                  </div>

                  {/* Stock Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-emerald-300/70 font-semibold">
                      <span>Stock disponible</span>
                      <span>
                        {Math.round((prod.remainingStock / prod.initialStock) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-950">
                      <div
                        className="bg-[#16a34a] h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (prod.remainingStock / prod.initialStock) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400/60 font-mono">ID: {prod.id}</span>
                  <button
                    onClick={() => {
                      setShowRestockModal(prod);
                      setRestockQty("");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-bold flex items-center gap-1.5 border border-emerald-900/60"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>Réapprovisionner</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 3: FINANCES & REVERSEMENTS DE CETTE BOUTIQUE */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "finances" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CA Total */}
            <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-2">
              <p className="text-xs font-bold text-emerald-300/70 uppercase">Chiffre d&apos;Affaires Brut (COD)</p>
              <p className="text-3xl font-black text-white">{formatCFA(totalRevenue)}</p>
              <p className="text-[11px] text-emerald-300/60">Total encaissé lors des livraisons</p>
            </div>

            {/* Commissions ENO */}
            <div className="bg-[#091b14] border border-emerald-700/40 rounded-3xl p-6 shadow-xl space-y-2">
              <p className="text-xs font-bold text-[#22c55e] uppercase">Commissions Retenues ENO</p>
              <p className="text-3xl font-black text-[#22c55e]">{formatCFA(totalCommissions)}</p>
              <p className="text-[11px] text-emerald-300/60">
                800 F (Closing) + 2 000 F (Livraison) = 2 800 F / colis
              </p>
            </div>

            {/* Net Partenaire */}
            <div className="bg-[#091b14] border border-emerald-600/40 rounded-3xl p-6 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase">Net Reversible au Partenaire</p>
                <p className="text-3xl font-black text-emerald-400">{formatCFA(netPayable)}</p>
              </div>
              <button
                onClick={() => {
                  setPayoutAmount(netPayable.toString());
                  setShowPayoutModal(true);
                  setPayoutSuccess(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Virer par MTN / Moov MoMo</span>
              </button>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-white">Détail des commissions par commande livrée</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-900/60 text-emerald-300/70 uppercase text-[10px]">
                    <th className="py-3 px-4">Commande</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Montant Encaissé</th>
                    <th className="py-3 px-4">Frais Closing</th>
                    <th className="py-3 px-4">Frais Livraison</th>
                    <th className="py-3 px-4 text-right">Net Reversé Partenaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40 font-medium">
                  {deliveredOrders.map((ord) => {
                    const net = ord.totalPrice - 2800;
                    return (
                      <tr key={ord.id} className="hover:bg-emerald-950/30">
                        <td className="py-3 px-4 font-mono text-[#22c55e] font-bold">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-white font-bold">{ord.clientName}</td>
                        <td className="py-3 px-4 text-white">{formatCFA(ord.totalPrice)}</td>
                        <td className="py-3 px-4 text-emerald-300/70">800 F CFA</td>
                        <td className="py-3 px-4 text-emerald-300/70">2 000 F CFA</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-400">
                          {formatCFA(net)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 4: PROFIL & PARAMÈTRES DE CETTE BOUTIQUE */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "profil" && (
        <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl space-y-6">
          <h3 className="text-base font-black text-white">Coordonnées de l&apos;e-commerçant</h3>

          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300/70">Nom de la boutique</span>
              <span className="font-bold text-white text-sm">{partner.companyName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300/70">Nom du gérant</span>
              <span className="font-bold text-white text-sm">{partner.fullName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300/70">WhatsApp / Téléphone</span>
              <span className="font-bold text-[#25d366] text-sm">{partner.phone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300/70">Adresse email</span>
              <span className="font-bold text-[#22c55e] text-sm">{partner.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300/70">Ville / Zone de stockage</span>
              <span className="font-bold text-white text-sm">{partner.address}</span>
            </div>

            {partner.notes && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 space-y-1">
                <span className="text-emerald-300/70 text-[11px] font-bold uppercase">
                  Notes & Accords de partenariat
                </span>
                <p className="text-emerald-100 text-xs">{partner.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ➕ MODAL : AJOUTER UN NOUVEAU PRODUIT */}
      {/* ══════════════════════════════════════════════════════ */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Nouveau Produit Déposé</h3>
                  <p className="text-[11px] text-emerald-300/70">Pour {partner.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-emerald-300/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="text-emerald-200/80 font-bold uppercase text-[10px]">
                  Nom du produit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SERUM ANTI-TACHES 50ML"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-emerald-200/80 font-bold uppercase text-[10px]">
                    Prix de vente (F CFA)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 8500"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-emerald-200/80 font-bold uppercase text-[10px]">
                    Quantité déposée
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-200 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold shadow-md"
                >
                  Enregistrer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 📦 MODAL : RÉAPPROVISIONNER STOCK */}
      {/* ══════════════════════════════════════════════════════ */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              Réapprovisionner {showRestockModal.name}
            </h3>
            <p className="text-xs text-emerald-300/70">
              Stock actuel en rayon : <span className="text-white font-bold">{showRestockModal.remainingStock} pcs</span>
            </p>

            <form onSubmit={handleRestock} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-200/80 uppercase">
                  Quantité d&apos;unités ajoutées
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Ex: 50"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold"
                >
                  Ajouter au stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 💸 MODAL : REVERSEMENT MOBILE MONEY */}
      {/* ══════════════════════════════════════════════════════ */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              Virement Mobile Money pour {partner.companyName}
            </h3>

            {payoutSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold space-y-2 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                <p>
                  Virement de {formatCFA(parseInt(payoutAmount) || 0)} effectué avec succès au numéro {partner.phone} !
                </p>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="mt-2 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-emerald-200/80">
                  Numéro bénéficiaire : <span className="font-bold text-white">{partner.phone}</span> ({partner.fullName})
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-300/70 uppercase">
                    Montant à transférer (F CFA)
                  </label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutSuccess(true)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmer le transfert</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
