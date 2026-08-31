"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Search,
  Store,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  Package,
  Boxes,
  PhoneCall,
  Sparkles,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  partners as initialPartners,
  orders as initialOrders,
  products as initialProducts,
  formatCFA,
} from "@/lib/mock-data";
import { Partner, Product } from "@/lib/types";

export default function AdminPartenairesPage() {
  const router = useRouter();
  const [partnerList, setPartnerList] = useState<Partner[]>(initialPartners);
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"actifs" | "attente">("actifs");

  // Approval Modal State
  const [partnerToApprove, setPartnerToApprove] = useState<Partner | null>(null);
  const [productRows, setProductRows] = useState<
    { name: string; price: string; quantity: string }[]
  >([{ name: "", price: "", quantity: "" }]);

  // Add Product to existing partner modal
  const [partnerForNewProduct, setPartnerForNewProduct] = useState<Partner | null>(null);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");

  const pendingPartners = partnerList.filter((p) => !p.isApproved);
  const activePartners = partnerList.filter((p) => p.isApproved);

  const togglePartnerStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPartnerList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleAddProductRow = () => {
    setProductRows((prev) => [...prev, { name: "", price: "", quantity: "" }]);
  };

  const handleRemoveProductRow = (index: number) => {
    setProductRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProductRow = (
    index: number,
    field: "name" | "price" | "quantity",
    val: string
  ) => {
    setProductRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  // Complete Onboarding & Validation
  const handleConfirmValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerToApprove) return;

    // 1. Create products
    const newProducts: Product[] = productRows
      .filter((r) => r.name.trim() !== "")
      .map((r, idx) => ({
        id: `prod_${partnerToApprove.id}_${Date.now()}_${idx}`,
        name: r.name.toUpperCase(),
        price: parseInt(r.price) || 5000,
        initialStock: parseInt(r.quantity) || 10,
        remainingStock: parseInt(r.quantity) || 10,
        deliveredCount: 0,
        partnerId: partnerToApprove.id,
        createdAt: new Date().toISOString().split("T")[0],
      }));

    if (newProducts.length > 0) {
      setProductList((prev) => [...prev, ...newProducts]);
    }

    // 2. Approve partner
    const approvedPartnerId = partnerToApprove.id;
    setPartnerList((prev) =>
      prev.map((p) =>
        p.id === approvedPartnerId ? { ...p, isApproved: true, isActive: true } : p
      )
    );

    setPartnerToApprove(null);
    setProductRows([{ name: "", price: "", quantity: "" }]);

    // Redirect to the dedicated store view
    router.push(`/admin/partenaires/${approvedPartnerId}`);
  };

  // Add Product to existing partner
  const handleAddNewProductToExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForNewProduct || !newProdName) return;

    const newProd: Product = {
      id: `prod_${partnerForNewProduct.id}_${Date.now()}`,
      name: newProdName.toUpperCase(),
      price: parseInt(newProdPrice) || 5000,
      initialStock: parseInt(newProdStock) || 10,
      remainingStock: parseInt(newProdStock) || 10,
      deliveredCount: 0,
      partnerId: partnerForNewProduct.id,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProductList((prev) => [...prev, newProd]);
    setPartnerForNewProduct(null);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
  };

  const displayedPartners = (
    activeTab === "actifs" ? activePartners : pendingPartners
  ).filter(
    (p) =>
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 🌟 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Gestion des Boutiques E-commerce Partenaires
          </h2>
          <p className="text-xs text-emerald-300/70 mt-1">
            Gérez chaque boutique indépendamment : validation des inscriptions, dépôts de produits et suivi des commandes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
          <input
            type="text"
            placeholder="Rechercher une boutique, nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/50 border border-emerald-900 rounded-2xl text-xs text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-[#16a34a]"
          />
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3">
        <button
          onClick={() => setActiveTab("actifs")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "actifs"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Boutiques Actives ({activePartners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("attente")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "attente"
              ? "bg-[#16a34a] text-white shadow-lg shadow-emerald-600/20"
              : "bg-emerald-950/40 text-emerald-200/70 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Profils en attente de validation ({pendingPartners.length})</span>
          {pendingPartners.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 🕒 VUE : PROFILS EN ATTENTE DE VALIDATION */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "attente" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-200">
                Processus de validation d&apos;inscription ENO LIVRAISON
              </p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Dès qu&apos;un e-commerçant s&apos;inscrit sur le site, son compte est mis en attente. Contactez-le, enregistrez le ou les produits qu&apos;il dépose dans l&apos;entrepôt avec leurs quantités, puis validez son compte.
              </p>
            </div>
          </div>

          {displayedPartners.length === 0 ? (
            <div className="py-16 text-center text-emerald-300/60 text-xs bg-[#091b14] border border-emerald-900/60 rounded-3xl">
              Aucun profil en attente de validation pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedPartners.map((ptn) => (
                <div
                  key={ptn.id}
                  className="bg-[#091b14] border-2 border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-lg">
                          {ptn.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-white">{ptn.companyName}</h3>
                          <p className="text-xs text-emerald-200/80 font-semibold">{ptn.fullName}</p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        En Attente
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-emerald-200/80 pt-2 border-t border-emerald-900/60">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#25d366]" />
                        <span className="font-bold text-white">{ptn.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>{ptn.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ptn.address}</span>
                      </p>
                    </div>

                    {ptn.notes && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900/60 text-[11px] text-emerald-300/80 space-y-0.5">
                        <span className="text-[#22c55e] font-bold">Demande du commerçant :</span>
                        <p>{ptn.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-emerald-900/60 flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={`tel:${ptn.phone}`}
                      className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" /> Appeler
                    </a>

                    <button
                      onClick={() => {
                        setPartnerToApprove(ptn);
                        setProductRows([{ name: "", price: "", quantity: "" }]);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Valider & Enregistrer les produits</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 🏢 VUE : BOUTIQUES PARTENAIRES ACTIVES */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "actifs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedPartners.map((ptn) => {
            const ptnOrders = initialOrders.filter((o) => o.partnerId === ptn.id);
            const ptnDelivered = ptnOrders.filter((o) => o.status === "LIVREE");
            const ptnProducts = productList.filter((p) => p.partnerId === ptn.id);

            return (
              <div
                key={ptn.id}
                onClick={() => router.push(`/admin/partenaires/${ptn.id}`)}
                className="bg-[#091b14] border-2 border-emerald-900/60 hover:border-emerald-500 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                        {ptn.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                          {ptn.companyName}
                        </h3>
                        <p className="text-xs text-emerald-300/70 font-semibold">{ptn.fullName}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ptn.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {ptn.isActive ? "Actif" : "Suspendu"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-emerald-200/80 pt-2 border-t border-emerald-900/60">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#25d366]" />
                      <span>{ptn.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                      <span>{ptn.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ptn.address}</span>
                    </p>
                  </div>

                  {/* 3 Stats Boxes */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                    <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-900/60">
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Produits</p>
                      <p className="text-base font-black text-[#22c55e] mt-0.5">
                        {ptnProducts.length}
                      </p>
                    </div>

                    <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-900/60">
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Commandes</p>
                      <p className="text-base font-black text-white mt-0.5">{ptnOrders.length}</p>
                    </div>

                    <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-900/60">
                      <p className="text-[10px] text-emerald-300/60 font-bold uppercase">Livrées</p>
                      <p className="text-base font-black text-emerald-400 mt-0.5">
                        {ptnDelivered.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPartnerForNewProduct(ptn);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-xs font-bold text-emerald-200 hover:text-white border border-emerald-900/60 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>Nouveau produit</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => togglePartnerStatus(ptn.id, e)}
                      className={`p-2 rounded-xl text-xs font-bold ${
                        ptn.isActive
                          ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                      title={ptn.isActive ? "Suspendre" : "Activer"}
                    >
                      {ptn.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>

                    <Link
                      href={`/admin/partenaires/${ptn.id}`}
                      className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <span>Espace Dédié</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 🚀 MODAL : VALIDATION D'INSCRIPTION & PRODUITS DÉPOSÉS */}
      {/* ══════════════════════════════════════════════════════ */}
      {partnerToApprove && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center font-black text-lg">
                  {partnerToApprove.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Valider le partenariat de {partnerToApprove.companyName}
                  </h3>
                  <p className="text-xs text-emerald-300/70">
                    Gérant : {partnerToApprove.fullName} ({partnerToApprove.phone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPartnerToApprove(null)}
                className="text-emerald-300/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmValidation} className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#22c55e] uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> Produits confiés par le commerçant
                </h4>
                <p className="text-[11px] text-emerald-200/70">
                  Renseignez le(s) produit(s) physique(s) et la quantité initiale déposée dans l&apos;entrepôt ENO LIVRAISON. Vous pourrez en ajouter d&apos;autres à tout moment.
                </p>
              </div>

              {/* Product Rows */}
              <div className="space-y-3">
                {productRows.map((row, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-900/60 space-y-2.5 relative"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300/70">
                      <span>Produit #{index + 1}</span>
                      {productRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProductRow(index)}
                          className="text-rose-400 hover:text-rose-300 font-bold"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                          Nom du produit
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: SERUM HYDRATANT"
                          value={row.name}
                          onChange={(e) =>
                            handleUpdateProductRow(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-emerald-900 rounded-xl text-xs text-white focus:outline-none focus:border-[#16a34a]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                          Prix de vente (F CFA)
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Ex: 8500"
                          value={row.price}
                          onChange={(e) =>
                            handleUpdateProductRow(index, "price", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-emerald-900 rounded-xl text-xs text-white focus:outline-none focus:border-[#16a34a]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                          Quantité déposée
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Ex: 100"
                          value={row.quantity}
                          onChange={(e) =>
                            handleUpdateProductRow(index, "quantity", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-emerald-900 rounded-xl text-xs text-white focus:outline-none focus:border-[#16a34a]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddProductRow}
                  className="w-full py-2.5 rounded-xl border border-dashed border-emerald-700/60 hover:border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Ajouter un autre produit pour cette boutique</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPartnerToApprove(null)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Valider l&apos;inscription & Ouvrir la boutique</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ➕ MODAL : NOUVEAU PRODUIT POUR PARTENAIRE EXISTANT */}
      {/* ══════════════════════════════════════════════════════ */}
      {partnerForNewProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091b14] border border-emerald-900 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              Nouveau produit pour {partnerForNewProduct.companyName}
            </h3>

            <form onSubmit={handleAddNewProductToExisting} className="space-y-3.5 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                  Nom du nouveau produit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ÉCOUTEURS SANS FIL V2"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                    Prix de vente (F CFA)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 12000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-200/70 font-bold uppercase">
                    Quantité déposée
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPartnerForNewProduct(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-200 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md"
                >
                  Enregistrer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
