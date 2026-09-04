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
  CloseuseStatus,
  FinancialTransaction,
  CodCollection,
  CodRemittance,
  FinancialAuditLog,
  TreasuryManagerProfile,
  EmployeeStatus,
  DriverCodFinancialSummary,
} from "./types";
import {
  initialTransactions,
  initialCodCollections,
  initialCodRemittances,
  initialFinancialAuditLogs,
  initialTreasuryManagers,
} from "./mock-data";

interface OperationsContextType {
  // Entités & Données
  orders: Order[];
  partners: Partner[];
  products: Product[];
  livreurs: LivreurProfile[];
  closeuses: CloseuseProfile[];
  treasuryManagers: TreasuryManagerProfile[];
  payoutRequests: PayoutRequest[];
  transactions: FinancialTransaction[];
  codCollections: CodCollection[];
  codRemittances: CodRemittance[];
  auditLogs: FinancialAuditLog[];
  conversations: Conversation[];
  activities: ActivityItem[];
  alerts: AgencyAlert[];
  period: PeriodFilter;

  // Automatisation des Attributions
  assignmentConfig: AssignmentConfig;
  assignmentLogs: AssignmentLog[];
  closerAvailability: Record<string, CloseuseStatus>;

  // Session & Rôles
  currentRole: UserRole;
  activeLivreurId: string;
  activeCloseuseId: string;
  activePartnerId: string;
  activeTreasuryManagerId: string;
  activeLivreur: LivreurProfile;
  activeCloseuse: CloseuseProfile;
  activePartner: Partner;
  activeTreasuryManager: TreasuryManagerProfile;
  getDriverCodFunds: (driverId: string) => DriverCodFinancialSummary;

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
  addCloseuse: (data: {
    name: string;
    email: string;
    phone: string;
    languages?: string[];
    zones?: string[];
    skills?: string[];
    maxActiveOrders?: number;
    maxActiveConversations?: number;
    commissionPerConfirmation?: number;
    availabilityStatus?: CloseuseStatus;
  }) => CloseuseProfile;
  updateCloseuse: (closeuseId: string, data: Partial<CloseuseProfile>) => void;
  reassignCloseuseOrders: (fromCloseuseId: string, toCloseuseId: string) => void;
  addPartner: (data: Partial<Partner>) => Partner;
  updatePartner: (partnerId: string, data: Partial<Partner>) => void;
  suspendPartner: (partnerId: string, reason: string) => void;
  reactivatePartner: (partnerId: string) => void;
  changePassword: (newPassword: string) => void;
  approvePayout: (payoutId: string) => void;
  validatePayout: (payoutId: string) => void;
  payPayout: (payoutId: string, paymentReference: string, adminName?: string) => void;
  rejectPayout: (payoutId: string, reason?: string) => void;
  verifyWithdrawal: (withdrawalId: string, internalNote?: string) => void;
  approveWithdrawal: (withdrawalId: string, internalNote?: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;
  payWithdrawal: (withdrawalId: string, paymentReference: string, adminName?: string) => void;
  addTreasuryManager: (data: Partial<TreasuryManagerProfile>) => TreasuryManagerProfile;
  updateTreasuryManager: (id: string, data: Partial<TreasuryManagerProfile>) => void;
  toggleTreasuryManagerStatus: (id: string, status: EmployeeStatus) => void;
  deleteTreasuryManager: (id: string) => void;
  receiveDriverRemittance: (params: {
    livreurId: string;
    receivedAmount: number;
    receivedBy: string;
    receivedById?: string;
    notes?: string;
    discrepancyReason?: string;
  }) => CodRemittance;
  declareRemittance: (livreurId: string, amountDeclared: number, orderIds: string[], notes?: string) => CodRemittance;
  validateRemittance: (remittanceId: string, amountValidated?: number) => void;
  disputeRemittance: (remittanceId: string, notes: string) => void;
  reportCodDiscrepancy: (orderId: string, actualAmount: number, justification: string) => void;
  addTransaction: (data: Partial<FinancialTransaction>) => FinancialTransaction;
  sendConversationMessage: (convId: string, text: string, isInternalNote?: boolean) => void;
  assignConversation: (convId: string, agentName: string, agentRole: string) => void;
  resolveAlert: (alertId: string) => void;

  // Méthodes d'Automatisation
  updateAssignmentConfig: (newConfig: Partial<AssignmentConfig>) => void;
  updateCloserAvailability: (closerId: string, status: CloseuseStatus) => void;
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
  const [treasuryManagers, setTreasuryManagers] = useState<TreasuryManagerProfile[]>(initialTreasuryManagers);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(initialPayoutRequests);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [codCollections, setCodCollections] = useState<CodCollection[]>(initialCodCollections);
  const [codRemittances, setCodRemittances] = useState<CodRemittance[]>(initialCodRemittances);
  const [auditLogs, setAuditLogs] = useState<FinancialAuditLog[]>(initialFinancialAuditLogs);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activities, setActivities] = useState<ActivityItem[]>(initialAgencyPulseActivities);
  const [alerts, setAlerts] = useState<AgencyAlert[]>(initialAgencyAlerts);
  const [period, setPeriod] = useState<PeriodFilter>("TODAY");

  // Automatisation State
  const [assignmentConfig, setAssignmentConfig] = useState<AssignmentConfig>(initialAssignmentConfig);
  const [assignmentLogs, setAssignmentLogs] = useState<AssignmentLog[]>(initialAssignmentLogs);
  const [closerAvailability, setCloserAvailability] = useState<Record<string, CloseuseStatus>>({
    "cls-1": "AVAILABLE",
    "cls-2": "BUSY",
    "cls-3": "PAUSED",
  });
  const [roundRobinPointer, setRoundRobinPointer] = useState<number>(0);

  // Session State
  const [currentRole, setCurrentRole] = useState<UserRole>("PDG");
  const [activeLivreurId, setActiveLivreurId] = useState<string>("liv-1");
  const [activeCloseuseId, setActiveCloseuseId] = useState<string>("cls-1");
  const [activePartnerId, setActivePartnerId] = useState<string>("p1");
  const [activeTreasuryManagerId, setActiveTreasuryManagerId] = useState<string>("tm-1");

  // Rôle Switcher
  const switchRole = (role: UserRole, specificId?: string) => {
    setCurrentRole(role);
    if (role === "LIVREUR" && specificId) setActiveLivreurId(specificId);
    if (role === "CLOSEUSE" && specificId) setActiveCloseuseId(specificId);
    if (role === "PARTNER" && specificId) setActivePartnerId(specificId);
    if (role === "TREASURY_MANAGER" && specificId) setActiveTreasuryManagerId(specificId);
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
  const updateCloserAvailability = (closerId: string, status: CloseuseStatus) => {
    setCloserAvailability((prev) => ({ ...prev, [closerId]: status }));
    setCloseuses((prev) =>
      prev.map((c) => (c.id === closerId ? { ...c, availabilityStatus: status } : c))
    );
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

  const addCloseuse = (data: {
    name: string;
    email: string;
    phone: string;
    languages?: string[];
    zones?: string[];
    skills?: string[];
    maxActiveOrders?: number;
    maxActiveConversations?: number;
    commissionPerConfirmation?: number;
    availabilityStatus?: CloseuseStatus;
  }): CloseuseProfile => {
    const newC: CloseuseProfile = {
      id: `cls-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      isActive: true,
      availabilityStatus: data.availabilityStatus || "AVAILABLE",
      mustChangePassword: true,
      temporaryCode: Math.floor(100000 + Math.random() * 900000).toString(),
      callsTodayCount: 0,
      confirmedTodayCount: 0,
      confirmedWeekCount: 0,
      confirmedMonthCount: 0,
      cancelledTodayCount: 0,
      unreachableTodayCount: 0,
      callbacksScheduledToday: 0,
      conversionRate: 85,
      maxActiveOrders: data.maxActiveOrders || 15,
      maxActiveConversations: data.maxActiveConversations || 5,
      activeOrdersCount: 0,
      activeConversationsCount: 0,
      commissionPerConfirmation: data.commissionPerConfirmation || 750,
      avgProcessingTimeMinutes: 4.5,
      languages: data.languages || ["Français", "Fon"],
      zones: data.zones || ["Cotonou"],
      skills: data.skills || ["Généraliste"],
      lastActivityAt: "À l'instant",
    };
    setCloseuses((prev) => [...prev, newC]);
    return newC;
  };

  const updateCloseuse = (closeuseId: string, data: Partial<CloseuseProfile>) => {
    setCloseuses((prev) =>
      prev.map((c) => (c.id === closeuseId ? { ...c, ...data } : c))
    );
  };

  const reassignCloseuseOrders = (fromCloseuseId: string, toCloseuseId: string) => {
    const targetCloser = closeuses.find((c) => c.id === toCloseuseId);
    if (!targetCloser) return;

    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.assignedCloseuseId === fromCloseuseId && (o.status === "EN_ATTENTE" || o.status === "A_RAPPELER")) {
          count++;
          return {
            ...o,
            assignedCloseuseId: targetCloser.id,
            assignedCloseuseName: targetCloser.name,
            updatedAt: new Date().toISOString(),
            comment: `Réassigné à la closeuse ${targetCloser.name}`,
          };
        }
        return o;
      })
    );
  };

  const addPartner = (data: Partial<Partner>): Partner => {
    const newP: Partner = {
      id: `p-${Date.now()}`,
      fullName: data.fullName || "Propriétaire",
      companyName: data.companyName || "Nouvelle Boutique",
      email: data.email || "contact@boutique.bj",
      phone: data.phone || "+229 01 00 00 00",
      address: data.address || "Cotonou, Bénin",
      city: data.city || "Cotonou",
      isActive: true,
      isApproved: true,
      status: data.status || "ACTIVE",
      category: data.category || "Généraliste",
      websiteUrl: data.websiteUrl || "",
      deliveryFeeDefault: data.deliveryFeeDefault || 2000,
      agencyCommissionDefault: data.agencyCommissionDefault || 800,
      onboardingStep: data.onboardingStep || 1,
      availableBalance: 0,
      pendingBalance: 0,
      ordersCountToday: 0,
      ordersCountMonth: 0,
      gmvProcessed: 0,
      confirmationRate: 0,
      deliverySuccessRate: 0,
      lastPayoutDate: "Nouveau",
      lastActivityAt: "À l'instant",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPartners((prev) => [...prev, newP]);
    return newP;
  };

  const updatePartner = (partnerId: string, data: Partial<Partner>) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, ...data } : p))
    );
  };

  const suspendPartner = (partnerId: string, reason: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              isActive: false,
              status: "SUSPENDED",
              suspensionReason: reason,
              lastActivityAt: `Suspendu le ${new Date().toLocaleDateString("fr-FR")}`,
            }
          : p
      )
    );
  };

  const reactivatePartner = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              isActive: true,
              status: "ACTIVE",
              suspensionReason: undefined,
              lastActivityAt: "Réactivé à l'instant",
            }
          : p
      )
    );
  };

  const changePassword = (_newPassword: string) => {};

  const approvePayout = (payoutId: string) => {
    approveWithdrawal(payoutId);
  };

  const validatePayout = (payoutId: string) => {
    approveWithdrawal(payoutId);
  };

  const verifyWithdrawal = (withdrawalId: string, internalNote?: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === withdrawalId
          ? {
              ...p,
              status: "IN_VERIFICATION",
              internalNote: internalNote || p.internalNote,
            }
          : p
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Demande de retrait mise en vérification",
        actor: "Direction ENO (Super Admin)",
        targetType: "WITHDRAWAL",
        targetId: withdrawalId,
        details: internalNote || "Contrôle de sécurité des coordonnées de paiement.",
      },
      ...prev,
    ]);
  };

  const approveWithdrawal = (withdrawalId: string, internalNote?: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === withdrawalId
          ? {
              ...p,
              status: "APPROVED",
              approvedAt: new Date().toISOString(),
              internalNote: internalNote || p.internalNote,
              txReference: p.txReference || `TX-VAL-${Date.now()}`,
            }
          : p
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Demande de retrait approuvée",
        actor: "Direction ENO (Super Admin)",
        targetType: "WITHDRAWAL",
        targetId: withdrawalId,
        details: internalNote || "Approbation par le PDG. Prêt pour virement.",
      },
      ...prev,
    ]);
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const payout = payoutRequests.find((p) => p.id === withdrawalId);
    if (!payout) return;

    // Restituer le montant réservé au solde disponible
    if (payout.partnerId) {
      setPartners((prev) =>
        prev.map((prt) =>
          prt.id === payout.partnerId
            ? {
                ...prt,
                availableBalance: (prt.availableBalance || 0) + (payout.reservedAmount || payout.amount),
              }
            : prt
        )
      );
    }

    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === withdrawalId
          ? {
              ...p,
              status: "REJECTED",
              reservedAmount: 0,
              rejectionReason: reason || "Demande refusée par la direction.",
            }
          : p
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Demande de retrait refusée & solde restitué",
        actor: "Direction ENO (Super Admin)",
        targetType: "WITHDRAWAL",
        targetId: withdrawalId,
        amount: payout.amount,
        details: `Motif: ${reason}. Montant réintégré au solde disponible.`,
      },
      ...prev,
    ]);
  };

  const payWithdrawal = (withdrawalId: string, paymentReference: string, adminName = "Direction ENO") => {
    const payout = payoutRequests.find((p) => p.id === withdrawalId);
    if (!payout || payout.status === "PAID") return;

    const partner = partners.find((p) => p.id === payout.partnerId);
    const balanceBefore = (partner?.availableBalance || 0) + (payout.reservedAmount || payout.amount);
    const balanceAfter = Math.max(0, partner?.availableBalance || 0);

    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === withdrawalId
          ? {
              ...p,
              status: "PAID",
              paidAt: new Date().toISOString(),
              paymentReference,
              adminProcessorName: adminName,
              reservedAmount: 0,
              balanceBefore,
              balanceAfter,
              txReference: `TX-PAY-${Date.now()}`,
            }
          : p
      )
    );

    // Mettre à jour la date du dernier virement partenaire
    if (partner) {
      setPartners((prev) =>
        prev.map((prt) =>
          prt.id === partner.id
            ? {
                ...prt,
                lastPayoutDate: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
              }
            : prt
        )
      );
    }

    // Ajouter l'écriture comptable au Grand Livre de Trésorerie
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      txReference: `TX-RET-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      type: "RETRAIT",
      label: `Retrait Marchand ${payout.partnerName} (${payout.operator})`,
      partnerId: payout.partnerId,
      partnerName: payout.partnerName,
      inflow: 0,
      outflow: payout.amount,
      balanceAfter: 14850000 - payout.amount,
      status: "COMPLETED",
      notes: `Virement exécuté (${payout.operator}). Réf: ${paymentReference}. Traité par ${adminName}.`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Virement de retrait payé & archivé",
        actor: adminName,
        targetType: "WITHDRAWAL",
        targetId: withdrawalId,
        amount: payout.amount,
        details: `Règlement ${payout.operator} exécuté. Réf: ${paymentReference}.`,
      },
      ...prev,
    ]);
  };

  const payPayout = (payoutId: string, paymentReference: string, adminName = "Direction ENO") => {
    payWithdrawal(payoutId, paymentReference, adminName);
  };

  const rejectPayout = (payoutId: string, reason?: string) => {
    rejectWithdrawal(payoutId, reason || "Demande refusée par la direction.");
  };

  const declareRemittance = (
    livreurId: string,
    amountDeclared: number,
    orderIds: string[],
    notes?: string
  ): CodRemittance => {
    const livreur = livreurs.find((l) => l.id === livreurId);
    const newRem: CodRemittance = {
      id: `rem-${Date.now()}`,
      reference: `REM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      livreurId,
      livreurName: livreur?.name || "Livreur",
      amountExpected: amountDeclared,
      amountDeclared,
      ordersCount: orderIds.length,
      orderIds,
      period: `Remise du ${new Date().toLocaleDateString("fr-FR")}`,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "PENDING_VALIDATION",
      notes,
    };

    setCodRemittances((prev) => [newRem, ...prev]);

    // Mettre à jour les statuts de remise des commandes concernées
    setCodCollections((prev) =>
      prev.map((c) =>
        orderIds.includes(c.orderId)
          ? { ...c, remittanceStatus: "REMITTANCE_PENDING", remittanceId: newRem.id }
          : c
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Remise de fonds déclarée par le livreur",
        actor: livreur?.name || "Livreur",
        targetType: "REMITTANCE",
        targetId: newRem.reference,
        amount: amountDeclared,
        details: `${amountDeclared} FCFA déclarés sur ${orderIds.length} colis livrés.`,
      },
      ...prev,
    ]);

    return newRem;
  };

  const validateRemittance = (remittanceId: string, amountValidated?: number) => {
    const rem = codRemittances.find((r) => r.id === remittanceId);
    if (!rem) return;

    const validatedAmt = amountValidated ?? rem.amountDeclared;

    setCodRemittances((prev) =>
      prev.map((r) =>
        r.id === remittanceId
          ? {
              ...r,
              status: "VALIDATED",
              amountValidated: validatedAmt,
              validatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
              validatedBy: "Direction ENO (Super Admin)",
            }
          : r
      )
    );

    // Mettre à jour les collections
    setCodCollections((prev) =>
      prev.map((c) =>
        rem.orderIds.includes(c.orderId) || c.remittanceId === remittanceId
          ? { ...c, remittanceStatus: "VALIDATED" }
          : c
      )
    );

    // Écriture de remise dans le Grand Livre
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      txReference: `TX-REM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      type: "REMISE_LIVREUR",
      label: `Remise de fonds ${rem.livreurName} (${rem.reference})`,
      livreurId: rem.livreurId,
      livreurName: rem.livreurName,
      inflow: validatedAmt,
      outflow: 0,
      balanceAfter: 14850000 + validatedAmt,
      status: "COMPLETED",
      notes: `Fonds vérifiés et encaissés au coffre-fort. ${rem.ordersCount} commandes validées.`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Remise de fonds validée par le PDG",
        actor: "Direction ENO (Super Admin)",
        targetType: "REMITTANCE",
        targetId: rem.reference,
        amount: validatedAmt,
        details: `Validation physique au coffre de ${validatedAmt} FCFA. Commandes libérées.`,
      },
      ...prev,
    ]);
  };

  const disputeRemittance = (remittanceId: string, notes: string) => {
    setCodRemittances((prev) =>
      prev.map((r) =>
        r.id === remittanceId
          ? {
              ...r,
              status: "DISPUTED",
              notes: `${r.notes ? r.notes + " | " : ""}Contestation PDG: ${notes}`,
            }
          : r
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Remise de fonds contestée par la direction",
        actor: "Direction ENO (Super Admin)",
        targetType: "REMITTANCE",
        targetId: remittanceId,
        details: `Motif de contestation: ${notes}`,
      },
      ...prev,
    ]);
  };

  const reportCodDiscrepancy = (orderId: string, actualAmount: number, justification: string) => {
    setCodCollections((prev) =>
      prev.map((c) => {
        if (c.orderId === orderId) {
          const discrepancy = actualAmount - c.expectedAmount;
          return {
            ...c,
            collectedAmount: actualAmount,
            discrepancy,
            discrepancyJustification: justification,
            collectionStatus: discrepancy !== 0 ? "DISCREPANCY_FLAGGED" : "COLLECTED",
            remittanceStatus: discrepancy !== 0 ? "DISCREPANCY_DETECTED" : c.remittanceStatus,
          };
        }
        return c;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Écart d'encaissement signalé",
        actor: "Opérations / Livreur",
        targetType: "DISCREPANCY",
        targetId: orderId,
        amount: actualAmount,
        details: `Justification enregistrée: ${justification}`,
      },
      ...prev,
    ]);
  };

  // 🎯 SOURCE UNIQUE DE VÉRITÉ : Calcul transparent des fonds COD par livreur
  const getDriverCodFunds = (driverId: string): DriverCodFinancialSummary => {
    const driver = livreurs.find((l) => l.id === driverId);
    const driverName = driver?.name || "Livreur";

    // Collections liées à ce livreur
    const driverCols = codCollections.filter((c) => c.livreurId === driverId);
    
    // Commandes non encore validées au coffre
    const unremittedCols = driverCols.filter(
      (c) => c.remittanceStatus !== "VALIDATED" && c.collectionStatus !== "NOT_COLLECTED"
    );

    // Montant restant à remettre = somme des encaissements sur ces colis (toujours >= 0)
    let fundsToRemit = unremittedCols.reduce((sum, c) => sum + Math.max(0, c.collectedAmount), 0);
    
    // Si aucune collection mock n'existe encore pour ce livreur, attribuer une valeur cohérente non-négative
    if (driverCols.length === 0) {
      fundsToRemit = driverId === "liv-1" ? 150000 : driverId === "liv-2" ? 50000 : driverId === "liv-3" ? 0 : 75000;
    }

    const unremittedOrderIds = unremittedCols.map((c) => c.orderId);
    const unremittedOrdersCount = unremittedCols.length > 0 ? unremittedCols.length : (fundsToRemit > 0 ? 3 : 0);

    const totalCodCollected = 2500000;
    const totalFundsRemitted = Math.max(0, totalCodCollected - fundsToRemit);

    const ceilingThreshold = 100000;

    let statusLevel: "ZERO" | "NORMAL" | "ATTENTION" | "URGENT" = "NORMAL";
    let statusLabel = "Fonds normaux";

    if (fundsToRemit === 0) {
      statusLevel = "ZERO";
      statusLabel = "✓ Aucun fonds en attente";
    } else if (fundsToRemit >= 150000) {
      statusLevel = "URGENT";
      statusLabel = "🔴 Action requise (Plafond dépassé)";
    } else if (fundsToRemit >= ceilingThreshold) {
      statusLevel = "ATTENTION";
      statusLabel = "⚠️ Attention (Proche plafond)";
    } else {
      statusLevel = "NORMAL";
      statusLabel = "Fonds normaux";
    }

    return {
      livreurId: driverId,
      livreurName: driverName,
      totalCodCollected,
      totalFundsRemitted,
      fundsToRemit,
      unremittedOrdersCount,
      unremittedOrderIds,
      lastRemittanceDate: "Aujourd'hui à 10:42",
      nextRemittanceDeadline: "Aujourd'hui — 18:00",
      ceilingThreshold,
      statusLevel,
      statusLabel,
    };
  };

  // 👥 Gestion des Responsables de Trésorerie par le PDG
  const addTreasuryManager = (data: Partial<TreasuryManagerProfile>): TreasuryManagerProfile => {
    const firstName = data.firstName || "Nouveau";
    const lastName = data.lastName || "Responsable";
    const newTm: TreasuryManagerProfile = {
      id: `tm-${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: data.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@enolivraison.com`,
      phone: data.phone || "+229 01 00 00 00 00",
      zone: data.zone || "Hub Central Cotonou",
      status: data.status || "ACTIF",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      lastActiveAt: "À l'instant",
      remittancesReceivedCount: 0,
      totalFundsReceived: 0,
      discrepanciesFlaggedCount: 0,
      notes: data.notes,
    };

    setTreasuryManagers((prev) => [newTm, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: "Création d'un Responsable de Trésorerie",
        actor: "Direction ENO (Super Admin)",
        targetType: "PARTNER",
        targetId: newTm.id,
        details: `Compte trésorier créé pour ${newTm.name} (${newTm.zone}).`,
      },
      ...prev,
    ]);

    return newTm;
  };

  const updateTreasuryManager = (id: string, data: Partial<TreasuryManagerProfile>) => {
    setTreasuryManagers((prev) =>
      prev.map((tm) => {
        if (tm.id === id) {
          const updated = { ...tm, ...data };
          if (data.firstName || data.lastName) {
            updated.name = `${updated.firstName} ${updated.lastName}`.trim();
          }
          return updated;
        }
        return tm;
      })
    );
  };

  const toggleTreasuryManagerStatus = (id: string, status: EmployeeStatus) => {
    setTreasuryManagers((prev) =>
      prev.map((tm) => (tm.id === id ? { ...tm, status } : tm))
    );
  };

  const deleteTreasuryManager = (id: string) => {
    setTreasuryManagers((prev) => prev.filter((tm) => tm.id !== id));
  };

  // ⚡ Workflow Rapide (< 1min) de Réception Physique de Remise par le Trésorier
  const receiveDriverRemittance = ({
    livreurId,
    receivedAmount,
    receivedBy,
    receivedById,
    notes,
    discrepancyReason,
  }: {
    livreurId: string;
    receivedAmount: number;
    receivedBy: string;
    receivedById?: string;
    notes?: string;
    discrepancyReason?: string;
  }): CodRemittance => {
    const driverSummary = getDriverCodFunds(livreurId);
    const expectedAmount = driverSummary.fundsToRemit;
    const difference = expectedAmount - receivedAmount;
    const isDiscrepancy = difference > 0;

    const ref = `RM-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString().replace("T", " ").slice(0, 16);

    const newRemittance: CodRemittance = {
      id: `rem-${Date.now()}`,
      reference: ref,
      livreurId,
      livreurName: driverSummary.livreurName,
      amountExpected: expectedAmount,
      amountDeclared: receivedAmount,
      receivedAmount,
      amountValidated: receivedAmount,
      discrepancyAmount: isDiscrepancy ? difference : 0,
      discrepancyReason: isDiscrepancy ? discrepancyReason : undefined,
      ordersCount: driverSummary.unremittedOrdersCount,
      orderIds: driverSummary.unremittedOrderIds,
      period: `Tournée du ${new Date().toLocaleDateString("fr-FR")}`,
      createdAt: nowIso,
      receivedAt: nowIso,
      receivedBy,
      receivedById,
      validatedAt: nowIso,
      validatedBy: receivedBy,
      status: isDiscrepancy ? "DISCREPANCY_DETECTED" : "VALIDATED",
      notes,
    };

    setCodRemittances((prev) => [newRemittance, ...prev]);

    // Mettre à jour les statuts des encaissements concernés
    setCodCollections((prev) =>
      prev.map((c) => {
        if (c.livreurId === livreurId && c.remittanceStatus !== "VALIDATED") {
          return {
            ...c,
            remittanceStatus: isDiscrepancy ? "DISCREPANCY_DETECTED" : "VALIDATED",
            remittanceId: newRemittance.id,
          };
        }
        return c;
      })
    );

    // Mettre à jour les statistiques du trésorier qui a reçu les fonds
    if (receivedById) {
      setTreasuryManagers((prev) =>
        prev.map((tm) =>
          tm.id === receivedById
            ? {
                ...tm,
                remittancesReceivedCount: tm.remittancesReceivedCount + 1,
                totalFundsReceived: tm.totalFundsReceived + receivedAmount,
                discrepanciesFlaggedCount: isDiscrepancy
                  ? tm.discrepanciesFlaggedCount + 1
                  : tm.discrepanciesFlaggedCount,
                lastActiveAt: "À l'instant",
              }
            : tm
        )
      );
    }

    // Ajouter l'écriture comptable au Grand Livre
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      txReference: `TX-REM-${ref}`,
      date: nowIso,
      type: "REMISE_LIVREUR",
      label: `Remise d'espèces ${driverSummary.livreurName} (${ref})`,
      livreurId,
      livreurName: driverSummary.livreurName,
      inflow: receivedAmount,
      outflow: 0,
      balanceAfter: 15200000 + receivedAmount,
      status: "COMPLETED",
      notes: `Reçu physiquement par ${receivedBy}.${isDiscrepancy ? ` Écart: -${difference} FCFA.` : " Montant exact validé au coffre."}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Consigner dans le Journal d'Audit inaltérable
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        action: isDiscrepancy ? "Remise reçue avec écart détecté" : "Réception & Validation de remise physique",
        actor: `${receivedBy} (Responsable de trésorerie)`,
        targetType: "REMITTANCE",
        targetId: ref,
        amount: receivedAmount,
        details: isDiscrepancy
          ? `${receivedAmount} FCFA reçus de ${driverSummary.livreurName} (Attendu: ${expectedAmount} FCFA, Écart: -${difference} FCFA). Motif: ${discrepancyReason || "Non précisé"}.`
          : `${receivedAmount} FCFA reçus de ${driverSummary.livreurName}. Validation complète sans écart.`,
      },
      ...prev,
    ]);

    // Alerte pour le PDG si écart
    if (isDiscrepancy) {
      const newAlert: AgencyAlert = {
        id: `alt-disc-${Date.now()}`,
        severity: "CRITICAL",
        title: `Écart de caisse sur remise ${ref}`,
        description: `${driverSummary.livreurName} a remis ${receivedAmount} FCFA au lieu de ${expectedAmount} FCFA (-${difference} FCFA). Reçu par ${receivedBy}. Motif: ${discrepancyReason || "À arbitrer"}.`,
        actionLabel: "Examiner",
        actionHref: "/pdg/finance",
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    return newRemittance;
  };

  const addTransaction = (data: Partial<FinancialTransaction>): FinancialTransaction => {
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      txReference: data.txReference || `TX-${Date.now().toString().slice(-6)}`,
      date: data.date || new Date().toISOString().replace("T", " ").slice(0, 16),
      type: data.type || "AJUSTEMENT",
      label: data.label || "Opération financière",
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      livreurId: data.livreurId,
      livreurName: data.livreurName,
      orderNumber: data.orderNumber,
      inflow: data.inflow || 0,
      outflow: data.outflow || 0,
      balanceAfter: data.balanceAfter || 14850000,
      status: data.status || "COMPLETED",
      notes: data.notes,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
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
  const activeTreasuryManager = treasuryManagers.find((t) => t.id === activeTreasuryManagerId) || treasuryManagers[0];

  return (
    <OperationsContext.Provider
      value={{
        orders,
        partners,
        products,
        livreurs,
        closeuses,
        treasuryManagers,
        payoutRequests,
        transactions,
        codCollections,
        codRemittances,
        auditLogs,
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
        activeTreasuryManagerId,
        activeLivreur,
        activeCloseuse,
        activePartner,
        activeTreasuryManager,
        getDriverCodFunds,
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
        updateCloseuse,
        reassignCloseuseOrders,
        addPartner,
        updatePartner,
        suspendPartner,
        reactivatePartner,
        changePassword,
        approvePayout,
        validatePayout,
        payPayout,
        rejectPayout,
        verifyWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        payWithdrawal,
        addTreasuryManager,
        updateTreasuryManager,
        toggleTreasuryManagerStatus,
        deleteTreasuryManager,
        receiveDriverRemittance,
        declareRemittance,
        validateRemittance,
        disputeRemittance,
        reportCodDiscrepancy,
        addTransaction,
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
