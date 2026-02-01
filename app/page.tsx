import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, MapPin, Phone, Mail, Clock, Mic2, Headphones, Sliders, Users, Star, Play } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background hero-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Platinum Sound</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              HOME
            </Link>
            <Link href="#studios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              STUDIOS
            </Link>
            <Link href="#team" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              TEAM
            </Link>
            <Link href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              SERVICES
            </Link>
            <Link href="#clients" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              CLIENTS
            </Link>
            <Link href="/dashboard/bookings" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              BOOKING
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Enter CRM</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-primary font-bold tracking-[4px] uppercase text-sm mb-4">
            Est. NYC
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-platinum-gradient">PLATINUM SOUNDS</span>
            <br />
            <span className="text-primary">RECORDING STUDIOS</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Founded by Jerry &apos;Wonda&apos; Duplessis and Wyclef Jean.
            A beacon of innovation where music, film, and media converge.
            Celebrating 20+ years of excellence in the heart of New York City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Book a Session
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Phone className="mr-2 h-5 w-5" />
              212-265-6060
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y bg-card/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">20+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-platinum-gradient mb-2">500+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Albums Recorded</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Grammy Wins</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-platinum-gradient mb-2">24/7</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Studio Access</div>
          </div>
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Studio A */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary">Studio A</h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">FLAGSHIP</span>
                </div>
                <p className="text-xl font-semibold mb-2">Neve 88R Console</p>
                <p className="text-muted-foreground mb-6">
                  Our flagship room featuring a legendary Neve 88R console,
                  perfect for tracking, mixing, and immersive audio experiences.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-primary" />
                    Large live room with isolation booths
                  </li>
                  <li className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    5.1 Surround monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Vintage outboard gear collection
                  </li>
                </ul>
              </div>
            </div>

            {/* Studio B */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary">Studio B</h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">MIXING</span>
                </div>
                <p className="text-xl font-semibold mb-2">SSL 9000K Console</p>
                <p className="text-muted-foreground mb-6">
                  A mixing powerhouse with the iconic SSL 9000K,
                  delivering the punch and clarity that defined countless hit records.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-primary" />
                    Dedicated vocal booth
                  </li>
                  <li className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    Stereo & surround monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Full Pro Tools HDX system
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the talented professionals behind platinum records
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Jerry 'Wonda' Duplessis", role: "Founder & Producer", icon: Music },
              { name: "Wyclef Jean", role: "Co-Founder & Producer", icon: Music },
              { name: "David Kahne", role: "Lead Engineer", icon: Sliders },
              { name: "Mike Dean", role: "Mixing Engineer", icon: Sliders },
            ].map((member, i) => (
              <div key={i} className="text-center p-6 rounded-xl border bg-background hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <member.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
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
              <div key={i} className="text-center p-6 rounded-xl border bg-background hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Notable Clients */}
      <section id="clients" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notable Sessions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Where legends create and new stars are born
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { artist: "Drake", project: "Certified Lover Boy Sessions", rating: 5 },
              { artist: "Rihanna", project: "Vocal Recording & Production", rating: 5 },
              { artist: "The Weeknd", project: "After Hours Album", rating: 5 },
              { artist: "Bad Bunny", project: "Un Verano Sin Ti", rating: 5 },
              { artist: "Wyclef Jean", project: "Carnival Series", rating: 5 },
              { artist: "A$AP Rocky", project: "Mixing Sessions", rating: 5 },
            ].map((client, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                <div className="flex gap-1 mb-3">
                  {[...Array(client.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
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
      <section className="py-20 px-6 bg-card/50 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Book your session today and join the legacy of platinum records
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Access Studio CRM
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
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
              <p className="text-sm text-muted-foreground">
                World-class recording studios in the heart of New York City.
              </p>
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
              <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mb-4">Hours</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Open 24/7 for Sessions</span>
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
