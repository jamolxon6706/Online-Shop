import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* MacBook Banner */}
          <div className="group relative overflow-hidden rounded-3xl bg-foreground p-8 lg:p-12">
            <div className="relative z-10">
              <p className="text-xs font-medium uppercase tracking-wider text-background/60">
                Limited Time Offer
              </p>
              <h3 className="mt-4 font-serif text-3xl lg:text-4xl text-background text-balance">
                MacBook Pro M3
                <br />
                <span className="text-background/70">Save up to $200</span>
              </h3>
              <p className="mt-4 max-w-sm text-background/70">
                The most powerful MacBook Pro ever. Now with incredible savings 
                for a limited time only.
              </p>
              <Button
                className="mt-6 bg-background text-foreground hover:bg-background/90 rounded-full"
                size="lg"
                asChild
              >
                <Link href="/category/macbook">
                  Shop MacBook
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute -right-12 -bottom-12 h-64 w-64 lg:h-80 lg:w-80 opacity-80 transition-transform group-hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80"
                alt="MacBook Pro"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Trade-In Banner */}
          <div className="group relative overflow-hidden rounded-3xl bg-secondary p-8 lg:p-12">
            <div className="relative z-10">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trade-In Program
              </p>
              <h3 className="mt-4 font-serif text-3xl lg:text-4xl text-balance">
                Upgrade with
                <br />
                <span className="text-muted-foreground">Trade-In Value</span>
              </h3>
              <p className="mt-4 max-w-sm text-muted-foreground">
                Get credit toward a new device when you trade in your current one. 
                It's easy, fast, and good for the planet.
              </p>
              <Button className="mt-6 rounded-full" size="lg" asChild>
                <Link href="/trade-in">
                  Get Estimate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute -right-8 -bottom-8 h-56 w-56 lg:h-72 lg:w-72 opacity-50 transition-transform group-hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"
                alt="iPhone"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Full Width Banner */}
        <div className="mt-6 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-foreground to-foreground/90 p-8 lg:p-16">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-1.5 text-xs font-medium text-background">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                In Store & Online
              </div>
              <h3 className="mt-6 font-serif text-3xl lg:text-5xl text-background text-balance">
                0% Interest Financing
              </h3>
              <p className="mt-4 text-lg text-background/70">
                Split your purchase into 12, 18, or 24 monthly payments with no interest. 
                Available on orders over $299.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 rounded-full"
                asChild
              >
                <Link href="/financing">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 text-background hover:bg-background/10 rounded-full"
                asChild
              >
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
