"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  Package,
  Boxes,
  Truck,
  Search,
  Phone,
  MapPin,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { currentPartner, orders, products } from "@/lib/mock-data";
import NewOrderModal from "@/components/dashboard/NewOrderModal";

export default function DashboardOverviewPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "LIVREE" | "EN_COURS" | "A_RAPPELER">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner.id);

  // Financial calculations
  const totalDeliveredOrders = 38;
  const caTotalBrut = 358800;
  const totalFraisLogistique = 106400; // 38 livraisons * 2800 F (800 F closing + 2000 F livraison)
  const soldeNetDisponible = caTotalBrut - totalFraisLogistique; // 252 400 F

  const partnerProducts = products.filter((p) => p.partnerId === currentPartner.id);
  const totalStockWarehouse = partnerProducts.reduce((acc, p) => acc + p.remainingStock, 0);

  // Filtered orders
  const filteredOrders = partnerOrders.filter((ord) => {
    const matchesStatus = filterStatus === "ALL" || ord.status === filterStatus;
    const matchesSearch =
      ord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.clientPhone.includes(searchTerm) ||
      ord.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleQuickPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 4500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up w-full max-w-full min-w-0">
      {/* 🏛️ STRATE I : L'EN-TÊTE STATUTAIRE */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-[#EAE6DD] min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-[#787163] truncate">
            <span>Maison Partenaire</span>
            <span>•</span>
            <span className="text-[#0D5940]">Entrepôts Cotonou & Calavi</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#141A17] tracking-tight mt-1 truncate">
            {currentPartner.companyName}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#5C5649] font-medium hidden sm:inline">Stockage 100% Offert</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D5940]"></span>
          <span className="text-xs font-bold text-[#0D5940]">Actif & Garanti</span>
        </div>
      </div>

      {/* 💎 STRATE II : LE GRAND COFFRE SOUVERAIN */}
      <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(20,26,23,0.04)] relative overflow-hidden w-full min-w-0">
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D5940]"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 min-w-0">
          {/* Solde & Intitulé */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#787163]">
              Solde Net Encaissé • Prêt pour virement immédiat
            </p>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#141A17] tracking-tight">
                {soldeNetDisponible.toLocaleString("fr-FR")}
              </span>
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#0D5940] tracking-wider uppercase">
                F CFA
              </span>
            </div>
            <p className="text-xs text-[#5C5649] leading-relaxed">
              Revenu net après déduction transparente des frais ENO (2 800 F / colis livré).
            </p>
          </div>

          {/* Master Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={handleQuickPayout}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#0D5940] hover:bg-[#093D2C] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Transférer sur Mobile Money</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-[#FAF9F5] hover:bg-white text-[#141A17] border border-[#EAE6DD] font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#0D5940] shrink-0" />
              <span>Nouveau Colis</span>
            </button>
          </div>
        </div>

        {/* Payout Notification Toast */}
        {payoutRequested && (
          <div className="mt-5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#0D5940]/40 text-[#0D5940] text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Demande de reversement de 252 400 F CFA transmise. Traitement sous 30 min.</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#787163] shrink-0">MoMo MTN</span>
          </div>
        )}

        {/* Décomposition financière alignée */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#EAE6DD] w-full">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DD]/60 flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">Chiffre d&apos;Affaires Brut</p>
            <p className="text-base sm:text-lg font-black text-[#141A17] mt-1 truncate">
              {caTotalBrut.toLocaleString("fr-FR")} F CFA
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DD]/60 flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">Frais Logistique & Closing</p>
            <p className="text-base sm:text-lg font-black text-[#A84232] mt-1 truncate">
              -{totalFraisLogistique.toLocaleString("fr-FR")} F CFA
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DD]/60 flex flex-col justify-between h-full min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#787163] truncate">Compte de Réception</p>
            <p className="text-base sm:text-lg font-bold text-[#141A17] mt-1 truncate">
              MTN • +229 01 97 36 29 06
            </p>
          </div>
        </div>
      </div>

      {/* 📦 STRATE III : LE TRIPTYQUE D'ÉTAT (Aligné sur la même ligne) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
        {/* 01. Encaissé */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#787163] truncate">
              01 • Encaissé & Livré
            </span>
            <span className="text-[10px] font-bold text-[#0D5940] bg-[#FAF9F5] border border-[#EAE6DD] px-2 py-0.5 rounded-full shrink-0">
              Taux 92%
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {totalDeliveredOrders} <span className="text-xs sm:text-sm font-semibold text-[#787163]">colis</span>
            </p>
            <p className="text-[11px] sm:text-xs text-[#5C5649] mt-1 leading-normal">
              Colis remis aux acheteurs avec encaissement cash à la livraison.
            </p>
          </div>
        </div>

        {/* 02. En Transit */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#787163] truncate">
              02 • En Livraison
            </span>
            <span className="text-[10px] font-bold text-[#141A17] bg-[#FAF9F5] border border-[#EAE6DD] px-2 py-0.5 rounded-full shrink-0">
              Cotonou & Calavi
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              14 <span className="text-xs sm:text-sm font-semibold text-[#787163]">colis</span>
            </p>
            <p className="text-[11px] sm:text-xs text-[#5C5649] mt-1 leading-normal">
              Livreurs déployés sur le terrain. Closes par téléphone sous 15 min.
            </p>
          </div>
        </div>

        {/* 03. Stock Réel */}
        <div className="bg-white border border-[#EAE6DD] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#787163] truncate">
              03 • En Entrepôt
            </span>
            <span className="text-[10px] font-bold text-[#0D5940] bg-[#FAF9F5] border border-[#EAE6DD] px-2 py-0.5 rounded-full shrink-0">
              Gratuit
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#141A17] tracking-tight">
              {totalStockWarehouse} <span className="text-xs sm:text-sm font-semibold text-[#787163]">unités</span>
            </p>
            <p className="text-[11px] sm:text-xs text-[#5C5649] mt-1 leading-normal">
              Stock sécurisé sous surveillance continue dans les hangars ENO.
            </p>
          </div>
        </div>
      </div>

      {/* 📜 STRATE IV : LE LIVRE-JOURNAL DES LIVRAISONS */}
      <div className="bg-white border border-[#EAE6DD] rounded-3xl shadow-[0_2px_12px_rgba(20,26,23,0.03)] overflow-hidden w-full min-w-0">
        {/* Table Controls Header */}
        <div className="p-4 sm:p-6 border-b border-[#EAE6DD] flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-[#141A17] tracking-tight">
              Livre des Livraisons Récentes
            </h3>
            <p className="text-xs text-[#787163] mt-0.5">
              Historique en direct de vos commandes et livraisons au Bénin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto min-w-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60 min-w-0">
              <Search className="w-3.5 h-3.5 text-[#8C8474] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Chercher client, ville, N°..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs text-[#141A17] placeholder:text-[#8C8474] focus:outline-none focus:border-[#0D5940] focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#EAE6DD] shrink-0 overflow-x-auto">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === "ALL"
                    ? "bg-white text-[#141A17] shadow-2xs"
                    : "text-[#787163] hover:text-[#141A17]"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus("LIVREE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === "LIVREE"
                    ? "bg-white text-[#0D5940] shadow-2xs"
                    : "text-[#787163] hover:text-[#141A17]"
                }`}
              >
                Livrées
              </button>
              <button
                onClick={() => setFilterStatus("EN_COURS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === "EN_COURS"
                    ? "bg-white text-[#141A17] shadow-2xs"
                    : "text-[#787163] hover:text-[#141A17]"
                }`}
              >
                En route
              </button>
              <button
                onClick={() => setFilterStatus("A_RAPPELER")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === "A_RAPPELER"
                    ? "bg-white text-[#A84232] shadow-2xs"
                    : "text-[#787163] hover:text-[#141A17]"
                }`}
              >
                À rappeler
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table with safe horizontal scroll */}
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
            <thead className="bg-[#FAF9F5] border-b border-[#EAE6DD] text-[#787163] font-bold uppercase tracking-[0.15em] text-[10px]">
              <tr>
                <th className="py-3 px-5">Réf.</th>
                <th className="py-3 px-5">Client & Contact</th>
                <th className="py-3 px-5">Destination</th>
                <th className="py-3 px-5">Articles</th>
                <th className="py-3 px-5">Montant COD</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5">Note Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DD]/60 font-medium text-[#141A17]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#787163] text-xs">
                    Aucune livraison ne correspond à votre filtre.
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 8).map((ord) => {
                  const isDelivered = ord.status === "LIVREE";
                  const isRecall = ord.status === "A_RAPPELER";

                  return (
                    <tr key={ord.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                      {/* Ref */}
                      <td className="py-3.5 px-5 font-mono font-bold text-[#0D5940]">
                        {ord.orderNumber}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-5">
                        <p className="font-black text-[#141A17]">{ord.clientName}</p>
                        <a
                          href={`https://wa.me/${ord.clientPhone.replace(/\s+/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#787163] hover:text-[#0D5940] flex items-center gap-1 mt-0.5 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ord.clientPhone}</span>
                        </a>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-5 text-[#5C5649]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8C8474] shrink-0" />
                          <span>{ord.address}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-5 font-bold uppercase text-[#141A17]">
                        {ord.products} <span className="text-[#787163] font-normal">({ord.quantity}x)</span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-5 font-black text-sm text-[#141A17]">
                        {ord.totalPrice.toLocaleString("fr-FR")} F
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isDelivered
                              ? "bg-[#FAF9F5] text-[#0D5940] border-[#0D5940]/30"
                              : isRecall
                              ? "bg-[#FAF9F5] text-[#A84232] border-[#A84232]/30"
                              : "bg-[#FAF9F5] text-[#141A17] border-[#141A17]/30"
                          }`}
                        >
                          {isDelivered ? "LIVRÉE" : isRecall ? "À RAPPELER" : "EN ROUTE"}
                        </span>
                      </td>

                      {/* Comment */}
                      <td className="py-3.5 px-5 text-[#787163] text-xs">
                        {ord.comment ? (
                          <span className="truncate max-w-[180px] block font-medium text-[#5C5649]">
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

        {/* Footer Link to full orders page */}
        <div className="p-3.5 sm:p-4 bg-[#FAF9F5] border-t border-[#EAE6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#787163] font-medium">
            Affichage des livraisons actives
          </span>
          <Link
            href="/dashboard/commandes"
            className="font-bold text-[#0D5940] hover:underline flex items-center gap-1"
          >
            <span>Consulter le livre complet des livraisons</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Global New Order Modal */}
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
