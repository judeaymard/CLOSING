// Test de bout en bout de l'architecture d'upload et de persistance réelle des pièces jointes
import { promises as fs } from "fs";
import path from "path";

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log("==================================================");
  console.log("🧪 DÉBUT DES TESTS AUTOMATISÉS DE BOUT EN BOUT");
  console.log("==================================================");

  let successCount = 0;
  let failureCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [SUCCÈS] ${message}`);
      successCount++;
    } else {
      console.error(`❌ [ÉCHEC] ${message}`);
      failureCount++;
    }
  }

  // 1. Tester l'upload d'une vraie image JPG
  console.log("\n--- TEST 1 : UPLOAD D'UNE PHOTO RÉELLE (JPG) ---");
  const testJpgBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00,
    0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c,
    0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01,
    0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);

  const fileJpg = new File([testJpgBuffer], "photo_colis_test.jpg", { type: "image/jpeg" });
  const formDataJpg = new FormData();
  formDataJpg.append("file", fileJpg);
  formDataJpg.append("conversationId", "conv-1");
  formDataJpg.append("uploadedBy", "Jude S. (PDG)");
  formDataJpg.append("uploadedByRole", "PDG");

  const uploadJpgRes = await fetch(`${BASE_URL}/api/conversations/upload`, {
    method: "POST",
    body: formDataJpg,
  });

  const uploadJpgText = await uploadJpgRes.text();
  let uploadJpgData = {};
  try {
    uploadJpgData = JSON.parse(uploadJpgText);
  } catch (e) {
    console.error("Réponse serveur non-JSON:", uploadJpgText.slice(0, 300));
  }

  assert(uploadJpgRes.status === 201, `Status HTTP 201 créé (${uploadJpgRes.status})`);
  assert(uploadJpgData.success === true, "Upload JPG réussi");
  assert(uploadJpgData.attachment && uploadJpgData.attachment.id, "ID d'attachement généré");
  assert(uploadJpgData.attachment && uploadJpgData.attachment.type === "IMAGE", "Type d'attachement IMAGE");

  const photoAttachmentId = uploadJpgData.attachment?.id;

  // 2. Tester l'upload d'un vrai document PDF
  console.log("\n--- TEST 2 : UPLOAD D'UN DOCUMENT PDF RÉEL ---");
  const testPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n162\n%%EOF");

  const filePdf = new File([testPdfBuffer], "bordereau_livraison_20412.pdf", { type: "application/pdf" });
  const formDataPdf = new FormData();
  formDataPdf.append("file", filePdf);
  formDataPdf.append("conversationId", "conv-1");
  formDataPdf.append("uploadedBy", "Jude S. (PDG)");
  formDataPdf.append("uploadedByRole", "PDG");

  const uploadPdfRes = await fetch(`${BASE_URL}/api/conversations/upload`, {
    method: "POST",
    body: formDataPdf,
  });

  const uploadPdfData = await uploadPdfRes.json();
  assert(uploadPdfRes.status === 201, `Status HTTP 201 créé pour PDF (${uploadPdfRes.status})`);
  assert(uploadPdfData.attachment && uploadPdfData.attachment.type === "PDF", "Type d'attachement PDF");

  const pdfAttachmentId = uploadPdfData.attachment?.id;

  // 3. Tester le rejet d'un fichier exécutable interdit (.exe)
  console.log("\n--- TEST 3 : SÉCURITÉ - REJET FICHIER EXÉCUTABLE ---");
  const fileExe = new File(["MALICIOUS CODE"], "virus.exe", { type: "application/x-msdownload" });
  const formDataExe = new FormData();
  formDataExe.append("file", fileExe);
  formDataExe.append("conversationId", "conv-1");

  const uploadExeRes = await fetch(`${BASE_URL}/api/conversations/upload`, {
    method: "POST",
    body: formDataExe,
  });
  assert(uploadExeRes.status === 400, `Exécutable .exe correctement rejeté (HTTP 400)`);

  // 4. Tester l'association Message ↔ Pièces jointes multiples
  console.log("\n--- TEST 4 : CRÉATION MESSAGE AVEC MULTI-PIÈCES JOINTES ---");
  const msgRes = await fetch(`${BASE_URL}/api/conversations/conv-1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "Voici la photo du colis et le bordereau de livraison.",
      isInternalNote: false,
      sender: "PDG",
      senderName: "Jude S. (PDG)",
      attachments: [uploadJpgData.attachment, uploadPdfData.attachment],
    }),
  });

  const msgData = await msgRes.json();
  assert(msgRes.status === 201, `Message créé avec succès (HTTP 201)`);
  assert(msgData.message && msgData.message.attachments.length === 2, "2 pièces jointes associées au message");
  assert(msgData.conversation && msgData.conversation.messages.length > 0, "Conversation mise à jour côté serveur");

  // 5. Tester la récupération sécurisée et le streaming du fichier via l'API
  console.log("\n--- TEST 5 : RÉCUPÉRATION SÉCURISÉE DE LA PHOTO VIA L'API ---");
  const getAttRes = await fetch(`${BASE_URL}/api/attachments/${photoAttachmentId}?userRole=PDG`);
  assert(getAttRes.status === 200, `Fichier récupéré via /api/attachments/${photoAttachmentId} (HTTP 200)`);
  assert(getAttRes.headers.get("content-type") === "image/jpeg", "Content-Type image/jpeg vérifié");
  const retrievedBuffer = await getAttRes.arrayBuffer();
  assert(retrievedBuffer.byteLength === testJpgBuffer.length, `Intégrité des données vérifiée (${retrievedBuffer.byteLength} octets)`);

  // 6. Tester la vérification des permissions (Accès refusé pour un partenaire tiers)
  console.log("\n--- TEST 6 : CONTRÔLE D'ACCÈS & PERMISSIONS ---");
  const getDeniedRes = await fetch(`${BASE_URL}/api/attachments/${photoAttachmentId}?userRole=PARTNER&userId=p99_unauthorized`);
  assert(getDeniedRes.status === 403, `Accès refusé pour un partenaire non autorisé (HTTP 403)`);

  // 7. Tester la persistance globale des conversations depuis l'API
  console.log("\n--- TEST 7 : PERSISTANCE DES CONVERSATIONS APRÈS RELOAD ---");
  const convsRes = await fetch(`${BASE_URL}/api/conversations`);
  const convsData = await convsRes.json();
  const targetConv = convsData.conversations.find((c) => c.id === "conv-1");
  assert(targetConv !== undefined, "Conversation conv-1 trouvée sur le serveur");
  const lastMsg = targetConv.messages[targetConv.messages.length - 1];
  assert(lastMsg.attachments && lastMsg.attachments.length === 2, "2 pièces jointes toujours présentes sur le serveur");
  assert(lastMsg.attachments[0].id === photoAttachmentId, "Photo toujours liée avec le même ID");

  console.log("\n==================================================");
  console.log(`📊 BILAN DES TESTS : ${successCount} SUCCÈS, ${failureCount} ÉCHECS`);
  console.log("==================================================");

  if (failureCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Erreur d'exécution des tests:", err);
  process.exit(1);
});
