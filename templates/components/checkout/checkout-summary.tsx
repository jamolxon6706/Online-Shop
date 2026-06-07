import Image from "next/image"
import Link from "next/link"
import { Shield, Lock } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  image: string
}

interface CheckoutSummaryProps {
  items: OrderItem[]
}

export function CheckoutSummary({ items }: CheckoutSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = 0 // Free shipping
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  return (
    <div className="sticky top-24 space-y-6">
      {/* Order Summary */}
      <div className="rounded-2xl bg-background border border-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <Link
            href="/cart"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit
          </Link>
        </div>

        {/* Items */}
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.variant}</p>
              </div>
              <p className="font-medium text-sm">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-3 border-t border-border pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Tax</span>
            <span>${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="rounded-2xl bg-secondary/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Secure Checkout</p>
            <p className="text-xs text-muted-foreground">
              Your data is protected with 256-bit encryption
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Buyer Protection</p>
            <p className="text-xs text-muted-foreground">
              Full refund if item is not as described
            </p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="text-foreground underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}
