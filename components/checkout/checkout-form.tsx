"use client"

import { useState } from "react"
import { Check, CreditCard, Truck, Package, ChevronRight, CheckCircle, ShoppingBag, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createOrder } from "@/lib/api"

const steps = [
  { id: "contact", name: "Contact", icon: Package },
  { id: "delivery", name: "Delivery", icon: Truck },
  { id: "payment", name: "Payment", icon: CreditCard },
]

const deliveryMethods = [
  { id: "express", name: "Express Delivery", description: "Same-day delivery", price: 15, time: "Today" },
  { id: "standard", name: "Standard Delivery", description: "1-3 business days", price: 0, time: "Mar 19-21" },
  { id: "pickup", name: "Store Pickup", description: "Pick up at our store", price: 0, time: "Ready in 2 hours" },
]

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "applepay", name: "Apple Pay", icon: "" },
  { id: "paypal", name: "PayPal", icon: "🅿️" },
  { id: "installment", name: "0% Installment", icon: "📅" },
]

interface CartItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  image: string
}

interface CheckoutFormProps {
  cartItems?: CartItem[]
  onSuccess?: () => void
}

export function CheckoutForm({ cartItems = [], onSuccess }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState("contact")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState("standard")
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [orderComplete, setOrderComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const [contactForm, setContactForm] = useState({ first_name: "", phone_number: "" })

  const completeStep = (step: string) => {
    setCompletedSteps((prev) => [...new Set([...prev, step])])
    const currentIndex = steps.findIndex((s) => s.id === step)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handlePlaceOrder = async () => {
    if (!contactForm.first_name || !contactForm.phone_number) {
      setError("Ism va telefon raqam to'ldirilishi shart")
      return
    }
    setError("")
    setIsProcessing(true)
    const res = await createOrder({
      first_name: contactForm.first_name,
      phone_number: contactForm.phone_number,
      from_cart: cartItems.length > 0,
    })
    setIsProcessing(false)
    if (!res.ok) {
      setError(res.error || "Buyurtma yaratishda xatolik")
      return
    }
    setOrderComplete(true)
    onSuccess?.()
  }

  if (orderComplete) {
    const orderNumber = `APX-${Date.now().toString().slice(-8)}`
    return (
      <div className="rounded-2xl bg-background border border-border p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl">Buyurtma qabul qilindi!</h2>
        <p className="mt-2 text-muted-foreground">Buyurtmangiz muvaffaqiyatli joylashtirildi.</p>
        <div className="mt-6 rounded-xl bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">Buyurtma raqami</p>
          <p className="mt-1 text-lg font-semibold">{orderNumber}</p>
        </div>
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Taxminiy yetkazib berish</p>
              <p className="text-sm text-muted-foreground">
                {selectedDelivery === "express" ? "Bugun" : selectedDelivery === "pickup" ? "2 soat ichida" : "19-21 mart, 2026"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Yordam kerakmi?</p>
              <p className="text-sm text-muted-foreground">+998 90 123 45 67</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="flex-1 rounded-xl">
            <Link href="/"><ShoppingBag className="mr-2 h-4 w-4" />Xarid davom ettirish</Link>
          </Button>
          <Button asChild className="flex-1 rounded-xl">
            <Link href="/account/orders">Buyurtmalarim</Link>
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
                  isCurrent ? "bg-foreground text-background" : isCompleted ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
                <span className="text-sm font-medium">{step.name}</span>
              </button>
              {index < steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {/* Contact */}
      {currentStep === "contact" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">Aloqa ma'lumotlari</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Ism *</label>
              <input
                type="text" required
                value={contactForm.first_name}
                onChange={(e) => setContactForm(f => ({ ...f, first_name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ism"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon raqam *</label>
              <input
                type="tel" required
                value={contactForm.phone_number}
                onChange={(e) => setContactForm(f => ({ ...f, phone_number: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="+998901234567"
              />
            </div>
          </div>
          <Button
            className="mt-6 w-full rounded-xl" size="lg"
            onClick={() => {
              if (!contactForm.first_name || !contactForm.phone_number) return
              completeStep("contact")
            }}
          >
            Yetkazib berishga o'tish <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delivery */}
      {currentStep === "delivery" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">Yetkazib berish usuli</h2>
          <div className="mt-4 space-y-3">
            {deliveryMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors",
                  selectedDelivery === method.id ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center", selectedDelivery === method.id ? "border-foreground" : "border-border")}>
                    {selectedDelivery === method.id && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                  </div>
                  <input type="radio" name="delivery" value={method.id} checked={selectedDelivery === method.id} onChange={() => setSelectedDelivery(method.id)} className="sr-only" />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{method.price === 0 ? "Bepul" : `$${method.price}`}</p>
                  <p className="text-sm text-muted-foreground">{method.time}</p>
                </div>
              </label>
            ))}
          </div>
          <Button className="mt-6 w-full rounded-xl" size="lg" onClick={() => completeStep("delivery")}>
            To'lovga o'tish <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Payment */}
      {currentStep === "payment" && (
        <div className="rounded-2xl bg-background border border-border p-6">
          <h2 className="text-lg font-semibold">To'lov usuli</h2>
          <div className="mt-6 space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                  selectedPayment === method.id ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/50"
                )}
              >
                <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center", selectedPayment === method.id ? "border-foreground" : "border-border")}>
                  {selectedPayment === method.id && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                </div>
                <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="sr-only" />
                <span className="text-xl">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>
          <Button
            className="mt-6 w-full rounded-xl" size="lg"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? "Buyurtma joylashtirilmoqda..." : "Buyurtmani tasdiqlash"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Buyurtma berish orqali siz Foydalanish shartlari va Maxfiylik siyosatimizga rozisiz
          </p>
        </div>
      )}
    </div>
  )
}
