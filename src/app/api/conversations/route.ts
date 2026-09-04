import { NextResponse } from "next/server";
import { getConversations } from "@/lib/server-db";

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json({ success: true, conversations });
  } catch (error: any) {
    console.error("Erreur récupération des conversations:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
