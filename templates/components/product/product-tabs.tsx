"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductTabsProps {
  product: {
    features: string[]
    specs: { name: string; value: string }[]
    rating: number
    reviewCount: number
  }
}

const tabs = ["Features", "Specifications", "Reviews", "FAQ"]

const reviews = [
  {
    id: 1,
    author: "Alex M.",
    rating: 5,
    date: "March 10, 2026",
    title: "Absolutely incredible device",
    content:
      "This is by far the best phone I've ever owned. The camera quality is outstanding, battery life is exceptional, and the display is gorgeous. Highly recommend!",
    helpful: 124,
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    id: 2,
    author: "Sarah K.",
    rating: 5,
    date: "March 8, 2026",
    title: "Worth every penny",
    content:
      "Upgraded from the 14 Pro and the difference is noticeable. The new Camera Control button is a game changer for photography enthusiasts like myself.",
    helpful: 87,
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    id: 3,
    author: "Michael R.",
    rating: 4,
    date: "March 5, 2026",
    title: "Great phone, minor learning curve",
    content:
      "Excellent device overall. Took some time to get used to the new features but now I can't imagine going back. The titanium build feels premium.",
    helpful: 56,
    verified: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
]

const faqs = [
  {
    question: "Is this an original Apple product?",
    answer:
      "Yes, all products sold at APEX Store are 100% original Apple products with official warranty. We are an authorized Apple reseller.",
  },
  {
    question: "What warranty is included?",
    answer:
      "This product comes with a full 1-year Apple Limited Warranty. You can also purchase AppleCare+ for extended coverage.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We offer same-day delivery for orders placed before 2 PM. Standard delivery takes 1-3 business days. Free shipping on orders over $299.",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "Yes, we offer 0% APR financing for 12, 18, or 24 months on qualifying purchases. You can select your preferred payment plan at checkout.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 14-day hassle-free return policy. Products must be in original condition with all accessories and packaging.",
  },
]

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("Features")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Features Tab */}
          {activeTab === "Features" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-semibold">Key Features</h3>
                <ul className="mt-6 space-y-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-foreground">
                        <svg
                          className="h-3 w-3 text-background"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-background p-8">
                <h4 className="font-semibold">Why Choose This Product</h4>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Experience the perfect blend of cutting-edge technology and elegant design. 
                  This product represents the pinnacle of innovation, offering unparalleled 
                  performance, stunning visuals, and a seamless user experience that adapts 
                  to your lifestyle.
                </p>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "Specifications" && (
            <div className="rounded-3xl bg-background overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.specs.map((spec, index) => (
                    <tr
                      key={spec.name}
                      className={cn(
                        "border-b border-border last:border-0",
                        index % 2 === 0 && "bg-secondary/30"
                      )}
                    >
                      <td className="px-6 py-4 text-sm font-medium w-1/3">
                        {spec.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "Reviews" && (
            <div id="reviews">
              {/* Review Summary */}
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-semibold">{product.rating}</p>
                    <div className="mt-2 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.rating)
                              ? "fill-foreground text-foreground"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.reviewCount.toLocaleString()} reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="w-3 text-xs">{stars}</span>
                        <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full"
                            style={{
                              width:
                                stars === 5
                                  ? "85%"
                                  : stars === 4
                                  ? "10%"
                                  : stars === 3
                                  ? "3%"
                                  : "1%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="rounded-full">Write a Review</Button>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl bg-background p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={review.image}
                            alt={review.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{review.author}</p>
                            {review.verified && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "fill-foreground text-foreground"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="mt-4 font-semibold">{review.title}</h4>
                    <p className="mt-2 text-muted-foreground">
                      {review.content}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="rounded-full">
                  Load More Reviews
                </Button>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "FAQ" && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-background overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-transform",
                        expandedFaq === index && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
