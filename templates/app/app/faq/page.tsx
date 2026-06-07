import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageCircle, Phone, Mail } from "lucide-react"

const faqCategories = [
  {
    title: "Orders & Shipping",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 3-5 business days. Express delivery is available for next-day delivery in selected areas. You can track your order in real-time through your account dashboard.",
      },
      {
        question: "What are the shipping costs?",
        answer:
          "We offer free standard shipping on all orders over $299. For orders below this amount, a flat rate of $15 applies. Express shipping costs $25 regardless of order value.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order is shipped, you'll receive a tracking number via email. You can also track your order status directly from your account page on our website.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship within the United States only. We're working on expanding our shipping coverage to more countries. Sign up for our newsletter to be notified when international shipping becomes available.",
      },
    ],
  },
  {
    title: "Products & Warranty",
    questions: [
      {
        question: "Are all products original Apple products?",
        answer:
          "Yes, 100% of our products are original Apple products sourced directly from authorized distributors. We never sell refurbished or third-party items as new. Every product comes with full Apple warranty coverage.",
      },
      {
        question: "What warranty do products come with?",
        answer:
          "All our Apple products come with the standard 1-year Apple Limited Warranty. You can also purchase AppleCare+ for extended coverage. We handle all warranty claims directly to make the process easier for you.",
      },
      {
        question: "Can I check product availability before ordering?",
        answer:
          "Product availability is shown in real-time on each product page. If an item is out of stock, you can sign up for notifications and we'll email you when it's back in stock.",
      },
      {
        question: "How do I verify my product is authentic?",
        answer:
          "Every Apple product has a serial number that can be verified on Apple's official website. We also provide original purchase receipts and warranty documentation with every order.",
      },
    ],
  },
  {
    title: "Payments & Financing",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, PayPal, and bank transfers. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        question: "Do you offer installment payments?",
        answer:
          "Yes! We offer 0% APR financing for 6, 12, or 24 months on qualifying purchases. You can apply during checkout and get an instant decision. Monthly payments are calculated and shown on product pages.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard encryption and never store your full card details. All payments are processed through PCI-DSS compliant payment processors.",
      },
      {
        question: "Can I pay with multiple methods?",
        answer:
          "Currently, each order can only be paid with one payment method. However, you can use store credit or gift cards in combination with another payment method.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return policy for all products in original, unopened condition. Opened products can be returned within 7 days if there's a defect. Returns are free for defective items.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Log into your account, go to Order History, select the order you want to return, and click 'Request Return'. You'll receive a prepaid shipping label via email. Simply pack the item securely and drop it off at any authorized shipping location.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Once we receive your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 additional business days depending on your bank.",
      },
      {
        question: "Can I exchange a product?",
        answer:
          "Yes, exchanges are available for different colors, storage capacities, or sizes within 14 days of delivery. Contact our support team to arrange an exchange.",
      },
    ],
  },
  {
    title: "Account & Support",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click the account icon in the header and select 'Register'. You'll need to provide your email, create a password, and verify your email address. Having an account lets you track orders, save wishlist items, and checkout faster.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "Our support team is available 24/7. You can reach us via phone at +1 (555) 123-4567, email at support@apex.store, or through live chat on our website. Average response time is under 2 hours.",
      },
      {
        question: "Do you have physical stores?",
        answer:
          "Yes, we have flagship stores in New York, Los Angeles, and Miami. Visit our Contact page for addresses and hours. You can also arrange in-store pickup for online orders.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within minutes. If you don't see the email, check your spam folder.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">FAQ</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about orders, shipping, products, 
              and more. Can&apos;t find what you&apos;re looking for? Contact our support team.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Link
              href="/contact"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Get instant help</p>
              </div>
            </Link>
            <Link
              href="tel:+15551234567"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </Link>
            <Link
              href="mailto:support@apex.store"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@apex.store</p>
              </div>
            </Link>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div className="bg-secondary/50 px-6 py-4">
                  <h2 className="font-semibold text-lg">{category.title}</h2>
                </div>
                <Accordion type="single" collapsible className="px-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-12 rounded-2xl bg-secondary/50 p-8 text-center">
            <h2 className="font-serif text-2xl">Still have questions?</h2>
            <p className="mt-2 text-muted-foreground">
              Our expert support team is ready to help you 24/7
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="rounded-xl min-w-[160px]" size="lg">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl min-w-[160px]" size="lg">
                <Link href="tel:+15551234567">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
