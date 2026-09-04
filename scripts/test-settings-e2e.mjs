async function runTests() {
  console.log("🚀 Lancement des tests E2E Paramètres & Permissions ENO...");

  const BASE_URL = "http://localhost:3005";

  // Test 1: GET /api/settings
  console.log("\n1️⃣ Test GET /api/settings");
  const getSettingsRes = await fetch(`${BASE_URL}/api/settings`);
  const getSettingsData = await getSettingsRes.json();
  console.log(`✅ Code HTTP: ${getSettingsRes.status}`);
  console.log(`✅ Paramètres plateforme reçus: Nom = "${getSettingsData.settings?.general?.platformName}"`);
  console.log(`✅ Total Rôles configurés: ${getSettingsData.roles?.length}`);
  console.log(`✅ Total Permissions granulaires: ${getSettingsData.permissions?.length}`);
  if (!getSettingsData.success || !getSettingsData.settings) {
    throw new Error("Échec GET /api/settings");
  }

  // Test 2: PUT /api/settings (Update financial parameters)
  console.log("\n2️⃣ Test PUT /api/settings (Mise à jour des règles financières)");
  const updateSettingsRes = await fetch(`${BASE_URL}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      settings: {
        financial: {
          ...getSettingsData.settings.financial,
          defaultCommissionRate: 6.5,
          minWithdrawalThreshold: 15000,
        },
      },
      updatedBy: "Robot Testeur E2E (PDG)",
    }),
  });
  const updateSettingsData = await updateSettingsRes.json();
  console.log(`✅ Code HTTP: ${updateSettingsRes.status}, Success: ${updateSettingsData.success}`);
  console.log(`✅ Nouvelle commission: ${updateSettingsData.settings?.financial?.defaultCommissionRate}%`);
  if (!updateSettingsData.success) {
    throw new Error("Échec PUT /api/settings");
  }

  // Test 3: PUT /api/settings (Update Role Permissions)
  console.log("\n3️⃣ Test PUT /api/settings (Mise à jour des permissions rôle)");
  const updatePermsRes = await fetch(`${BASE_URL}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "ROLE_PERMISSIONS",
      roleId: "CLOSEUSE",
      permissions: ["orders.view", "orders.edit", "conversations.view", "conversations.reply", "notifications.view"],
    }),
  });
  const updatePermsData = await updatePermsRes.json();
  console.log(`✅ Code HTTP: ${updatePermsRes.status}, Success: ${updatePermsData.success}`);
  if (!updatePermsData.success) {
    throw new Error("Échec PUT /api/settings permissions");
  }

  // Test 4: GET /api/users
  console.log("\n4️⃣ Test GET /api/users");
  const getUsersRes = await fetch(`${BASE_URL}/api/users`);
  const getUsersData = await getUsersRes.json();
  console.log(`✅ Code HTTP: ${getUsersRes.status}`);
  console.log(`✅ Total Utilisateurs annuaire: ${getUsersData.users?.length}`);
  if (!getUsersData.success || !Array.isArray(getUsersData.users)) {
    throw new Error("Échec GET /api/users");
  }

  // Test 5: POST /api/users (Create new user)
  console.log("\n5️⃣ Test POST /api/users (Création d'un nouvel utilisateur)");
  const testUser = {
    id: `usr-test-${Date.now()}`,
    firstName: "Alexandre",
    lastName: "Gbedo",
    email: `alexandre.gbedo.${Date.now()}@enolivraison.com`,
    phone: "+229 01 99 88 77 66",
    role: "LOGISTICS_MANAGER",
    roleLabel: "Responsable Logistique",
    status: "active",
    zone: "Hub Calavi",
  };
  const createUserRes = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
  const createUserData = await createUserRes.json();
  console.log(`✅ Code HTTP: ${createUserRes.status}, Success: ${createUserData.success}`);
  console.log(`✅ Notice retournée: ${createUserData.notice}`);
  if (!createUserData.success) {
    throw new Error("Échec POST /api/users");
  }

  // Test 6: PATCH /api/users (Suspend user)
  console.log("\n6️⃣ Test PATCH /api/users (Suspension d'un utilisateur)");
  const suspendUserRes = await fetch(`${BASE_URL}/api/users`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: testUser.id,
      updates: { status: "suspended" },
    }),
  });
  const suspendUserData = await suspendUserRes.json();
  console.log(`✅ Code HTTP: ${suspendUserRes.status}, Success: ${suspendUserData.success}`);
  console.log(`✅ Nouveau statut: ${suspendUserData.user?.status}`);
  if (!suspendUserData.success || suspendUserData.user?.status !== "suspended") {
    throw new Error("Échec PATCH /api/users");
  }

  console.log("\n🎉 TOUS LES TESTS PARAMÈTRES & PERMISSIONS SONT VALIDÉS AVEC SUCCÈS !");
}

runTests().catch((err) => {
  console.error("❌ Erreur test E2E:", err);
  process.exit(1);
});
