"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { PublicMobileNav } from "@/components/public-mobile-nav"
import { Button } from "@/components/ui/button"
import { Clock, Headphones, Mail, MapPin, Mic2, Music, Phone, Sliders, Star, Users, Loader2, Instagram, Facebook, Youtube, ArrowRight, Play, Pause } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [studios, setStudios] = useState<any[]>([])
  const [isLoadingStudios, setIsLoadingStudios] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [activeTeamFilter, setActiveTeamFilter] = useState("all")
  const [isPlaying, setIsPlaying] = useState(true)

  // Scroll handler for glassmorphism nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax scroll hook
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  // Count up animation component
  function CountUpStat({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: any }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (isInView) {
        let start = 0
        const end = value
        const duration = 2000
        const increment = end / (duration / 16)
        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
        return () => clearInterval(timer)
      }
    }, [isInView, value])

    return (
      <div ref={ref} className="text-center">
        <div className="w-12 h-12 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-3">
          <Icon className="h-6 w-6 text-royal" />
        </div>
        <div className="text-4xl md:text-5xl font-extrabold text-royal mb-2">
          {count}{suffix}
        </div>
        <div className="text-muted-foreground text-sm uppercase tracking-wider">{label}</div>
      </div>
    )
  }

  useEffect(() => {
    async function fetchStudios() {
      try {
        const res = await fetch('/api/rooms')
        if (res.ok) {
          const data = await res.json()
          setStudios(data)
        }
      } catch (error) {
        console.error('Error fetching studios:', error)
      } finally {
        setIsLoadingStudios(false)
      }
    }
    fetchStudios()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/Platinum Sound logo with 3D effect.png"
              alt="Platinum Sound Logo"
              width={360}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-base font-semibold text-foreground/80 hover:text-royal hover:bg-royal/5 rounded-md transition-all"
            >
              HOME
            </Link>
            <Link
              href="#studios"
              className="px-4 py-2 text-base font-semibold text-foreground/80 hover:text-royal hover:bg-royal/5 rounded-md transition-all"
            >
              STUDIOS
            </Link>
            <Link
              href="#team"
              className="px-4 py-2 text-base font-semibold text-foreground/80 hover:text-royal hover:bg-royal/5 rounded-md transition-all"
            >
              TEAM
            </Link>
            <Link
              href="#services"
              className="px-4 py-2 text-base font-semibold text-foreground/80 hover:text-royal hover:bg-royal/5 rounded-md transition-all"
            >
              SERVICES
            </Link>
            <Link
              href="#clients"
              className="px-4 py-2 text-base font-semibold text-foreground/80 hover:text-royal hover:bg-royal/5 rounded-md transition-all"
            >
              CLIENTS
            </Link>
            <Link
              href="/booking"
              className="px-4 py-2 text-base font-semibold text-black hover:text-black/80 hover:bg-black/5 rounded-md transition-all"
            >
              BOOKING
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/booking">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-yellow-300 text-black hover:bg-yellow-400 font-semibold px-6"
                >
                  Book a Session
                </Button>
              </motion.div>
            </Link>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg">
                  Log In
                </Button>
              </motion.div>
            </Link>
          </div>
          <PublicMobileNav />
        </div>

      </nav>

      {/* Hero Section with Background */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/studio-hero.png"
            alt="Platinum Sound Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Background Video */}
        <motion.div style={{ y: y2 }} className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-royal font-bold tracking-[4px] uppercase text-xs sm:text-sm mb-4">
            Est. NYC
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-platinum-gradient">PLATINUM SOUND</span>
            <br />
            <span className="text-royal">RECORDING STUDIOS</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Founded by Jerry &apos;Wonda&apos; Duplessis and Wyclef Jean.
            A beacon of innovation where music, film, and media converge.
            Celebrating 20+ years of excellence in the heart of New York City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                {/* Pulsing glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-royal via-yellow-400 to-royal rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse" />
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white text-black hover:bg-white/90 relative z-10 shadow-lg">
                  Book Now
                </Button>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Pulsing glow effect for secondary button */}
              <div className="absolute -inset-1 bg-gradient-to-r from-platinum-gradient via-white to-platinum-gradient rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 text-foreground border-foreground/50 hover:bg-accent relative z-10">
                <Phone className="mr-2 h-5 w-5" />
                212-265-6060
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y bg-card/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 20, suffix: "+", label: "Years of Excellence", icon: Clock },
            { value: 500, suffix: "+", label: "Albums Recorded", icon: Music },
            { value: 50, suffix: "+", label: "Grammy Wins", icon: Star },
            { value: 24, suffix: "/7", label: "Studio Access", icon: Headphones },
          ].map((stat, i) => (
            <CountUpStat key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* Studios Section */}
      <section id="studios" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">World-Class Studios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Two legendary rooms equipped with the finest analog and digital gear
            </p>
          </div>
          {isLoadingStudios ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-royal" />
            </div>
          ) : studios.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {studios.slice(0, 6).map((studio) => (
                <div key={studio.id} className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:border-royal/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-royal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-royal">{studio.name}</h3>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-royal/10 text-royal">
                        {studio.status === 'AVAILABLE' ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </div>
                    <p className="text-xl font-semibold mb-2">${studio.baseRate}/hour</p>
                    <p className="text-muted-foreground mb-6">
                      {studio.description || 'Professional recording studio with premium amenities.'}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {studio.amenities && studio.amenities.slice(0, 3).map((amenity: string) => (
                        <li key={amenity} className="flex items-center gap-2">
                          <Mic2 className="h-4 w-4 text-royal" />
                          {amenity}
                        </li>
                      ))}
                      {studio.rateWithEngineer && (
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-royal" />
                          ${studio.rateWithEngineer}/hr with engineer
                        </li>
                      )}
                    </ul>
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Virtual Tour
                      </Button>
                      <Link href="/booking" className="flex-1">
                        <Button size="sm" className="w-full bg-royal hover:bg-royal/90">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Fallback to hardcoded studios if no data */}
              <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:border-royal/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-royal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-royal">Studio A</h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-royal/10 text-royal">FLAGSHIP</span>
                  </div>
                  <p className="text-xl font-semibold mb-2">Neve 88R Console</p>
                  <p className="text-muted-foreground mb-6">
                    Our flagship room featuring a legendary Neve 88R console,
                    perfect for tracking, mixing, and immersive audio experiences.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Mic2 className="h-4 w-4 text-royal" />
                      Large live room with isolation booths
                    </li>
                    <li className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-royal" />
                      5.1 Surround monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-royal" />
                      Vintage outboard gear collection
                    </li>
                  </ul>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Virtual Tour
                    </Button>
                    <Link href="/booking" className="flex-1">
                      <Button size="sm" className="w-full bg-royal hover:bg-royal/90">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:border-royal/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-royal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-royal">Studio B</h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-royal/10 text-royal">MIXING</span>
                  </div>
                  <p className="text-xl font-semibold mb-2">SSL 9000K Console</p>
                  <p className="text-muted-foreground mb-6">
                    A mixing powerhouse with the iconic SSL 9000K,
                    delivering the punch and clarity that defined countless hit records.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Mic2 className="h-4 w-4 text-royal" />
                      Dedicated vocal booth
                    </li>
                    <li className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-royal" />
                      Stereo & surround monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-royal" />
                      Full Pro Tools HDX system
                    </li>
                  </ul>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Virtual Tour
                    </Button>
                    <Link href="/booking" className="flex-1">
                      <Button size="sm" className="w-full bg-royal hover:bg-royal/90">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Innovative. Experienced. Professional.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "founder", label: "Founder" },
              { id: "management", label: "Management" },
              { id: "engineers", label: "Engineers" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveTeamFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTeamFilter === filter.id
                    ? "bg-royal text-white"
                    : "bg-background border hover:border-royal/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Founder/Owner - Show when 'all' or 'founder' selected */}
            {(activeTeamFilter === "all" || activeTeamFilter === "founder") && (
              <div className="col-span-full lg:col-span-2 lg:row-span-2 p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative w-32 h-40 mx-auto md:mx-0 rounded-xl overflow-hidden border-4 border-royal/20 shrink-0">
                    <Image
                      src="/jerrywonda1.png"
                      alt="Jerry 'Wonda' Duplessis - Founder/Owner"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold mb-1">Jerry "Wonda" Duplessis</h4>
                    <p className="text-royal font-medium mb-3">Founder/Owner</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Grammy Award-winning, multi-platinum music producer with 3 Grammy Awards and over 16 nominations. Produced global hits like "Hips Don't Lie" and composed for film. Goodwill Ambassador to Haiti.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Management - Show when 'all' or 'management' selected */}
            {(activeTeamFilter === "all" || activeTeamFilter === "management") && (
              <>
                {[
                  { name: "Lisa", role: "Manager" },
                  { name: "Spice", role: "Manager" },
                ].map((member, i) => (
                  <div key={`mgmt-${i}`} className="p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-royal/10 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-royal" />
                      </div>
                      <div>
                        <h4 className="font-bold">{member.name}</h4>
                        <p className="text-sm text-royal">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Engineers - Show when 'all' or 'engineers' selected */}
            {(activeTeamFilter === "all" || activeTeamFilter === "engineers") && (
              <>
                {[
                  {
                    name: "Serge",
                    role: "Chief Engineer",
                    bio: "Grammy-winning engineer with 20+ years experience. Worked with Shakira, Kanye West, and Aretha Franklin."
                  },
                  {
                    name: "Knice",
                    role: "Senior Engineer",
                    bio: "Brooklyn-based recording & immersive mixing engineer. Worked with French Montana, Brandy, and Miguel."
                  },
                  {
                    name: "Rene",
                    role: "Senior Engineer",
                    bio: "Brooklyn-born mixing engineer since 2015. Specializes in Dolby Atmos. Worked with Wyclef Jean and Mary J. Blige."
                  },
                  {
                    name: "Darren",
                    role: "Senior Engineer",
                    bio: "NYU Master's in Music Tech. Dolby Atmos specialist. Worked with Leon John and Langa Mavuso."
                  },
                  {
                    name: "Julian",
                    role: "Staff Engineer",
                    bio: "Talented staff engineer with expertise in recording and mixing."
                  },
                  {
                    name: "Jack",
                    role: "Staff Engineer",
                    bio: "Known for precision and dedication to achieving the perfect sound."
                  },
                  {
                    name: "Solon",
                    role: "Staff Engineer",
                    bio: "Experienced in recording and production. Works closely with artists."
                  },
                  {
                    name: "Kyle",
                    role: "Engineer",
                    bio: "Committed to delivering high-quality recordings."
                  },
                  {
                    name: "Jacob",
                    role: "Engineer",
                    bio: "Talented engineer with a keen ear for detail."
                  },
                  {
                    name: "Rohan",
                    role: "Engineer",
                    bio: "Specializing in recording and mixing."
                  },
                  {
                    name: "Chris",
                    role: "Engineer",
                    bio: "Brooklyn-born Audio Engineer. Worked with Nas, Wyclef Jean, and Maino."
                  },
                ].map((member, i) => (
                  <div key={`eng-${i}`} className="p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-royal/10 flex items-center justify-center shrink-0">
                        <Sliders className="h-6 w-6 text-royal" />
                      </div>
                      <div>
                        <h4 className="font-bold">{member.name}</h4>
                        <p className="text-sm text-royal">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-card/50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Full-service recording, mixing, and production for artists, labels, and brands
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic2, title: "Recording", desc: "Multi-track recording with world-class engineers" },
              { icon: Sliders, title: "Mixing", desc: "Professional mixing for any genre or format" },
              { icon: Headphones, title: "Mastering", desc: "Final polish for streaming and physical release" },
              { icon: Users, title: "Production", desc: "Full production services with in-house producers" },
            ].map((service, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-royal group-hover:text-white transition-colors">
                  <service.icon className="h-6 w-6 text-royal group-hover:text-white" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                <div className="flex items-center justify-center gap-1 text-royal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Notable Clients */}
      <section id="clients" className="py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notable Sessions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Where legends create and new stars are born
            </p>
          </div>

          {/* Artist Logos Marquee */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
              <div className="flex gap-8 animate-marquee">
                {[
                  "Shakira", "Wyclef Jean", "Kanye West", "Drake", "Beyoncé", "Jay-Z", 
                  "Rihanna", "Bruno Mars", "Kendrick Lamar", "Travis Scott", "French Montana", "Mary J. Blige"
                ].map((artist, i) => (
                  <div key={i} className="text-2xl md:text-3xl font-bold text-muted-foreground/30 whitespace-nowrap">
                    {artist}
                  </div>
                ))}
                {[
                  "Shakira", "Wyclef Jean", "Kanye West", "Drake", "Beyoncé", "Jay-Z", 
                  "Rihanna", "Bruno Mars", "Kendrick Lamar", "Travis Scott", "French Montana", "Mary J. Blige"
                ].map((artist, i) => (
                  <div key={`dup-${i}`} className="text-2xl md:text-3xl font-bold text-muted-foreground/30 whitespace-nowrap">
                    {artist}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { artist: "Client A", project: "Certified Lover Boy Sessions", rating: 5 },
              { artist: "Client B", project: "Vocal Recording & Production", rating: 5 },
              { artist: "Client C", project: "After Hours Album", rating: 5 },
              { artist: "Client D", project: "Un Verano Sin Ti", rating: 5 },
              { artist: "Wyclef Jean", project: "Carnival Series", rating: 5 },
              { artist: "A$AP Rocky", project: "Mixing Sessions", rating: 5 },
            ].map((client, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card hover:border-royal/50 transition-colors">
                <div className="flex gap-1 mb-3">
                  {[...Array(client.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-royal text-royal" />
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-1">{client.artist}</h3>
                <p className="text-sm text-muted-foreground">{client.project}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-royal/20 via-purple-500/20 to-royal/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Book your session today and join the legacy of platinum records
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="text-lg px-8 bg-royal hover:bg-royal/90">
                Book a Session
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-background/80">
              <Mail className="mr-2 h-5 w-5" />
              info@platinumsoundny.com
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5 text-primary" />
                <span className="font-bold">Platinum Sound</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                World-class recording studios in the heart of New York City.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-royal/10 flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-royal/10 flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-royal/10 flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mb-4">Address</h4>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <p>122 W. 26th St.<br />New York, NY 10001</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>212-265-6060</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@platinumsoundny.com</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get updates on new services and studio news.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-royal"
                />
                <Button size="sm" className="bg-royal hover:bg-royal/90">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Platinum Sound Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
