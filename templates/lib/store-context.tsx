"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import {
  getToken,
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem,
  clearCart as apiClearCart,
  getProfile,
  logout as apiLogout,
  getWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
  type ApiCart,
  type ApiCartItem,
  type UserProfile,
  getImageUrl,
} from "./api"

// ─── Types ────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  badge?: string
  quantity?: number
  discount?: number
}

export interface CartItem {
  cartItemId: number
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
  maxQuantity: number
}

interface StoreContextType {
  // Auth
  user: UserProfile | null
  isLoggedIn: boolean
  refreshUser: () => Promise<void>
  logout: () => void

  // Cart — login bo'lsa backend, guest bo'lsa localStorage
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  cartLoading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>

  // Wishlist — login bo'lsa FAQAT backend, guest bo'lsa localStorage
  wishlist: Product[]
  wishlistLoading: boolean
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
  clearWishlist: () => Promise<void>

  // Notifications
  notification: { message: string; type: "success" | "error" } | null
  showNotification: (message: string, type: "success" | "error") => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// ─── Guest localStorage helpers ───────────────────────────
const GUEST_CART_KEY     = "apex_guest_cart"
const GUEST_WISHLIST_KEY = "apex_guest_wishlist"

function loadGuestCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]") } catch { return [] }
}
function saveGuestCart(c: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(c))
}

function loadGuestWishlist(): Product[] {
  try { return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]") } catch { return [] }
}
function saveGuestWishlist(w: Product[]) {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(w))
}

// ─── Transform helpers ────────────────────────────────────
function apiCartToItems(apiCart: ApiCart): CartItem[] {
  return [...apiCart.items]
    .sort((a, b) => a.id - b.id)
    .map((item: ApiCartItem) => ({
      cartItemId:  item.id,
      id:          String(item.product.id),
      name:        item.product.title,
      price:       item.total / item.quantity,
      image:       getImageUrl(item.product.thumbnail_photo),
      category:    "",
      quantity:    item.quantity,
      maxQuantity: item.product.quantity ?? 99,
    }))
}

// ─── Provider ─────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user,            setUser]            = useState<UserProfile | null>(null)
  const [cart,            setCart]            = useState<CartItem[]>([])
  const [cartLoading,     setCartLoading]     = useState(false)
  const [wishlist,        setWishlist]        = useState<Product[]>([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [notification,    setNotification]    = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // ── Refresh wishlist ──────────────────────────────────
  const refreshWishlist = useCallback(async () => {
    if (!getToken()) {
      setWishlist(loadGuestWishlist())
      return
    }
    setWishlistLoading(true)
    try {
      const data = await getWishlist()
      if (data && Array.isArray(data.products)) {
        const items: Product[] = data.products.map((p) => ({
          id:            String(p.id),
          name:          p.title,
          price:         p.discount > 0
                           ? Math.round(parseFloat(p.price) * (1 - p.discount / 100))
                           : parseFloat(p.price),
          originalPrice: p.discount > 0 ? parseFloat(p.price) : undefined,
          image:         getImageUrl(p.thumbnail_photo),
          category:      typeof p.category === "object"
                           ? (p.category as any)?.title ?? ""
                           : p.category ?? "",
          discount:      p.discount,
          quantity:      p.quantity,
        }))
        setWishlist(items)
      } else {
        setWishlist([])
      }
    } catch {
      setWishlist([])
    } finally {
      setWishlistLoading(false)
    }
  }, [])

  // ── Refresh cart ──────────────────────────────────────
  const refreshCart = useCallback(async () => {
    if (!getToken()) { setCart(loadGuestCart()); return }
    setCartLoading(true)
    const apiCart = await getCart()
    setCartLoading(false)
    if (apiCart) setCart(apiCartToItems(apiCart))
  }, [])

  // ── Refresh user ──────────────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!getToken()) { setUser(null); return }
    const profile = await getProfile()
    setUser(profile)
  }, [])

  // ── On mount ──────────────────────────────────────────
  useEffect(() => {
    refreshUser()
    refreshCart()
    refreshWishlist()
  }, [refreshUser, refreshCart, refreshWishlist])

  // ── Logout ────────────────────────────────────────────
  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
    setCart(loadGuestCart())
    setWishlist(loadGuestWishlist())
    showNotification("Tizimdan chiqildi", "success")
  }, [showNotification])

  // ── Cart: Add ─────────────────────────────────────────
  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (!getToken()) {
      const prev = loadGuestCart()
      const existing = prev.find((i) => i.id === product.id)
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { cartItemId: Date.now(), id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, quantity, maxQuantity: product.quantity ?? 99 }]
      saveGuestCart(updated)
      setCart(updated)
      showNotification(`${product.name} savatga qo'shildi`, "success")
      return
    }
    const result = await apiAddToCart(Number(product.id), quantity)
    if (result.ok && result.cart) {
      setCart(apiCartToItems(result.cart))
      showNotification(`${product.name} savatga qo'shildi`, "success")
    } else {
      showNotification(result.error || "Xatolik yuz berdi", "error")
    }
  }, [showNotification])

  // ── Cart: Remove ──────────────────────────────────────
  const removeFromCart = useCallback(async (cartItemId: number) => {
    if (!getToken()) {
      const updated = loadGuestCart().filter((i) => i.cartItemId !== cartItemId)
      saveGuestCart(updated)
      setCart(updated)
      showNotification("Mahsulot savatdan olib tashlandi", "success")
      return
    }
    const result = await removeCartItem(cartItemId)
    if (result.ok && result.cart) {
      setCart(apiCartToItems(result.cart))
      showNotification("Mahsulot savatdan olib tashlandi", "success")
    } else {
      showNotification(result.error || "Xatolik yuz berdi", "error")
    }
  }, [showNotification])

  // ── Cart: Update quantity ─────────────────────────────
  const updateCartQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (quantity < 1) { await removeFromCart(cartItemId); return }
    if (!getToken()) {
      const updated = loadGuestCart().map((i) => i.cartItemId === cartItemId ? { ...i, quantity } : i)
      saveGuestCart(updated)
      setCart(updated)
      return
    }
    const result = await updateCartItem(cartItemId, quantity)
    if (result.ok && result.cart) setCart(apiCartToItems(result.cart))
    else showNotification(result.error || "Xatolik yuz berdi", "error")
  }, [removeFromCart, showNotification])

  // ── Cart: Clear ───────────────────────────────────────
  const clearCartFn = useCallback(async () => {
    if (!getToken()) { saveGuestCart([]); setCart([]); return }
    await apiClearCart()
    setCart([])
  }, [])

  // ── Wishlist: Add ─────────────────────────────────────
  const addToWishlist = useCallback(async (product: Product) => {
    // Duplicate tekshirish
    if (wishlist.some((p) => p.id === product.id)) {
      showNotification("Bu mahsulot allaqachon istaklarda bor", "error")
      return
    }

    if (!getToken()) {
      // Guest mode — localStorage ga yoz
      const updated = [...loadGuestWishlist(), product]
      saveGuestWishlist(updated)
      setWishlist(updated)
      showNotification(`${product.name} istaklarga qo'shildi`, "success")
      return
    }

    // Optimistic update — UI darhol yangilansin
    setWishlist((prev) => [...prev, product])
    showNotification(`${product.name} istaklarga qo'shildi`, "success")

    // Backend ga yuborish
    const result = await addToWishlistApi(Number(product.id))
    if (!result.ok) {
      // Agar xatolik bo'lsa — orqaga qaytarish
      setWishlist((prev) => prev.filter((p) => p.id !== product.id))
      showNotification(result.error || "Istaklarga qo'shishda xatolik", "error")
    } else {
      // Backend dan yangi ma'lumotlarni o'qib olish (sof holat)
      await refreshWishlist()
    }
  }, [wishlist, showNotification, refreshWishlist])

  // ── Wishlist: Remove ──────────────────────────────────
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!getToken()) {
      const updated = loadGuestWishlist().filter((p) => p.id !== productId)
      saveGuestWishlist(updated)
      setWishlist(updated)
      showNotification("Istaklardan olib tashlandi", "success")
      return
    }

    // Optimistic update
    setWishlist((prev) => prev.filter((p) => p.id !== productId))
    showNotification("Istaklardan olib tashlandi", "success")

    const result = await removeFromWishlistApi(Number(productId))
    if (!result.ok) {
      // Xatolik bo'lsa — qayta yuklash
      await refreshWishlist()
      showNotification(result.error || "O'chirishda xatolik yuz berdi", "error")
    }
  }, [showNotification, refreshWishlist])

  // ── Wishlist: Clear ───────────────────────────────────
  const clearWishlist = useCallback(async () => {
    if (!getToken()) {
      saveGuestWishlist([])
      setWishlist([])
      return
    }
    // Optimistic
    setWishlist([])
    const result = await clearWishlistApi()
    if (!result.ok) {
      // Qayta yuklash — agar xatolik bo'lsa
      await refreshWishlist()
      showNotification("Tozalashda xatolik yuz berdi", "error")
    } else {
      showNotification("Istaklar ro'yxati tozalandi", "success")
    }
  }, [refreshWishlist, showNotification])

  // ── Wishlist: Check ───────────────────────────────────
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((p) => p.id === productId)
  }, [wishlist])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        refreshUser,
        logout,
        cart,
        cartCount,
        cartTotal,
        cartLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart: clearCartFn,
        refreshCart,
        wishlist,
        wishlistLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
        clearWishlist,
        notification,
        showNotification,
      }}
    >
      {children}
      {notification && (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-sm ${
            notification.type === "success"
              ? "bg-foreground text-background"
              : "bg-red-500 text-white"
          }`}>
            <span className={`h-2 w-2 rounded-full shrink-0 ${
              notification.type === "success" ? "bg-green-400" : "bg-red-200"
            }`} />
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}