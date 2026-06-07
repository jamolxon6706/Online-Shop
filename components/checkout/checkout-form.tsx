"use client"

import { useState } from "react"
import { Check, CreditCard, Truck, Package, ChevronRight, CheckCircle, ShoppingBag, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const steps = [
  { id: "contact", name: "Contact", icon: Package },
  { id: "delivery", name: "Delivery", icon: Truck },
  { id: "payment", name: "Payment", icon: CreditCard },
]

const deliveryMethods = [
  {
    id: "express",
    name: "Express Delivery",
    description: "Same-day delivery",
    price: 15,
    time: "Today",
  },
  {
    id: "standard",
    name: "Standard Delivery",
    description: "1-3 business days",
    price: 0,
    time: "Mar 19-21",
  },
  {
    id: "pickup",
    name: "Store Pickup",
    description: "Pick up at our store",
    price: 0,
    time: "Ready in 2 hours",
  },
]

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "applepay", name: "Apple Pay", icon: "" },
  { id: "paypal", name: "PayPal", icon: "🅿️" },
  { id: "installment", name: "0% Installment", icon: "📅" },
]

export function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState("contact")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState("standard")
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [orderComplete, setOrderComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const completeStep = (step: string) => {
    setCompletedSteps((prev) => [...new Set([...prev, step])])
    const currentIndex = steps.findIndex((s) => s.id === step)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setOrderComplete(true)
  }

  // Order Success State
  if (orderComplete) {
    const orderNumber = `APX-${Date.now().toString().slice(-8)}`
    
    return (
      <div className="rounded-2xl bg-background border border-border p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl">Order Confirmed!</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        <div className="mt-6 rounded-xl bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="mt-1 text-lg font-semibold">{orderNumber}</p>
        </div>
        
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Confirmation Email Sent</p>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent order details to your email address
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">
                {selectedDelivery === "express" ? "Today" : selectedDelivery === "pickup" ? "Ready in 2 hours" : "March 19-21, 2026"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Need Help?</p>
              <p className="text-sm text-muted-foreground">
                Contact us at +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="flex-1 rounded-xl">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button asChild className="flex-1 rounded-xl">
            <Link href="/">
              Track Order
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2 transition-colors whitespace-nowrap",
                  isCurrent
                    ? "bg-foreground text-background"
                    : isCompleted
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
                <span className="text-sm font-medium">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )
        })}
      </div>

      {/* Contact Information */}
      {currentStep === "contact" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We'll use this information to keep you updated
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="+1 (234) 567-890"
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full rounded-xl"
            size="lg"
            onClick={() => completeStep("contact")}
          >
            Continue to Delivery
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delivery Method */}
      {currentStep === "delivery" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">Delivery Address</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Street Address</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Apartment, suite, etc. (optional)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Apt 4B"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <h3 className="mt-8 font-semibold">Delivery Method</h3>
          <div className="mt-4 space-y-3">
            {deliveryMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors",
                  selectedDelivery === method.id
                    ? "border-foreground bg-secondary/50"
                    : "border-border hover:border-foreground/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                      selectedDelivery === method.id
                        ? "border-foreground"
                        : "border-border"
                    )}
                  >
                    {selectedDelivery === method.id && (
                      <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="delivery"
                    value={method.id}
                    checked={selectedDelivery === method.id}
                    onChange={() => setSelectedDelivery(method.id)}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {method.price === 0 ? "Free" : `$${method.price}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{method.time}</p>
                </div>
              </label>
            ))}
          </div>

          <Button
            className="mt-6 w-full rounded-xl"
            size="lg"
            onClick={() => completeStep("delivery")}
          >
            Continue to Payment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Payment Method */}
      {currentStep === "payment" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All transactions are secure and encrypted
          </p>

          <div className="mt-6 space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                  selectedPayment === method.id
                    ? "border-foreground bg-secondary/50"
                    : "border-border hover:border-foreground/50"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    selectedPayment === method.id
                      ? "border-foreground"
                      : "border-border"
                  )}
                >
                  {selectedPayment === method.id && (
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                  )}
                </div>
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id)}
                  className="sr-only"
                />
                <span className="text-xl">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>

          {selectedPayment === "card" && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Name on Card</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {selectedPayment === "installment" && (
            <div className="mt-6 p-4 rounded-xl bg-secondary">
              <p className="text-sm font-medium">0% APR Financing Available</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Split your purchase into 12, 18, or 24 monthly payments with no interest.
              </p>
              <div className="mt-4 flex gap-3">
                {[12, 18, 24].map((months) => (
                  <button
                    key={months}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:border-foreground transition-colors"
                  >
                    {months} months
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="billing-same"
              className="mt-1 h-4 w-4 rounded border-border"
              defaultChecked
            />
            <label htmlFor="billing-same" className="text-sm text-muted-foreground">
              Billing address is the same as delivery address
            </label>
          </div>

          <Button 
            className="mt-6 w-full rounded-xl" 
            size="lg"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing Order..." : "Complete Order"}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By placing your order, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      )}
    </div>
  )
}
