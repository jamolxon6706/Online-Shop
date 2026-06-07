import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"

export const metadata: Metadata = {
  title: "Checkout | APEX Store",
  description: "Complete your purchase securely",
}

// Demo order data
const orderItems = [
  {
    id: "1",
    name: "iPhone 16 Pro Max",
    variant: "256GB - Natural Titanium",
    price: 1199,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=200&q=80",
  },
  {
    id: "2",
    name: "AirPods Pro 2nd Generation",
    variant: "USB-C",
    price: 249,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&q=80",
  },
]

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Checkout</h1>
            <p className="mt-2 text-muted-foreground">
              Complete your order securely
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>
            <div>
              <CheckoutSummary items={orderItems} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
