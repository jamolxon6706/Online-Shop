"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoryHeader } from "@/components/category/category-header"
import { ProductFilters, type FilterState } from "@/components/category/product-filters"
import { ProductGrid } from "@/components/category/product-grid"
import { getProductsByCategory } from "@/lib/api"
import type { Product } from "@/lib/types"

const categoryBanners: Record<string, string> = {
  iphone:      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=80",
  macbook:     "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80",
  ipad:        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1600&q=80",
  watch:       "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1600&q=80",
  airpods:     "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=1600&q=80",
  accessories: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=1600&q=80",
}

const defaultFilters: FilterState = {
  priceRanges: [],
  storages: [],
  colors: [],
  inStock: false,
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [products, setProducts] = useState<Product[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductsByCategory(slug).then(({ products, categoryName }) => {
      setProducts(products)
      setCategoryName(categoryName)
      setLoading(false)
    })
  }, [slug])

  const banner = categoryBanners[slug] ?? categoryBanners["accessories"]

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <CategoryHeader
          name={categoryName || slug}
          description=""
          banner={banner}
          productCount={products.length}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-secondary aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <ProductFilters
                products={products}
                filters={filters}
                onChange={setFilters}
              />
              <ProductGrid products={products} filters={filters} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}