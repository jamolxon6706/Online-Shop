"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Package, CheckCircle, XCircle, Clock, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminGetOrders, type ApiOrder } from "@/lib/api"

type OrderStatus = "pending" | "preparing" | "shipping" | "delivered"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending:   { label: "Kutilmoqda",     color: "bg-yellow-100 text-yellow-700",  icon: Clock },
  preparing: { label: "Qadoqlanmoqda",  color: "bg-blue-100 text-blue-700",     icon: Package },
  shipping:  { label: "Yetkazilmoqda",  color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Yetkazildi",     color: "bg-green-100 text-green-700",   icon: CheckCircle },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null)

  useEffect(() => {
    adminGetOrders().then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch =
      o.first_name.toLowerCase().includes(q) ||
      o.phone_number.toLowerCase().includes(q) ||
      String(o.id).includes(q) ||
      o.product.title.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buyurtmalar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{orders.length} ta buyurtma</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([["all", "Barchasi"], ["pending", "Kutilmoqda"], ["preparing", "Jarayonda"], ["shipping", "Yetkazilmoqda"], ["delivered", "Yetkazildi"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              statusFilter === val ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span className={cn("ml-2 text-xs", statusFilter === val ? "text-background/70" : "text-muted-foreground")}>
              {counts[val as keyof typeof counts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ID, ism, telefon yoki mahsulot..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mijoz</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Mahsulot</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Sana</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-3 px-4">
                      <div className="h-4 w-full rounded bg-secondary animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground text-sm">Buyurtma topilmadi</td>
                </tr>
              ) : filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                const Icon = cfg.icon
                return (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-xs">#{order.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{order.first_name}</p>
                      <p className="text-xs text-muted-foreground">{order.phone_number}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs max-w-[160px] truncate">
                      {order.product.title} × {order.quantity}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs">
                      {new Date(order.created_at).toLocaleDateString("uz-UZ")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium w-fit", cfg.color)}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Buyurtma #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-secondary">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Mijoz</p>
                  <p className="font-medium mt-0.5">{selectedOrder.first_name}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium mt-0.5">{selectedOrder.phone_number}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Mahsulot</p>
                  <p className="font-medium mt-0.5">{selectedOrder.product.title}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Miqdor</p>
                  <p className="font-bold mt-0.5">{selectedOrder.quantity} ta</p>
                </div>
                <div className="rounded-xl bg-secondary p-3 col-span-2">
                  <p className="text-xs text-muted-foreground">Yaratilgan</p>
                  <p className="font-medium mt-0.5">{new Date(selectedOrder.created_at).toLocaleString("uz-UZ")}</p>
                </div>
              </div>
              <div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", STATUS_CONFIG[selectedOrder.status]?.color ?? "bg-secondary")}>
                  {STATUS_CONFIG[selectedOrder.status]?.label ?? selectedOrder.status_display}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
