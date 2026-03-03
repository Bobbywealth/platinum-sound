"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Lock, CreditCard } from "lucide-react"

interface StripePaymentFormProps {
  clientSecret: string
  amount: number
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
}

declare global {
  interface Window {
    Stripe?: (key: string) => StripeInstance
  }
}

interface StripeInstance {
  elements: (options?: Record<string, unknown>) => StripeElements
  confirmPayment: (options: {
    elements: StripeElements
    confirmParams?: Record<string, unknown>
    redirect: "if_required"
  }) => Promise<{ error?: { message?: string }; paymentIntent?: { id: string; status: string } }>
}

interface StripeElements {
  create: (type: string, options?: Record<string, unknown>) => StripeElement
  getElement: (type: string) => StripeElement | null
  submit: () => Promise<{ error?: { message?: string } }>
}

interface StripeElement {
  mount: (element: HTMLElement) => void
  unmount: () => void
  on: (event: string, handler: () => void) => void
}

export function StripePaymentForm({
  clientSecret,
  amount,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [elementsReady, setElementsReady] = useState(false)
  const stripeRef = useRef<StripeInstance | null>(null)
  const elementsRef = useRef<StripeElements | null>(null)
  const paymentElementRef = useRef<HTMLDivElement>(null)

  // Load Stripe.js from CDN
  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/"
    script.async = true
    script.onload = () => setStripeLoaded(true)
    script.onerror = () => onPaymentError("Failed to load Stripe.js")
    document.head.appendChild(script)

    return () => {
      // Don't remove the script on cleanup to avoid re-loading
    }
  }, [onPaymentError])

  // Initialize Stripe Elements once Stripe.js is loaded
  useEffect(() => {
    if (!stripeLoaded || !paymentElementRef.current || !clientSecret) return

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey || !window.Stripe) {
      onPaymentError("Stripe is not configured")
      return
    }

    const stripe = window.Stripe(publishableKey)
    stripeRef.current = stripe

    const elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#000000",
          borderRadius: "8px",
        },
      },
    })
    elementsRef.current = elements

    const paymentElement = elements.create("payment", {
      layout: "tabs",
    })

    paymentElement.on("ready", () => {
      setIsLoading(false)
      setElementsReady(true)
    })

    paymentElement.mount(paymentElementRef.current)

    return () => {
      paymentElement.unmount()
    }
  }, [stripeLoaded, clientSecret, onPaymentError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripeRef.current || !elementsRef.current || isProcessing) return

    setIsProcessing(true)

    try {
      // Submit elements first to trigger validation
      const { error: submitError } = await elementsRef.current.submit()
      if (submitError) {
        onPaymentError(submitError.message || "Payment validation failed")
        setIsProcessing(false)
        return
      }

      const { error, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        redirect: "if_required",
      })

      if (error) {
        onPaymentError(error.message || "Payment failed")
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent.id)
      } else {
        onPaymentError("Payment could not be completed. Please try again.")
        setIsProcessing(false)
      }
    } catch {
      onPaymentError("An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CreditCard className="h-4 w-4" />
          <span>Payment Details</span>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs text-muted-foreground">Loading payment form...</span>
              </div>
            </div>
          )}
          <div
            ref={paymentElementRef}
            className="min-h-[200px] p-1 rounded-lg border bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <Button
        type="submit"
        disabled={!elementsReady || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Pay ${amount.toFixed(2)} & Confirm Booking
          </span>
        )}
      </Button>
    </form>
  )
}
