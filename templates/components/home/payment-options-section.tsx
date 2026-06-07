import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const paymentOptions = [
  {
    title: "Pay in Full",
    description: "One-time payment with all major cards",
    features: ["All credit/debit cards", "Apple Pay & PayPal", "Bank transfer"],
  },
  {
    title: "12 Month Plan",
    description: "0% interest financing",
    features: ["No interest charges", "$0 down payment", "Easy approval process"],
    highlighted: true,
  },
  {
    title: "18 Month Plan",
    description: "Extended monthly payments",
    features: ["Lower monthly cost", "Flexible terms", "Early payoff option"],
  },
]

export function PaymentOptionsSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Flexible Payments
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-balance">
              Pay Your Way
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Choose the payment option that works best for you. Whether you 
              prefer to pay in full or spread the cost over time, we've got 
              you covered with 0% interest financing.
            </p>

            <div className="mt-10 space-y-4">
              {paymentOptions.map((option) => (
                <div
                  key={option.title}
                  className={`rounded-2xl border p-6 transition-colors ${
                    option.highlighted
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{option.title}</h3>
                      <p
                        className={`mt-1 text-sm ${
                          option.highlighted
                            ? "text-background/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                    {option.highlighted && (
                      <span className="rounded-full bg-background text-foreground px-3 py-1 text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-2 text-sm ${
                          option.highlighted
                            ? "text-background/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Button className="mt-8 rounded-full" size="lg" asChild>
              <Link href="/financing">
                View All Payment Options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-secondary p-8 lg:p-12">
              <div className="h-full rounded-2xl bg-foreground p-8 text-background flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-background/60">
                    Monthly Payment
                  </p>
                  <p className="mt-2 font-serif text-5xl lg:text-6xl">$83</p>
                  <p className="mt-2 text-background/60">for 12 months</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-background/60">Product</span>
                    <span>iPhone 16 Pro</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-background/60">Total Price</span>
                    <span>$999</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-background/60">Interest</span>
                    <span className="text-green-400">$0</span>
                  </div>
                  <div className="h-px bg-background/20" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost</span>
                    <span>$999</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-2xl bg-secondary/50 -z-10" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-2xl bg-secondary/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
