"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/store-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore()

  return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Wishlist</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl">My Wishlist</h1>
                <p className="mt-2 text-muted-foreground">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              {wishlist.length > 0 && (
                  <Button
                      variant="outline"
                      onClick={() => wishlist.forEach((item) => removeFromWishlist(item.id))}
                      className="rounded-xl"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
              )}
            </div>

            {wishlist.length === 0 ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlist.map((item) => (
                      <div key={item.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden">
                        {/* Image */}
                        <div className="relative aspect-square bg-secondary">
                          <Link href={`/product/${item.id}`}>
                            <Image
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                          </Link>
                          {/* Remove */}
                          <button
                              onClick={() => removeFromWishlist(item.id)}
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
                            <span className="text-lg font-semibold">${item.price.toLocaleString()}</span>
                            {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toLocaleString()}
                        </span>
                            )}
                          </div>
                          <Button
                              className="mt-4 w-full rounded-xl"
                              onClick={() => addToCart(item)}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
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