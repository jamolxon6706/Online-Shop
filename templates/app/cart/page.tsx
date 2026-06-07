"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartEmpty } from "@/components/cart/cart-empty"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store-context"

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartLoading,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refreshCart,
    isLoggedIn,
  } = useStore()

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const isEmpty = cart.length === 0

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl">Savat</h1>
              {!isEmpty && (
                <p className="mt-2 text-muted-foreground">
                  {cartCount} ta mahsulot
                </p>
              )}
            </div>
            {!isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => clearCart()}
              >
                Savatni tozalash
              </Button>
            )}
          </div>

          {!isLoggedIn && !isEmpty && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Savatingiz faqat bu qurilmada saqlanmoqda.{" "}
              <Link href="/account" className="font-medium underline">
                Kirish
              </Link>{" "}
              orqali hisobingizga saqlang.
            </div>
          )}

          {cartLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isEmpty ? (
            <CartEmpty />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Table header */}
                <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Mahsulot</div>
                  <div className="col-span-2 text-center">Narx</div>
                  <div className="col-span-2 text-center">Miqdor</div>
                  <div className="col-span-2 text-right">Jami</div>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="rounded-2xl bg-card p-4 sm:p-6 border border-border"
                  >
                    <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4">
                        <Link
                          href={`/product/${item.id}`}
                          className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-col justify-between py-1">
                          <Link
                            href={`/product/${item.id}`}
                            className="font-medium hover:text-muted-foreground transition-colors"
                          >
                            {item.name}
                          </Link>
                          {item.category && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.category}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden sm:block col-span-2 text-center">
                        <span className="font-medium">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 mt-4 sm:mt-0 flex justify-center">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition-colors rounded-l-lg"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors rounded-r-lg"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-semibold sm:order-1">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-border">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div>
                <CartSummary items={cart.map(i => ({ price: i.price, quantity: i.quantity }))} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
