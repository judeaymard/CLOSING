import { PlatformSettings, Partner, PayoutOperator } from "./types";

/**
 * Service Centralisé de Tarification et Calculs Métier
 * ENO Livraison 2027
 * 
 * Ce service garantit que TOUS les calculs financiers (frais de livraison, frais de closing,
 * commissions agence, totaux de commandes, règles de retraits) consomment obligatoirement
 * la configuration centrale de `platformSettings` comme UNIQUE SOURCE DE VÉRITÉ.
 */

export interface PricingOverrides {
  deliveryFee?: number;
  closingFee?: number;
  commissionRate?: number;
  zone?: string;
  isExpress?: boolean;
}

/**
 * 1. Calcul des frais de livraison pour une nouvelle commande
 */
export function calculateDeliveryFee(
  settings: PlatformSettings,
  overrides?: PricingOverrides,
  partner?: Partial<Partner>
): number {
  if (overrides?.deliveryFee !== undefined && overrides.deliveryFee >= 0) {
    return overrides.deliveryFee;
  }
  if (partner?.deliveryFeeDefault !== undefined && partner.deliveryFeeDefault > 0) {
    return partner.deliveryFeeDefault;
  }
  return settings.financial?.defaultDeliveryFee ?? 2000;
}

/**
 * 2. Calcul des frais de closing (service fee) pour une nouvelle commande
 */
export function calculateClosingFee(
  settings: PlatformSettings,
  overrides?: PricingOverrides,
  partner?: Partial<Partner>
): number {
  if (overrides?.closingFee !== undefined && overrides.closingFee >= 0) {
    return overrides.closingFee;
  }
  if (partner?.agencyCommissionDefault !== undefined && partner.agencyCommissionDefault > 0) {
    return partner.agencyCommissionDefault;
  }
  return settings.financial?.defaultClosingFee ?? 800;
}

/**
 * 3. Calcul de la commission agence ENO sur les opérations
 */
export function calculateCommission(
  settings: PlatformSettings,
  baseAmount: number,
  overrides?: PricingOverrides
): number {
  const rate = overrides?.commissionRate !== undefined 
    ? overrides.commissionRate 
    : (settings.financial?.defaultCommissionRate ?? 5);
  return Math.round((baseAmount * rate) / 100);
}

/**
 * 4. Calcul du montant total d'une commande
 */
export function calculateOrderTotal(
  productPrice: number,
  deliveryFee: number,
  serviceFee: number
): number {
  return Math.max(0, productPrice + deliveryFee + serviceFee);
}

/**
 * 5. Validation stricte d'une demande de retrait selon la configuration active
 */
export interface WithdrawalValidationResult {
  isValid: boolean;
  errors: string[];
  requiresDoubleValidation: boolean;
  isAutoApproved: boolean;
}

export function validateWithdrawalRequest(
  settings: PlatformSettings,
  partner: Partial<Partner> | undefined,
  amount: number,
  operator: PayoutOperator,
  destination: {
    phone?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
    binancePayId?: string;
    binanceEmail?: string;
  }
): WithdrawalValidationResult {
  const errors: string[] = [];
  const minThreshold = settings.financial?.minWithdrawalThreshold ?? 10000;
  const autoApproveLimit = settings.financial?.autoApprovePayoutsBelow ?? 100000;
  const doubleValidationLimit = settings.financial?.requireDoubleValidationAbove ?? 500000;

  // 1. Vérification du compte partenaire
  if (!partner) {
    errors.push("Boutique partenaire introuvable.");
  } else if (!partner.isActive) {
    errors.push("Le compte marchand est actuellement inactif ou suspendu.");
  }

  // 2. Vérification du montant
  if (amount <= 0) {
    errors.push("Le montant demandé doit être strictement supérieur à 0 FCFA.");
  } else if (amount < minThreshold) {
    errors.push(`Le montant minimum de retrait configuré est de ${minThreshold.toLocaleString("fr-FR")} FCFA (demandé: ${amount.toLocaleString("fr-FR")} FCFA).`);
  }

  // 3. Vérification du solde disponible
  const availableBalance = partner?.availableBalance ?? 0;
  if (amount > availableBalance) {
    errors.push(`Solde insuffisant : vous disposez de ${availableBalance.toLocaleString("fr-FR")} FCFA, montant demandé : ${amount.toLocaleString("fr-FR")} FCFA.`);
  }

  // 4. Vérification de la passerelle de paiement
  const gateways = settings.paymentGateways;
  if (!gateways) {
    errors.push("Configuration des passerelles de paiement indisponible.");
  } else {
    if (operator === "LEEKPAY" || operator === "MTN" || operator === "MOOV" || operator === "WAVE" || operator === "ORANGE") {
      if (!gateways.leekpay?.enabled) {
        errors.push("La passerelle LeekPay / Mobile Money est actuellement désactivée dans les paramètres de la plateforme.");
      }
      if (!destination.phone || destination.phone.trim().length < 6) {
        errors.push("Numéro de téléphone bénéficiaire invalide ou manquant pour le règlement Mobile Money.");
      }
    } else if (operator === "BINANCE_PAY") {
      if (!gateways.binancePay?.enabled) {
        errors.push("Le moyen de paiement Binance Pay est actuellement désactivé dans les paramètres de la plateforme.");
      }
      if (!destination.binancePayId && !destination.binanceEmail && !destination.phone) {
        errors.push("Identifiant Binance Pay (Pay ID ou Email Binance) requis.");
      }
    } else if (operator === "USDT" || operator === "USDT_TRC20") {
      if (!gateways.usdtCrypto?.enabled) {
        errors.push("Le paiement en USDT Crypto est actuellement désactivé dans les paramètres de la plateforme.");
      }
      if (!destination.cryptoAddress || destination.cryptoAddress.trim().length < 10) {
        errors.push("Adresse de portefeuille USDT invalide ou manquante.");
      }
      if (!destination.cryptoNetwork) {
        errors.push("Le réseau blockchain (TRC20, BEP20, Polygon, etc.) doit être explicitement spécifié.");
      }
    }
  }

  const isAutoApproved = errors.length === 0 && amount <= autoApproveLimit;
  const requiresDoubleValidation = amount >= doubleValidationLimit;

  return {
    isValid: errors.length === 0,
    errors,
    requiresDoubleValidation,
    isAutoApproved,
  };
}

/**
 * 6. Liste des passerelles de paiement actuellement autorisées
 */
export function getAvailablePaymentGateways(settings: PlatformSettings) {
  const gateways = settings.paymentGateways;
  return {
    leekpay: gateways?.leekpay?.enabled ?? true,
    binancePay: gateways?.binancePay?.enabled ?? true,
    usdtCrypto: gateways?.usdtCrypto?.enabled ?? true,
  };
}
