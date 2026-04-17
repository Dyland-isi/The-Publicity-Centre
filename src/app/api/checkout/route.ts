import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

interface CheckoutItem {
  name: string;
  price: number; // in pounds
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  customerEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, customerEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const line_items = items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const stripe = getServerStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customerEmail,
      shipping_address_collection: { allowed_countries: ["GB"] },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?canceled=true`,
      metadata: {
        source: "publicity-centre-shop",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
