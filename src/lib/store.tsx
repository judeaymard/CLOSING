"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  orders as initialOrders,
  partners as initialPartners,
  products as initialProducts,
  livreurs as initialLivreurs,
  closeuses as initialCloseuses,
  initialPayoutRequests,
  initialAgencyPulseActivities,
  initialConversations,
  initialAgencyAlerts,
  currentPartner,
} from "./mock-data";
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
  Conversation,
  ActivityItem,
  AgencyAlert,
  PeriodFilter,
  ChatMessage,
  AssignmentConfig,
  AssignmentLog,
  AssignmentMode,
  LivreurStatus,
} from "./types";

interface OperationsContextType {
  // Entités & Données
  orders: Order[];
  partners: Partner[];
  products: Product[];
  livreurs: LivreurProfile[];
  closeuses: CloseuseProfile[];
  payoutRequests: PayoutRequest[];
  conversations: Conversation[];
  activities: ActivityItem[];
  alerts: AgencyAlert[];
  period: PeriodFilter;

  // Automatisation des Attributions
  assignmentConfig: AssignmentConfig;
  assignmentLogs: AssignmentLog[];
  closerAvailability: Record<string, "AVAILABLE" | "BUSY" | "UNAVAILABLE">;

  // Session & Rôles
  currentRole: UserRole;
  activeLivreurId: string;
  activeCloseuseId: string;
  activePartnerId: string;
  activeLivreur: LivreurProfile;
  activeCloseuse: CloseuseProfile;
  activePartner: Partner;

  // Actions
  setPeriod: (period: PeriodFilter) => void;
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
  assignOrderToCloseuse: (orderId: string, closeuseId: string) => void;
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
  addLivreur: (data: {
    name: string;
    email: string;
    phone: string;
    zone: string;
    secondaryZones?: string[];
    vehicle: string;
    licensePlate?: string;
    maxActiveCapacity?: number;
    commissionPerDelivery?: number;
    availabilityStatus?: LivreurStatus;
  }) => LivreurProfile;
  updateLivreurAvailability: (livreurId: string, status: LivreurStatus) => void;
  updateLivreur: (livreurId: string, data: Partial<LivreurProfile>) => void;
  reassignLivreurOrders: (fromLivreurId: string, toLivreurId: string) => void;
  addCloseuse: (data: { name: string; email: string; phone: string }) => CloseuseProfile;
  changePassword: (newPassword: string) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string) => void;
  sendConversationMessage: (convId: string, text: string, isInternalNote?: boolean) => void;
  assignConversation: (convId: string, agentName: string, agentRole: string) => void;
  resolveAlert: (alertId: string) => void;

  // Méthodes d'Automatisation
  updateAssignmentConfig: (newConfig: Partial<AssignmentConfig>) => void;
  updateCloserAvailability: (closerId: string, status: "AVAILABLE" | "BUSY" | "UNAVAILABLE") => void;
  simulateAssignment: (type: "ORDER" | "CONVERSATION") => {
    winner: CloseuseProfile | null;
    reason: string;
    modeUsed: AssignmentMode;
    breakdown: { closer: CloseuseProfile; load: number; status: string; eligible: boolean }[];
  };
  triggerAutoAssignItem: (itemId: string, type: "ORDER" | "CONVERSATION") => boolean;
}

const initialAssignmentConfig: AssignmentConfig = {
  ordersMode: "SMART_AUTO",
  conversationsMode: "SMART_AUTO",
  maxCapacityPerCloser: 15,
  autoRedistribute: true,
  redistributeTimeoutMinutes: 30,
  prioritizeUrgent: true,
  notifyOnAssign: true,
  useRoundRobinOnTie: true,
  queueUnassigned: true,
};

const initialAssignmentLogs: AssignmentLog[] = [
  {
    id: "log-1",
    timestamp: "11:42",
    itemType: "ORDER",
    itemRef: "CMD-2458",
    assignedToCloserName: "Marie Dossou",
    assignedToCloserId: "cls-2",
    modeUsed: "SMART_AUTO",
    reason: "Charge active la plus faible (4 commandes)",
    success: true,
  },
  {
    id: "log-2",
    timestamp: "11:15",
    itemType: "CONVERSATION",
    itemRef: "Dossou Fashion",
    assignedToCloserName: "Sarah K.",
    assignedToCloserId: "cls-1",
    modeUsed: "SMART_AUTO",
    reason: "Égalité de charge, rotation Round Robin appliquée",
    success: true,
  },
  {
    id: "log-3",
    timestamp: "10:30",
    itemType: "ORDER",
    itemRef: "CMD-20412",
    assignedToCloserName: "Carine A.",
    assignedToCloserId: "cls-3",
    modeUsed: "SMART_AUTO",
    reason: "Rotation équitable début de journée",
    success: true,
  },
];

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [livreurs, setLivreurs] = useState<LivreurProfile[]>(initialLivreurs);
  const [closeuses, setCloseuses] = useState<CloseuseProfile[]>(initialCloseuses);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(initialPayoutRequests);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activities, setActivities] = useState<ActivityItem[]>(initialAgencyPulseActivities);
  const [alerts, setAlerts] = useState<AgencyAlert[]>(initialAgencyAlerts);
  const [period, setPeriod] = useState<PeriodFilter>("TODAY");

  // Automatisation State
  const [assignmentConfig, setAssignmentConfig] = useState<AssignmentConfig>(initialAssignmentConfig);
  const [assignmentLogs, setAssignmentLogs] = useState<AssignmentLog[]>(initialAssignmentLogs);
  const [closerAvailability, setCloserAvailability] = useState<Record<string, "AVAILABLE" | "BUSY" | "UNAVAILABLE">>({
    "cls-1": "AVAILABLE",
    "cls-2": "AVAILABLE",
    "cls-3": "AVAILABLE",
  });
  const [roundRobinPointer, setRoundRobinPointer] = useState<number>(0);

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

  // Helper: compute active load for a closer
  const getCloserActiveLoad = (closerId: string, closerName: string) => {
    return orders.filter(
      (o) =>
        (o.assignedCloseuseId === closerId || o.assignedCloseuseName === closerName) &&
        (o.status === "EN_ATTENTE" || o.status === "A_RAPPELER" || o.status === "CONFIRMEE")
    ).length;
  };

  // 1. Mise à jour de la configuration d'attribution
  const updateAssignmentConfig = (newConfig: Partial<AssignmentConfig>) => {
    setAssignmentConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // 2. Mise à jour de la disponibilité d'une closeuse
  const updateCloserAvailability = (closerId: string, status: "AVAILABLE" | "BUSY" | "UNAVAILABLE") => {
    setCloserAvailability((prev) => ({ ...prev, [closerId]: status }));
  };

  // 3. Simulateur d'attribution algorithmique 4 étapes
  const simulateAssignment = (
    type: "ORDER" | "CONVERSATION"
  ): {
    winner: CloseuseProfile | null;
    reason: string;
    modeUsed: AssignmentMode;
    breakdown: { closer: CloseuseProfile; load: number; status: string; eligible: boolean }[];
  } => {
    const mode: AssignmentMode = type === "ORDER" ? assignmentConfig.ordersMode : assignmentConfig.conversationsMode;

    if (mode === "MANUAL") {
      return {
        winner: null,
        reason: "Mode Manuel actif : Les éléments sont placés dans la file d'attente sans attribution automatique.",
        modeUsed: "MANUAL",
        breakdown: closeuses.map((c) => ({
          closer: c,
          load: getCloserActiveLoad(c.id, c.name),
          status: closerAvailability[c.id] || "AVAILABLE",
          eligible: false,
        })),
      };
    }

    const breakdown = closeuses.map((c) => {
      const status = closerAvailability[c.id] || "AVAILABLE";
      const load = getCloserActiveLoad(c.id, c.name);
      const eligible = status === "AVAILABLE" && load < assignmentConfig.maxCapacityPerCloser;
      return { closer: c, load, status, eligible };
    });

    const eligibleClosers = breakdown.filter((b) => b.eligible);

    if (eligibleClosers.length === 0) {
      return {
        winner: null,
        reason: "Toutes les closeuses ont atteint leur capacité maximale ou sont indisponibles. L'élément sera mis en file d'attente.",
        modeUsed: mode,
        breakdown,
      };
    }

    if (mode === "ROUND_ROBIN") {
      const winnerIndex = roundRobinPointer % eligibleClosers.length;
      const winner = eligibleClosers[winnerIndex].closer;
      return {
        winner,
        reason: `Distribution Round Robin équitable (Tour de rôle, position ${winnerIndex + 1}/${eligibleClosers.length})`,
        modeUsed: "ROUND_ROBIN",
        breakdown,
      };
    }

    // SMART_AUTO
    const minLoad = Math.min(...eligibleClosers.map((b) => b.load));
    const lowestLoadClosers = eligibleClosers.filter((b) => b.load === minLoad);

    if (lowestLoadClosers.length === 1) {
      const winner = lowestLoadClosers[0].closer;
      return {
        winner,
        reason: `${winner.name} sélectionnée — charge active la plus faible (${minLoad} commandes actives).`,
        modeUsed: "SMART_AUTO",
        breakdown,
      };
    }

    // Tie-breaker Round Robin
    const winnerIndex = roundRobinPointer % lowestLoadClosers.length;
    const winner = lowestLoadClosers[winnerIndex].closer;
    return {
      winner,
      reason: `${winner.name} sélectionnée — égalité de charge (${minLoad} commandes), rotation Round Robin secondaire appliquée.`,
      modeUsed: "SMART_AUTO",
      breakdown,
    };
  };

  // 4. Déclenchement de l'attribution automatique réelle
  const triggerAutoAssignItem = (itemId: string, type: "ORDER" | "CONVERSATION") => {
    const sim = simulateAssignment(type);
    if (!sim.winner) return false;

    const winner = sim.winner;
    const newPointer = roundRobinPointer + 1;
    setRoundRobinPointer(newPointer);

    if (type === "ORDER") {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === itemId
            ? {
                ...o,
                assignedCloseuseId: winner.id,
                assignedCloseuseName: winner.name,
                status: "A_RAPPELER",
                updatedAt: new Date().toISOString(),
                comment: `Attribution automatique : ${sim.reason}`,
              }
            : o
        )
      );
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === itemId
            ? {
                ...c,
                assignedAgentName: winner.name,
                assignedAgentRole: "Closeuse",
                status: "IN_PROGRESS",
              }
            : c
        )
      );
    }

    // Log the assignment
    const newLog: AssignmentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      itemType: type,
      itemRef: itemId,
      assignedToCloserName: winner.name,
      assignedToCloserId: winner.id,
      modeUsed: sim.modeUsed,
      reason: sim.reason,
      success: true,
    };
    setAssignmentLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    return true;
  };

  // Création de commande avec auto-assign si configuré
  const createOrder = (orderData: Partial<Order>): Order => {
    const count = orders.length + 1;
    const orderNumber = `CMD-BJ${String(count).padStart(4, "0")}`;
    const newOrder: Order = {
      id: `cmd_${Date.now()}`,
      orderNumber,
      clientName: orderData.clientName || "Nouveau Client",
      clientPhone: orderData.clientPhone || "+229 01 00 00 00",
      region: orderData.region || "Littoral",
      address: orderData.address || "Adresse standard",
      city: orderData.city || "Cotonou",
      products: orderData.products || "Produit standard",
      quantity: orderData.quantity || 1,
      totalPrice: orderData.totalPrice || 15000,
      deliveryFee: 2000,
      serviceFee: 800,
      status: "EN_ATTENTE",
      partnerId: orderData.partnerId || activePartnerId,
      partnerName: orderData.partnerName || "E-commerçant",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Auto-assignment if active
    if (assignmentConfig.ordersMode !== "MANUAL") {
      setTimeout(() => {
        triggerAutoAssignItem(newOrder.id, "ORDER");
      }, 300);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, comment?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              comment: comment || o.comment,
              deliveredAt: status === "LIVREE" ? new Date().toISOString() : o.deliveredAt,
              codCollected: status === "LIVREE" ? true : o.codCollected,
            }
          : o
      )
    );
  };

  const logClosingCall = (
    orderId: string,
    note: string,
    newStatus: OrderStatus,
    assignedLivreurId?: string,
    deliveryTimeSlot?: string
  ) => {
    const livreur = livreurs.find((l) => l.id === assignedLivreurId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              closingNotes: note,
              assignedLivreurId: assignedLivreurId || o.assignedLivreurId,
              assignedLivreurName: livreur?.name || o.assignedLivreurName,
              deliveryTimeSlot: deliveryTimeSlot || o.deliveryTimeSlot,
              callCount: (o.callCount || 0) + 1,
              updatedAt: new Date().toISOString(),
              comment: `Appel closing : ${note}`,
            }
          : o
      )
    );
  };

  const assignOrderToCloseuse = (orderId: string, closeuseId: string) => {
    const closer = closeuses.find((c) => c.id === closeuseId);
    if (!closer) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedCloseuseId: closer.id,
              assignedCloseuseName: closer.name,
              status: o.status === "EN_ATTENTE" ? "A_RAPPELER" : o.status,
              updatedAt: new Date().toISOString(),
              comment: `Attribué manuellement à la closeuse ${closer.name}`,
            }
          : o
      )
    );
  };

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
  };

  const markOrderDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "LIVREE",
              deliveredAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              codCollected: true,
              comment: "Colis livré et montant COD encaissé avec succès par le livreur.",
            }
          : o
      )
    );
  };

  const markOrderFailed = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "REFUSEE",
              updatedAt: new Date().toISOString(),
              comment: `Livraison échouée : ${reason}`,
            }
          : o
      )
    );
  };

  const requestPayout = (
    amount: number,
    operator: PayoutOperator,
    phone: string,
    countryCode = "+229",
    cryptoAddress?: string,
    cryptoNetwork?: string
  ): PayoutRequest => {
    const partner = partners.find((p) => p.id === activePartnerId) || currentPartner;
    const newReq: PayoutRequest = {
      id: `pay_${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.companyName,
      amount,
      operator,
      phone,
      countryCode,
      cryptoAddress,
      cryptoNetwork,
      cryptoEstimatedUsdt: cryptoAddress ? Math.round(amount / 655) : undefined,
      requestedAt: new Date().toISOString().split("T")[0],
      status: "PENDING",
    };
    setPayoutRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const addLivreur = (data: {
    name: string;
    email: string;
    phone: string;
    zone: string;
    secondaryZones?: string[];
    vehicle: string;
    licensePlate?: string;
    maxActiveCapacity?: number;
    commissionPerDelivery?: number;
    availabilityStatus?: LivreurStatus;
  }): LivreurProfile => {
    const newL: LivreurProfile = {
      id: `liv-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      zone: data.zone,
      secondaryZones: data.secondaryZones || [],
      vehicle: data.vehicle,
      licensePlate: data.licensePlate || "RB-0000-XX",
      isActive: true,
      availabilityStatus: data.availabilityStatus || "AVAILABLE",
      mustChangePassword: true,
      temporaryCode: Math.floor(100000 + Math.random() * 900000).toString(),
      assignedOrdersCount: 0,
      maxActiveCapacity: data.maxActiveCapacity || 8,
      deliveredTodayCount: 0,
      deliveredWeekCount: 0,
      deliveredMonthCount: 0,
      failedTodayCount: 0,
      cashCollectedToday: 0,
      commissionPerDelivery: data.commissionPerDelivery || 1500,
      successRate: 100,
      avgDeliveryTimeMinutes: 30,
      lastActivityAt: "À l'instant",
    };
    setLivreurs((prev) => [...prev, newL]);
    return newL;
  };

  const updateLivreurAvailability = (livreurId: string, status: LivreurStatus) => {
    setLivreurs((prev) =>
      prev.map((l) => (l.id === livreurId ? { ...l, availabilityStatus: status } : l))
    );
  };

  const updateLivreur = (livreurId: string, data: Partial<LivreurProfile>) => {
    setLivreurs((prev) =>
      prev.map((l) => (l.id === livreurId ? { ...l, ...data } : l))
    );
  };

  const reassignLivreurOrders = (fromLivreurId: string, toLivreurId: string) => {
    const targetLivreur = livreurs.find((l) => l.id === toLivreurId);
    if (!targetLivreur) return;

    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.assignedLivreurId === fromLivreurId && (o.status === "EN_COURS" || o.status === "CONFIRMEE")) {
          count++;
          return {
            ...o,
            assignedLivreurId: targetLivreur.id,
            assignedLivreurName: targetLivreur.name,
            updatedAt: new Date().toISOString(),
            comment: `Réassigné à ${targetLivreur.name} (${targetLivreur.zone})`,
          };
        }
        return o;
      })
    );

    setLivreurs((prev) =>
      prev.map((l) => {
        if (l.id === fromLivreurId) return { ...l, assignedOrdersCount: 0 };
        if (l.id === toLivreurId) return { ...l, assignedOrdersCount: l.assignedOrdersCount + count };
        return l;
      })
    );
  };

  const addCloseuse = (data: { name: string; email: string; phone: string }): CloseuseProfile => {
    const newC: CloseuseProfile = {
      id: `cls-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      isActive: true,
      mustChangePassword: true,
      temporaryCode: Math.floor(100000 + Math.random() * 900000).toString(),
      callsTodayCount: 0,
      confirmedTodayCount: 0,
      conversionRate: 85,
    };
    setCloseuses((prev) => [...prev, newC]);
    return newC;
  };

  const changePassword = (_newPassword: string) => {};

  const approvePayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "APPROVED",
              approvedAt: new Date().toISOString(),
              txReference: `TX-ENO-${Date.now()}`,
            }
          : p
      )
    );
  };

  const rejectPayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: "REJECTED" } : p))
    );
  };

  const sendConversationMessage = (convId: string, text: string, isInternalNote = false) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "PDG",
      senderName: "Direction ENO",
      text,
      sentAt: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      isInternalNote,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: isInternalNote ? `[Note Interne] ${text}` : text,
              lastMessageAt: "À l'instant",
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );
  };

  const assignConversation = (convId: string, agentName: string, agentRole: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, assignedAgentName: agentName, assignedAgentRole: agentRole, status: "IN_PROGRESS" }
          : c
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
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
        conversations,
        activities,
        alerts,
        period,
        assignmentConfig,
        assignmentLogs,
        closerAvailability,
        setPeriod,
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
        assignOrderToCloseuse,
        assignOrderToLivreur,
        markOrderDelivered,
        markOrderFailed,
        requestPayout,
        addLivreur,
        updateLivreurAvailability,
        updateLivreur,
        reassignLivreurOrders,
        addCloseuse,
        changePassword,
        approvePayout,
        rejectPayout,
        sendConversationMessage,
        assignConversation,
        resolveAlert,
        updateAssignmentConfig,
        updateCloserAvailability,
        simulateAssignment,
        triggerAutoAssignItem,
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
