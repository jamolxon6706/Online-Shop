"use client"

import { useState } from "react"
import { Mail, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <section className="py-16 sm:py-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {isSubmitted ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl">
                You&apos;re on the list!
              </h2>
              <p className="text-background/70">
                Thank you for subscribing. You&apos;ll be the first to know about exclusive deals and new arrivals.
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-background/10">
                <Mail className="h-7 w-7" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
                Get Exclusive Offers
              </h2>
              <p className="mt-4 text-background/70">
                Subscribe to our newsletter and be the first to know about new products, special discounts, and exclusive Apple deals.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-background/20 bg-background/10 text-background placeholder:text-background/50 focus:border-background/40 focus:ring-background/20 sm:w-80"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-12 bg-background text-foreground hover:bg-background/90"
                  >
                    {isLoading ? (
                      "Subscribing..."
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-sm text-background/50">
                No spam, unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-background/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Exclusive discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Early access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>New arrivals</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
