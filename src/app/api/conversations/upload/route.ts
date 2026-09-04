import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_LABEL,
  ALLOWED_MIME_TYPES,
  BLOCKED_EXTENSIONS,
  formatFileSize,
  getAttachmentType,
} from "@/lib/attachments";
import { ChatAttachment } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const conversationId = (formData.get("conversationId") as string) || "general";
    const uploadedBy = (formData.get("uploadedBy") as string) || "Utilisateur";

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
        { error: `Le type de fichier .${cleanExt} est strictement interdit.` },
        { status: 400 }
      );
    }

    // 3. Validation du type MIME
    const mimeType = file.type || "application/octet-stream";
    const fileType = getAttachmentType(mimeType, originalName);

    // 4. Préparation du répertoire de stockage persistant
    const sanitizedConvId = conversationId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const uploadDir = path.join(process.cwd(), "public", "uploads", "conversations", sanitizedConvId);
    await fs.mkdir(uploadDir, { recursive: true });

    // 5. Génération d'un nom de fichier unique et sécurisé
    const uniqueId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const sanitizedBaseName = path
      .basename(originalName, `.${cleanExt}`)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const storedFileName = `${uniqueId}_${sanitizedBaseName}.${cleanExt}`;
    const filePath = path.join(uploadDir, storedFileName);

    // 6. Écriture du fichier sur disque
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/conversations/${sanitizedConvId}/${storedFileName}`;

    const attachment: ChatAttachment = {
      id: uniqueId,
      conversationId: sanitizedConvId,
      uploadedBy,
      fileName: originalName,
      mimeType,
      fileSize: formatFileSize(file.size),
      fileSizeBytes: file.size,
      storagePath: filePath,
      url: publicUrl,
      type: fileType,
      createdAt: new Date().toISOString(),
      status: "UPLOADED",
      progress: 100,
    };

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

    if (!fileUrl || !fileUrl.startsWith("/uploads/conversations/")) {
      return NextResponse.json({ error: "URL de fichier invalide" }, { status: 400 });
    }

    const relativePath = fileUrl.replace(/^\//, "");
    const fullPath = path.join(process.cwd(), "public", relativePath);

    try {
      await fs.unlink(fullPath);
    } catch {
      // Si le fichier physique n'existe plus, continuer
    }

    return NextResponse.json({ success: true, message: "Pièce jointe supprimée." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
