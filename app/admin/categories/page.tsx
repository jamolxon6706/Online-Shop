"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Plus, Edit2, Trash2, X, Upload, Check, Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategories, authHeaders } from "@/lib/api"
import type { Category } from "@/lib/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const cats = await getCategories()
    setCategories(cats)
    setLoading(false)
  }

  function openNew() {
    setEditCat(null); setName(""); setPhoto(null); setPhotoPreview(""); setShowForm(true)
  }

  function openEdit(c: Category) {
    setEditCat(c); setName(c.name); setPhotoPreview(c.image); setPhoto(null); setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const fd = new FormData()
    fd.append("title", name)
    if (photo) fd.append("photo", photo)
    const url = editCat ? `${BASE_URL}/api/categories/${editCat.id}/` : `${BASE_URL}/api/categories/`
    const method = editCat ? "PATCH" : "POST"
    await fetch(url, { method, headers: authHeaders(), body: fd })
    setSaving(false); setShowForm(false); await load()
  }

  async function handleDelete(id: number) {
    await fetch(`${BASE_URL}/api/categories/${id}/`, { method: "DELETE", headers: authHeaders() })
    setDeleteId(null); await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kategoriyalar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{categories.length} ta kategoriya</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Yangi kategoriya
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-secondary aspect-square animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square relative bg-secondary">
                {cat.image && cat.image !== '/placeholder.jpg' ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Tag className="h-12 w-12 text-muted-foreground opacity-30" />
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="font-medium text-sm">{cat.name}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setShowForm(false)} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold">{editCat ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div
                className="relative h-40 rounded-xl border-2 border-dashed border-border bg-secondary cursor-pointer overflow-hidden hover:border-foreground/30 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {photoPreview ? (
                  <Image src={photoPreview} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-xs">Rasm yuklash</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0]
                if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)) }
              }} />
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Kategoriya nomi"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowForm(false)}>Bekor</Button>
              <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={!name.trim() || saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1.5" />}
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-xs bg-card rounded-2xl p-6 shadow-2xl text-center">
            <p className="font-semibold mb-2">Kategoriyani o'chirish</p>
            <p className="text-sm text-muted-foreground mb-5">Bu amal bekor qilib bo'lmaydi.</p>
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
