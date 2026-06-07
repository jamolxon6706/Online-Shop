"use client"

import Link from "next/link"
import Image from "next/image"
import { getImageUrl, type Category } from "@/lib/api"
import { useEffect, useState } from "react"
import { getCategories } from "@/lib/api"

// ─── Skeleton ─────────────────────────────────────────────

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 animate-pulse">
      <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-secondary" />
      <div className="h-3 w-16 rounded bg-secondary" />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────

interface Props {
  // Server component dan pre-fetch qilingan kategoriyalar (ixtiyoriy)
  categories?: Category[]
}

export function CategoriesSection({ categories: initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])
  const [loading, setLoading] = useState(!initialCategories)

  useEffect(() => {
    // Agar server dan kategoriyalar kelgan bo'lsa — API ga qayta murojaat qilmaslik
    if (initialCategories && initialCategories.length > 0) return
    getCategories().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [initialCategories])

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Kategoriyalar</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
          {loading
            ? [...Array(6)].map((_, i) => <CategoryCardSkeleton key={i} />)
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-secondary overflow-hidden
                                  group-hover:shadow-md transition-all duration-200 group-hover:scale-[1.03]">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-center text-muted-foreground
                                   group-hover:text-foreground transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))
          }
        </div>
      </div>
    </section>
  )
}
