import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { amount, currency = "usd", description, metadata } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error("[PAYMENT DEBUG] Stripe secret key is not configured in environment")
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    // Debug: Log key prefix to help diagnose (never log full key)
    if (stripeSecretKey.startsWith("sk_test_")) {
      console.log("[PAYMENT DEBUG] Stripe test key detected")
    } else if (stripeSecretKey.startsWith("sk_live_")) {
      console.log("[PAYMENT DEBUG] Stripe live key detected")
    } else {
      console.error("[PAYMENT DEBUG] Invalid Stripe key format - does not start with sk_test_ or sk_live_")
      return NextResponse.json({ error: "Stripe key format is invalid" }, { status: 500 })
    }

    // Create Payment Intent via Stripe REST API
    const params = new URLSearchParams({
      amount: Math.round(amount * 100).toString(), // Stripe uses cents
      currency,
      "automatic_payment_methods[enabled]": "true",
    })

    if (description) {
      params.append("description", description)
    }

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        params.append(`metadata[${key}]`, String(value))
      })
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const paymentIntent = await stripeResponse.json()

    if (!stripeResponse.ok) {
      console.error("[PAYMENT DEBUG] Stripe API error:", JSON.stringify(paymentIntent))
      return NextResponse.json(
        { error: paymentIntent.error?.message || "Failed to create payment intent" },
        { status: stripeResponse.status }
      )
    }

    console.log("[PAYMENT DEBUG] Payment intent created successfully:", paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
