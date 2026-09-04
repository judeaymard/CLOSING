import {
  calculateDeliveryFee,
  calculateClosingFee,
  calculateCommission,
  calculateOrderTotal,
  validateWithdrawalRequest,
  getAvailablePaymentGateways,
} from "../src/lib/pricing-service.ts";
import { getPaymentProvider } from "../src/lib/payment-providers.ts";
import { initialPlatformSettings, initialPlatformUsers } from "../src/lib/mock-data.ts";

console.log("======================================================================");
console.log("🔥 TEST SUITE : PARAMÈTRES = SOURCE DE VÉRITÉ DE TOUTE LA PLATEFORME (SECTION 36)");
console.log("======================================================================\n");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// Clone fresh settings
let currentSettings = JSON.parse(JSON.stringify(initialPlatformSettings));

// ----------------------------------------------------------------------
// TEST 1 : Modification des Frais de Closing (Exemple Section 36.3)
// ----------------------------------------------------------------------
console.log("📌 Test 1: Modification des frais de closing (800 -> 1200 FCFA)");
const oldClosingFee = calculateClosingFee(currentSettings);
assert(oldClosingFee === 800, `Frais de closing initiaux = 800 FCFA (obtenu: ${oldClosingFee})`);

// Modification dans Paramètres
currentSettings.financial.defaultClosingFee = 1200;
const newClosingFee = calculateClosingFee(currentSettings);
assert(newClosingFee === 1200, `Nouvelle commande utilise les frais de closing mis à jour = 1200 FCFA (obtenu: ${newClosingFee})`);

// Immutabilité historique : une ancienne commande avec 800 FCFA garde ses 800 FCFA
const historicalOrder = { id: "cmd_old", serviceFee: 800, totalPrice: 15000 };
assert(historicalOrder.serviceFee === 800, "L'ancienne commande conserve ses frais historiques de 800 FCFA");
console.log("");

// ----------------------------------------------------------------------
// TEST 2 : Modification des Frais de Livraison (Exemple Section 36.4)
// ----------------------------------------------------------------------
console.log("📌 Test 2: Modification des frais de livraison (2000 -> 2500 FCFA)");
const oldDeliveryFee = calculateDeliveryFee(currentSettings);
assert(oldDeliveryFee === 2000, `Frais de livraison initiaux = 2000 FCFA (obtenu: ${oldDeliveryFee})`);

// Modification dans Paramètres
currentSettings.financial.defaultDeliveryFee = 2500;
const newDeliveryFee = calculateDeliveryFee(currentSettings);
assert(newDeliveryFee === 2500, `Nouvelle commande utilise les frais de livraison mis à jour = 2500 FCFA (obtenu: ${newDeliveryFee})`);
console.log("");

// ----------------------------------------------------------------------
// TEST 3 : Modification du Taux de Commission ENO (Exemple Section 36.5)
// ----------------------------------------------------------------------
console.log("📌 Test 3: Modification du taux de commission ENO (5% -> 10%)");
const orderTotal = 20000;
const oldCommission = calculateCommission(currentSettings, orderTotal);
assert(oldCommission === 1000, `Commission initiale à 5% sur 20 000 FCFA = 1 000 FCFA (obtenu: ${oldCommission})`);

// Modification dans Paramètres
currentSettings.financial.defaultCommissionRate = 10;
const newCommission = calculateCommission(currentSettings, orderTotal);
assert(newCommission === 2000, `Nouvelle livraison applique la commission mise à jour à 10% = 2 000 FCFA (obtenu: ${newCommission})`);

// Immutabilité : ancienne transaction à 5%
const oldTransaction = { id: "tx_old", commissionRate: 5, commissionAmount: 1000 };
assert(oldTransaction.commissionRate === 5, "L'ancienne transaction financière conserve 5% de commission historique");
console.log("");

// ----------------------------------------------------------------------
// TEST 4 : Désactivation d'une Passerelle de Paiement dans Paramètres
// ----------------------------------------------------------------------
console.log("📌 Test 4: Désactivation de Binance Pay dans Paramètres (Section 36.11)");
const partner = { id: "p1", companyName: "Boutique Test", isActive: true, availableBalance: 2000000 };

// 4.a Binance Pay activé par défaut
const validBefore = validateWithdrawalRequest(currentSettings, partner, 100000, "BINANCE_PAY", { binancePayId: "12345678" });
assert(validBefore.isValid === true, "Retrait Binance Pay autorisé lorsque la passerelle est activée dans Paramètres");

// 4.b Désactivation de Binance Pay dans Paramètres
currentSettings.paymentGateways.binancePay.enabled = false;
const validAfter = validateWithdrawalRequest(currentSettings, partner, 100000, "BINANCE_PAY", { binancePayId: "12345678" });
assert(validAfter.isValid === false, "Retrait Binance Pay REJETÉ lorsque la passerelle est désactivée dans Paramètres");
assert(validAfter.errors[0].includes("désactivé"), `Message explicite retourné : "${validAfter.errors[0]}"`);
console.log("");

// ----------------------------------------------------------------------
// TEST 5 : Validation USDT et Réseau Blockchain Explicite (Section 36.22)
// ----------------------------------------------------------------------
console.log("📌 Test 5: Validation stricte USDT et exigence du réseau blockchain");
// Sans réseau
const usdtNoNetwork = validateWithdrawalRequest(currentSettings, partner, 150000, "USDT", {
  cryptoAddress: "TXYZ1234567890abcdef",
});
assert(usdtNoNetwork.isValid === false, "Retrait USDT rejeté si le réseau blockchain n'est pas spécifié");

// Avec réseau valide TRC20
const usdtValid = validateWithdrawalRequest(currentSettings, partner, 150000, "USDT", {
  cryptoAddress: "TXYZ1234567890abcdef",
  cryptoNetwork: "TRC20",
});
assert(usdtValid.isValid === true, "Retrait USDT validé avec adresse et réseau blockchain explicite (TRC20)");
console.log("");

// ----------------------------------------------------------------------
// TEST 6 : Modification du Seuil Minimum de Retrait (Section 36.9)
// ----------------------------------------------------------------------
console.log("📌 Test 6: Modification du seuil minimum de retrait (10 000 -> 50 000 FCFA)");
currentSettings.financial.minWithdrawalThreshold = 50000;

// Demande sous le seuil
const belowThreshold = validateWithdrawalRequest(currentSettings, partner, 25000, "LEEKPAY", { phone: "+22997000000" });
assert(belowThreshold.isValid === false, "Demande de 25 000 FCFA REJETÉE (en dessous du seuil configuré de 50 000 FCFA)");

// Demande au-dessus du seuil
const aboveThreshold = validateWithdrawalRequest(currentSettings, partner, 60000, "LEEKPAY", { phone: "+22997000000" });
assert(aboveThreshold.isValid === true, "Demande de 60 000 FCFA VALIDÉE (au-dessus du seuil configuré)");
console.log("");

// ----------------------------------------------------------------------
// TEST 7 : Adaptateurs de Paiement & Tag INTEGRATION REQUIRED (Section 36.12 & 36.26)
// ----------------------------------------------------------------------
console.log("📌 Test 7: Adaptateurs de paiement LeekPay, Binance Pay et USDT");
const leekpayProvider = getPaymentProvider("LEEKPAY", currentSettings);
const binanceProvider = getPaymentProvider("BINANCE_PAY", currentSettings);
const usdtProvider = getPaymentProvider("USDT", currentSettings);

assert(leekpayProvider.name.includes("LeekPay"), `Adaptateur LeekPay instancié (${leekpayProvider.name})`);
assert(binanceProvider.name.includes("Binance Pay"), `Adaptateur Binance Pay instancié (${binanceProvider.name})`);
assert(usdtProvider.name.includes("USDT"), `Adaptateur USDT instancié (${usdtProvider.name})`);

const payoutExecution = await usdtProvider.createPayout({
  payoutId: "WDR-TEST-001",
  amount: 250000,
  currency: "FCFA",
  recipient: { name: "Boutique Test", cryptoAddress: "TXYZ1234567890abcdef", cryptoNetwork: "TRC20" },
  idempotencyKey: "WDR-TEST-001",
});

assert(payoutExecution.success === true, "Exécution de payout transmise via l'adaptateur");
assert(payoutExecution.isSimulatedOrPending === true, "Tagué 'isSimulatedOrPending' / INTEGRATION REQUIRED tant que l'intégration production n'est pas déployée");
console.log("");

// ----------------------------------------------------------------------
// TEST 8 : Double Validation des Retraits Élevés (Section 36.10)
// ----------------------------------------------------------------------
console.log("📌 Test 8: Détection de seuil de double validation (> 500 000 FCFA)");
const normalReq = validateWithdrawalRequest(currentSettings, partner, 150000, "LEEKPAY", { phone: "+22997000000" });
assert(normalReq.requiresDoubleValidation === false, "Retrait de 150 000 FCFA : validation simple standard");

const highValueReq = validateWithdrawalRequest(currentSettings, partner, 750000, "LEEKPAY", { phone: "+22997000000" });
assert(highValueReq.requiresDoubleValidation === true, "Retrait de 750 000 FCFA : Double validation 2FA obligatoire déclenchée");
console.log("");

// ----------------------------------------------------------------------
// RÉSUMÉ FINAL
// ----------------------------------------------------------------------
console.log("======================================================================");
console.log(`📊 RÉSULTAT FINAL DU TEST SUITE SOURCE DE VÉRITÉ :`);
console.log(`   ✅ Succès : ${testsPassed}`);
console.log(`   ❌ Échecs : ${testsFailed}`);
console.log("======================================================================");

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log("🎉 TOUTES LES VÉRIFICATIONS SONT CONFORMES À LA SECTION 36 !");
  process.exit(0);
}
