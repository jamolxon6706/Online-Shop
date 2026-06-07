"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-12 pb-20 lg:pt-20 lg:pb-32">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium tracking-wide">
              NEW iPhone 16 Pro Max Available Now
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-center font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight text-balance">
            Experience the
            <br />
            <span className="text-muted-foreground">Future of Tech</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-center text-lg text-muted-foreground leading-relaxed text-pretty">
            Your premium destination for original Apple products with official 
            warranty, expert consultation, and world-class service.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="min-w-[180px] rounded-full" asChild>
              <Link href="/category/iphone">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[180px] rounded-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
              </svg>
              <span>Original Products</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 2.311L4.5 7.653v8.694l7.5 4.342 7.5-4.342V7.653L12 3.311zM12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span>Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.965 18a3.5 3.5 0 01-6.93 0H1V6a1 1 0 011-1h14a1 1 0 011 1v2h3l3 4.056V18h-2.035a3.5 3.5 0 01-6.93 0h-5.07zM15 7H3v8.05a3.5 3.5 0 015.663.95h5.674c.168-.353.393-.674.663-.95V7zm2 6h4v-.285L18.992 10H17v3zm.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 6h-7a6 6 0 10-6 6v7h-2V12A8 8 0 1117 6h5v2zm-7 14H7v-2h8v2z" />
              </svg>
              <span>0% Installments</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-secondary shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&q=80"
                alt="iPhone 16 Pro Max showcase"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              
              {/* Floating Cards */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-background/90 backdrop-blur-xl px-4 py-3 shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Starting at</p>
                    <p className="font-semibold">$999</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-background/90 backdrop-blur-xl px-4 py-3 shadow-lg">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-secondary ring-2 ring-background"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trusted by</p>
                    <p className="font-semibold">10K+ Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
