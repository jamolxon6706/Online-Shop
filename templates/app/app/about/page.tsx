import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield, Award, Truck, Headphones, CheckCircle, Store, Users, Clock } from "lucide-react"
import Image from "next/image"

const values = [
  {
    icon: Shield,
    title: "100% Original Products",
    description: "Every product we sell is sourced directly from official Apple channels, guaranteeing authenticity and quality."
  },
  {
    icon: Award,
    title: "Official Warranty",
    description: "All our products come with full manufacturer warranty, giving you complete peace of mind with every purchase."
  },
  {
    icon: Truck,
    title: "Fast & Secure Delivery",
    description: "We deliver across the country with secure packaging and real-time tracking for every order."
  },
  {
    icon: Headphones,
    title: "Expert Consultation",
    description: "Our Apple-certified specialists are ready to help you find the perfect product for your needs."
  },
]

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "5+", label: "Years Experience" },
  { value: "50K+", label: "Products Sold" },
  { value: "99%", label: "Satisfaction Rate" },
]

const guarantees = [
  "Genuine Apple Products Only",
  "Price Match Guarantee",
  "14-Day Return Policy",
  "Secure Payment Options",
  "Free Technical Support",
  "Trade-In Program Available",
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                About APEX Store
              </span>
              <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl text-balance">
                Your Trusted Apple Partner
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                For over 5 years, APEX has been the premier destination for original Apple products. 
                We combine premium service with unbeatable prices to deliver an exceptional shopping experience.
              </p>
            </div>
          </div>
          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
              <div>
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Our Story
                </span>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                  Built on Trust, Driven by Excellence
                </h2>
                <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    APEX Store was founded with a simple mission: to provide customers with authentic 
                    Apple products backed by exceptional service. What started as a small retail shop 
                    has grown into the region&apos;s most trusted Apple reseller.
                  </p>
                  <p>
                    We understand that purchasing technology is an investment. That&apos;s why we go 
                    beyond just selling products. Our team of certified experts helps you make 
                    informed decisions, ensuring you get the right device for your lifestyle.
                  </p>
                  <p>
                    Every product in our store is carefully sourced through official channels, 
                    comes with full manufacturer warranty, and is backed by our dedicated 
                    after-sales support team.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                    alt="APEX Store interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 rounded-xl bg-card p-6 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground">
                      <Store className="h-6 w-6 text-background" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">Since 2020</p>
                      <p className="text-sm text-muted-foreground">Serving Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-foreground py-16 text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-4xl sm:text-5xl">{stat.value}</p>
                  <p className="mt-2 text-sm text-background/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Why Choose Us
              </span>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                The APEX Difference
              </h2>
              <p className="mt-4 text-muted-foreground">
                We&apos;re committed to providing an unparalleled shopping experience 
                for all your Apple product needs.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-foreground/20"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-foreground/5 transition-colors group-hover:bg-foreground group-hover:text-background">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="bg-muted/30 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
              <div>
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Our Promise
                </span>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                  Your Satisfaction, Guaranteed
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  We stand behind every product we sell. Our comprehensive guarantees 
                  ensure you can shop with complete confidence.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {guarantees.map((guarantee) => (
                    <div key={guarantee} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80"
                    alt="Apple products showcase"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Our Team
              </span>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                Apple-Certified Experts
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our team consists of passionate Apple enthusiasts who are certified 
                to help you get the most out of your devices.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-lg">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Sales Consultants</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Expert guidance to help you choose the perfect Apple product
                </p>
              </div>
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-lg">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Headphones className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Support Team</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dedicated support for all your post-purchase needs
                </p>
              </div>
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Service Center</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Authorized repairs and maintenance services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-foreground py-24 text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl sm:text-4xl">
                Ready to Experience Premium?
              </h2>
              <p className="mt-4 text-background/70">
                Visit our store or shop online to discover the complete Apple ecosystem.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/category/iphone"
                  className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
                >
                  Shop Now
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-background/30 px-8 py-3 text-sm font-medium transition-colors hover:bg-background/10"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
