import { cn } from "@/lib/utils"
import Image from "next/image"
import * as React from "react"

function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

interface AvatarImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
}

function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  if (!src) return null
  return (
    <div className={cn("aspect-square h-full w-full", className)} {...props}>
      <Image
        src={src}
        alt={alt || "Avatar"}
        className="object-cover"
        fill
        sizes="40px"
      />
    </div>
  )
}

function AvatarFallback({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }

