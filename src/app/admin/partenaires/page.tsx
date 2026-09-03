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

  const handleConfirmValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerToApprove) return;

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

    setProductList((prev) => [...prev, ...newProducts]);
    setPartnerList((prev) =>
      prev.map((p) =>
        p.id === partnerToApprove.id ? { ...p, isApproved: true, isActive: true } : p
      )
    );

    setPartnerToApprove(null);
  };

  const displayedPartners = (activeTab === "actifs" ? activePartners : pendingPartners).filter(
    (p) =>
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Portefeuille E-commerçants Partenaires</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des nouvelles inscriptions, gestion des boutiques et contrôle des inventaires.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 max-w-md">
        <button
          onClick={() => setActiveTab("actifs")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "actifs"
              ? "bg-slate-900 text-white font-black shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Marchands Actifs ({activePartners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("attente")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "attente"
              ? "bg-amber-500 text-slate-950 font-black shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>En Attente ({pendingPartners.length})</span>
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedPartners.map((ptn) => {
          const partnerOrders = initialOrders.filter((o) => o.partnerId === ptn.id);
          const partnerProducts = productList.filter((p) => p.partnerId === ptn.id);
          const deliveredOrders = partnerOrders.filter((o) => o.status === "LIVREE");
          const totalSales = deliveredOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

          return (
            <div
              key={ptn.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {ptn.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{ptn.companyName}</h3>
                      <p className="text-xs text-slate-500">{ptn.fullName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ptn.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {ptn.isActive ? "Actif" : "Suspendu"}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ptn.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ptn.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ptn.address}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">Commandes</span>
                    <span className="font-bold text-slate-900">{partnerOrders.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">Articles en Stock</span>
                    <span className="font-bold text-slate-900">{partnerProducts.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={(e) => togglePartnerStatus(ptn.id, e)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  {ptn.isActive ? "Suspendre" : "Réactiver"}
                </button>

                <Link
                  href={`/admin/stocks`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-slate-700"
                >
                  <span>Gérer stocks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📝 MODAL VALIDATION ONBOARDING */}
      {partnerToApprove && (
        <div className="fixed inset-0 z-100 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Valider l&apos;E-commerçant</h3>
              <button onClick={() => setPartnerToApprove(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Activez le compte de <strong>{partnerToApprove.companyName}</strong> et enregistrez les produits initiaux déposés dans l&apos;entrepôt.
            </p>

            <form onSubmit={handleConfirmValidation} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Produits Initiaux</label>
                {productRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Nom du produit"
                      value={row.name}
                      onChange={(e) => handleUpdateProductRow(idx, "name", e.target.value)}
                      className="col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <input
                      type="number"
                      placeholder="Prix (F)"
                      value={row.price}
                      onChange={(e) => handleUpdateProductRow(idx, "price", e.target.value)}
                      className="col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      value={row.quantity}
                      onChange={(e) => handleUpdateProductRow(idx, "quantity", e.target.value)}
                      className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    {productRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProductRow(idx)}
                        className="col-span-1 text-slate-400 hover:text-rose-600 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddProductRow}
                  className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une autre ligne</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPartnerToApprove(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Valider le Marchand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
