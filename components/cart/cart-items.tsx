"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store-context"



export function CartItems() {
    const { cart, updateCartQuantity, removeFromCart, addToWishlist } = useStore()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map((item) => {
                // max miqdor: product.quantity mavjud bo'lsa shu, yo'qsa cheksiz
                const maxQty = item.maxQuantity ?? 99

                return (
                    <div key={item.cartItemId} className="rounded-2xl bg-card p-4 sm:p-6 border border-border">
                        <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">

                            {/* Product Info */}
                            <div className="col-span-6 flex gap-4">
                                <Link
                                    href={`/product/${item.id}`}
                                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary"
                                >
                                    <Image
                                        src={item.image || "/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </Link>
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="font-medium hover:text-muted-foreground transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 text-xs",
                                        maxQty > 0 ? "text-green-600" : "text-destructive"
                                    )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        maxQty > 0 ? "bg-green-600" : "bg-destructive"
                    )} />
                                        {maxQty > 0 ? `In Stock (${maxQty})` : "Out of Stock"}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="hidden sm:block col-span-2 text-center">
                                <span className="font-medium">${item.price.toLocaleString()}</span>
                            </div>

                            {/* Quantity */}
                            <div className="col-span-2 mt-4 sm:mt-0 flex justify-center">
                                <div className="flex items-center rounded-lg border border-border">
                                    <button
                                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                                        className="p-2 hover:bg-secondary transition-colors rounded-l-lg disabled:opacity-40"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                                    <button
                                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                                        className="p-2 hover:bg-secondary transition-colors rounded-r-lg disabled:opacity-40"
                                        disabled={item.quantity >= maxQty}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="col-span-2 mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                <span className="font-semibold sm:order-1">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
                                <div className="flex items-center gap-2 sm:hidden">
                                    <Button
                                        variant="ghost" size="icon" className="h-8 w-8"
                                        onClick={() => addToWishlist(item)}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost" size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => removeFromCart(item.cartItemId)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden sm:flex items-center justify-end gap-4 mt-4 pt-4 border-t border-border">
                            <button
                                onClick={() => addToWishlist(item)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Heart className="h-4 w-4" />
                                Save for Later
                            </button>
                            <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                O'chirish
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}