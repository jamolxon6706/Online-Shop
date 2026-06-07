import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoryHeader } from "@/components/category/category-header"
import { ProductFilters } from "@/components/category/product-filters"
import { ProductGrid } from "@/components/category/product-grid"
import { getProductsByCategory } from "@/lib/api"

const categoryBanners: Record<string, string> = {
  iphone: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=80",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80",
  ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1600&q=80",
  watch: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1600&q=80",
  airpods: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=1600&q=80",
  accessories: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=1600&q=80",
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | APEX Store`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const { products, categoryName } = await getProductsByCategory(slug)

  if (!products) notFound()

  const banner = categoryBanners[slug] ?? categoryBanners["accessories"]

  return (
      <>
        <Header />
        <main className="pt-16 lg:pt-20">
          <CategoryHeader
              name={categoryName}
              description=""
              banner={banner}
              productCount={products.length}
          />
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <ProductFilters />
              <ProductGrid products={products} />
            </div>
          </div>
        </main>
        <Footer />
      </>
  )
}