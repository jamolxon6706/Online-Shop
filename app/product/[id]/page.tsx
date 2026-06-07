"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { getProductById } from "@/lib/api"
import type { Product, ColorVariant } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(null)

  useEffect(() => {
    if (!id) return
    getProductById(id).then((p) => {
      setProduct(p)
      if (p?.colorVariants?.[0]) setActiveColor(p.colorVariants[0])
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-32 rounded bg-secondary animate-pulse" />
                <div className="h-10 w-full rounded bg-secondary animate-pulse" />
                <div className="h-8 w-28 rounded bg-secondary animate-pulse" />
                <div className="h-24 w-full rounded bg-secondary animate-pulse" />
                <div className="flex gap-3 mt-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 w-24 rounded-xl bg-secondary animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) return notFound()

  const fallbackImages = product.photos?.length ? product.photos : [product.image]

  const productForInfo = {
    id: product.id,
    name: product.name,
    category: product.category,
    categorySlug: product.category.toLowerCase().replace(/\s+/g, '-'),
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    quantity: product.quantity,
    description: product.description,
    photos: fallbackImages,
    colorVariants: product.colorVariants || [],
    storageOptions: product.storageOptions || [],
    isNew: product.isNew,
  }

  const productForTabs = {
    id: product.id,
    name: product.name,
    category: product.category,
    categorySlug: product.category.toLowerCase(),
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    quantity: product.quantity,
    inStock: product.quantity > 0,
    description: product.description ?? "",
    photos: fallbackImages,
    features: [],
    specs: [],
    colors: [],
    storages: [],
    rating: 4.8,
    reviewCount: 0,
  }

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={fallbackImages}
              name={product.name}
              activeColor={activeColor}
            />
            <ProductInfo
              product={productForInfo}
              onColorChange={setActiveColor}
            />
          </div>
        </div>
        <ProductTabs product={productForTabs} />
        <RelatedProducts category={product.category.toLowerCase()} currentProductId={product.id} />
      </main>
      <Footer />
    </>
  )
}
