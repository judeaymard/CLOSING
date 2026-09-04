import { NextRequest, NextResponse } from "next/server";
import {
  getNotifications,
  saveNotification,
  markNotificationRead,
  markAllNotificationsRead,
  resolveNotificationAlert,
} from "@/lib/server-db";
import { PlatformNotification } from "@/lib/types";

export async function GET() {
  try {
    const notifications = await getNotifications();
    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error("Erreur récupération des notifications:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const newNotif: PlatformNotification = {
      id: body.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      category: body.category || "SYSTEME",
      priority: body.priority || "INFO",
      title: body.title || "Nouvelle notification",
      description: body.description || "",
      isRead: false,
      createdAt: body.createdAt || `À l'instant (${timeFormatted})`,
      isoDate: body.isoDate || now.toISOString(),
      actionUrl: body.actionUrl,
      actionLabel: body.actionLabel,
      referenceId: body.referenceId,
      referenceType: body.referenceType,
      isAlert: Boolean(body.isAlert),
      alertStatus: body.isAlert ? "ACTIVE" : undefined,
      actor: body.actor,
      metadata: body.metadata,
    };

    const saved = await saveNotification(newNotif);
    return NextResponse.json({ success: true, notification: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Erreur création notification:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur lors de la création de la notification." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === "MARK_ALL_READ") {
      const updated = await markAllNotificationsRead();
      return NextResponse.json({ success: true, notifications: updated });
    }

    if (action === "MARK_READ" && id) {
      const updated = await markNotificationRead(id);
      return NextResponse.json({ success: true, notification: updated });
    }

    if (action === "RESOLVE_ALERT" && id) {
      const updated = await resolveNotificationAlert(id);
      return NextResponse.json({ success: true, notification: updated });
    }

    return NextResponse.json(
      { error: "Action non reconnue ou identifiant manquant." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Erreur mise à jour notification:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la mise à jour." },
      { status: 500 }
    );
  }
}
