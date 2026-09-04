import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformSettings,
  savePlatformSettings,
  getRolePermissions,
  saveRolePermissions,
} from "@/lib/server-db";
import { platformRoles, platformPermissions } from "@/lib/mock-data";

export async function GET() {
  try {
    const [settings, rolePermissions] = await Promise.all([
      getPlatformSettings(),
      getRolePermissions(),
    ]);

    return NextResponse.json({
      success: true,
      settings,
      rolePermissions,
      roles: platformRoles,
      permissions: platformPermissions,
    });
  } catch (error) {
    console.error("Erreur API GET /api/settings:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de récupérer les paramètres" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    if (body.type === "ROLE_PERMISSIONS" && body.roleId && Array.isArray(body.permissions)) {
      const updatedMap = await saveRolePermissions(body.roleId, body.permissions);
      return NextResponse.json({
        success: true,
        message: "Permissions mises à jour avec succès",
        rolePermissions: updatedMap,
      });
    }

    // Default: update entire settings or section
    const current = await getPlatformSettings();
    const updatedSettings = {
      ...current,
      ...body.settings,
      lastUpdated: new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " à " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      updatedBy: body.updatedBy || "Jude S. (PDG)",
    };

    const saved = await savePlatformSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: "Paramètres enregistrés avec succès",
      settings: saved,
    });
  } catch (error) {
    console.error("Erreur API PUT /api/settings:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement des paramètres" },
      { status: 500 }
    );
  }
}
