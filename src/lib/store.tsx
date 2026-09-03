"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Order,
  Partner,
  Product,
  LivreurProfile,
  CloseuseProfile,
  PayoutRequest,
  PayoutOperator,
  UserRole,
  OrderStatus,
} from "./types";
import {
  orders as initialOrders,
  partners as initialPartners,
  products as initialProducts,
  livreurs as initialLivreurs,
  closeuses as initialCloseuses,
  initialPayoutRequests,
  currentPartner,
} from "./mock-data";

interface OperationsContextType {
  // Entités & Données
  orders: Order[];
  partners: Partner[];
  products: Product[];
  livreurs: LivreurProfile[];
  closeuses: CloseuseProfile[];
  payoutRequests: PayoutRequest[];

  // Session & Rôles
  currentRole: UserRole;
  activeLivreurId: string;
  activeCloseuseId: string;
  activePartnerId: string;
  activeLivreur: LivreurProfile;
  activeCloseuse: CloseuseProfile;
  activePartner: Partner;

  // Actions
  switchRole: (role: UserRole, specificId?: string) => void;
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, comment?: string) => void;
  logClosingCall: (
    orderId: string,
    note: string,
    newStatus: OrderStatus,
    assignedLivreurId?: string,
    deliveryTimeSlot?: string
  ) => void;
  assignOrderToLivreur: (orderId: string, livreurId: string) => void;
  markOrderDelivered: (orderId: string) => void;
  markOrderFailed: (orderId: string, reason: string) => void;
  requestPayout: (
    amount: number,
    operator: PayoutOperator,
    phone: string,
    countryCode?: string,
    cryptoAddress?: string,
    cryptoNetwork?: string
  ) => PayoutRequest;
  addLivreur: (data: { name: string; email: string; phone: string; zone: string; vehicle: string }) => LivreurProfile;
  addCloseuse: (data: { name: string; email: string; phone: string }) => CloseuseProfile;
  changePassword: (newPassword: string) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [livreurs, setLivreurs] = useState<LivreurProfile[]>(initialLivreurs);
  const [closeuses, setCloseuses] = useState<CloseuseProfile[]>(initialCloseuses);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(initialPayoutRequests);

  // Session State
  const [currentRole, setCurrentRole] = useState<UserRole>("PDG");
  const [activeLivreurId, setActiveLivreurId] = useState<string>("liv-1");
  const [activeCloseuseId, setActiveCloseuseId] = useState<string>("cls-1");
  const [activePartnerId, setActivePartnerId] = useState<string>("p1");

  // Rôle Switcher
  const switchRole = (role: UserRole, specificId?: string) => {
    setCurrentRole(role);
    if (role === "LIVREUR" && specificId) setActiveLivreurId(specificId);
    if (role === "CLOSEUSE" && specificId) setActiveCloseuseId(specificId);
    if (role === "PARTNER" && specificId) setActivePartnerId(specificId);
  };

  // 1. Création de Commande par un Partenaire
  const createOrder = (orderData: Partial<Order>): Order => {
    const partner = partners.find((p) => p.id === activePartnerId) || currentPartner;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let rand = "";
    for (let i = 0; i < 6; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `CMD-BJ${rand}`,
      clientName: orderData.clientName || "Nouveau Client",
      clientPhone: orderData.clientPhone || "+229 01 00 00 00",
      region: orderData.region || "Littoral",
      address: orderData.address || "Cotonou",
      city: orderData.city || "Cotonou",
      products: orderData.products || "Article",
      quantity: orderData.quantity || 1,
      totalPrice: orderData.totalPrice || 10000,
      deliveryFee: 2000,
      serviceFee: 800,
      status: "EN_ATTENTE",
      comment: orderData.comment || "Nouvelle commande e-commerçant transmise à l'agence",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partnerId: partner.id,
      partnerName: partner.companyName,
      callCount: 0,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // 2. Mise à jour de Statut Simple
  const updateOrderStatus = (orderId: string, status: OrderStatus, comment?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              comment: comment || o.comment,
              updatedAt: new Date().toISOString(),
              deliveredAt: status === "LIVREE" ? new Date().toISOString() : o.deliveredAt,
              codCollected: status === "LIVREE" ? true : o.codCollected,
            }
          : o
      )
    );
  };

  // 3. Journal d'appel & Qualification par une Closeuse
  const logClosingCall = (
    orderId: string,
    note: string,
    newStatus: OrderStatus,
    assignedLivreurId?: string,
    deliveryTimeSlot?: string
  ) => {
    const closeuse = closeuses.find((c) => c.id === activeCloseuseId);
    const livreur = livreurs.find((l) => l.id === assignedLivreurId);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: newStatus,
          closingNotes: note,
          assignedCloseuseId: closeuse?.id || o.assignedCloseuseId,
          assignedCloseuseName: closeuse?.name || o.assignedCloseuseName,
          assignedLivreurId: assignedLivreurId || o.assignedLivreurId,
          assignedLivreurName: livreur?.name || o.assignedLivreurName,
          deliveryTimeSlot: deliveryTimeSlot || o.deliveryTimeSlot,
          callCount: (o.callCount || 0) + 1,
          updatedAt: new Date().toISOString(),
          comment: `[${closeuse?.name || "Closeuse"}] ${note}`,
        };
      })
    );

    // Mettre à jour les stats de la closeuse
    setCloseuses((prev) =>
      prev.map((c) =>
        c.id === activeCloseuseId
          ? {
              ...c,
              callsTodayCount: c.callsTodayCount + 1,
              confirmedTodayCount:
                newStatus === "CONFIRMEE" || newStatus === "EN_COURS"
                  ? c.confirmedTodayCount + 1
                  : c.confirmedTodayCount,
            }
          : c
      )
    );
  };

  // 4. Attribution de Commande à un Livreur
  const assignOrderToLivreur = (orderId: string, livreurId: string) => {
    const livreur = livreurs.find((l) => l.id === livreurId);
    if (!livreur) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedLivreurId: livreur.id,
              assignedLivreurName: livreur.name,
              status: "EN_COURS",
              updatedAt: new Date().toISOString(),
              comment: `Attribué au coursier ${livreur.name} (${livreur.zone})`,
            }
          : o
      )
    );

    setLivreurs((prev) =>
      prev.map((l) =>
        l.id === livreurId
          ? { ...l, assignedOrdersCount: l.assignedOrdersCount + 1 }
          : l
      )
    );
  };

  // 5. Validation de Livraison & Encaissement COD par le Livreur
  const markOrderDelivered = (orderId: string) => {
    let orderPrice = 0;
    let targetLivreurId = activeLivreurId;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          orderPrice = o.totalPrice;
          targetLivreurId = o.assignedLivreurId || activeLivreurId;
          return {
            ...o,
            status: "LIVREE",
            deliveredAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            codCollected: true,
            comment: "Colis livré et montant COD encaissé avec succès par le livreur.",
          };
        }
        return o;
      })
    );

    // Mettre à jour la caisse et le compteur du livreur
    setLivreurs((prev) =>
      prev.map((l) =>
        l.id === targetLivreurId
          ? {
              ...l,
              deliveredTodayCount: l.deliveredTodayCount + 1,
              cashCollectedToday: l.cashCollectedToday + orderPrice,
            }
          : l
      )
    );
  };

  // 6. Échec / Report de Livraison par le Livreur
  const markOrderFailed = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "A_RAPPELER",
              updatedAt: new Date().toISOString(),
              comment: `[Rapport Livreur] ${reason}`,
            }
          : o
      )
    );
  };

  // 7. Demande de Retrait par le Partenaire (Mobile Money ou Crypto USDT / Binance Pay)
  const requestPayout = (
    amount: number,
    operator: PayoutOperator,
    phone: string,
    countryCode: string = "+229",
    cryptoAddress?: string,
    cryptoNetwork?: string
  ): PayoutRequest => {
    const partner = partners.find((p) => p.id === activePartnerId) || currentPartner;
    const estUsdt = Math.round((amount / 600) * 100) / 100;

    const newPayout: PayoutRequest = {
      id: `pay-${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.companyName,
      amount,
      operator,
      phone,
      countryCode,
      cryptoAddress,
      cryptoNetwork: cryptoNetwork || (operator === "USDT_TRC20" ? "TRC-20 (Tron)" : operator === "BINANCE_PAY" ? "Binance Pay" : undefined),
      cryptoEstimatedUsdt: operator.includes("USDT") || operator.includes("BINANCE") ? estUsdt : undefined,
      requestedAt: new Date().toISOString(),
      status: "PENDING",
    };

    setPayoutRequests((prev) => [newPayout, ...prev]);
    return newPayout;
  };

  // 8. Approbation de Retrait par le PDG
  const approvePayout = (payoutId: string) => {
    const randTx = `TX-ENO-${Math.floor(100000 + Math.random() * 900000)}`;
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "APPROVED",
              approvedAt: new Date().toISOString(),
              txReference: randTx,
            }
          : p
      )
    );
  };

  // 9. Rejet de Retrait par le PDG
  const rejectPayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "REJECTED",
              approvedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  // 10. Ajout d'un Livreur par le PDG avec code d'activation email
  const addLivreur = (data: { name: string; email: string; phone: string; zone: string; vehicle: string }): LivreurProfile => {
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newLivreur: LivreurProfile = {
      id: `liv-${Date.now()}`,
      name: data.name.toUpperCase(),
      email: data.email,
      phone: data.phone,
      zone: data.zone,
      vehicle: data.vehicle,
      isActive: true,
      mustChangePassword: true,
      temporaryCode: tempCode,
      assignedOrdersCount: 0,
      deliveredTodayCount: 0,
      cashCollectedToday: 0,
    };
    setLivreurs((prev) => [...prev, newLivreur]);
    return newLivreur;
  };

  // 11. Ajout d'une Closeuse par le PDG avec code d'activation email
  const addCloseuse = (data: { name: string; email: string; phone: string }): CloseuseProfile => {
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newCloseuse: CloseuseProfile = {
      id: `cls-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      isActive: true,
      mustChangePassword: true,
      temporaryCode: tempCode,
      callsTodayCount: 0,
      confirmedTodayCount: 0,
      conversionRate: 0,
    };
    setCloseuses((prev) => [...prev, newCloseuse]);
    return newCloseuse;
  };

  // 12. Changement de mot de passe obligatoire lors de la 1ère connexion
  const changePassword = (_newPassword: string) => {
    if (currentRole === "LIVREUR") {
      setLivreurs((prev) =>
        prev.map((l) =>
          l.id === activeLivreurId
            ? { ...l, mustChangePassword: false, temporaryCode: undefined }
            : l
        )
      );
    } else if (currentRole === "CLOSEUSE") {
      setCloseuses((prev) =>
        prev.map((c) =>
          c.id === activeCloseuseId
            ? { ...c, mustChangePassword: false, temporaryCode: undefined }
            : c
        )
      );
    }
  };

  const activeLivreur = livreurs.find((l) => l.id === activeLivreurId) || livreurs[0];
  const activeCloseuse = closeuses.find((c) => c.id === activeCloseuseId) || closeuses[0];
  const activePartner = partners.find((p) => p.id === activePartnerId) || currentPartner;

  return (
    <OperationsContext.Provider
      value={{
        orders,
        partners,
        products,
        livreurs,
        closeuses,
        payoutRequests,
        currentRole,
        activeLivreurId,
        activeCloseuseId,
        activePartnerId,
        activeLivreur,
        activeCloseuse,
        activePartner,
        switchRole,
        createOrder,
        updateOrderStatus,
        logClosingCall,
        assignOrderToLivreur,
        markOrderDelivered,
        markOrderFailed,
        requestPayout,
        addLivreur,
        addCloseuse,
        changePassword,
        approvePayout,
        rejectPayout,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error("useOperations must be used within an OperationsProvider");
  }
  return context;
}
