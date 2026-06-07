"use client"

import { useState } from "react"
import { Check, Globe, Bell, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "APEX Store",
    siteUrl: "https://apexstore.uz",
    currency: "USD",
    language: "uz",
    emailNotifs: true,
    orderNotifs: true,
    lowStockAlert: true,
    lowStockThreshold: "5",
    twoFactor: false,
    darkMode: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn("h-6 w-11 rounded-full transition-colors relative shrink-0", value ? "bg-foreground" : "bg-border")}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform", value ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  )

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Sozlamalar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Tizim sozlamalarini boshqaring</p>
      </div>

      <Section icon={Globe} title="Umumiy sozlamalar">
        {[
          { label: "Do'kon nomi", key: "siteName", type: "text" as const, placeholder: "APEX Store" },
          { label: "Sayt URL", key: "siteUrl", type: "text" as const, placeholder: "https://example.com" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="text-sm font-medium mb-1.5 block">{label}</label>
            <input
              type={type}
              value={settings[key as keyof typeof settings] as string}
              onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Valyuta</label>
            <select
              value={settings.currency}
              onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none"
            >
              <option value="USD">USD — Dollar</option>
              <option value="UZS">UZS — So'm</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Til</label>
            <select
              value={settings.language}
              onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none"
            >
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Bildirishnomalar">
        {[
          { key: "emailNotifs",  label: "Email bildirishnomalar",    desc: "Yangi buyurtmalar haqida email" },
          { key: "orderNotifs",  label: "Buyurtma statuslari",        desc: "Status o'zgarganda xabar" },
          { key: "lowStockAlert",label: "Kam qoldiq ogohlantirishlar",desc: "Mahsulot tugab qolganda" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Toggle value={settings[key as keyof typeof settings] as boolean} onChange={() => setSettings(s => ({ ...s, [key]: !s[key as keyof typeof settings] }))} />
          </div>
        ))}
        {settings.lowStockAlert && (
          <div>
            <label className="text-sm font-medium mb-1.5 block">Kam qoldiq chegarasi</label>
            <input
              type="number" min="1"
              value={settings.lowStockThreshold}
              onChange={e => setSettings(s => ({ ...s, lowStockThreshold: e.target.value }))}
              className="w-32 rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none"
            />
          </div>
        )}
      </Section>

      <Section icon={Shield} title="Xavfsizlik">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Ikki bosqichli autentifikatsiya</p>
            <p className="text-xs text-muted-foreground">Google Authenticator bilan himoya</p>
          </div>
          <Toggle value={settings.twoFactor} onChange={() => setSettings(s => ({ ...s, twoFactor: !s.twoFactor }))} />
        </div>
        <button className="w-full rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-secondary transition-colors">
          Parolni o'zgartirish
        </button>
      </Section>

      {/* Save */}
      <Button
        onClick={handleSave}
        className={cn("rounded-xl h-12 w-full text-base transition-all", saved && "bg-green-600 hover:bg-green-700")}
      >
        {saved ? <><Check className="h-5 w-5 mr-2" /> Saqlandi!</> : <><Save className="h-5 w-5 mr-2" /> Sozlamalarni saqlash</>}
      </Button>
    </div>
  )
}
