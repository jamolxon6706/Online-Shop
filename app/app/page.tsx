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
import { getProducts } from "@/lib/api"

export default async function HomePage() {
    const products = await getProducts()

    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <CategoriesSection />
                <BestSellersSection products={products} />
                <PromoBanner />
                <NewArrivalsSection products={products.slice(0, 6)} />
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