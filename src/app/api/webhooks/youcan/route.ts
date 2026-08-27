import { NextRequest, NextResponse } from "next/server";

// YouCan sends order data via webhook when a new order is created
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract order data from YouCan webhook payload
    const orderData = body.payload || body.data || body;

    const order = {
      externalId: orderData.id?.toString() || orderData.ref || "",
      orderNumber: orderData.ref || orderData.id?.toString() || "",
      platform: "YouCan",
      clientName: [orderData.first_name, orderData.last_name]
        .filter(Boolean)
        .join(" ") || orderData.customer_name || "Client YouCan",
      clientPhone: orderData.phone || orderData.customer_phone || "",
      clientEmail: orderData.email || orderData.customer_email || "",
      address: [
        orderData.address,
        orderData.city,
        orderData.state,
      ]
        .filter(Boolean)
        .join(", ") || "Adresse non renseignée",
      city: orderData.city || "",
      products: Array.isArray(orderData.variants || orderData.products || orderData.items)
        ? (orderData.variants || orderData.products || orderData.items)
            .map((item: { product_name?: string; name?: string; title?: string }) =>
              item.product_name || item.name || item.title
            )
            .join(", ")
        : "Produit YouCan",
      quantity: Array.isArray(orderData.variants || orderData.products || orderData.items)
        ? (orderData.variants || orderData.products || orderData.items).reduce(
            (sum: number, item: { quantity?: number }) => sum + (item.quantity || 1),
            0
          )
        : 1,
      totalPrice: parseFloat(orderData.total_price || orderData.price || "0"),
      currency: orderData.currency || "MAD",
      paymentMethod: orderData.payment_method || "COD",
      status: "EN_ATTENTE",
      createdAt: orderData.created_at || new Date().toISOString(),
      rawPayload: body,
    };

    // Log the incoming order (in production, save to database)
    console.log("[YouCan Webhook] Nouvelle commande reçue:", {
      orderNumber: order.orderNumber,
      client: order.clientName,
      phone: order.clientPhone,
      total: `${order.totalPrice} ${order.currency}`,
      products: order.products,
    });

    // TODO: In production, save to database
    // await db.orders.create({ data: order });

    return NextResponse.json(
      { received: true, orderNumber: order.orderNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error("[YouCan Webhook Error]", error);
    return NextResponse.json({ received: true, error: "Processing error" }, { status: 200 });
  }
}
