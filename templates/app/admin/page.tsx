"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Package, ShoppingCart, Users, TrendingUp, TrendingDown,
  AlertTriangle, ArrowUpRight, BarChart2, DollarSign, Eye
} from "lucide-react"
import { adminGetStats, adminGetProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

interface Stats {
  total_products: number
  active_products: number
  total_categories: number
  total_orders: number
  total_users: number
  low_stock: number
}

const DEMO_STATS: Stats = {
  total_products: 24,
  active_products: 22,
  total_categories: 6,
  total_orders: 187,
  total_users: 1240,
  low_stock: 3,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(DEMO_STATS)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetProducts()]).then(([s, p]) => {
      if (s) setStats(s)
      setProducts(p.slice(0, 8))
      setLoading(false)
    })
  }, [])

  const statCards = [
    {
      title: "Jami mahsulotlar",
      value: stats.total_products,
      icon: Package,
      change: "+3 bu oy",
      up: true,
      href: "/admin/products",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Buyurtmalar",
      value: stats.total_orders,
      icon: ShoppingCart,
      change: "+12% bu hafta",
      up: true,
      href: "/admin/orders",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Foydalanuvchilar",
      value: stats.total_users.toLocaleString(),
      icon: Users,
      change: "+48 bu oy",
      up: true,
      href: "/admin/customers",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Kam qolgan mahsulotlar",
      value: stats.low_stock,
      icon: AlertTriangle,
      change: "E'tibor bering",
      up: false,
      href: "/admin/products",
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">APEX Admin panelga xush kelibsiz</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ title, value, icon: Icon, change, up, href, color }) => (
          <Link
            key={title}
            href={href}
            className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{loading ? "—" : value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
            </div>
            <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold">So'nggi mahsulotlar</h2>
            <Link href="/admin/products" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              Barchasi <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-40 rounded bg-secondary animate-pulse" />
                    <div className="h-3 w-24 rounded bg-secondary animate-pulse" />
                  </div>
                  <div className="h-4 w-16 rounded bg-secondary animate-pulse" />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Mahsulotlar yo'q
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors">
                  <div
                    className="h-10 w-10 rounded-xl bg-secondary shrink-0 overflow-hidden"
                    style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">${product.price.toLocaleString()}</p>
                    <p className={`text-xs ${product.quantity > 5 ? "text-green-600" : product.quantity > 0 ? "text-yellow-600" : "text-red-500"}`}>
                      {product.quantity > 0 ? `${product.quantity} ta` : "Tugagan"}
                    </p>
                  </div>
                  <Link href={`/admin/products?edit=${product.id}`} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground ml-1 shrink-0">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Summary */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold mb-4">Tezkor harakatlar</h2>
            <div className="space-y-2">
              {[
                { label: "Yangi mahsulot qo'shish", href: "/admin/products?new=1", icon: Package },
                { label: "Barcha buyurtmalar", href: "/admin/orders", icon: ShoppingCart },
                { label: "Yangi kategoriya", href: "/admin/categories?new=1", icon: BarChart2 },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:bg-secondary transition-colors group"
                >
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Category Stats */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold mb-4">Kategoriyalar</h2>
            <div className="space-y-3">
              {[
                { name: "iPhone",     count: 4, color: "bg-blue-500" },
                { name: "MacBook",    count: 4, color: "bg-purple-500" },
                { name: "iPad",       count: 4, color: "bg-green-500" },
                { name: "AirPods",    count: 4, color: "bg-yellow-500" },
                { name: "Apple Watch",count: 3, color: "bg-red-500" },
              ].map(({ name, count, color }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${color} shrink-0`} />
                  <span className="text-sm flex-1">{name}</span>
                  <span className="text-sm text-muted-foreground font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
