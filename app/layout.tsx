import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Platinum Sound Studios",
    template: "%s | Platinum Sound Studios",
  },
  description: "World-class recording studios in the heart of New York City. Recording, mixing, and mastering services for artists, labels, and brands.",
  keywords: ["recording studio", "music studio", "mixing", "mastering", "NYC", "recording"],
  authors: [{ name: "Platinum Sound Studios" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://platinumsoundny.com",
    siteName: "Platinum Sound Studios",
    title: "Platinum Sound Studios - World-Class Recording Studios",
    description: "World-class recording studios in the heart of New York City",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
