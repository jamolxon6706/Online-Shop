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
  cartItemId: number   // backend cart item id (PATCH/DELETE için)
  id: string           // product id
  name: string
  price: number
  image: string
  category: string
  quantity: number
  maxQuantity: number  // ombordagi max miqdor
}

interface StoreContextType {
  // Auth
  user: UserProfile | null
  isLoggedIn: boolean
  refreshUser: () => Promise<void>
  logout: () => void

  // Cart (backend synced when logged in, localStorage when guest)
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  cartLoading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>

  // Wishlist (localStorage + backend sync)
  wishlist: Product[]
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean

  // Notifications
  notification: { message: string; type: "success" | "error" } | null
  showNotification: (message: string, type: "success" | "error") => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// ─── Guest cart localStorage helpers ─────────────────────
const GUEST_CART_KEY = "guest_cart"

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveGuestCart(cart: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
}

function apiCartToItems(apiCart: ApiCart): CartItem[] {
  return [...apiCart.items]
      .sort((a, b) => a.id - b.id)   // tartibni saqlash
      .map((item: ApiCartItem) => ({
        cartItemId: item.id,
        id: String(item.product.id),
        name: item.product.title,
        price: item.total / item.quantity,
        image: getImageUrl(item.product.thumbnail_photo),
        category: "",
        quantity: item.quantity,
        maxQuantity: item.product.quantity ?? 99,  // ombordagi miqdor
      }))
}

// ─── Provider ─────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // ── Refresh user profile ──────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!getToken()) { setUser(null); return }
    const profile = await getProfile()
    setUser(profile)
    // Login bo'lganda wishlistni backenddan yuklash
    const apiWishlist = await getWishlist()
    if (apiWishlist) {
      const items: Product[] = apiWishlist.products.map((p) => ({
        id: String(p.id),
        name: p.title,
        price: parseFloat(p.price),
        image: getImageUrl(p.thumbnail_photo),
        category: "",
      }))
      setWishlist(items)
    }
  }, [])

  // ── Refresh cart from backend ─────────────────────────
  const refreshCart = useCallback(async () => {
    if (!getToken()) {
      setCart(loadGuestCart())
      return
    }
    setCartLoading(true)
    const apiCart = await getCart()
    setCartLoading(false)
    if (apiCart) setCart(apiCartToItems(apiCart))
  }, [])

  // ── On mount: load user, cart, wishlist ───────────────
  useEffect(() => {
    refreshUser()
    refreshCart()

    // Wishlist from localStorage
    try {
      const raw = localStorage.getItem("wishlist")
      if (raw) setWishlist(JSON.parse(raw))
    } catch {}

    setHydrated(true)
  }, [refreshUser, refreshCart])

  // Save wishlist to localStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  // ── Logout ────────────────────────────────────────────
  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
    setCart(loadGuestCart())
    showNotification("Chiqildi", "success")
  }, [showNotification])

  // ── Add to cart ───────────────────────────────────────
  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (!getToken()) {
      // Guest mode: localStorage
      const guestCart = loadGuestCart()
      const existing = guestCart.find((i) => i.id === product.id)
      let updated: CartItem[]
      const maxQty = product.quantity ?? 99
      if (existing) {
        updated = guestCart.map((i) =>
            i.id === product.id
                ? {
                    ...i,
                    quantity: Math.min(
                        i.quantity + quantity,
                        i.maxQuantity ?? maxQty,
                    ),
                  }
                : i
        )
      } else {
        updated = [
          ...guestCart,
          {
            cartItemId: Date.now(), // temp id for guest
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity,
            maxQuantity: maxQty,
          },
        ]
      }
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
      showNotification(result.error || "Xatolik", "error")
    }
  }, [showNotification])

  // ── Remove from cart ──────────────────────────────────
  const removeFromCart = useCallback(async (cartItemId: number) => {
    if (!getToken()) {
      const updated = loadGuestCart().filter((i) => i.cartItemId !== cartItemId)
      saveGuestCart(updated)
      setCart(updated)
      showNotification("Mahsulot o'chirildi", "success")
      return
    }
    const result = await removeCartItem(cartItemId)
    if (result.ok && result.cart) {
      setCart(apiCartToItems(result.cart))
      showNotification("Mahsulot o'chirildi", "success")
    } else {
      showNotification(result.error || "Xatolik", "error")
    }
  }, [showNotification])

  // ── Update quantity ───────────────────────────────────
  const updateCartQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (quantity < 1) { await removeFromCart(cartItemId); return }

    if (!getToken()) {
      const updated = loadGuestCart().map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity } : i
      )
      saveGuestCart(updated)
      setCart(updated)
      return
    }
    const result = await updateCartItem(cartItemId, quantity)
    if (result.ok && result.cart) {
      setCart(apiCartToItems(result.cart))
    } else {
      showNotification(result.error || "Xatolik", "error")
    }
  }, [removeFromCart, showNotification])

  // ── Clear cart ────────────────────────────────────────
  const clearCartFn = useCallback(async () => {
    if (!getToken()) {
      saveGuestCart([])
      setCart([])
      return
    }
    await apiClearCart()
    setCart([])
  }, [])

  // ── Wishlist ──────────────────────────────────────────
  const addToWishlist = useCallback(async (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev
      showNotification(`${product.name} wishlistga qo'shildi`, "success")
      return [...prev, product]
    })
    if (getToken()) {
      await addToWishlistApi(Number(product.id))
    }
  }, [showNotification])

  const removeFromWishlist = useCallback(async (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId))
    showNotification("Wishlistdan o'chirildi", "success")
    if (getToken()) {
      await removeFromWishlistApi(Number(productId))
    }
  }, [showNotification])

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
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            notification,
            showNotification,
          }}
      >
        {children}
        {notification && (
            <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div
                  className={`rounded-xl px-4 py-3 shadow-lg ${
                      notification.type === "success"
                          ? "bg-foreground text-background"
                          : "bg-red-500 text-white"
                  }`}
              >
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