import { NextRequest, NextResponse } from "next/server";

// Shopify sends order data via webhook when a new order is created
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract order data from Shopify webhook payload
    const order = {
      externalId: body.id?.toString() || "",
      orderNumber: body.name || body.order_number?.toString() || "",
      platform: "Shopify",
      clientName: `${body.customer?.first_name || ""} ${body.customer?.last_name || ""}`.trim() || "Client Shopify",
      clientPhone: body.customer?.phone || body.shipping_address?.phone || body.billing_address?.phone || "",
      clientEmail: body.customer?.email || body.contact_email || "",
      address: [
        body.shipping_address?.address1,
        body.shipping_address?.address2,
        body.shipping_address?.city,
        body.shipping_address?.province,
      ]
        .filter(Boolean)
        .join(", ") || "Adresse non renseignée",
      city: body.shipping_address?.city || "",
      products: (body.line_items || [])
        .map((item: { name?: string; title?: string }) => item.name || item.title)
        .join(", "),
      quantity: (body.line_items || []).reduce(
        (sum: number, item: { quantity?: number }) => sum + (item.quantity || 1),
        0
      ),
      totalPrice: parseFloat(body.total_price || "0"),
      currency: body.currency || "XOF",
      paymentMethod: body.gateway || "COD",
      status: "EN_ATTENTE",
      createdAt: body.created_at || new Date().toISOString(),
      rawPayload: body,
    };

    // Log the incoming order (in production, save to database)
    console.log("[Shopify Webhook] Nouvelle commande reçue:", {
      orderNumber: order.orderNumber,
      client: order.clientName,
      phone: order.clientPhone,
      total: `${order.totalPrice} ${order.currency}`,
      products: order.products,
    });

    // TODO: In production, save to database
    // await db.orders.create({ data: order });

    // Return 200 OK (Shopify expects this to confirm receipt)
    return NextResponse.json(
      { received: true, orderNumber: order.orderNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Shopify Webhook Error]", error);
    // Still return 200 to prevent Shopify from retrying
    return NextResponse.json({ received: true, error: "Processing error" }, { status: 200 });
  }
}
