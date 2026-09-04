import { promises as fs } from "fs";
import path from "path";
import { Conversation, ChatMessage, ChatAttachment } from "./types";
import { initialConversations } from "./mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");
const ATTACHMENTS_FILE = path.join(DATA_DIR, "attachments.json");
const STORAGE_DIR = path.join(process.cwd(), "storage", "attachments");
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "conversations");

/**
 * Initialise les répertoires et fichiers de persistance serveur si nécessaire.
 */
export async function initDatabase(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.mkdir(PUBLIC_UPLOADS_DIR, { recursive: true });

    // Initialisation du fichier conversations.json s'il n'existe pas
    try {
      await fs.access(CONVERSATIONS_FILE);
    } catch {
      await fs.writeFile(
        CONVERSATIONS_FILE,
        JSON.stringify(initialConversations, null, 2),
        "utf-8"
      );
    }

    // Initialisation du fichier attachments.json s'il n'existe pas
    try {
      await fs.access(ATTACHMENTS_FILE);
    } catch {
      await fs.writeFile(ATTACHMENTS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données serveur:", error);
  }
}

/**
 * Récupère l'ensemble des conversations enregistrées côté serveur.
 */
export async function getConversations(): Promise<Conversation[]> {
  await initDatabase();
  try {
    const data = await fs.readFile(CONVERSATIONS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error("Erreur lecture conversations.json:", error);
  }
  return initialConversations;
}

/**
 * Récupère une conversation spécifique par son identifiant.
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  const conversations = await getConversations();
  return conversations.find((c) => c.id === id) || null;
}

/**
 * Enregistre ou met à jour une conversation.
 */
export async function saveConversation(conversation: Conversation): Promise<Conversation> {
  await initDatabase();
  const conversations = await getConversations();
  const index = conversations.findIndex((c) => c.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.unshift(conversation);
  }

  await fs.writeFile(
    CONVERSATIONS_FILE,
    JSON.stringify(conversations, null, 2),
    "utf-8"
  );
  return conversation;
}

/**
 * Récupère l'ensemble des métadonnées de pièces jointes enregistrées.
 */
export async function getAttachments(): Promise<ChatAttachment[]> {
  await initDatabase();
  try {
    const data = await fs.readFile(ATTACHMENTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error("Erreur lecture attachments.json:", error);
  }
  return [];
}

/**
 * Récupère une pièce jointe par son identifiant unique.
 */
export async function getAttachmentById(id: string): Promise<ChatAttachment | null> {
  const attachments = await getAttachments();
  return attachments.find((a) => a.id === id) || null;
}

/**
 * Enregistre une nouvelle pièce jointe dans la base de données.
 */
export async function saveAttachment(attachment: ChatAttachment): Promise<ChatAttachment> {
  await initDatabase();
  const attachments = await getAttachments();
  const index = attachments.findIndex((a) => a.id === attachment.id);

  if (index >= 0) {
    attachments[index] = attachment;
  } else {
    attachments.unshift(attachment);
  }

  await fs.writeFile(
    ATTACHMENTS_FILE,
    JSON.stringify(attachments, null, 2),
    "utf-8"
  );
  return attachment;
}

/**
 * Enregistre un message dans une conversation et relie les pièces jointes associées.
 */
export async function saveMessageToConversation(
  conversationId: string,
  message: ChatMessage
): Promise<{ conversation: Conversation; message: ChatMessage }> {
  await initDatabase();
  const conversations = await getConversations();
  const convIndex = conversations.findIndex((c) => c.id === conversationId);

  let targetConv: Conversation;
  if (convIndex >= 0) {
    targetConv = conversations[convIndex];
  } else {
    targetConv = {
      id: conversationId,
      partnerId: "p1",
      partnerName: "Client Inconnu",
      companyName: conversationId,
      phone: "+229 00 00 00 00",
      lastMessage: message.text || "Nouvelle conversation",
      lastMessageAt: "À l'instant",
      unreadCount: 0,
      status: "OPEN",
      priority: "NORMAL",
      messages: [],
    };
    conversations.unshift(targetConv);
  }

  // Mettre à jour les pièces jointes avec le messageId
  if (message.attachments && message.attachments.length > 0) {
    const attachments = await getAttachments();
    let updatedAttachments = false;

    for (const att of message.attachments) {
      const attIndex = attachments.findIndex((a) => a.id === att.id);
      if (attIndex >= 0) {
        attachments[attIndex].messageId = message.id;
        attachments[attIndex].conversationId = conversationId;
        updatedAttachments = true;
      } else {
        attachments.push({
          ...att,
          messageId: message.id,
          conversationId,
        });
        updatedAttachments = true;
      }
    }

    if (updatedAttachments) {
      await fs.writeFile(
        ATTACHMENTS_FILE,
        JSON.stringify(attachments, null, 2),
        "utf-8"
      );
    }
  }

  // Ajouter le message à la conversation
  const updatedMessages = [...targetConv.messages, message];
  const hasAtts = message.attachments && message.attachments.length > 0;
  const attLabel = hasAtts
    ? ` (${message.attachments!.length} pièce${message.attachments!.length > 1 ? "s" : ""} jointe${message.attachments!.length > 1 ? "s" : ""})`
    : "";

  targetConv.messages = updatedMessages;
  targetConv.lastMessage = `${message.text || "Fichier joint"}${attLabel}`;
  targetConv.lastMessageAt = "À l'instant";
  targetConv.status = targetConv.status === "RESOLVED" ? "OPEN" : targetConv.status;

  await fs.writeFile(
    CONVERSATIONS_FILE,
    JSON.stringify(conversations, null, 2),
    "utf-8"
  );

  return { conversation: targetConv, message };
}

/**
 * Vérifie si un utilisateur a le droit d'accéder à une pièce jointe selon les règles de permission.
 */
export async function checkAttachmentAccess(
  attachment: ChatAttachment,
  userRole?: string,
  userId?: string
): Promise<{ allowed: boolean; reason?: string }> {
  // Sans rôle spécifié ou rôle système PDG / Direction
  if (!userRole || userRole === "PDG" || userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return { allowed: true };
  }

  // Responsable de trésorerie : accès aux pièces jointes de la plateforme
  if (userRole === "TREASURY_MANAGER" || userRole === "TREASURY") {
    return { allowed: true };
  }

  // Trouver la conversation associée
  if (attachment.conversationId) {
    const conv = await getConversationById(attachment.conversationId);
    if (!conv) {
      return { allowed: false, reason: "Conversation introuvable." };
    }

    // Closeuse : autorisée si la conversation est assignée à elle ou non assignée
    if (userRole === "CLOSEUSE" || userRole === "AGENT") {
      if (!conv.assignedAgentId || conv.assignedAgentId === userId || !userId) {
        return { allowed: true };
      }
      return { allowed: true }; // Closeuses de l'agence autorisées à consulter les supports
    }

    // E-commerçant / Partenaire : autorisé seulement pour ses propres conversations
    if (userRole === "PARTNER" || userRole === "ECOMMERCANT") {
      if (userId && conv.partnerId && conv.partnerId !== userId) {
        return {
          allowed: false,
          reason: "Vous n'êtes pas autorisé à accéder aux fichiers de cette conversation.",
        };
      }
      return { allowed: true };
    }
  }

  return { allowed: true };
}
