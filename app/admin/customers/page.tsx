"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Phone, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminGetCustomers, type ApiCustomer } from "@/lib/api"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joinDate: string
  status: "active" | "inactive"
}

function toCustomer(c: ApiCustomer): Customer {
  return {
    id: c.id,
    name: c.name || c.email || `User #${c.id}`,
    email: c.email,
    phone: c.phone,
    orders: c.orders_count,
    totalSpent: parseFloat(c.total_spent) || 0,
    joinDate: c.date_joined,
    status: c.is_active ? "active" : "inactive",
  }
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Customer | null>(null)

  useEffect(() => {
    adminGetCustomers().then(data => {
      setCustomers(data.map(toCustomer))
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Yuklanmoqda...</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 h-16 animate-pulse bg-secondary/50" />
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card h-64 animate-pulse bg-secondary/50" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{customers.length} ta foydalanuvchi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Jami foydalanuvchilar", value: customers.length, color: "text-blue-600" },
          { label: "Faol foydalanuvchilar", value: customers.filter(c => c.status === "active").length, color: "text-green-600" },
          {
            label: "O'rtacha buyurtma",
            value: customers.length > 0
              ? (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1)
              : "0",
            color: "text-purple-600",
          },
          { label: "Jami daromad", value: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, color: "text-orange-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <p className={cn("text-2xl font-bold", color)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Ism, email yoki telefon..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            {search ? "Qidiruv natijasi topilmadi" : "Foydalanuvchilar yo'q"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Foydalanuvchi</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Telefon</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Buyurtmalar</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Jami xarid</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-border flex items-center justify-center shrink-0 text-sm font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs font-mono">{customer.phone || "—"}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-sm">
                        <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.orders}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell font-semibold">${customer.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        customer.status === "active" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
                      )}>
                        {customer.status === "active" ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelected(customer)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center border-b border-border">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-border flex items-center justify-center mx-auto text-2xl font-bold mb-3">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-semibold">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: Phone, label: "Telefon", value: selected.phone || "—" },
                { icon: ShoppingCart, label: "Buyurtmalar", value: `${selected.orders} ta` },
                { icon: Mail, label: "A'zo bo'lgan", value: selected.joinDate },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-foreground text-background p-3 text-center">
                <p className="text-xs opacity-70">Jami xarid qilingan summa</p>
                <p className="text-xl font-bold mt-0.5">${selected.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setSelected(null)} className="w-full rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-secondary transition-colors">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
