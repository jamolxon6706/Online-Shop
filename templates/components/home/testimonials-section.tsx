"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
    text: "Exceptional service from start to finish. The team helped me choose the perfect MacBook for my design work, and the financing options made it incredibly affordable.",
    product: "MacBook Pro 16-inch",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    text: "I've been buying Apple products from APEX for years. Their warranty support is unmatched, and I love knowing I'm getting 100% authentic products every time.",
    product: "iPhone 16 Pro Max",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Fitness Instructor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
    text: "The Apple Watch Ultra 2 has been a game-changer for my training. APEX made the purchase process seamless with same-day delivery. Highly recommend!",
    product: "Apple Watch Ultra 2",
  },
  {
    id: 4,
    name: "David Park",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 5,
    text: "Outstanding customer service. They went above and beyond to help me set up devices for my entire team. The bulk pricing and support were excellent.",
    product: "iPad Pro + Accessories",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Testimonials
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-balance">
            Loved by Thousands
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-16 relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="mx-auto max-w-3xl text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-foreground text-foreground"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="mt-8 font-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-balance">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.product}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    currentIndex === index
                      ? "w-8 bg-foreground"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  )}
                >
                  <span className="sr-only">Go to testimonial {index + 1}</span>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-20 border-t border-border pt-12">
          <p className="text-center text-sm text-muted-foreground">
            Trusted by leading companies worldwide
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
            {["Google", "Meta", "Amazon", "Microsoft", "Tesla"].map((company) => (
              <span key={company} className="text-xl font-semibold tracking-tight">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
