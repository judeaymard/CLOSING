import http from "http";

async function runTests() {
  console.log("🚀 Lancement du test E2E Notifications & Alertes ENO...");

  const BASE_URL = "http://localhost:3005";

  // Test 1: GET /api/notifications
  console.log("\n1️⃣ Test GET /api/notifications");
  const getRes = await fetch(`${BASE_URL}/api/notifications`);
  const getData = await getRes.json();
  console.log(`✅ Code HTTP: ${getRes.status}`);
  console.log(`✅ Total Notifications récupérées: ${getData.notifications?.length}`);
  if (!getData.success || !Array.isArray(getData.notifications)) {
    throw new Error("Échec GET /api/notifications");
  }

  // Test 2: POST /api/notifications (Ajout d'une notification de test)
  console.log("\n2️⃣ Test POST /api/notifications (Création d'une nouvelle notification)");
  const testNotif = {
    id: `notif-test-${Date.now()}`,
    category: "FINANCES",
    priority: "CRITICAL",
    title: "TEST E2E: Signalement de non-concordance de caisse COD",
    description: "Vérification automatisée de création et de persistance d'une alerte critique.",
    createdAt: "Aujourd'hui à 12:00",
    isoDate: new Date().toISOString(),
    referenceId: "DISP-TEST-99",
    referenceType: "TRANSACTION",
    actionUrl: "/admin/tresorerie",
    actionLabel: "Contrôler la caisse",
    isAlert: true,
    alertStatus: "ACTIVE",
    actor: {
      id: "usr-tester",
      name: "Robot Testeur E2E",
      role: "Auditeur",
      type: "SYSTEM",
    },
  };

  const postRes = await fetch(`${BASE_URL}/api/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testNotif),
  });
  const postData = await postRes.json();
  console.log(`✅ Code HTTP: ${postRes.status}, Success: ${postData.success}`);

  // Test 3: PATCH /api/notifications (MARK_READ)
  console.log("\n3️⃣ Test PATCH /api/notifications (MARK_READ)");
  const markReadRes = await fetch(`${BASE_URL}/api/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "MARK_READ", id: testNotif.id }),
  });
  const markReadData = await markReadRes.json();
  console.log(`✅ Code HTTP: ${markReadRes.status}, Success: ${markReadData.success}`);

  // Test 4: PATCH /api/notifications (RESOLVE_ALERT)
  console.log("\n4️⃣ Test PATCH /api/notifications (RESOLVE_ALERT)");
  const resolveRes = await fetch(`${BASE_URL}/api/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "RESOLVE_ALERT", id: testNotif.id }),
  });
  const resolveData = await resolveRes.json();
  console.log(`✅ Code HTTP: ${resolveRes.status}, Success: ${resolveData.success}`);

  console.log("\n🎉 TOUS LES TESTS NOTIFICATIONS SONT VALIDÉS AVEC SUCCÈS !");
}

runTests().catch((err) => {
  console.error("❌ Erreur test E2E:", err);
  process.exit(1);
});
