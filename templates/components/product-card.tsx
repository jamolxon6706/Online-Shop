"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store-context"

interface ProductCardProps {
    id: string
    name: string
    category: string
    price: number
    originalPrice?: number
    image: string
    badge?: string
    monthlyPayment?: number
    isNew?: boolean
    quantity?: number
    className?: string
}

export function ProductCard({
                                id,
                                name,
                                category,
                                price,
                                originalPrice,
                                image,
                                badge,
                                monthlyPayment,
                                isNew,
                                quantity,
                                className,
                            }: ProductCardProps) {
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, cart, showNotification } = useStore()

    const isInCart = cart.some((item) => item.id === id)
    const inWishlist = isInWishlist(id)

    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0

    function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (isInCart) {
            showNotification("Bu mahsulot allaqachon savatda bor!", "error")
            return
        }
        addToCart({ id, name, category, price, originalPrice, image, maxQuantity: quantity })
    }

    function handleWishlist(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (inWishlist) {
            removeFromWishlist(id)
        } else {
            addToWishlist({ id, name, category, price, originalPrice, image })
        }
    }

    return (
        <div className={cn("group relative", className)}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <Link href={`/product/${id}`}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isNew && (
                        <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              New
            </span>
                    )}
                    {discount > 0 && (
                        <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
              -{discount}%
            </span>
                    )}
                    {badge && (
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {badge}
            </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleWishlist}
                        className={cn(
                            "h-9 w-9 rounded-full backdrop-blur-sm shadow-lg transition-colors",
                            inWishlist
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-background/90 hover:bg-background"
                        )}
                    >
                        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                        <span className="sr-only">Add to wishlist</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
                        asChild
                    >
                        <Link href={`/product/${id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Quick view</span>
                        </Link>
                    </Button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Button
                        className="w-full rounded-xl shadow-lg"
                        size="lg"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {category}
                </p>
                <Link href={`/product/${id}`}>
                    <h3 className="font-medium leading-tight text-balance hover:text-muted-foreground transition-colors">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold">
            ${price.toLocaleString()}
          </span>
                    {originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
                    )}
                </div>
                {monthlyPayment && (
                    <p className="text-xs text-muted-foreground">
                        or ${monthlyPayment}/mo for 12 months
                    </p>
                )}
            </div>
        </div>
    )
}