import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Clock, Headphones, Mail, MapPin, Mic2, Music, Phone, Sliders, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/Platinum Sound logo with 3D effect.png"
              alt="Platinum Sound Logo"
              width={360}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-royal transition-colors">
              HOME
            </Link>
            <Link href="#studios" className="text-sm font-medium text-muted-foreground hover:text-royal transition-colors">
              STUDIOS
            </Link>
            <Link href="#team" className="text-sm font-medium text-muted-foreground hover:text-royal transition-colors">
              TEAM
            </Link>
            <Link href="#services" className="text-sm font-medium text-muted-foreground hover:text-royal transition-colors">
              SERVICES
            </Link>
            <Link href="#clients" className="text-sm font-medium text-muted-foreground hover:text-royal transition-colors">
              CLIENTS
            </Link>
            <Link href="/dashboard/bookings" className="text-sm font-medium text-royal hover:text-royal/80 transition-colors">
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

      {/* Hero Section with Background Video */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
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
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-royal font-bold tracking-[4px] uppercase text-sm mb-4">
            Est. NYC
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-platinum-gradient">PLATINUM SOUNDS</span>
            <br />
            <span className="text-royal">RECORDING STUDIOS</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Founded by Jerry &apos;Wonda&apos; Duplessis and Wyclef Jean.
            A beacon of innovation where music, film, and media converge.
            Celebrating 20+ years of excellence in the heart of New York City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                Book Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-foreground border-foreground/50 hover:bg-accent">
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
            <div className="text-4xl md:text-5xl font-extrabold text-royal mb-2">20+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-platinum-gradient mb-2">500+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">Albums Recorded</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-royal mb-2">50+</div>
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
              </div>
            </div>

            {/* Studio B */}
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
              Innovative. Experienced. Professional.
            </p>
          </div>

          {/* Founder/Owner */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Founder/Owner</h3>
            <div className="max-w-3xl mx-auto">
              <div className="text-center p-8 rounded-2xl border bg-background">
                <div className="w-24 h-24 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-6">
                  <Music className="h-12 w-12 text-royal" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Jerry "Wonda" Duplessis</h4>
                <p className="text-royal font-medium mb-4">Founder/Owner</p>
                <p className="text-muted-foreground leading-relaxed">
                  Jerry "Wonda" Duplessis is a legendary figure in the music industry, known for his groundbreaking work as a producer, songwriter, and musician. Co-founding Platinum Sound Studios in 2000 alongside his cousin Wyclef Jean, Jerry Wonda has built the studio into a world-class recording destination in New York City. With a Grammy-winning portfolio that includes work with icons like Shakira, Whitney Houston, and U2, his influence spans genres and decades. Platinum Sound Studios stands as a testament to his dedication to creating high-quality, genre-defining music.
                </p>
              </div>
            </div>
          </div>

          {/* Management */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Management</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Lisa Hershfield", role: "General Manager" },
                { name: "Jasmine Hunt", role: "Manager" },
                { name: "Spice", role: "Booking Manager" },
                { name: "Gary Valentino", role: "CFO Manager" },
              ].map((member, i) => (
                <div key={i} className="text-center p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-royal" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Engineers */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Engineers</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Serge \"Surgical\" Tsai",
                  role: "Chief Engineer",
                  bio: "Grammy-winning, multi-platinum recording and mix engineer with over 20 years of experience. Based in NYC since 1989, Serge is Chief Engineer at Platinum Sound, working with artists like Shakira, Kanye West, Justin Bieber, and Beyonce. His credits include Grammy-winning albums, an Oscar-nominated soundtrack, and collabs with Aretha Franklin and Carlos Santana. Known for his \"Sonic Air Bending\" techniques, he also mentors upcoming engineers and artists."
                },
                {
                  name: "Devonne \"Knice\" Knights",
                  role: "Recording & Immersive Mixing Engineer",
                  bio: "Recording and Immersive Mixing engineer from Brooklyn, New York. Knice graduated from SAE with a 4.0 and went on to work up the ranks at Platinum Sound Studios as a recording engineer, ultimately joining the Senior Engineer Staff. Has worked with French Montana, Brandy, Miguel, EST Gee, Lola Brooke, Desiigner, Rich The Kid, and many more label and local artists."
                },
                {
                  name: "Zel Omar Campbell",
                  role: "Recording Engineer",
                  bio: "Multi-platinum recording engineer from the Bronx, began his music journey at 13 under Public Enemy's DJ Johnny Juice. After earning a bachelor's in recording arts from Full Sail University, he joined Platinum Sound in 2017. Has worked with top artists like Rich The Kid, Mariah Carey, and Jadakiss."
                },
                {
                  name: "Julian \"Finesse\" Wright",
                  role: "Producer & Recording Engineer",
                  bio: "Producer and recording engineer with a background in live sound and a degree from SUNY Purchase College. Furthered his education at SAE NY and has since worked with artists like Wyclef Jean, KRS-ONE, and Dionne Warwick."
                },
                {
                  name: "Darren \"The Clinic\" Blanckensee",
                  role: "Recording & Dolby Atmos Engineer",
                  bio: "South African recording hop, R&B engineer specializing in hip, and Dolby Atmos mixing. With a Master's in Music Tech from NYU and experience at NYU's James L Dolan studio and Platinum Sound, he's crafted standout tracks for artists like Leon John and Langa Mavuso. Known for his speed and intuitive approach, Darren creates immersive soundscapes that enhance every project."
                },
                {
                  name: "Rene \"DeZ BuDdha\" Desrivieres",
                  role: "Recording & Mixing Engineer",
                  bio: "Brooklyn-born recording and mixing engineer, joined Platinum Sound in 2015 and has worked with top artists like Wyclef Jean and Mary J. Blige. Known for his exceptional quality, he also mentors the next generation of audio engineers. Recently expanded into Dolby Atmos Surround Sound, earning credits with artists like French Montana."
                },
                {
                  name: "Chris \"Apex\" Valerio",
                  role: "Audio Engineer & Producer",
                  bio: "Brooklyn-born Audio Engineer and Producer, developed his craft at LaGuardia Community College. Has worked with top artists like Nas, Wyclef Jean, Maino, Jim Jones, Homixide Gang, and Asian Doll, reflecting his commitment and influence in the music industry."
                },
                {
                  name: "Suzi",
                  role: "Audio Engineer & Singer-Songwriter",
                  bio: "Versatile audio engineer and singer-songwriter who brings a unique creative perspective to Platinum Sound. As an artist-turned-engineer, has amassed over 300 million streams worldwide. Has collaborated with top talent including Fetty Wap, Tory Lanez, French Montana, Lil' Kim, Dascha Polanco, Kiko El Crazy, and many others."
                },
                {
                  name: "Jack \"Smack\" Vayo",
                  role: "Audio Engineer",
                  bio: "Skilled audio engineer renowned for his precision and speed. Raised in Florida, began building his own studio straight out of high school. After refining skills at SAE Institute of New York, his exceptional ear for detail has led to collaborations with top artists including Fivio Foreign, Wyclef Jean, Scorey, Nino Paid, Capella Grey, and Rondodasosa."
                },
              ].map((member, i) => (
                <div key={i} className="p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-royal/10 flex items-center justify-center shrink-0">
                      <Sliders className="h-7 w-7 text-royal" />
                    </div>
                    <div>
                      <h4 className="font-bold">{member.name}</h4>
                      <p className="text-sm text-royal">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Staff */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">Support Staff</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Solon Ramirez", role: "Photographer/Videographer" },
                { name: "Marshall Morton", role: "Studio Tech" },
                { name: "Stephen \"Stitch\" Keech", role: "Studio Tech" },
                { name: "Scotty \"Too Fly\"", role: "Public Relations" },
              ].map((member, i) => (
                <div key={i} className="text-center p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-royal" />
                  </div>
                  <h4 className="font-bold mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
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
              <div key={i} className="text-center p-6 rounded-xl border bg-background hover:border-royal/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-6 w-6 text-royal" />
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
