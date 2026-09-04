// Rôles utilisateurs dans l'écosystème ENO LIVRAISON
export type UserRole =
  | 'PDG'
  | 'SUPER_ADMIN'
  | 'CLOSEUSE'
  | 'CLOSER'
  | 'LIVREUR'
  | 'DELIVERY_AGENT'
  | 'PARTNER'
  | 'MERCHANT'
  | 'TREASURY_MANAGER';

// Statuts de commande
export type OrderStatus =
  | 'EN_ATTENTE'
  | 'CONFIRMEE'
  | 'EN_COURS'
  | 'LIVREE'
  | 'A_RAPPELER'
  | 'REFUSEE'
  | 'ANNULEE'
  | 'RETOURNEE';

// Couleurs et labels des statuts
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  CONFIRMEE: { label: 'Confirmée', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  EN_COURS: { label: 'En livraison', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  LIVREE: { label: 'Livrée & Encaissée', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  A_RAPPELER: { label: 'À rappeler', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  REFUSEE: { label: 'Refusée', color: 'text-red-500', bg: 'bg-red-500/10' },
  ANNULEE: { label: 'Annulée', color: 'text-gray-500', bg: 'bg-gray-500/10' },
  RETOURNEE: { label: 'Retournée', color: 'text-purple-500', bg: 'bg-purple-500/10' },
};

// Commande
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  region: string;
  address: string;
  city: string;
  products: string;
  quantity: number;
  totalPrice: number;
  deliveryFee: number;
  serviceFee: number;
  status: OrderStatus;
  comment?: string;
  availability?: string;
  availabilityLocation?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  partnerId: string;
  partnerName?: string;
  // Affectations & Suivi Opérationnel
  assignedCloseuseId?: string;
  assignedCloseuseName?: string;
  assignedLivreurId?: string;
  assignedLivreurName?: string;
  closingNotes?: string;
  callCount?: number;
  codCollected?: boolean;
  deliveryTimeSlot?: string;
}

// Statuts opérationnels des livreurs
export type LivreurStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'PAUSED' | 'OFFLINE' | 'UNAVAILABLE';

// Profil Livreur
export interface LivreurProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  secondaryZones?: string[];
  avatarUrl?: string;
  vehicle: string;
  licensePlate?: string;
  isActive: boolean;
  availabilityStatus?: LivreurStatus;
  mustChangePassword?: boolean;
  temporaryCode?: string;
  assignedOrdersCount: number;
  maxActiveCapacity?: number;
  deliveredTodayCount: number;
  deliveredWeekCount?: number;
  deliveredMonthCount?: number;
  failedTodayCount?: number;
  cashCollectedToday: number;
  commissionPerDelivery?: number;
  successRate?: number;
  avgDeliveryTimeMinutes?: number;
  lastActivityAt?: string;
}

// Statuts opérationnels des closeuses
export type CloseuseStatus = 'AVAILABLE' | 'BUSY' | 'PAUSED' | 'OFFLINE' | 'UNAVAILABLE';

// Profil Closeuse
export interface CloseuseProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isActive: boolean;
  availabilityStatus?: CloseuseStatus;
  mustChangePassword?: boolean;
  temporaryCode?: string;
  callsTodayCount: number;
  confirmedTodayCount: number;
  confirmedWeekCount?: number;
  confirmedMonthCount?: number;
  cancelledTodayCount?: number;
  unreachableTodayCount?: number;
  callbacksScheduledToday?: number;
  conversionRate: number;
  maxActiveOrders?: number;
  maxActiveConversations?: number;
  activeOrdersCount?: number;
  activeConversationsCount?: number;
  commissionPerConfirmation?: number;
  avgProcessingTimeMinutes?: number;
  languages?: string[];
  zones?: string[];
  skills?: string[];
  lastActivityAt?: string;
}

// Opérateurs de Retrait (LeekPay, Binance Pay, USDT, etc.)
export type PayoutOperator = 'LEEKPAY' | 'BINANCE_PAY' | 'USDT' | 'MTN' | 'MOOV' | 'WAVE' | 'ORANGE' | 'USDT_TRC20';

export type PayoutStatus =
  | 'PENDING'
  | 'IN_VERIFICATION'
  | 'APPROVED'
  | 'IN_TREATMENT'
  | 'VALIDATED'
  | 'PAID'
  | 'REJECTED'
  | 'FAILED';

// Demande de Retrait Financier E-commerçant
export interface PayoutRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  reservedAmount?: number;
  operator: PayoutOperator;
  phone?: string;
  countryCode?: string;
  leekpayPhone?: string;
  leekpayCountry?: string;
  binancePayId?: string;
  binanceEmail?: string;
  cryptoAddress?: string;
  cryptoNetwork?: string;
  cryptoEstimatedUsdt?: number;
  requestedAt: string;
  status: PayoutStatus;
  balanceBefore?: number;
  balanceAfter?: number;
  validatedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  adminProcessorName?: string;
  paymentReference?: string;
  txReference?: string;
  rejectionReason?: string;
  internalNote?: string;
}

// Statuts d'Encaissement COD
export type CodCollectionStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'PARTIALLY_COLLECTED'
  | 'NOT_COLLECTED'
  | 'DISCREPANCY_FLAGGED';

// Statuts de Remise de Fonds par le Livreur
export type RemittanceDeliveryStatus =
  | 'HELD_BY_DRIVER'
  | 'REMITTANCE_PENDING'
  | 'REMITTED'
  | 'VALIDATED'
  | 'DISCREPANCY_DETECTED';

// Fiche Encaissement COD
export interface CodCollection {
  orderId: string;
  orderNumber: string;
  partnerId: string;
  partnerName: string;
  clientName: string;
  clientPhone: string;
  livreurId: string;
  livreurName: string;
  expectedAmount: number;
  collectedAmount: number;
  discrepancy: number;
  discrepancyJustification?: string;
  collectionStatus: CodCollectionStatus;
  remittanceStatus: RemittanceDeliveryStatus;
  deliveredAt: string;
  remittanceId?: string;
}

// Statuts d'un Employé / Responsable
export type EmployeeStatus = 'ACTIF' | 'EN_PAUSE' | 'DESACTIVE';

// Profil du Responsable de Trésorerie
export interface TreasuryManagerProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  zone: string; // adresse ou zone de travail
  status: EmployeeStatus;
  avatar?: string;
  createdAt: string;
  lastActiveAt: string;
  remittancesReceivedCount: number;
  totalFundsReceived: number;
  discrepanciesFlaggedCount: number;
  notes?: string;
}

// Synthèse financière COD unifiée par livreur (Source Unique de Vérité)
export interface DriverCodFinancialSummary {
  livreurId: string;
  livreurName: string;
  totalCodCollected: number;
  totalFundsRemitted: number;
  fundsToRemit: number; // Toujours >= 0 (Montant réellement dû sur colis non encore remis)
  unremittedOrdersCount: number;
  unremittedOrderIds: string[];
  lastRemittanceDate?: string;
  nextRemittanceDeadline?: string;
  ceilingThreshold: number; // Seuil d'alerte (ex: 100 000 ou 150 000 FCFA)
  statusLevel: 'ZERO' | 'NORMAL' | 'ATTENTION' | 'URGENT';
  statusLabel: string;
}

// Statuts d'une Opération de Remise de Fonds
export type RemittanceStatus =
  | 'PENDING_VALIDATION'
  | 'VALIDATED'
  | 'PARTIALLY_VALIDATED'
  | 'DISCREPANCY_DETECTED'
  | 'DISPUTED';

// Opération de Remise de Fonds Livreur
export interface CodRemittance {
  id: string;
  reference: string;
  livreurId: string;
  livreurName: string;
  amountExpected: number;
  amountDeclared: number;
  receivedAmount?: number;
  amountValidated?: number;
  discrepancyAmount?: number;
  discrepancyJustification?: string;
  discrepancyReason?: string;
  ordersCount: number;
  orderIds: string[];
  period: string;
  createdAt: string;
  receivedAt?: string;
  receivedBy?: string;
  receivedById?: string;
  validatedAt?: string;
  validatedBy?: string;
  status: RemittanceStatus;
  notes?: string;
}

// Journal d'Audit Financier Non-Destructif
export interface FinancialAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetType: 'REMITTANCE' | 'WITHDRAWAL' | 'ORDER' | 'PARTNER' | 'DISCREPANCY' | 'TRANSACTION';
  targetId: string;
  amount?: number;
  details: string;
}

// Types d'opérations du Grand Livre de Trésorerie
export type TransactionType =
  | 'ENCAISSEMENT_COD'
  | 'REMISE_LIVREUR'
  | 'CREDIT_MARCHAND'
  | 'MONTANT_RESERVE'
  | 'RETRAIT'
  | 'COMMISSION_ENO'
  | 'COMMISSION_AGENCE'
  | 'COMMISSION_CLOSEUSE'
  | 'COMMISSION_LIVREUR'
  | 'CORRECTION_VALIDEE'
  | 'DEPENSE'
  | 'AJUSTEMENT';

export interface FinancialTransaction {
  id: string;
  txReference: string;
  date: string;
  type: TransactionType;
  label: string;
  partnerId?: string;
  partnerName?: string;
  livreurId?: string;
  livreurName?: string;
  orderNumber?: string;
  inflow: number; // Entrée de fonds
  outflow: number; // Sortie de fonds
  balanceAfter: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  notes?: string;
}

// Statuts des E-commerçants
export type PartnerStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'ONBOARDING' | 'INACTIVE' | 'SUSPENDED';

// Partenaire (E-commerçant)
export interface Partner {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  isActive: boolean;
  isApproved: boolean;
  status?: PartnerStatus;
  avatarUrl?: string;
  createdAt: string;
  notes?: string;
  category?: string;
  websiteUrl?: string;
  deliveryFeeDefault?: number;
  agencyCommissionDefault?: number;
  onboardingStep?: number;
  availableBalance?: number;
  pendingBalance?: number;
  lastActivityAt?: string;
  deliverySuccessRate?: number;
  confirmationRate?: number;
  ordersCountToday?: number;
  ordersCountMonth?: number;
  gmvProcessed?: number;
  lastPayoutDate?: string;
  suspensionReason?: string;
}

// Produit (Stock)
export interface Product {
  id: string;
  name: string;
  price: number;
  initialStock: number;
  remainingStock: number;
  deliveredCount: number;
  partnerId: string;
  createdAt?: string;
}

// Stats du dashboard
export interface DashboardStats {
  chiffreAffaires: number;
  revenuNet: number;
  nombreCommandes: number;
  tauxConfirmation: number;
  tauxLivraison: number;
  tauxRetour: number;
}

// Finance
export interface FinanceData {
  chiffreAffairesTotal: number;
  commissionsPrelevees: number;
  revenuNet: number;
  commandesLivrees: number;
  commandesTotal: number;
  fraisService: number;
  fraisLivraison: number;
  totalParProduit: number;
}

// Période sélectionnée
export type PeriodFilter = 'TODAY' | '7D' | '30D' | 'YEAR';

// Événement d'activité en direct (Agency Pulse)
export interface ActivityItem {
  id: string;
  type: 'ORDER_CREATED' | 'ORDER_CONFIRMED' | 'ORDER_DISPATCHED' | 'ORDER_DELIVERED' | 'PAYOUT_REQUESTED' | 'MESSAGE_RECEIVED';
  title: string;
  description: string;
  time: string;
  orderNumber?: string;
  partnerName?: string;
  amount?: number;
}

// Message de conversation
export interface ChatMessage {
  id: string;
  sender: 'PARTNER' | 'BOT' | 'AGENT' | 'PDG';
  senderName: string;
  text: string;
  sentAt: string;
  isInternalNote?: boolean;
}

// Conversation du Hub de Communication
export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  companyName: string;
  avatarUrl?: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'ALL' | 'UNASSIGNED' | 'WAITING' | 'IN_PROGRESS' | 'RESOLVED' | 'URGENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedAgentName?: string;
  assignedAgentRole?: string;
  relatedOrderNumber?: string;
  messages: ChatMessage[];
}

// Alerte du Centre d'Attention
export interface AgencyAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  count?: number;
}

// Modes & Configuration d'Attribution Automatique
export type AssignmentMode = 'SMART_AUTO' | 'ROUND_ROBIN' | 'MANUAL';

export interface AssignmentConfig {
  ordersMode: AssignmentMode;
  conversationsMode: AssignmentMode;
  maxCapacityPerCloser: number;
  autoRedistribute: boolean;
  redistributeTimeoutMinutes: number;
  prioritizeUrgent: boolean;
  notifyOnAssign: boolean;
  useRoundRobinOnTie: boolean;
  queueUnassigned: boolean;
}

export interface AssignmentLog {
  id: string;
  timestamp: string;
  itemType: 'ORDER' | 'CONVERSATION';
  itemRef: string;
  assignedToCloserName: string;
  assignedToCloserId: string;
  modeUsed: AssignmentMode;
  reason: string;
  success: boolean;
}
