import { Shield, Truck, CreditCard, Headphones, Award, RefreshCw } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "100% Original Products",
    description:
      "Every product comes with Apple authenticity guarantee and official certification.",
  },
  {
    icon: Award,
    title: "Official Warranty",
    description:
      "Full manufacturer warranty coverage with local service center support.",
  },
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    description:
      "Free express shipping on orders over $299. Same-day delivery available.",
  },
  {
    icon: CreditCard,
    title: "0% Installments",
    description:
      "Split your purchase into easy monthly payments with no interest charges.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Dedicated Apple specialists available 7 days a week for consultation.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description:
      "14-day hassle-free returns with full refund. No questions asked.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Why APEX Store
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-balance">
            Premium Service,
            <br />
            <span className="text-muted-foreground">Unmatched Trust</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
            We're more than just a store. We're your trusted partner in the Apple 
            ecosystem, committed to delivering excellence at every step.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-foreground">
                <feature.icon className="h-6 w-6 transition-colors group-hover:text-background" />
              </div>
              <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "5+", label: "Years of Trust" },
            { value: "99%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Customer Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl lg:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
