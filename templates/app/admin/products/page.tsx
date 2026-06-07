"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Plus, Search, Edit2, Trash2, X, Upload, Check,
  ChevronDown, AlertTriangle, Loader2, Package, MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminAddColorVariant, adminUploadColorPhotos, adminAddStorageOption,
  getCategories
} from "@/lib/api"
import type { Product, Category, ColorVariant, StorageOption } from "@/lib/types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "colors" | "storage">("basic")

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", price: "", discount: "0",
    quantity: "", category: "", is_active: true,
  })
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")

  // Color variants form
  const [colorName, setColorName] = useState("")
  const [colorHex, setColorHex] = useState("#000000")
  const [colorPhotos, setColorPhotos] = useState<File[]>([])
  const [addingColor, setAddingColor] = useState(false)

  // Storage options form
  const [storageLabel, setStorageLabel] = useState("")
  const [storageValue, setStorageValue] = useState("")
  const [ramValue, setRamValue] = useState("")
  const [storagePrice, setStoragePrice] = useState("")
  const [addingStorage, setAddingStorage] = useState(false)
  const [localStorageOptions, setLocalStorageOptions] = useState<{ label: string; storage: string; ram: string; price: string }[]>([])
  const [localColorVariants, setLocalColorVariants] = useState<{ name: string; hex: string; photos: File[] }[]>([])

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [prods, cats] = await Promise.all([adminGetProducts(), getCategories()])
    setProducts(prods)
    setCategories(cats)
    setLoading(false)
  }

  function openNew() {
    setEditProduct(null)
    setForm({ title: "", description: "", price: "", discount: "0", quantity: "", category: "", is_active: true })
    setThumbnail(null)
    setThumbnailPreview("")
    setLocalStorageOptions([])
    setLocalColorVariants([])
    setActiveTab("basic")
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({
      title: p.name,
      description: p.description ?? "",
      price: String(p.price),
      discount: String(p.discount ?? 0),
      quantity: String(p.quantity),
      category: String(p.categoryId ?? ""),
      is_active: p.isActive ?? true,
    })
    setThumbnailPreview(p.image)
    setThumbnail(null)
    setLocalStorageOptions([])
    setLocalColorVariants([])
    setActiveTab("basic")
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const fd = new FormData()
    fd.append("title", form.title)
    fd.append("description", form.description)
    fd.append("price", form.price)
    fd.append("discount", form.discount)
    fd.append("quantity", form.quantity)
    if (form.category) fd.append("category", form.category)
    fd.append("is_active", String(form.is_active))
    if (thumbnail) fd.append("thumbnail_photo", thumbnail)

    let productId = editProduct?.id
    if (editProduct) {
      await adminUpdateProduct(editProduct.id, fd)
    } else {
      const res = await adminCreateProduct(fd)
      if (res.ok && res.data) productId = res.data.id
    }

    // Add storage options (new product only for now)
    if (!editProduct && productId) {
      for (const opt of localStorageOptions) {
        await adminAddStorageOption(productId, {
          label: opt.label,
          storage: opt.storage,
          ram: opt.ram,
          price: parseFloat(opt.price),
        })
      }
      // Add color variants
      for (const col of localColorVariants) {
        const res = await adminAddColorVariant(productId, { name: col.name, hex_code: col.hex })
        if (res.ok && res.id && col.photos.length > 0) {
          await adminUploadColorPhotos(res.id, col.photos)
        }
      }
    }

    setSaving(false)
    setShowForm(false)
    await load()
  }

  async function handleDelete(id: string) {
    await adminDeleteProduct(id)
    setDeleteId(null)
    await load()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mahsulotlar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} ta mahsulot</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          Yangi mahsulot
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mahsulot</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Kategoriya</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Narx</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Miqdor</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Ranglar</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Xotira</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-secondary animate-pulse shrink-0" />
                        <div className="h-4 w-32 rounded bg-secondary animate-pulse" />
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell"><div className="h-4 w-20 rounded bg-secondary animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-4 w-16 rounded bg-secondary animate-pulse" /></td>
                    <td className="py-3 px-4 hidden sm:table-cell"><div className="h-4 w-10 rounded bg-secondary animate-pulse" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><div className="h-4 w-12 rounded bg-secondary animate-pulse" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><div className="h-4 w-16 rounded bg-secondary animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-4 w-16 rounded bg-secondary animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p>Mahsulot topilmadi</p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                          {p.image && <Image src={p.image} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[180px]">{p.name}</p>
                          {p.discount > 0 && (
                            <span className="text-xs text-red-500 font-medium">-{p.discount}%</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-4 font-semibold">${p.price.toLocaleString()}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        p.quantity > 10 ? "bg-green-100 text-green-700" :
                        p.quantity > 0  ? "bg-yellow-100 text-yellow-700" :
                                          "bg-red-100 text-red-600"
                      )}>
                        {p.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {(p.colorVariants || []).slice(0, 5).map(c => (
                          <span key={c.id} className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                        {(p.colorVariants?.length ?? 0) > 5 && (
                          <span className="text-xs text-muted-foreground">+{(p.colorVariants?.length ?? 0) - 5}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(p.storageOptions || []).slice(0, 3).map(s => (
                          <span key={s.id} className="rounded-md bg-secondary px-1.5 py-0.5 text-xs">{s.label}</span>
                        ))}
                        {(p.storageOptions?.length ?? 0) > 3 && (
                          <span className="text-xs text-muted-foreground">+{(p.storageOptions?.length ?? 0) - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Product Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setShowForm(false)} />
          <div className="relative z-10 w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="font-semibold">{editProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h2>
              <button onClick={() => !saving && setShowForm(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-5 shrink-0">
              {([["basic", "Asosiy ma'lumot"], ["colors", "Ranglar"], ["storage", "Xotira/RAM"]] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                  {tab === "colors" && localColorVariants.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-foreground text-background text-xs px-1.5 py-0.5">{localColorVariants.length}</span>
                  )}
                  {tab === "storage" && localStorageOptions.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-foreground text-background text-xs px-1.5 py-0.5">{localStorageOptions.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-5">
              {/* ── Basic Tab ── */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Asosiy rasm</label>
                    <div
                      className="relative h-40 w-40 rounded-xl border-2 border-dashed border-border hover:border-foreground/30 transition-colors cursor-pointer overflow-hidden bg-secondary"
                      onClick={() => fileRef.current?.click()}
                    >
                      {thumbnailPreview ? (
                        <Image src={thumbnailPreview} alt="preview" fill className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                          <Upload className="h-8 w-8" />
                          <span className="text-xs">Rasm yuklash</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) { setThumbnail(f); setThumbnailPreview(URL.createObjectURL(f)) }
                      }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Mahsulot nomi *</label>
                      <input
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="iPhone 15 Pro Max"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Narx ($) *</label>
                      <input
                        value={form.price} type="number"
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="999"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Chegirma (%)</label>
                      <input
                        value={form.discount} type="number" min="0" max="100"
                        onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                        placeholder="0"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Miqdor *</label>
                      <input
                        value={form.quantity} type="number" min="0"
                        onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                        placeholder="50"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Kategoriya</label>
                      <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      >
                        <option value="">— Tanlang —</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Tavsif</label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Mahsulot haqida qisqacha tavsif..."
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                        className={cn(
                          "h-6 w-11 rounded-full transition-colors relative",
                          form.is_active ? "bg-foreground" : "bg-border"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
                          form.is_active ? "translate-x-5" : "translate-x-0.5"
                        )} />
                      </button>
                      <span className="text-sm">Faol mahsulot</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Colors Tab ── */}
              {activeTab === "colors" && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">Rang variantlarini qo'shing. Har bir rang uchun alohida rasmlar yuklashingiz mumkin.</p>

                  {/* Added colors list */}
                  {localColorVariants.length > 0 && (
                    <div className="space-y-2">
                      {localColorVariants.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                          <span className="h-6 w-6 rounded-full border border-border shrink-0" style={{ backgroundColor: c.hex }} />
                          <span className="text-sm font-medium flex-1">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.photos.length} ta rasm</span>
                          <button onClick={() => setLocalColorVariants(v => v.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add color form */}
                  <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
                    <h3 className="text-sm font-medium">Yangi rang qo'shish</h3>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          value={colorName}
                          onChange={e => setColorName(e.target.value)}
                          placeholder="Space Black"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="h-10 w-10 rounded-xl border border-border cursor-pointer" />
                        <span className="text-xs text-muted-foreground font-mono">{colorHex}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Bu rang uchun rasmlar (ixtiyoriy)</label>
                      <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border px-3 py-2 hover:bg-secondary transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {colorPhotos.length > 0 ? `${colorPhotos.length} ta rasm tanlandi` : "Rasmlarni tanlang"}
                        </span>
                        <input
                          type="file" accept="image/*" multiple className="hidden"
                          onChange={e => setColorPhotos(Array.from(e.target.files || []))}
                        />
                      </label>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl w-full"
                      disabled={!colorName.trim()}
                      onClick={() => {
                        setLocalColorVariants(v => [...v, { name: colorName, hex: colorHex, photos: colorPhotos }])
                        setColorName(""); setColorHex("#000000"); setColorPhotos([])
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Rang qo'shish
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Storage Tab ── */}
              {activeTab === "storage" && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Xotira/RAM variantlari va ular uchun narxlarni kiriting.
                    <br />
                    <span className="font-medium">Format:</span> Label: "512/8", Storage: "512GB", RAM: "8GB" (MacBook uchun)
                  </p>

                  {/* Added options */}
                  {localStorageOptions.length > 0 && (
                    <div className="space-y-2">
                      {localStorageOptions.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                          <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold">{s.label}</span>
                          <span className="text-sm flex-1">{s.ram ? `${s.storage} / ${s.ram}` : s.storage}</span>
                          <span className="text-sm font-semibold">${s.price}</span>
                          <button onClick={() => setLocalStorageOptions(v => v.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add storage form */}
                  <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
                    <h3 className="text-sm font-medium">Yangi variant qo'shish</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Label *</label>
                        <input
                          value={storageLabel} onChange={e => setStorageLabel(e.target.value)}
                          placeholder="512/8"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Storage *</label>
                        <input
                          value={storageValue} onChange={e => setStorageValue(e.target.value)}
                          placeholder="512GB"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">RAM (MacBook uchun)</label>
                        <input
                          value={ramValue} onChange={e => setRamValue(e.target.value)}
                          placeholder="8GB"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Narx ($) *</label>
                        <input
                          value={storagePrice} type="number" onChange={e => setStoragePrice(e.target.value)}
                          placeholder="1299"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm" variant="outline" className="rounded-xl w-full"
                      disabled={!storageLabel.trim() || !storageValue.trim() || !storagePrice.trim()}
                      onClick={() => {
                        setLocalStorageOptions(v => [...v, { label: storageLabel, storage: storageValue, ram: ramValue, price: storagePrice }])
                        setStorageLabel(""); setStorageValue(""); setRamValue(""); setStoragePrice("")
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Variant qo'shish
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)} disabled={saving}>
                Bekor qilish
              </Button>
              <Button className="rounded-xl min-w-[120px]" onClick={handleSave} disabled={saving || !form.title || !form.price}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saqlanmoqda</> : <><Check className="h-4 w-4 mr-2" />Saqlash</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-center font-semibold mb-2">Mahsulotni o'chirish</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteId(null)}>Bekor</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => handleDelete(deleteId)}>O'chirish</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
