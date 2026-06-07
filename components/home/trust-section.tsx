import Link from "next/link"
import { ArrowRight, Shield, Award, BadgeCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const guarantees = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Every product is verified and certified by Apple",
  },
  {
    icon: Award,
    title: "Official Warranty",
    description: "Full manufacturer warranty with local support",
  },
  {
    icon: BadgeCheck,
    title: "Best Price Match",
    description: "We'll match any authorized retailer's price",
  },
  {
    icon: Clock,
    title: "Same-Day Delivery",
    description: "Order by 2 PM for same-day delivery",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-background/60">
              Our Promise
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-balance">
              Shop with
              <br />
              Complete Confidence
            </h2>
            <p className="mt-6 text-lg text-background/70 leading-relaxed">
              At APEX Store, we understand that purchasing premium electronics 
              is a significant investment. That's why we've built our entire 
              business around trust, transparency, and exceptional service.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {guarantees.map((guarantee) => (
                <div key={guarantee.title} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background/10">
                    <guarantee.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{guarantee.title}</h3>
                    <p className="mt-1 text-sm text-background/60">
                      {guarantee.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 rounded-full"
                asChild
              >
                <Link href="/about">
                  Learn About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 text-background hover:bg-background/10 rounded-full"
                asChild
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl bg-background/10 p-6">
                  <p className="text-4xl font-serif">5+</p>
                  <p className="mt-2 text-sm text-background/60">
                    Years of Excellence
                  </p>
                </div>
                <div className="rounded-2xl bg-background/10 p-6">
                  <p className="text-4xl font-serif">99%</p>
                  <p className="mt-2 text-sm text-background/60">
                    Customer Satisfaction
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl bg-background/10 p-6">
                  <p className="text-4xl font-serif">10K+</p>
                  <p className="mt-2 text-sm text-background/60">
                    Happy Customers
                  </p>
                </div>
                <div className="rounded-2xl bg-background/5 p-6 border border-background/10">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-background/60">Support Online</span>
                  </div>
                  <p className="mt-3 font-semibold">24/7</p>
                  <p className="text-sm text-background/60">Expert Support</p>
                </div>
              </div>
            </div>

            {/* Decorative Badge */}
            <div className="absolute -top-6 right-0 flex items-center gap-3 rounded-2xl bg-background px-5 py-3 text-foreground shadow-lg">
              <BadgeCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Certified</p>
                <p className="font-semibold">Apple Reseller</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
