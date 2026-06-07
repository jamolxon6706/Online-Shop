"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

const tabs = ["All", "iPhones", "Macs", "AirPods", "Watches", "Accessories"]

interface Props {
  products: Product[]
}

export function BestSellersSection({ products }: Props) {
  const [activeTab, setActiveTab] = useState("All")

  const filteredProducts =
      activeTab === "All"
          ? products
          : products.filter((p) =>
              p.category.toLowerCase().includes(activeTab.toLowerCase().replace("s", ""))
          )

  return (
      <section className="py-20 lg:py-32 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Most Popular
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-balance">
                  Best Sellers
                </h2>
              </div>
              <Link
                  href="/products"
                  className="group flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                View All Products
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                          "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                          activeTab === tab
                              ? "bg-foreground text-background"
                              : "bg-background text-foreground hover:bg-muted"
                      )}
                  >
                    {tab}
                  </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                />
            ))}
          </div>
        </div>
      </section>
  )
}