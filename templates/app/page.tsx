import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { BestSellersSection } from "@/components/home/best-sellers-section"
import { NewArrivalsSection } from "@/components/home/new-arrivals-section"
import { PromoBanner } from "@/components/home/promo-banner"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { PaymentOptionsSection } from "@/components/home/payment-options-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { TrustSection } from "@/components/home/trust-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { getProducts, getCategories } from "@/lib/api"

// ─── Skeleton components ──────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
          <div className="aspect-square bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 rounded bg-secondary" />
            <div className="h-3 w-1/2 rounded bg-secondary" />
            <div className="h-5 w-1/3 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 w-32 shrink-0 rounded-2xl bg-secondary animate-pulse" />
      ))}
    </div>
  )
}

// ─── Async server components ──────────────────────────────

async function ProductSections() {
  // Parallel fetch — ikkitasi bir vaqtda yuklanadi
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <>
      <CategoriesSection categories={categories} />
      <BestSellersSection products={products} />
      <PromoBanner />
      <NewArrivalsSection products={products.slice(0, 6)} />
    </>
  )
}

// ─── Page ──────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — static, hech narsa kutmaydi */}
        <HeroSection />

        {/* Products — Suspense bilan parallel yuklash */}
        <Suspense fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 space-y-16">
            <CategorySkeleton />
            <ProductSkeleton />
          </div>
        }>
          <ProductSections />
        </Suspense>

        {/* Static sections — hech qanday API chaqiriq yo'q */}
        <WhyChooseUsSection />
        <PaymentOptionsSection />
        <TestimonialsSection />
        <TrustSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
