"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  className?: string
}

export function CTASection({
  title,
  description,
  buttonText,
  buttonHref,
  className,
}: CTASectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gray-900 text-white p-8 text-center",
        className
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      <Link href={buttonHref}>
        <Button size="lg" variant="secondary">
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}
