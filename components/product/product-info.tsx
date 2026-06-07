"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  ChevronRight, Heart, ShoppingBag, Truck, Shield,
  CreditCard, Check, Minus, Plus, MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store-context"
import type { ColorVariant, StorageOption } from "@/lib/types"

interface ProductInfoProps {
  product: {
    id: string
    name: string
    category: string
    categorySlug?: string
    price: number
    originalPrice?: number
    discount?: number
    isNew?: boolean
    quantity?: number
    description?: string
    photos?: string[]
    colorVariants?: ColorVariant[]
    storageOptions?: StorageOption[]
  }
  onColorChange?: (color: ColorVariant) => void
}

export function ProductInfo({ product, onColorChange }: ProductInfoProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, showNotification } = useStore()

  const hasColors = (product.colorVariants?.length ?? 0) > 0
  const hasStorage = (product.storageOptions?.length ?? 0) > 0

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    product.colorVariants?.[0] ?? null
  )
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(
    product.storageOptions?.[0] ?? null
  )
  const [quantity, setQuantity] = useState(1)

  const inStock = (product.quantity ?? 0) > 0
  const wishlisted = isInWishlist(product.id)

  // Active price: storage option price OR base price
  const activePrice = selectedStorage?.price ?? product.price
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount ?? 0)

  const handleColorSelect = useCallback((color: ColorVariant) => {
    setSelectedColor(color)
    onColorChange?.(color)
  }, [onColorChange])

  const currentImage = selectedColor?.images?.[0] ?? product.photos?.[0] ?? '/placeholder.jpg'

  const handleAddToCart = async () => {
    await addToCart({
      id: product.id,
      name: product.name,
      price: activePrice,
      originalPrice: product.originalPrice,
      image: currentImage,
      category: product.category,
    }, quantity)
  }

  const handleWishlist = async () => {
    if (wishlisted) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist({
        id: product.id,
        name: product.name,
        price: activePrice,
        image: currentImage,
        category: product.category,
      })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Bosh sahifa</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        {product.categorySlug && (
          <>
            <Link href={`/category/${product.categorySlug}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </>
        )}
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {product.isNew && (
          <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">New</span>
        )}
        {discountPercent > 0 && (
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
            -{discountPercent}%
          </span>
        )}
        <span className={cn(
          "rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1",
          inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", inStock ? "bg-green-600" : "bg-red-500")} />
          {inStock ? "Mavjud" : "Tugagan"}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl leading-tight">{product.name}</h1>

      {/* Price */}
      <div className="mt-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-semibold">${activePrice.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > activePrice && (
            <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
          )}
          {selectedStorage && (
            <span className="text-sm text-muted-foreground">
              ({selectedStorage.ram ? `${selectedStorage.storage} / ${selectedStorage.ram}` : selectedStorage.storage})
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          yoki ${Math.round(activePrice / 12)}/oy · 12 oy · 0% APR
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
      )}

      {/* ─── Color Selection ─── */}
      {hasColors && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Rang:</span>
            <span className="text-sm text-muted-foreground">{selectedColor?.name}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colorVariants!.map((color) => {
              const isLight = ['#FFFFFF', '#F2F0EB', '#F5F5F0', '#E3E4E5', '#F0F0EC'].includes(color.hex)
              const isSelected = selectedColor?.id === color.id
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-200 relative focus:outline-none",
                    isSelected
                      ? "ring-2 ring-foreground ring-offset-2 scale-110"
                      : "hover:scale-110 hover:ring-2 hover:ring-border hover:ring-offset-1"
                  )}
                  style={{ backgroundColor: color.hex, border: isLight ? '1px solid #e5e5e5' : 'none' }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-4 w-4" style={{ color: isLight ? '#000' : '#fff' }} />
                    </span>
                  )}
                  <span className="sr-only">{color.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Storage/RAM Selection ─── */}
      {hasStorage && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">
              {product.storageOptions![0]?.ram ? "Xotira / RAM:" : "Xotira:"}
            </span>
            <span className="text-sm text-muted-foreground">
              {selectedStorage?.ram
                ? `${selectedStorage.storage} / ${selectedStorage.ram}`
                : selectedStorage?.storage}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.storageOptions!.map((option) => {
              const isSelected = selectedStorage?.id === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedStorage(option)}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none",
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow-md"
                      : "border-border hover:border-foreground/40 hover:bg-secondary"
                  )}
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className={cn("ml-2 text-xs", isSelected ? "text-background/70" : "text-muted-foreground")}>
                    ${option.price.toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Quantity ─── */}
      <div className="mt-8">
        <span className="text-sm font-medium">Miqdor</span>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-3 hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(q + 1, product.quantity ?? 99))}
              disabled={quantity >= (product.quantity ?? 99)}
              className="p-3 hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {product.quantity !== undefined && (
            <span className="text-sm text-muted-foreground">{product.quantity} dona qoldi</span>
          )}
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 rounded-xl h-14 text-base font-semibold"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Savatchaga qo'shish · ${activePrice.toLocaleString()}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "rounded-xl h-14 px-5 transition-colors",
            wishlisted && "text-red-500 border-red-300 bg-red-50 hover:bg-red-100"
          )}
          onClick={handleWishlist}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
        </Button>
      </div>

      {/* ─── Trust Badges ─── */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        {[
          { icon: Truck,      title: "Bepul yetkazib berish", desc: "$299 dan ortiq buyurtmada" },
          { icon: Shield,     title: "Rasmiy kafolat",         desc: "1 yillik himoya" },
          { icon: CreditCard, title: "0% bo'lib to'lash",      desc: "24 oygacha" },
          { icon: Check,      title: "100% Original",          desc: "Sertifikatlangan mahsulot" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Contact ─── */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary shrink-0">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">Bu mahsulot haqida savol bormi?</p>
          <p className="text-xs text-muted-foreground">Mutaxassislarimiz 24/7 yordam beradi</p>
        </div>
        <Button variant="outline" className="rounded-full text-sm shrink-0" size="sm">
          Bog'lanish
        </Button>
      </div>
    </div>
  )
}
