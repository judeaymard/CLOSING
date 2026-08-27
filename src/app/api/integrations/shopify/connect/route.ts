import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shopUrl, accessToken } = await req.json();

    if (!shopUrl || !accessToken) {
      return NextResponse.json(
        { error: "L'URL de la boutique et le token d'accès sont requis." },
        { status: 400 }
      );
    }

    // Normalize shop URL (remove https://, trailing slash, etc.)
    const cleanShop = shopUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .trim();

    // 1. Validate credentials by calling Shopify Admin API
    const shopResponse = await fetch(
      `https://${cleanShop}/admin/api/2024-01/shop.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!shopResponse.ok) {
      const status = shopResponse.status;
      if (status === 401 || status === 403) {
        return NextResponse.json(
          { error: "Token d'accès invalide ou expiré. Vérifiez votre clé API Admin Shopify." },
          { status: 401 }
        );
      }
      if (status === 404) {
        return NextResponse.json(
          { error: "Boutique introuvable. Vérifiez l'URL de votre boutique Shopify." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Erreur Shopify (${status}). Veuillez réessayer.` },
        { status: status }
      );
    }

    const shopData = await shopResponse.json();
    const shopName = shopData.shop?.name || cleanShop;

    // 2. Register webhook for new orders (orders/create)
    const webhookUrl = `${req.nextUrl.origin}/api/webhooks/shopify`;

    try {
      await fetch(
        `https://${cleanShop}/admin/api/2024-01/webhooks.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook: {
              topic: "orders/create",
              address: webhookUrl,
              format: "json",
            },
          }),
        }
      );
    } catch {
      // Webhook registration may fail in dev (localhost not reachable from Shopify)
      // This is expected - in production with a public URL it will work
      console.log("[Shopify] Webhook registration skipped (dev environment)");
    }

    // 3. Return success with shop info
    return NextResponse.json({
      success: true,
      shop: {
        name: shopName,
        url: cleanShop,
        domain: shopData.shop?.domain || cleanShop,
        email: shopData.shop?.email || "",
        currency: shopData.shop?.currency || "XOF",
      },
      message: `Boutique "${shopName}" connectée avec succès !`,
    });
  } catch (error: unknown) {
    console.error("[Shopify Connect Error]", error);

    // Check if it's a network error (shop URL unreachable)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Impossible de joindre la boutique Shopify. Vérifiez l'URL." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
