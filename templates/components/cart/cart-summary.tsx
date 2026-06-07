"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Tag, Shield, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  price: number
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [isPromoApplied, setIsPromoApplied] = useState(false)

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal >= 299 ? 0 : 15
  const discount = isPromoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setIsPromoApplied(true)
    }
  }

  return (
    <div className="sticky top-24 space-y-6">
      {/* Order Summary */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {/* Promo Code */}
        <div className="mt-6">
          <label className="text-sm font-medium">Promo Code</label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                disabled={isPromoApplied}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={isPromoApplied || !promoCode}
            >
              {isPromoApplied ? "Applied" : "Apply"}
            </Button>
          </div>
          {isPromoApplied && (
            <p className="mt-2 text-sm text-green-600">
              Promo code applied! 10% discount added.
            </p>
          )}
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-3 border-t border-border pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (10%)</span>
              <span>-${discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            or ${Math.round(total / 12)}/mo for 12 months at 0% APR
          </p>
        </div>

        {/* Checkout Button */}
        <Button className="mt-6 w-full rounded-xl" size="lg" asChild>
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      </div>

      {/* Trust Badges */}
      <div className="rounded-2xl bg-secondary/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Official Warranty</p>
            <p className="text-xs text-muted-foreground">1 Year Apple Warranty</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over $299</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">0% Financing</p>
            <p className="text-xs text-muted-foreground">Up to 24 months</p>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center">
        <Link
          href="/category/iphone"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
