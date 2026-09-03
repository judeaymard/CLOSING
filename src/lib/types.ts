// Rôles utilisateurs dans l'écosystème ENO LIVRAISON
export type UserRole = 'PDG' | 'CLOSEUSE' | 'LIVREUR' | 'PARTNER';

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

// Profil Livreur
export interface LivreurProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  avatarUrl?: string;
  vehicle: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  temporaryCode?: string;
  assignedOrdersCount: number;
  deliveredTodayCount: number;
  cashCollectedToday: number;
}

// Profil Closeuse
export interface CloseuseProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  temporaryCode?: string;
  callsTodayCount: number;
  confirmedTodayCount: number;
  conversionRate: number;
}

// Opérateurs de Retrait (Mobile Money & Crypto)
export type PayoutOperator = 'MTN' | 'MOOV' | 'WAVE' | 'ORANGE' | 'USDT_TRC20' | 'BINANCE_PAY';

// Demande de Retrait Financier
export interface PayoutRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  operator: PayoutOperator;
  phone: string;
  countryCode: string;
  cryptoAddress?: string;
  cryptoNetwork?: string;
  cryptoEstimatedUsdt?: number;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  txReference?: string;
}

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
  avatarUrl?: string;
  createdAt: string;
  notes?: string;
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
