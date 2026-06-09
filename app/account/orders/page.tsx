"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getMyOrders, getImageUrl, type ApiOrder } from "@/lib/api"
import { ChevronRight, Package, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  shipping: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders().then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Bosh sahifa</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/account" className="hover:text-foreground">Hisob</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Buyurtmalarim</span>
          </nav>

          <h1 className="text-2xl font-semibold mb-8">Buyurtmalarim</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Buyurtmalar yo'q</h2>
              <p className="mt-2 text-muted-foreground">Hali hech qanday buyurtma bermaganingsiz.</p>
              <Button asChild className="mt-6 rounded-xl">
                <Link href="/">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Xarid qilishni boshlash
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                        <Image
                          src={getImageUrl(order.product.thumbnail_photo)}
                          alt={order.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{order.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity} dona × {Number(order.product.price).toLocaleString()} so'm
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          #{order.id} · {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-secondary text-foreground"}`}>
                      {order.status_display}
                    </span>
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
