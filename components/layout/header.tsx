"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, Heart, User, Menu, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store-context"
import { searchProducts, getImageUrl } from "@/lib/api"
import type { Product } from "@/lib/types"

const navigation = [
  { name: "iPhone", href: "/category/iphone" },
  { name: "MacBook", href: "/category/macbook" },
  { name: "iPad", href: "/category/ipad" },
  { name: "Watch", href: "/category/watch" },
  { name: "AirPods", href: "/category/airpods" },
  { name: "Accessories", href: "/category/accessories" },
]

export function Header() {
  const router = useRouter()
  const { cartCount } = useStore()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Search state
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ESC tugmasi
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // Input focus when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  // Debounced search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const data = await searchProducts(value.trim())
      setResults(data.slice(0, 6))
      setSearching(false)
    }, 400)
  }, [])

  function closeSearch() {
    setIsSearchOpen(false)
    setQuery("")
    setResults([])
    setSearching(false)
  }

  function handleResultClick(productId: string) {
    closeSearch()
    router.push(`/product/${productId}`)
  }

  return (
      <>
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent"
            )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
                  <span className="text-sm font-bold text-background">A</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">APEX</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                  <Link href="/wishlist">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                  <Link href="/account">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <div
            className={cn(
                "fixed inset-0 z-50 bg-background transition-transform duration-300 lg:hidden",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
                <span className="text-sm font-bold text-background">A</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">APEX</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 px-4 pt-8">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center py-4 text-2xl font-medium border-b border-border"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
            ))}
            <div className="flex items-center gap-4 pt-8">
              <Button variant="outline" size="lg" className="flex-1" asChild>
                <Link href="/account">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="flex-1" asChild>
                <Link href="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </Button>
            </div>
          </nav>
        </div>

        {/* Search Modal */}
        <div
            className={cn(
                "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-opacity duration-300",
                isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={closeSearch}
        >
          <div
              className="mx-auto max-w-2xl px-4 pt-24"
              onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="relative">
              {searching ? (
                  <Loader2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground animate-spin" />
              ) : (
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              )}
              <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-12 text-lg outline-none focus:ring-2 focus:ring-ring"
              />
              {query && (
                  <button
                      onClick={() => handleQueryChange("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="mt-2 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                  {results.map((product) => (
                      <button
                          key={product.id}
                          onClick={() => handleResultClick(product.id)}
                          className="flex w-full items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors text-left border-b border-border last:border-0"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                          <Image
                              src={product.image || "/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price.toLocaleString()}</p>
                        </div>
                      </button>
                  ))}
                </div>
            )}

            {/* No results */}
            {!searching && query.trim() && results.length === 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  "{query}" bo'yicha hech narsa topilmadi
                </div>
            )}

            {!query && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Press ESC to close
                </p>
            )}
          </div>
        </div>
      </>
  )
}