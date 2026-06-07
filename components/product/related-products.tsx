import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface RelatedProductsProps {
  category: string
  currentProductId: string
}

const allProducts = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max 256GB",
    category: "iPhone",
    categorySlug: "iphone",
    price: 1199,
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=600&q=80",
    monthlyPayment: 99,
    isNew: true,
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro 128GB",
    category: "iPhone",
    categorySlug: "iphone",
    price: 999,
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=600&q=80",
    monthlyPayment: 83,
    isNew: true,
  },
  {
    id: "iphone-15",
    name: "iPhone 15 128GB Blue",
    category: "iPhone",
    categorySlug: "iphone",
    price: 799,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    monthlyPayment: 66,
  },
  {
    id: "macbook-pro-16",
    name: "MacBook Pro 16-inch M3 Pro",
    category: "MacBook",
    categorySlug: "macbook",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    monthlyPayment: 208,
  },
  {
    id: "macbook-air-15",
    name: "MacBook Air 15-inch M3",
    category: "MacBook",
    categorySlug: "macbook",
    price: 1299,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80",
    monthlyPayment: 108,
    isNew: true,
  },
  {
    id: "ipad-pro-13",
    name: "iPad Pro 13-inch M4",
    category: "iPad",
    categorySlug: "ipad",
    price: 1299,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    monthlyPayment: 108,
    isNew: true,
  },
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "Watch",
    categorySlug: "watch",
    price: 799,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
    monthlyPayment: 66,
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2nd Gen",
    category: "AirPods",
    categorySlug: "airpods",
    price: 249,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80",
    monthlyPayment: 20,
  },
]

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const relatedProducts = allProducts
    .filter(
      (product) =>
        product.categorySlug === category && product.id !== currentProductId
    )
    .slice(0, 4)

  // If not enough products in same category, add from other categories
  if (relatedProducts.length < 4) {
    const otherProducts = allProducts
      .filter(
        (product) =>
          product.categorySlug !== category && product.id !== currentProductId
      )
      .slice(0, 4 - relatedProducts.length)
    relatedProducts.push(...otherProducts)
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              You May Also Like
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Related Products
            </h2>
          </div>
          <Link
            href={`/category/${category}`}
            className="group flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
          >
            View All
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
