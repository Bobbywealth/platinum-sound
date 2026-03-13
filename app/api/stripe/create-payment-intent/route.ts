import { NextResponse } from "next/server"
import { rateLimit, getClientIp, rateLimitConfigs } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    // Apply rate limiting - strict limits for payment operations
    const clientIp = getClientIp(request)
    const { allowed, remaining, resetTime } = rateLimit(clientIp, rateLimitConfigs.strict)
    
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)) } }
      )
    }

    const { amount, currency = "usd", description, metadata } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error("Stripe secret key is not configured in environment")
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    // Verify key format - only log key type in development
    if (process.env.NODE_ENV === 'development') {
      if (stripeSecretKey.startsWith("sk_test_")) {
        console.log("Stripe test key detected")
      } else if (stripeSecretKey.startsWith("sk_live_")) {
        console.log("Stripe live key detected")
      }
    }
    
    if (!stripeSecretKey.startsWith("sk_test_") && !stripeSecretKey.startsWith("sk_live_")) {
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
      // Log error details only in development
      if (process.env.NODE_ENV === 'development') {
        console.error("Stripe API error:", JSON.stringify(paymentIntent))
      }
      return NextResponse.json(
        { error: paymentIntent.error?.message || "Failed to create payment intent" },
        { status: stripeResponse.status }
      )
    }

    // Log success only in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Payment intent created successfully:", paymentIntent.id)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating payment intent:", error)
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
