"use client"

import { useMemo, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import type { FilterState } from "./product-filters"
import { cn } from "@/lib/utils"
import { LayoutGrid, List } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  filters: FilterState
}

type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "discount"

function matchesPriceRange(price: number, range: string): boolean {
  switch (range) {
    case "under-500":  return price < 500
    case "500-1000":   return price >= 500 && price <= 1000
    case "1000-2000":  return price > 1000 && price <= 2000
    case "over-2000":  return price > 2000
    default:           return true
  }
}

export function ProductGrid({ products, filters }: ProductGridProps) {
  const [sort, setSort] = useState<SortOption>("default")

  const filtered = useMemo(() => {
    let result = [...products]

    // Filter: in stock
    if (filters.inStock) {
      result = result.filter(p => p.quantity > 0)
    }

    // Filter: price ranges
    if (filters.priceRanges.length > 0) {
      result = result.filter(p =>
        filters.priceRanges.some(range => matchesPriceRange(p.price, range))
      )
    }

    // Filter: storage
    if (filters.storages.length > 0) {
      result = result.filter(p =>
        p.storageOptions?.some(s => filters.storages.includes(s.storage))
      )
    }

    // Filter: colors
    if (filters.colors.length > 0) {
      result = result.filter(p =>
        p.colorVariants?.some(c => filters.colors.includes(c.name))
      )
    }

    // Sort
    switch (sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "discount":   result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0)); break
      case "newest":
        result.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        break
    }

    return result
  }, [products, filters, sort])

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> ta mahsulot topildi
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            <option value="default">Standart tartib</option>
            <option value="price-asc">Narx: arzon — qimmat</option>
            <option value="price-desc">Narx: qimmat — arzon</option>
            <option value="discount">Chegirmali avval</option>
            <option value="newest">Eng yangi</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Mahsulot topilmadi</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Tanlangan filtrlarga mos mahsulot yo'q. Filtrlarni o'zgartiring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              badge={product.badge}
              quantity={product.quantity}
            />
          ))}
        </div>
      )}
    </div>
  )
}
