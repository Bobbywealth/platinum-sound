"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = () => {
    setEmailError("")
    
    if (!email) {
      setEmailError("Email is required")
      return false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "An error occurred. Please try again.")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />
          {/* Animated Gradient Overlay */}
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
                  <CardTitle className="text-2xl font-semibold text-white">Check Your Email</CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <CardDescription className="text-gray-300">
                    We've sent you a password reset link
                  </CardDescription>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-green-500/20 border border-green-500/30 text-green-300 text-sm p-4 rounded-md backdrop-blur-sm text-center"
              >
                <p>If an account exists with this email, you will receive a password reset link within the next few minutes.</p>
                <p className="mt-2 text-gray-300">Please check your inbox and spam folder.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Link href="/login">
                  <Button className="w-full" variant="outline">
                    Back to Login
                  </Button>
                </Link>
              </motion.div>
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Animated Gradient Overlay */}
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

      {/* Audio Waveform Visualization */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-0 opacity-30">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,50 Q125,20 250,50 T500,50 T750,50 T1000,50 L1000,100 L0,100 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          <path
            d="M0,60 Q125,30 250,60 T500,60 T750,60 T1000,60 L1000,100 L0,100 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
          />
          <path
            d="M0,40 Q125,70 250,40 T500,40 T750,40 T1000,40 L1000,100 L0,100 Z"
            fill="url(#waveGradient2)"
            className="animate-pulse"
            style={{ animationDuration: '2.5s', animationDelay: '1s' }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Glassmorphism Card */}
        <Card className="backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-royal/10">
          <CardHeader className="text-center pb-2 space-y-6">
            {/* Animated Logo with floating effect */}
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
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 blur-xl bg-royal/30 -z-10 rounded-full" />
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <CardTitle className="text-2xl font-semibold text-white">Forgot Password</CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CardDescription className="text-gray-300">
                  Enter your email to reset your password
                </CardDescription>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-md backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@platinumsound.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-royal focus:ring-royal"
                  />
                </motion.div>
                {emailError && (
                  <p className="text-red-400 text-sm">{emailError}</p>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-royal hover:bg-royal/80"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-center"
            >
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                Back to Login
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
