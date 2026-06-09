"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { getCart, type ApiCart } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const [cart, setCart] = useState<ApiCart | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getCart().then((data) => {
      setCart(data)
      setLoading(false)
    })
  }, [])

  const cartItems = (cart?.items ?? []).map((item) => ({
    id: String(item.product.id),
    name: item.product.title,
    variant: "",
    price: parseFloat(String(item.product.price)),
    quantity: item.quantity,
    image: item.product.thumbnail_photo
      ? String(item.product.thumbnail_photo)
      : "/placeholder.jpg",
  }))

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Checkout</h1>
            <p className="mt-2 text-muted-foreground">Complete your order securely</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <CheckoutForm cartItems={cartItems} onSuccess={() => router.push("/account/orders")} />
            </div>
            <div>
              <CheckoutSummary items={cartItems} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
