"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
  Heart, ShoppingBag, Trash2, ArrowRight,
  ChevronRight, RefreshCw, Loader2
} from "lucide-react"
import { useStore } from "@/lib/store-context"

export default function WishlistPage() {
  const {
    wishlist, wishlistLoading,
    removeFromWishlist, addToCart,
    clearWishlist, refreshWishlist,
    isLoggedIn,
  } = useStore()

  // Sahifa ochilganda backenddan yangilab olish
  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Bosh sahifa</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Istaklar ro'yxati</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl">Istaklar ro'yxati</h1>
              <p className="mt-2 text-muted-foreground">
                {wishlistLoading
                  ? "Yuklanmoqda..."
                  : `${wishlist.length} ta mahsulot saqlangan`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshWishlist}
                disabled={wishlistLoading}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-40"
              >
                <RefreshCw className={`h-4 w-4 ${wishlistLoading ? "animate-spin" : ""}`} />
                Yangilash
              </button>
              {wishlist.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearWishlist}
                  className="rounded-xl text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Barchasini o'chirish
                </Button>
              )}
            </div>
          </div>

          {/* Guest banner */}
          {!isLoggedIn && (
            <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-secondary/60 px-5 py-4">
              <Heart className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Kirish qiling</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Login qilsangiz istaklar barcha qurilmalaringizda saqlanadi
                </p>
              </div>
              <Link href="/account">
                <Button size="sm" className="rounded-xl shrink-0">Kirish</Button>
              </Link>
            </div>
          )}

          {/* Loading state */}
          {wishlistLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden">
                  <div className="aspect-square bg-secondary animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-20 rounded bg-secondary animate-pulse" />
                    <div className="h-4 w-full rounded bg-secondary animate-pulse" />
                    <div className="h-5 w-24 rounded bg-secondary animate-pulse" />
                    <div className="h-10 w-full rounded-xl bg-secondary animate-pulse mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary mb-6">
                <Heart className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
              <h2 className="font-serif text-2xl mb-3">Istaklar ro'yxati bo'sh</h2>
              <p className="max-w-xs text-muted-foreground text-sm mb-8">
                Yoqqan mahsulotlarga yurak belgisini bosing — ular shu yerda saqlanadi
              </p>
              <Button asChild className="rounded-xl px-8" size="lg">
                <Link href="/">
                  Xarid qilishni boshlash
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Wishlist grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </Link>

                    {/* Discount badge */}
                    {item.discount && item.discount > 0 && (
                      <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                        -{item.discount}%
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Stock badge */}
                    {item.quantity !== undefined && item.quantity <= 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border">
                          Tugagan
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      {item.category}
                    </p>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-medium text-sm leading-snug hover:text-muted-foreground transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold">${item.price.toLocaleString()}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        className="w-full rounded-xl h-10 text-sm"
                        disabled={item.quantity !== undefined && item.quantity <= 0}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Savatga qo'shish
                      </Button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-full rounded-xl border border-border py-2 text-xs text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        Istaklardan olib tashlash
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add all to cart */}
          {wishlist.length > 1 && (
            <div className="mt-12 flex justify-center">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 gap-2"
                onClick={() => wishlist.forEach((item) => {
                  if (!item.quantity || item.quantity > 0) addToCart(item)
                })}
              >
                <ShoppingBag className="h-5 w-5" />
                Barchasini savatga qo'shish ({wishlist.length} ta)
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
