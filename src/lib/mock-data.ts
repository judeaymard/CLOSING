import { Order, Partner, Product } from './types';

export const enoAgencies = [
  {
    id: 'cotonou',
    city: 'Cotonou',
    title: 'Agence Principale Littoral & Atlantique',
    coverage: 'Cotonou • Abomey-Calavi • Porto-Novo',
    primaryPhone: '+229 01 64 29 18 84',
    secondaryPhone: '+229 01 93 83 79 06',
    whatsapp: '2290164291884',
    address: 'Cadjehoun / Haie Vive, Cotonou, Bénin',
    status: 'Ouvert • 08h00 - 20h30',
    hubLead: 'Responsable Opérations Cotonou',
  },
  {
    id: 'lokossa',
    city: 'Lokossa',
    title: 'Agence Régionale Mono & Couffo',
    coverage: 'Lokossa • Mono • Couffo • Athiémé',
    primaryPhone: '+229 01 67 51 00 82',
    secondaryPhone: null,
    whatsapp: '2290167510082',
    address: 'Avenue Principale, Face Gare, Lokossa, Bénin',
    status: 'Ouvert • 08h00 - 19h00',
    hubLead: 'Responsable Antenne Lokossa',
  },
];

export const enoSocials = {
  tiktok: {
    handle: '@enolivraison',
    url: 'https://www.tiktok.com/@enolivraison',
    followers: '1\u00A0157+',
    likes: '4\u00A0351+',
    label: 'TikTok Officiel',
  },
  facebook: {
    name: 'Eno Livraison',
    url: 'https://www.facebook.com/enolivraison',
    label: 'Page Facebook',
  },
  instagram: {
    handle: '@enolivraison',
    url: 'https://www.instagram.com/enolivraison',
    label: 'Instagram',
  },
  whatsappCotonou: 'https://wa.me/2290164291884?text=Bonjour%20ENO%20LIVRAISON%2C%20je%20souhaite%20confier%20mes%20colis%20%C3%A0%20Cotonou',
  whatsappLokossa: 'https://wa.me/2290167510082?text=Bonjour%20ENO%20LIVRAISON%2C%20je%20souhaite%20confier%20mes%20colis%20%C3%A0%20Lokossa',
};

export const currentPartner: Partner = {
  id: 'p1',
  fullName: 'SINABEROGUI Jude',
  companyName: 'Afrimarket',
  email: 'judesinaberogui@gmail.com',
  phone: '+2290164291884',
  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  isActive: true,
  isApproved: true,
  createdAt: '2026-01-15',
};

export const partners: Partner[] = [
  currentPartner,
  {
    id: 'p2',
    fullName: 'Epiphane Koumagnan',
    companyName: 'Bénin Shop',
    email: 'epiphane@beninshop.bj',
    phone: '+2290193837906',
    address: 'Zogbadjè, Abomey-Calavi',
    city: 'Abomey-Calavi',
    isActive: true,
    isApproved: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'p3',
    fullName: 'Fatou Dossou',
    companyName: 'Dossou Fashion',
    email: 'fatou@dossoufashion.bj',
    phone: '+22996987654',
    address: 'Ouando, Porto-Novo',
    city: 'Porto-Novo',
    isActive: true,
    isApproved: true,
    createdAt: '2026-03-05',
  },
  {
    id: 'p4',
    fullName: 'Arnaud Hounwanou',
    companyName: 'Lokossa Tech Store',
    email: 'arnaud@lokossatech.bj',
    phone: '+2290167510082',
    address: 'Centre-ville, Lokossa',
    city: 'Lokossa',
    isActive: true,
    isApproved: true,
    createdAt: '2026-04-12',
  },
  // 🕒 PARTENAIRES EN ATTENTE DE VALIDATION (ONBOARDING)
  {
    id: 'p5',
    fullName: 'Arsène Mensah',
    companyName: 'K-Beauty Bénin',
    email: 'arsene@kbeauty.bj',
    phone: '+22995112233',
    address: 'Haie Vive, Cotonou',
    city: 'Cotonou',
    isActive: false,
    isApproved: false,
    createdAt: '2026-08-27',
    notes: 'Boutique cosmétique import Corée. Souhaite confier 120 crèmes et 80 sérums.',
  },
  {
    id: 'p6',
    fullName: 'Béatrice Alihonou',
    companyName: 'Luxe Mode Cotonou',
    email: 'beatrice@luxemode.bj',
    phone: '+22997445566',
    address: 'Akpakpa, Cotonou',
    city: 'Cotonou',
    isActive: false,
    isApproved: false,
    createdAt: '2026-08-26',
    notes: 'Prêt-à-porter féminin & sacs de luxe. Souhaite démarrer le closing dès validation.',
  },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'ROULEAU DE COLORIAGE',
    price: 7800,
    initialStock: 100,
    remainingStock: 58,
    deliveredCount: 42,
    partnerId: 'p1',
    createdAt: '2026-01-15',
  },
  {
    id: 'prod1_2',
    name: 'FEUTRES MAGIQUES 12 PCS',
    price: 4500,
    initialStock: 80,
    remainingStock: 65,
    deliveredCount: 15,
    partnerId: 'p1',
    createdAt: '2026-02-01',
  },
  {
    id: 'prod2',
    name: 'CAHIER DESSIN PREMIUM',
    price: 5500,
    initialStock: 200,
    remainingStock: 145,
    deliveredCount: 55,
    partnerId: 'p2',
    createdAt: '2026-02-10',
  },
  {
    id: 'prod3',
    name: 'ÉCOUTEURS BLUETOOTH PRO',
    price: 12000,
    initialStock: 50,
    remainingStock: 32,
    deliveredCount: 18,
    partnerId: 'p3',
    createdAt: '2026-03-05',
  },
  {
    id: 'prod4',
    name: 'MONTRE CONNECTÉE SPORT',
    price: 18500,
    initialStock: 60,
    remainingStock: 48,
    deliveredCount: 12,
    partnerId: 'p4',
    createdAt: '2026-04-20',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'CMD-BJ74HDX1',
    clientName: 'KOUMAGNAN EPIPHANE',
    clientPhone: '+229 01 64 29 18 84',
    region: 'Littoral',
    address: 'CADJEHOUN, Cotonou',
    city: 'Cotonou',
    products: 'ROULEAU DE COLORIAGE',
    quantity: 1,
    totalPrice: 7800,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'A_RAPPELER',
    comment: 'CLIENT OCCUPÉ, RAPPELER À 16H',
    createdAt: '2026-08-24T13:00:00',
    updatedAt: '2026-08-24T15:00:00',
    partnerId: 'p1',
  },
  {
    id: 'o2',
    orderNumber: 'CMD-BJ7CDPE3',
    clientName: 'SONIA ADJIBADE',
    clientPhone: '+229 01 93 83 79 06',
    region: 'Atlantique',
    address: 'ZOGBADJE, Abomey-Calavi',
    city: 'Abomey-Calavi',
    products: 'ROULEAU COLORIAGE 1',
    quantity: 1,
    totalPrice: 7800,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'LIVREE',
    comment: 'LIVRÉE ET ENCAISSÉE',
    createdAt: '2026-08-24T13:00:00',
    updatedAt: '2026-08-24T16:30:00',
    deliveredAt: '2026-08-24T16:30:00',
    partnerId: 'p1',
  },
  {
    id: 'o3',
    orderNumber: 'CMD-BJ7I8SRQ',
    clientName: 'KHADY HOUNGBEDJI',
    clientPhone: '95528943',
    region: 'Littoral',
    address: 'AKPAKPA, Cotonou',
    city: 'Cotonou',
    products: 'ROULEAU DE COLORIAGE',
    quantity: 1,
    totalPrice: 7800,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'A_RAPPELER',
    comment: 'CLIENTE INDISPONIBLE',
    createdAt: '2026-08-24T13:00:00',
    updatedAt: '2026-08-24T14:00:00',
    partnerId: 'p1',
  },
  {
    id: 'o4',
    orderNumber: 'CMD-BJ7DUJXJ',
    clientName: 'ASEND SOSSOU',
    clientPhone: '97560781',
    region: 'Ouémé',
    address: 'OUANDO, Porto-Novo',
    city: 'Porto-Novo',
    products: 'CAHIER DESSIN PREMIUM',
    quantity: 2,
    totalPrice: 11000,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'LIVREE',
    comment: 'LIVRÉE AVEC SUCCÈS',
    createdAt: '2026-08-24T13:00:00',
    updatedAt: '2026-08-24T17:00:00',
    deliveredAt: '2026-08-24T17:00:00',
    partnerId: 'p2',
  },
  {
    id: 'o5',
    orderNumber: 'CMD-BJ7AJ5ED',
    clientName: 'NDEYE AGOSSA',
    clientPhone: '94482676',
    region: 'Littoral',
    address: 'HAIE VIVE, Cotonou',
    city: 'Cotonou',
    products: 'ÉCOUTEURS BLUETOOTH PRO',
    quantity: 1,
    totalPrice: 12000,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'LIVREE',
    comment: 'LIVRÉE AU DOMICILE',
    createdAt: '2026-08-24T13:00:00',
    updatedAt: '2026-08-24T15:30:00',
    deliveredAt: '2026-08-24T15:30:00',
    partnerId: 'p3',
  },
  {
    id: 'o6',
    orderNumber: 'CMD-BJ8LOK01',
    clientName: 'MARCELIN DANSOU',
    clientPhone: '+229 01 67 51 00 82',
    region: 'Mono',
    address: 'CENTRE-VILLE, Lokossa',
    city: 'Lokossa',
    products: 'MONTRE CONNECTÉE SPORT',
    quantity: 1,
    totalPrice: 18500,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'LIVREE',
    comment: 'LIVRÉ À LOKOSSA PAR L’AGENCE MONO',
    createdAt: '2026-08-23T13:00:00',
    updatedAt: '2026-08-23T16:00:00',
    deliveredAt: '2026-08-23T16:00:00',
    partnerId: 'p4',
  },
  {
    id: 'o7',
    orderNumber: 'CMD-BJ4IADX5',
    clientName: 'SEYNABOU AHOUANSE',
    clientPhone: '+229 01 64 29 18 84',
    region: 'Littoral',
    address: 'FIDJROSSE, Cotonou',
    city: 'Cotonou',
    products: 'ROULEAU DE COLORIAGE',
    quantity: 1,
    totalPrice: 7800,
    deliveryFee: 2000,
    serviceFee: 800,
    status: 'LIVREE',
    comment: 'LIVRÉE PAR COURSIER ENO',
    createdAt: '2026-08-22T13:00:00',
    updatedAt: '2026-08-22T15:00:00',
    deliveredAt: '2026-08-22T15:00:00',
    partnerId: 'p1',
  },
];

export function getPartnerById(partnerId: string): Partner | undefined {
  return partners.find((p) => p.id === partnerId);
}

export function getPartnerOrders(partnerId: string): Order[] {
  return orders.filter((o) => o.partnerId === partnerId);
}

export function getPartnerProducts(partnerId: string): Product[] {
  return products.filter((p) => p.partnerId === partnerId);
}

export function formatCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' F CFA';
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' F';
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'il y a 1 jour';
  return `il y a ${diffDays} jours`;
}

export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CMD-BJ';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
