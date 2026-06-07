"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from "lucide-react"

const initialWishlistItems = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "iPhone",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    inStock: true,
    monthlyPayment: 100,
  },
  {
    id: "macbook-pro-16",
    name: 'MacBook Pro 16" M4 Pro',
    category: "MacBook",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    inStock: true,
    monthlyPayment: 208,
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2nd Gen",
    category: "AirPods",
    price: 249,
    originalPrice: 279,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
    inStock: true,
    monthlyPayment: 21,
  },
  {
    id: "ipad-pro-13",
    name: 'iPad Pro 13" M4',
    category: "iPad",
    price: 1299,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    inStock: false,
    monthlyPayment: 108,
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)

  const removeItem = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setWishlistItems([])
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Wishlist</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl">My Wishlist</h1>
              <p className="mt-2 text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button variant="outline" onClick={clearAll} className="rounded-xl">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 font-serif text-2xl">Your wishlist is empty</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Start adding items you love by clicking the heart icon on any product
              </p>
              <Button asChild className="mt-8 rounded-xl" size="lg">
                <Link href="/">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-border bg-card overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-secondary">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    {!item.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </p>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="mt-1 font-medium hover:text-muted-foreground transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-semibold">
                        ${item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {item.monthlyPayment && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        or ${item.monthlyPayment}/mo for 12 months
                      </p>
                    )}
                    <Button
                      className="mt-4 w-full rounded-xl"
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {item.inStock ? "Add to Cart" : "Notify Me"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
