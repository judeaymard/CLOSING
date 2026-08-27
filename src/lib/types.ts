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
  EN_ATTENTE: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  CONFIRMEE: { label: 'Confirmée', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  EN_COURS: { label: 'En cours', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  LIVREE: { label: 'Livrée', color: 'text-emerald-400', bg: 'bg-emerald-500' },
  A_RAPPELER: { label: 'A rappeler', color: 'text-orange-400', bg: 'bg-orange-500' },
  REFUSEE: { label: 'Refusée', color: 'text-red-400', bg: 'bg-red-500/20' },
  ANNULEE: { label: 'Annulée', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  RETOURNEE: { label: 'Retournée', color: 'text-purple-400', bg: 'bg-purple-500/20' },
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
  isApproved: boolean; // false = En attente de validation
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
