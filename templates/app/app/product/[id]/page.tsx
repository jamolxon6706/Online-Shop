import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { getProductById } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} | APEX Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  const images = product.photos?.length
      ? product.photos
      : [product.image]

  const productForComponents = {
    id: product.id,
    name: product.name,
    category: product.category,
    categorySlug: product.category.toLowerCase(),
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    images,
    quantity: product.quantity,        // ← qo'shildi
    inStock: product.quantity > 0,
    description: product.description ?? "",
    photos: images,                    // ← qo'shildi
    features: [],
    specs: [],
    colors: [],
    storages: [],
    rating: 4.8,
    reviewCount: 0,
  }

  return (
      <>
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <ProductGallery images={images} name={product.name} />
              <ProductInfo product={productForComponents} />
            </div>
          </div>
          <ProductTabs product={productForComponents} />
          <RelatedProducts category={productForComponents.categorySlug} currentProductId={product.id} />
        </main>
        <Footer />
      </>
  )
}