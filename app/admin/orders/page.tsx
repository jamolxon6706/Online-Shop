"use client"

import { useState } from "react"
import { Search, Eye, Package, CheckCircle, XCircle, Clock, Truck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  customerName: string
  email: string
  total: number
  status: OrderStatus
  items: number
  date: string
  address: string
}

// Demo data
const DEMO_ORDERS: Order[] = [
  { id: "ORD-001", customerName: "Alisher Nazarov", email: "alisher@mail.ru", total: 1199, status: "delivered", items: 1, date: "2025-05-10", address: "Toshkent, Yunusobod" },
  { id: "ORD-002", customerName: "Malika Yusupova", email: "malika@gmail.com", total: 2399, status: "shipped", items: 2, date: "2025-05-11", address: "Toshkent, Chilonzor" },
  { id: "ORD-003", customerName: "Bobur Ismoilov", email: "bobur@mail.uz", total: 549, status: "processing", items: 1, date: "2025-05-11", address: "Samarqand, Markaz" },
  { id: "ORD-004", customerName: "Nilufar Rahimova", email: "nilufar@gmail.com", total: 799, status: "pending", items: 1, date: "2025-05-12", address: "Toshkent, Mirzo Ulugbek" },
  { id: "ORD-005", customerName: "Sardor Toshmatov", email: "sardor@yandex.ru", total: 3499, status: "cancelled", items: 1, date: "2025-05-09", address: "Namangan, Markaz" },
  { id: "ORD-006", customerName: "Zulfiya Xolmatova", email: "zulfiya@mail.ru", total: 249, status: "delivered", items: 1, date: "2025-05-08", address: "Toshkent, Shayxontohur" },
  { id: "ORD-007", customerName: "Jasur Qodirov", email: "jasur@gmail.com", total: 1499, status: "shipped", items: 2, date: "2025-05-10", address: "Farg'ona, Markaz" },
  { id: "ORD-008", customerName: "Shahnoza Mirzaeva", email: "shahnoza@mail.uz", total: 399, status: "processing", items: 1, date: "2025-05-12", address: "Toshkent, Sergeli" },
]

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending:    { label: "Kutilmoqda",    color: "bg-yellow-100 text-yellow-700",   icon: Clock },
  processing: { label: "Jarayonda",     color: "bg-blue-100 text-blue-700",       icon: Package },
  shipped:    { label: "Yetkazilmoqda", color: "bg-purple-100 text-purple-700",   icon: Truck },
  delivered:  { label: "Yetkazildi",    color: "bg-green-100 text-green-700",     icon: CheckCircle },
  cancelled:  { label: "Bekor qilindi", color: "bg-red-100 text-red-600",         icon: XCircle },
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filtered = DEMO_ORDERS.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: DEMO_ORDERS.length,
    pending: DEMO_ORDERS.filter(o => o.status === "pending").length,
    processing: DEMO_ORDERS.filter(o => o.status === "processing").length,
    shipped: DEMO_ORDERS.filter(o => o.status === "shipped").length,
    delivered: DEMO_ORDERS.filter(o => o.status === "delivered").length,
    cancelled: DEMO_ORDERS.filter(o => o.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buyurtmalar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{DEMO_ORDERS.length} ta buyurtma</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {([["all", "Barchasi"], ["pending", "Kutilmoqda"], ["processing", "Jarayonda"], ["shipped", "Yetkazilmoqda"], ["delivered", "Yetkazildi"], ["cancelled", "Bekor"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              statusFilter === val
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span className={cn("ml-2 text-xs", statusFilter === val ? "text-background/70" : "text-muted-foreground")}>
              {counts[val]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buyurtma ID, ism yoki email..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyurtma ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mijoz</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Sana</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Summa</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground text-sm">Buyurtma topilmadi</td>
                </tr>
              ) : filtered.map(order => {
                const { label, color, icon: Icon } = STATUS_CONFIG[order.status]
                return (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-xs">{order.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs">{order.date}</td>
                    <td className="py-3 px-4 font-semibold">${order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium w-fit", color)}>
                        <Icon className="h-3 w-3" />
                        {label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Buyurtma: {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-secondary">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Mijoz</p>
                  <p className="font-medium mt-0.5">{selectedOrder.customerName}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Sana</p>
                  <p className="font-medium mt-0.5">{selectedOrder.date}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Mahsulotlar</p>
                  <p className="font-medium mt-0.5">{selectedOrder.items} ta</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Jami summa</p>
                  <p className="font-bold mt-0.5">${selectedOrder.total.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3 col-span-2">
                  <p className="text-xs text-muted-foreground">Manzil</p>
                  <p className="font-medium mt-0.5">{selectedOrder.address}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Statusni o'zgartirish</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(status => {
                    const { label, color, icon: Icon } = STATUS_CONFIG[status]
                    const isActive = selectedOrder.status === status
                    return (
                      <button
                        key={status}
                        onClick={() => setSelectedOrder({ ...selectedOrder, status })}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all border",
                          isActive ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
