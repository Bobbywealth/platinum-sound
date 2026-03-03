import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Verify Stripe webhook signature using Web Crypto API
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = signature.split(",")
    const timestampPart = parts.find((p) => p.startsWith("t="))
    const signaturePart = parts.find((p) => p.startsWith("v1="))

    if (!timestampPart || !signaturePart) return false

    const timestamp = timestampPart.slice(2)
    const expectedSig = signaturePart.slice(3)

    // Protect against replay attacks (5 minute tolerance)
    const tolerance = 300
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - parseInt(timestamp)) > tolerance) return false

    const signedPayload = `${timestamp}.${payload}`
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signedPayload)
    )
    const computedSig = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return computedSig === expectedSig
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const payload = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  const isValid = await verifyStripeSignature(payload, signature, webhookSecret)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as {
        id: string
        amount: number
        currency: string
        metadata?: { bookingId?: string }
      }

      // If bookingId is in metadata, update the booking payment status
      const bookingId = paymentIntent.metadata?.bookingId
      if (bookingId) {
        try {
          const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payments: true },
          })

          if (booking) {
            const amountInDollars = paymentIntent.amount / 100

            // Record the Stripe payment split
            await prisma.paymentSplit.create({
              data: {
                bookingId,
                method: "STRIPE",
                amount: amountInDollars,
                reference: paymentIntent.id,
                notes: `Stripe payment (${paymentIntent.currency.toUpperCase()})`,
                recordedBy: booking.clientId, // Use clientId as recordedBy for public bookings
                recordedAt: new Date(),
              },
            })

            // Update booking status to CONFIRMED
            await prisma.booking.update({
              where: { id: bookingId },
              data: {
                status: "CONFIRMED",
                stripePaymentIntentId: paymentIntent.id,
              },
            })
          }
        } catch (err) {
          console.error("Error updating booking after payment:", err)
        }
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as {
        id: string
        metadata?: { bookingId?: string }
        last_payment_error?: { message?: string }
      }
      console.error(
        `Payment failed for intent ${paymentIntent.id}:`,
        paymentIntent.last_payment_error?.message
      )
      break
    }

    default:
      // Unhandled event type
      break
  }

  return NextResponse.json({ received: true })
}
