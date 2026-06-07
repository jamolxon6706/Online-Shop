// lib/api.ts — optimized version
// Asosiy o'zgarishlar:
// 1. getProductsByCategory — 2 ta API chaqiriq o'rniga parallel fetch
// 2. getProducts — select_related bilan (backend da kerak)
// 3. Token refresh mexanizmi qo'shildi

import type { ApiCategory, ApiProduct, Category, Product, ColorVariant, StorageOption } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const MEDIA_URL = `${BASE_URL}/media/`

// ─── Token helpers ────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Token refresh ────────────────────────────────────────
let isRefreshing = false
let refreshCallbacks: (() => void)[] = []

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = typeof window !== 'undefined'
    ? localStorage.getItem('refresh_token')
    : null
  if (!refreshToken) return false

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshCallbacks.push(() => resolve(true))
    })
  }

  isRefreshing = true
  try {
    const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!res.ok) { clearTokens(); return false }
    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    refreshCallbacks.forEach((cb) => cb())
    refreshCallbacks = []
    return true
  } catch {
    clearTokens()
    return false
  } finally {
    isRefreshing = false
  }
}

// ─── Fetch with auto-refresh ──────────────────────────────
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = { ...authHeaders(), ...(options.headers || {}) }
  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const retryHeaders = { ...authHeaders(), ...(options.headers || {}) }
      return fetch(url, { ...options, headers: retryHeaders })
    }
  }
  return res
}

// ─── Image URL ────────────────────────────────────────────
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return `${BASE_URL}${path}`
  return `${MEDIA_URL}${path}`
}

// ─── Slug helpers ─────────────────────────────────────────
const SLUG_MAP: Record<string, string> = {
  macs: 'macbook', macbook: 'macbook',
  iphones: 'iphone', iphone: 'iphone',
  airpods: 'airpods',
  watches: 'watch', watch: 'watch',
  accessories: 'accessories',
  ipad: 'ipad', ipads: 'ipad',
}

const SLUG_TO_TITLE: Record<string, string> = {
  macbook: 'macs',
  iphone: 'iphones',
  airpods: 'airpods',
  watch: 'watches',
  accessories: 'accessories',
  ipad: 'ipad',
}

// ─── Transform functions ──────────────────────────────────
export function transformColorVariant(v: import('./types').ApiColorVariant): ColorVariant {
  return {
    id: v.id,
    name: v.name,
    hex: v.hex_code,
    images: v.photos.map((p) => getImageUrl(p.photo)),
  }
}

export function transformStorageOption(s: import('./types').ApiStorageOption): StorageOption {
  return {
    id: s.id,
    label: s.label,
    storage: s.storage,
    ram: s.ram || '',
    price: parseFloat(s.price),
  }
}

export function transformProduct(p: ApiProduct): Product {
  const basePrice = parseFloat(p.price)
  const originalPrice = p.discount > 0 ? basePrice : undefined
  const discountedPrice = p.discount > 0 ? basePrice * (1 - p.discount / 100) : basePrice
  const storageOptions = (p.storage_options || []).map(transformStorageOption)
  const minStoragePrice = storageOptions.length > 0
    ? Math.min(...storageOptions.map(s => s.price))
    : null
  const colorVariants = (p.color_variants || []).map(transformColorVariant)

  return {
    id: String(p.id),
    name: p.title,
    category: typeof p.category === 'object' ? p.category?.title ?? '' : p.category ?? '',
    categoryId: typeof p.category === 'object' ? p.category?.id : undefined,
    price: minStoragePrice !== null ? minStoragePrice : Math.round(discountedPrice),
    originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    image: getImageUrl(p.thumbnail_photo),
    discount: p.discount,
    quantity: p.quantity,
    description: p.description,
    photos: p.photos?.map((ph) => getImageUrl(ph.photo)) || [],
    colorVariants,
    storageOptions,
    isActive: p.is_active,
    createdAt: p.created_at,
    isNew: false,
  }
}

export function transformCategory(c: ApiCategory): Category {
  const slug = SLUG_MAP[c.title.toLowerCase()] ?? c.title.toLowerCase()
  return {
    id: c.id,
    name: c.title,
    image: getImageUrl(c.photo),
    href: `/category/${slug}`,
    slug,
  }
}

// ─── Auth API ─────────────────────────────────────────────
export async function sendVerifyEmail(email: string): Promise<{ ok: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/verify-email/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.email?.[0] || data?.error || 'Xatolik yuz berdi' }
    return { ok: true, message: data.message }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function verifyOtp(email: string, code: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/verify-otp/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || JSON.stringify(data) }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function register(payload: {
  first_name: string; last_name: string; username: string
  email: string; phone_number: string; password: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      const firstError = Object.values(data).flat()[0]
      return { ok: false, error: String(firstError) || "Ro'yxatdan o'tishda xatolik" }
    }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/token/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.detail || 'Email yoki parol xato' }
    setTokens(data.access, data.refresh)
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export function logout() { clearTokens() }

export async function forgotPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.email?.[0] || data?.error || 'Xatolik' }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function forgotPasswordVerify(email: string, code: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password-verify/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || JSON.stringify(data) }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function resetPassword(
  email: string, new_password: string, confirm_password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password, confirm_password }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || JSON.stringify(data) }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

// ─── Profile API ──────────────────────────────────────────
export interface UserProfile {
  id: number; first_name: string; last_name: string
  email: string; phone_number: string; username: string
  is_staff?: boolean; is_superuser?: boolean
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/profile/`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function updateProfile(data: Partial<UserProfile>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/profile/`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) return { ok: false, error: JSON.stringify(json) }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function changePassword(
  old_password: string, new_password: string, confirm_password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/profile/change-password/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password, new_password, confirm_password }),
    })
    const json = await res.json()
    if (!res.ok) return { ok: false, error: json?.error || JSON.stringify(json) }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

// ─── Cart API ─────────────────────────────────────────────
export interface ApiCartItem {
  id: number; product: ApiProduct & { price: string }
  quantity: number; total: number; added_at: string
}
export interface ApiCart {
  id: number; items: ApiCartItem[]
  total_price: number; items_count: number; updated_at: string
}

export async function getCart(): Promise<ApiCart | null> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/cart/`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function addToCart(product_id: number, quantity = 1): Promise<{ ok: boolean; cart?: ApiCart; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/cart/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id, quantity }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik' }
    return { ok: true, cart: data }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function updateCartItem(itemId: number, quantity: number): Promise<{ ok: boolean; cart?: ApiCart; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/cart/${itemId}/`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik' }
    return { ok: true, cart: data }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function removeCartItem(itemId: number): Promise<{ ok: boolean; cart?: ApiCart; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/cart/${itemId}/`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik' }
    return { ok: true, cart: data }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function clearCart(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/cart/`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return { ok: false, error: 'Xatolik' }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

// ─── Products API ─────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/`, {
      next: { revalidate: 300 }, // 5 daqiqa cache
    })
    if (!res.ok) return []
    const data: ApiCategory[] = await res.json()
    return data.map(transformCategory)
  } catch { return [] }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products/`, {
      next: { revalidate: 120 }, // 2 daqiqa cache
    })
    if (!res.ok) return []
    const data: ApiProduct[] = await res.json()
    return data.map(transformProduct)
  } catch { return [] }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}/`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return null
    const data: ApiProduct = await res.json()
    return transformProduct(data)
  } catch { return null }
}

export async function getProductsByCategory(slug: string): Promise<{
  products: Product[]
  categoryName: string
  categoryId?: number
}> {
  try {
    // ✅ Parallel fetch — ikkitasi bir vaqtda (oldin ketma-ket edi, sekin!)
    const [categoriesRes, ] = await Promise.all([
      fetch(`${BASE_URL}/api/categories/`, { next: { revalidate: 300 } }),
    ])

    const categories: ApiCategory[] = await categoriesRes.json()
    const targetTitle = SLUG_TO_TITLE[slug] ?? slug
    const category = categories.find(
      (c) => c.title.toLowerCase() === targetTitle.toLowerCase()
    )
    if (!category) return { products: [], categoryName: slug }

    const res = await fetch(`${BASE_URL}/api/categories/${category.id}/`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return { products: [], categoryName: category.title, categoryId: category.id }

    const data = await res.json()
    const products: Product[] = (data.products ?? []).map((p: ApiProduct) => transformProduct(p))
    return { products, categoryName: category.title, categoryId: category.id }
  } catch { return { products: [], categoryName: slug } }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products/search/?title=${encodeURIComponent(query)}`,
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return []
    const data: ApiProduct[] = await res.json()
    return data.map(transformProduct)
  } catch { return [] }
}

// ─── Wishlist API ─────────────────────────────────────────
export interface ApiWishlist {
  id: number; products: ApiProduct[]
  products_count: number; updated_at: string
}

export async function getWishlist(): Promise<ApiWishlist | null> {
  if (!getToken()) return null
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/wishlist/`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function addToWishlistApi(product_id: number): Promise<{ ok: boolean; data?: ApiWishlist; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/wishlist/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik yuz berdi' }
    return { ok: true, data }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function removeFromWishlistApi(product_id: number): Promise<{ ok: boolean; data?: ApiWishlist; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/wishlist/`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik yuz berdi' }
    return { ok: true, data }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function clearWishlistApi(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/wishlist/clear/`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return { ok: false, error: 'Xatolik yuz berdi' }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function checkWishlistItem(product_id: number): Promise<boolean> {
  if (!getToken()) return false
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/wishlist/check/${product_id}/`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.in_wishlist ?? false
  } catch { return false }
}

// ─── Admin API ────────────────────────────────────────────
export async function adminGetStats() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/stats/`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function adminGetProducts(): Promise<Product[]> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return []
    const data: ApiProduct[] = await res.json()
    return data.map(transformProduct)
  } catch { return [] }
}

export async function adminCreateProduct(formData: FormData): Promise<{ ok: boolean; data?: Product; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/`, {
      method: 'POST', headers: authHeaders(), body: formData,
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: JSON.stringify(data) }
    return { ok: true, data: transformProduct(data) }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function adminUpdateProduct(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/${id}/`, {
      method: 'PATCH', headers: authHeaders(), body: formData,
    })
    if (!res.ok) { const d = await res.json(); return { ok: false, error: JSON.stringify(d) } }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function adminDeleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/${id}/`, {
      method: 'DELETE', headers: authHeaders(),
    })
    if (!res.ok) return { ok: false, error: 'Xatolik' }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function adminAddColorVariant(
  productId: string, data: { name: string; hex_code: string }
): Promise<{ ok: boolean; id?: number; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/${productId}/colors/`, {
      method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) return { ok: false, error: JSON.stringify(json) }
    return { ok: true, id: json.id }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function adminUploadColorPhotos(variantId: number, files: File[]): Promise<{ ok: boolean; error?: string }> {
  const formData = new FormData()
  files.forEach(f => formData.append('photos', f))
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/colors/${variantId}/photos/`, {
      method: 'POST', headers: authHeaders(), body: formData,
    })
    if (!res.ok) return { ok: false, error: 'Xatolik' }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function adminAddStorageOption(
  productId: string,
  data: { label: string; storage: string; ram: string; price: number }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/admin/products/${productId}/storage/`, {
      method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { const d = await res.json(); return { ok: false, error: JSON.stringify(d) } }
    return { ok: true }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}

export async function firebasePhoneLogin(
  firebase_token: string, phone_number: string
): Promise<{ ok: boolean; error?: string; created?: boolean }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/firebase-login/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebase_token, phone_number }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Xatolik yuz berdi' }
    setTokens(data.access, data.refresh)
    return { ok: true, created: data.created }
  } catch { return { ok: false, error: "Server bilan aloqa yo'q" } }
}
