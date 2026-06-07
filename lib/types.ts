// ─── Django Backend API Types ─────────────────────────────

export interface ApiCategory {
    id: number
    title: string
    photo: string
}

export interface ApiProductPhoto {
    id: number
    photo: string
    order: number
}

export interface ApiColorVariantPhoto {
    id: number
    photo: string
    order: number
}

export interface ApiColorVariant {
    id: number
    name: string
    hex_code: string
    photos: ApiColorVariantPhoto[]
    order: number
}

export interface ApiStorageOption {
    id: number
    label: string      // "512/8", "1T/16", "256"
    storage: string    // "512GB", "1TB", "256GB"
    ram: string        // "8GB", "16GB" yoki ""
    price: string      // decimal string from Django
    order: number
}

export interface ApiProduct {
    id: number
    title: string
    price: string           // base price (decimal string)
    discount: number        // discount percent
    thumbnail_photo: string | null
    quantity: number
    description?: string
    category?: string | ApiCategory
    photos?: ApiProductPhoto[]
    color_variants?: ApiColorVariant[]
    storage_options?: ApiStorageOption[]
    created_at?: string
    updated_at?: string
    is_active?: boolean
}

// ─── Frontend Types (after transform) ────────────────────

export interface ColorVariant {
    id: number
    name: string
    hex: string
    images: string[]
}

export interface StorageOption {
    id: number
    label: string      // "512/8"
    storage: string    // "512GB"
    ram: string        // "8GB" or ""
    price: number      // parsed number
}

export interface Product {
    id: string
    name: string
    category: string
    categoryId?: number
    price: number           // base price (cheapest option or base)
    originalPrice?: number  // before discount
    image: string           // thumbnail
    badge?: string
    monthlyPayment?: number
    isNew?: boolean
    discount: number
    quantity: number
    description?: string
    photos?: string[]            // all product photos (fallback)
    colorVariants?: ColorVariant[]
    storageOptions?: StorageOption[]
    createdAt?: string
    isActive?: boolean
}

export interface Category {
    id: number
    name: string
    image: string
    href: string
    slug: string
}
