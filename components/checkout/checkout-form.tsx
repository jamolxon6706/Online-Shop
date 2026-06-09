"use client"

import { useState, useRef } from "react"
import { Check, CreditCard, Truck, Package, ChevronRight, CheckCircle, ShoppingBag, Phone, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createOrder, createPayment } from "@/lib/api"

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
  { id: "card", name: "Karta orqali to'lov", icon: "💳" },
  { id: "cash", name: "Naqd / Yetkazib berishda to'lash", icon: "💵" },
  { id: "applepay", name: "Apple Pay", icon: "" },
  { id: "installment", name: "0% Bo'lib to'lash", icon: "📅" },
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
  const [selectedPayment, setSelectedPayment] = useState("cash")
  const [orderComplete, setOrderComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState<number | null>(null)

  const [contactForm, setContactForm] = useState({ first_name: "", phone_number: "" })
  const [cardNumber, setCardNumber] = useState("")
  const [checkPhoto, setCheckPhoto] = useState<File | null>(null)
  const [checkPhotoName, setCheckPhotoName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deliveryFee = deliveryMethods.find(d => d.id === selectedDelivery)?.price ?? 0
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalAmount = cartTotal + deliveryFee

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
    if (selectedPayment === "card" && cardNumber.replace(/\s/g, "").length < 16) {
      setError("To'liq karta raqamini kiriting (16 ta raqam)")
      return
    }
    setError("")
    setIsProcessing(true)

    const orderRes = await createOrder({
      first_name: contactForm.first_name,
      phone_number: contactForm.phone_number,
      from_cart: cartItems.length > 0,
    })

    if (!orderRes.ok) {
      setIsProcessing(false)
      setError(orderRes.error || "Buyurtma yaratishda xatolik")
      return
    }

    const firstOrder = orderRes.data?.[0]
    if (firstOrder) setOrderId(firstOrder.id)

    const rawCard = cardNumber.replace(/\s/g, "")
    const paymentRes = await createPayment({
      card_number: selectedPayment === "card" ? rawCard.slice(0, 16) : "0000000000000000",
      amount: Math.round(totalAmount) || 0,
      type: "money",
      check_photo: selectedPayment === "card" && checkPhoto ? checkPhoto : undefined,
    })

    setIsProcessing(false)

    if (!paymentRes.ok) {
      setError(paymentRes.error || "To'lovda xatolik yuz berdi, lekin buyurtmangiz qabul qilindi")
    }

    setOrderComplete(true)
    onSuccess?.()
  }

  if (orderComplete) {
    const orderLabel = orderId ? `#${orderId}` : `APX-${Date.now().toString().slice(-8)}`
    return (
      <div className="rounded-2xl bg-background border border-border p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl">Buyurtma qabul qilindi!</h2>
        <p className="mt-2 text-muted-foreground">Buyurtmangiz muvaffaqiyatli joylashtirildi.</p>
        <div className="mt-6 rounded-xl bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">Buyurtma raqami</p>
          <p className="mt-1 text-lg font-semibold">{orderLabel}</p>
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

          {/* Card payment details */}
          {selectedPayment === "card" && (
            <div className="mt-6 space-y-4 rounded-xl border border-border p-4">
              <div>
                <label className="text-sm font-medium">Karta raqami *</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 16)
                    const formatted = raw.replace(/(.{4})/g, "$1 ").trim()
                    setCardNumber(formatted)
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
              <div>
                <label className="text-sm font-medium">To'lov cheki rasmi (ixtiyoriy)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-6 hover:bg-secondary/50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {checkPhotoName || "Rasm yuklash uchun bosing"}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCheckPhoto(file)
                      setCheckPhotoName(file.name)
                    }
                  }}
                />
              </div>
            </div>
          )}

          {selectedPayment === "cash" && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
              Kuryerga yetkazib berilganda to'lanadi. Naqd pul yoki terminal orqali to'lash mumkin.
            </div>
          )}

          {totalAmount > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Jami to'lov</span>
              <span className="font-bold text-base">${totalAmount.toLocaleString()}</span>
            </div>
          )}

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
