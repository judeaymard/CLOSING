import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getAttachmentById, checkAttachmentAccess } from "@/lib/server-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userRole = searchParams.get("userRole") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const isDownload = searchParams.get("download") === "1";

    const attachment = await getAttachmentById(id);

    if (!attachment) {
      return NextResponse.json(
        { error: "Pièce jointe introuvable dans la base de données." },
        { status: 404 }
      );
    }

    // Vérification des permissions d'accès
    const access = await checkAttachmentAccess(attachment, userRole, userId);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason || "Accès refusé à cette pièce jointe." },
        { status: 403 }
      );
    }

    // Résolution du chemin physique
    let targetPath = attachment.storagePath;

    // Si le storagePath n'est pas direct ou s'il est relatif, rechercher dans les emplacements standard
    let fileBuffer: Buffer | null = null;

    if (targetPath) {
      try {
        fileBuffer = await fs.readFile(targetPath);
      } catch {}
    }

    // Essayer les emplacements de secours
    if (!fileBuffer && attachment.conversationId) {
      const pathsToTry = [
        path.join(process.cwd(), "storage", "attachments", attachment.conversationId, `${attachment.id}_${attachment.fileName}`),
        path.join(process.cwd(), "public", "uploads", "conversations", attachment.conversationId, `${attachment.id}_${attachment.fileName}`),
        attachment.url.startsWith("/uploads/")
          ? path.join(process.cwd(), "public", attachment.url.replace(/^\//, ""))
          : null,
      ].filter(Boolean) as string[];

      for (const p of pathsToTry) {
        try {
          fileBuffer = await fs.readFile(p);
          targetPath = p;
          break;
        } catch {}
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: "Fichier physique introuvable sur le serveur de stockage." },
        { status: 404 }
      );
    }

    // Encodage du nom de fichier pour le header Content-Disposition
    const safeFileName = encodeURIComponent(attachment.fileName || "piece_jointe");
    const disposition = isDownload
      ? `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`
      : `inline; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`;

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": attachment.mimeType || "application/octet-stream",
        "Content-Length": fileBuffer.length.toString(),
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Erreur serveur lors de la récupération de la pièce jointe:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur interne lors de la lecture du fichier." },
      { status: 500 }
    );
  }
}
