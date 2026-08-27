import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { storeUrl, apiToken } = await req.json();

    if (!storeUrl || !apiToken) {
      return NextResponse.json(
        { error: "L'URL de la boutique et le token API sont requis." },
        { status: 400 }
      );
    }

    // Normalize store URL
    const cleanStore = storeUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .trim();

    // 1. Validate credentials by calling YouCan API
    const storeResponse = await fetch(
      `https://${cleanStore}/api/store`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!storeResponse.ok) {
      const status = storeResponse.status;
      if (status === 401 || status === 403) {
        return NextResponse.json(
          { error: "Token API invalide ou expiré. Vérifiez votre clé API YouCan." },
          { status: 401 }
        );
      }
      if (status === 404) {
        return NextResponse.json(
          { error: "Boutique introuvable. Vérifiez l'URL de votre boutique YouCan." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Erreur YouCan (${status}). Veuillez réessayer.` },
        { status: status }
      );
    }

    let storeName = cleanStore;
    try {
      const storeData = await storeResponse.json();
      storeName = storeData?.name || storeData?.store?.name || cleanStore;
    } catch {
      // If response is not JSON, use cleanStore as name
    }

    // 2. Register webhook for new orders
    const webhookUrl = `${req.nextUrl.origin}/api/webhooks/youcan`;

    try {
      await fetch(
        `https://${cleanStore}/api/webhooks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            url: webhookUrl,
            event: "order.created",
          }),
        }
      );
    } catch {
      console.log("[YouCan] Webhook registration skipped (dev environment)");
    }

    // 3. Return success
    return NextResponse.json({
      success: true,
      store: {
        name: storeName,
        url: cleanStore,
      },
      message: `Boutique "${storeName}" connectée avec succès !`,
    });
  } catch (error: unknown) {
    console.error("[YouCan Connect Error]", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Impossible de joindre la boutique YouCan. Vérifiez l'URL." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
