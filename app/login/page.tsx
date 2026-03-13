"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = () => {
    let isValid = true
    setEmailError("")
    setPasswordError("")

    if (!email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch {
      setError("An error occurred. Please try again.")
    }
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

      {/* Login Card Container */}
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
                <CardTitle className="text-2xl font-semibold text-white">Welcome Back</CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CardDescription className="text-gray-300">
                  Sign in to access the studio management dashboard
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
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-royal focus:ring-royal/20 transition-all ${
                      emailError ? "border-red-500/50 bg-red-500/10" : ""
                    }`}
                    required
                  />
                </motion.div>
                {emailError && (
                  <p className="text-xs text-red-400">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-royal hover:text-royal/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError("")
                    }}
                    className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-royal focus:ring-royal/20 transition-all ${
                      passwordError ? "border-red-500/50 bg-red-500/10" : ""
                    }`}
                    required
                  />
                </motion.div>
                {passwordError && (
                  <p className="text-xs text-red-400">{passwordError}</p>
                )}
              </div>

              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-royal focus:ring-royal/50 cursor-pointer"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                  Remember me for 30 days
                </Label>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-royal hover:bg-royal/80 text-white shadow-lg shadow-royal/20 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-gray-400 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading}
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("github")}
                  disabled={loading}
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="pt-4 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <Link href="/">
                <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <motion.p
          className="text-center text-xs text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          Need help? Contact your system administrator
        </motion.p>
      </motion.div>
    </div>
  )
}
