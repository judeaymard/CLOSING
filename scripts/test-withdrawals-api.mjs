import { promises as fs } from "fs";
import path from "path";

console.log("======================================================================");
console.log("🏦 TEST ENDPOINT & WORKFLOW : API /api/withdrawals & SERVER DB");
console.log("======================================================================\n");

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const PAYOUTS_FILE = path.join(DATA_DIR, "payouts.json");
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");

let passed = 0;
let failed = 0;

function check(cond, msg) {
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

// 1. Verify existence of data directory and files
try {
  const settingsData = await fs.readFile(SETTINGS_FILE, "utf-8");
  const parsedSettings = JSON.parse(settingsData);
  check(parsedSettings && typeof parsedSettings === "object", "data/settings.json lisible et valide");
  check(parsedSettings.financial.minWithdrawalThreshold >= 0, `Seuil de retrait = ${parsedSettings.financial.minWithdrawalThreshold} FCFA`);
  check(parsedSettings.paymentGateways.leekpay !== undefined, "Configuration LeekPay présente");
} catch (e) {
  check(false, `Erreur lecture settings.json: ${e.message}`);
}

// 2. Verify server-side db methods directly via module
const {
  getPayoutRequests,
  savePayoutRequest,
  updatePayoutRequest,
  getTransactions,
  saveTransaction,
  getGlobalAuditLogs,
} = await import("../src/lib/server-db.ts");

// 2.a Test savePayoutRequest
const testPayoutId = `WDR-TEST-${Date.now()}`;
const newPayout = {
  id: testPayoutId,
  partnerId: "p-test",
  partnerName: "Boutique E2E Test",
  amount: 75000,
  reservedAmount: 75000,
  operator: "LEEKPAY",
  phone: "+229 97 00 00 00",
  requestedAt: new Date().toISOString(),
  status: "PENDING",
  balanceBefore: 1500000,
  balanceAfter: 1425000,
};

await savePayoutRequest(newPayout);
const payoutsList = await getPayoutRequests();
const found = payoutsList.find((p) => p.id === testPayoutId);
check(found !== undefined, `Retrait ${testPayoutId} enregistré sur le serveur`);
check(found?.status === "PENDING", "Statut initial 'PENDING'");
check(found?.reservedAmount === 75000, "Montant verrouillé = 75 000 FCFA");

// 2.b Test updatePayoutRequest to APPROVED
await updatePayoutRequest(testPayoutId, { status: "APPROVED", approvedAt: new Date().toISOString() });
const updatedList = await getPayoutRequests();
const foundUpdated = updatedList.find((p) => p.id === testPayoutId);
check(foundUpdated?.status === "APPROVED", "Statut transitionné vers 'APPROVED'");

// 2.c Test updatePayoutRequest to PAID with transaction
await updatePayoutRequest(testPayoutId, {
  status: "PAID",
  paidAt: new Date().toISOString(),
  paymentReference: "REF-LEEK-998877",
  reservedAmount: 0,
});
const foundPaid = (await getPayoutRequests()).find((p) => p.id === testPayoutId);
check(foundPaid?.status === "PAID", "Statut transitionné vers 'PAID'");
check(foundPaid?.reservedAmount === 0, "Montant réservé libéré à 0 FCFA après paiement");

// 2.d Verify financial transaction recording
const testTx = {
  id: `tx-${Date.now()}`,
  txReference: `TX-RET-${testPayoutId}`,
  date: new Date().toISOString().replace("T", " ").slice(0, 16),
  type: "RETRAIT",
  label: `Retrait Marchand Boutique E2E Test (LEEKPAY)`,
  partnerId: "p-test",
  partnerName: "Boutique E2E Test",
  inflow: 0,
  outflow: 75000,
  balanceAfter: 1425000,
  status: "COMPLETED",
  notes: "Virement exécuté avec succès.",
};
await saveTransaction(testTx);
const allTxs = await getTransactions();
const foundTx = allTxs.find((t) => t.txReference === testTx.txReference);
check(foundTx !== undefined, `Transaction financière ${testTx.txReference} enregistrée dans le Grand Livre`);

console.log("\n======================================================================");
console.log(`📊 RÉSULTAT DU TEST API & SERVEUR RETRAITS :`);
console.log(`   ✅ Succès : ${passed}`);
console.log(`   ❌ Échecs : ${failed}`);
console.log("======================================================================");

if (failed > 0) process.exit(1);
process.exit(0);
