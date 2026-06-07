"use client"

import { useState } from "react"
import { Search, Mail, Phone, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"

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

const DEMO_CUSTOMERS: Customer[] = [
  { id: 1, name: "Alisher Nazarov",  email: "alisher@mail.ru",   phone: "+998901234567", orders: 5,  totalSpent: 4799,  joinDate: "2024-12-01", status: "active" },
  { id: 2, name: "Malika Yusupova",  email: "malika@gmail.com",  phone: "+998912345678", orders: 3,  totalSpent: 2198,  joinDate: "2025-01-15", status: "active" },
  { id: 3, name: "Bobur Ismoilov",   email: "bobur@mail.uz",     phone: "+998923456789", orders: 1,  totalSpent: 549,   joinDate: "2025-03-20", status: "active" },
  { id: 4, name: "Nilufar Rahimova", email: "nilufar@gmail.com", phone: "+998934567890", orders: 7,  totalSpent: 6240,  joinDate: "2024-10-10", status: "active" },
  { id: 5, name: "Sardor Toshmatov", email: "sardor@yandex.ru",  phone: "+998945678901", orders: 2,  totalSpent: 1248,  joinDate: "2025-02-05", status: "inactive" },
  { id: 6, name: "Zulfiya Xolmatova",email: "zulfiya@mail.ru",   phone: "+998956789012", orders: 4,  totalSpent: 1596,  joinDate: "2025-01-28", status: "active" },
  { id: 7, name: "Jasur Qodirov",    email: "jasur@gmail.com",   phone: "+998967890123", orders: 6,  totalSpent: 5394,  joinDate: "2024-11-15", status: "active" },
  { id: 8, name: "Shahnoza Mirzaeva",email: "shahnoza@mail.uz",  phone: "+998978901234", orders: 2,  totalSpent: 1148,  joinDate: "2025-04-01", status: "active" },
]

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Customer | null>(null)

  const filtered = DEMO_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{DEMO_CUSTOMERS.length} ta foydalanuvchi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Jami foydalanuvchilar", value: DEMO_CUSTOMERS.length, color: "text-blue-600" },
          { label: "Faol foydalanuvchilar", value: DEMO_CUSTOMERS.filter(c => c.status === "active").length, color: "text-green-600" },
          { label: "O'rtacha buyurtma", value: (DEMO_CUSTOMERS.reduce((s, c) => s + c.orders, 0) / DEMO_CUSTOMERS.length).toFixed(1), color: "text-purple-600" },
          { label: "Jami daromad", value: `$${DEMO_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, color: "text-orange-600" },
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
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs font-mono">{customer.phone}</td>
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
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center border-b border-border">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-border flex items-center justify-center mx-auto text-2xl font-bold mb-3">
                {selected.name.charAt(0)}
              </div>
              <h2 className="font-semibold">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: Phone, label: "Telefon", value: selected.phone },
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
