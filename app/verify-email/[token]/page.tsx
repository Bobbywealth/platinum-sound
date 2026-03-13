"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function VerifyEmailPage() {
  const params = useParams()
  const token = params.token as string
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [alreadyVerified, setAlreadyVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${token}`)
        const data = await response.json()
        
        if (response.ok && data.valid) {
          setSuccess(true)
          setAlreadyVerified(data.alreadyVerified || false)
        } else {
          setError(data.error || "Invalid verification token")
        }
      } catch {
        setError("An error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      verifyEmail()
    }
  }, [token])

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <Card className="backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-royal/10">
            <CardHeader className="text-center pb-2 space-y-6">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative inline-block mx-auto"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <Image
                      src="/Platinum Sound logo with 3D effect.png"
                      alt="Platinum Sound Logo"
                      width={300}
                      height={68}
                      className="h-24 w-auto drop-shadow-lg"
                      priority
                    />
                  </Link>
                </motion.div>
                <div className="absolute inset-0 blur-xl bg-royal/30 -z-10 rounded-full" />
              </motion.div>

              <div>
                <CardTitle className="text-2xl font-semibold text-white">Invalid Link</CardTitle>
                <CardDescription className="text-gray-300">
                  This verification link is invalid
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-4 rounded-md backdrop-blur-sm text-center"
              >
                {error}
              </motion.div>

              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-transparent to-platinum-gradient/20 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [null, Math.random() * -200 + "px"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-royal/10">
          <CardHeader className="text-center pb-2 space-y-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative inline-block mx-auto"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Image
                    src="/Platinum Sound logo with 3D effect.png"
                    alt="Platinum Sound Logo"
                    width={300}
                    height={68}
                    className="h-24 w-auto drop-shadow-lg"
                    priority
                  />
                </Link>
              </motion.div>
              <div className="absolute inset-0 blur-xl bg-royal/30 -z-10 rounded-full" />
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <CardTitle className="text-2xl font-semibold text-white">
                  {alreadyVerified ? "Already Verified" : "Email Verified!"}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CardDescription className="text-gray-300">
                  {alreadyVerified 
                    ? "Your email was already verified" 
                    : "Your email has been successfully verified"}
                </CardDescription>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className={`text-sm p-4 rounded-md backdrop-blur-sm text-center ${
                alreadyVerified 
                  ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300"
                  : "bg-green-500/20 border border-green-500/30 text-green-300"
              }`}
            >
              {alreadyVerified ? (
                <p>Your account is already verified. You can log in to your account.</p>
              ) : (
                <p>Thank you for verifying your email. You can now access all features of your account.</p>
              )}
            </motion.div>

            <Link href="/login">
              <Button className="w-full bg-royal hover:bg-royal/80">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
