import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_LABEL,
  BLOCKED_EXTENSIONS,
  formatFileSize,
  getAttachmentType,
} from "@/lib/attachments";
import { ChatAttachment } from "@/lib/types";
import { saveAttachment } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const conversationId = (formData.get("conversationId") as string) || "general";
    const uploadedBy = (formData.get("uploadedBy") as string) || "Utilisateur";
    const uploadedByRole = (formData.get("uploadedByRole") as string) || undefined;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni dans la requête." },
        { status: 400 }
      );
    }

    // 1. Validation de la taille (20 MB)
    if (file.size > MAX_ATTACHMENT_SIZE) {
      return NextResponse.json(
        {
          error: `Le fichier dépasse la limite maximale autorisée de ${MAX_ATTACHMENT_SIZE_LABEL} (${formatFileSize(file.size)}).`,
        },
        { status: 400 }
      );
    }

    // 2. Validation de l'extension et sécurité
    const originalName = file.name || "fichier";
    const cleanExt = originalName.split(".").pop()?.toLowerCase() || "";

    if (BLOCKED_EXTENSIONS.includes(cleanExt)) {
      return NextResponse.json(
        { error: `Le type de fichier .${cleanExt} est strictement interdit pour des raisons de sécurité.` },
        { status: 400 }
      );
    }

    // 3. Validation du type MIME
    const mimeType = file.type || "application/octet-stream";
    const fileType = getAttachmentType(mimeType, originalName);

    // 4. Préparation des répertoires de stockage persistant
    const sanitizedConvId = conversationId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const storageDir = path.join(process.cwd(), "storage", "attachments", sanitizedConvId);
    const publicDir = path.join(process.cwd(), "public", "uploads", "conversations", sanitizedConvId);

    await fs.mkdir(storageDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    // 5. Génération d'un identifiant et d'un nom de fichier uniques
    const uniqueId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const sanitizedBaseName = path
      .basename(originalName, `.${cleanExt}`)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const storedFileName = `${uniqueId}_${sanitizedBaseName}.${cleanExt}`;
    const storageFilePath = path.join(storageDir, storedFileName);
    const publicFilePath = path.join(publicDir, storedFileName);

    // 6. Écriture physique du fichier sur disque
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(storageFilePath, buffer);
    await fs.writeFile(publicFilePath, buffer);

    const secureApiUrl = `/api/attachments/${uniqueId}`;
    const directFallbackUrl = `/uploads/conversations/${sanitizedConvId}/${storedFileName}`;

    const attachment: ChatAttachment = {
      id: uniqueId,
      conversationId: sanitizedConvId,
      uploadedBy,
      uploadedByRole,
      fileName: originalName,
      mimeType,
      fileSize: formatFileSize(file.size),
      fileSizeBytes: file.size,
      storagePath: storageFilePath,
      url: secureApiUrl,
      thumbnailUrl: fileType === "IMAGE" ? directFallbackUrl : undefined,
      type: fileType,
      createdAt: new Date().toISOString(),
      status: "UPLOADED",
      progress: 100,
    };

    // 7. Enregistrement dans la base de données serveur
    await saveAttachment(attachment);

    return NextResponse.json({ success: true, attachment }, { status: 201 });
  } catch (error: any) {
    console.error("Erreur upload pièce jointe:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de l'enregistrement du fichier." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "URL de fichier invalide" }, { status: 400 });
    }

    if (fileUrl.startsWith("/uploads/conversations/")) {
      const relativePath = fileUrl.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relativePath);
      try {
        await fs.unlink(fullPath);
      } catch {}
    }

    return NextResponse.json({ success: true, message: "Pièce jointe traitée." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
