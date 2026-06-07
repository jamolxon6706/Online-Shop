"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Send, Instagram, MessageCircle, CheckCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (234) 567-890", "+1 (234) 567-891"],
    action: "tel:+1234567890",
    actionLabel: "Call Now",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["hello@apexstore.com", "support@apexstore.com"],
    action: "mailto:hello@apexstore.com",
    actionLabel: "Send Email",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["123 Premium Avenue", "Tech City, TC 12345"],
    action: "https://maps.google.com",
    actionLabel: "Get Directions",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Sat: 10:00 AM - 9:00 PM", "Sunday: 11:00 AM - 7:00 PM"],
  },
]

const socialLinks = [
  { icon: Instagram, name: "Instagram", handle: "@apexstore", href: "https://instagram.com" },
  { icon: Send, name: "Telegram", handle: "@apexstore", href: "https://telegram.org" },
  { icon: MessageCircle, name: "WhatsApp", handle: "+1234567890", href: "https://wa.me/1234567890" },
]

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Get in Touch
              </span>
              <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl text-balance">
                We&apos;re Here to Help
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Have questions about our products or need expert consultation? 
                Our team is ready to assist you with all your Apple needs.
              </p>
            </div>
          </div>
          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-foreground/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 transition-colors group-hover:bg-foreground group-hover:text-background">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <div className="mt-2 space-y-1">
                    {item.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </div>
                  {item.action && (
                    <a
                      href={item.action}
                      className="mt-4 inline-flex items-center text-sm font-medium hover:underline"
                    >
                      {item.actionLabel}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Social */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl">Send Us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {formSubmitted ? (
                  <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-green-900 dark:text-green-100">
                      Message Sent Successfully
                    </h3>
                    <p className="mt-2 text-green-700 dark:text-green-300">
                      Thank you for reaching out! We&apos;ll respond within 24 hours.
                    </p>
                    <Button
                      className="mt-6"
                      variant="outline"
                      onClick={() => {
                        setFormSubmitted(false)
                        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="+1 (234) 567-890"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="order-status">Order Status</option>
                          <option value="warranty">Warranty Support</option>
                          <option value="returns">Returns & Refunds</option>
                          <option value="consultation">Expert Consultation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="mt-2 w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Social & Quick Contact */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="rounded-2xl border border-border bg-card p-8">
                  <h3 className="font-serif text-xl">Need Immediate Help?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our support team is available during working hours for instant assistance.
                  </p>
                  <div className="mt-6 space-y-4">
                    <a
                      href="tel:+1234567890"
                      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Call Us Now</p>
                        <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
                      </div>
                    </a>
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">Start a conversation</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="rounded-2xl border border-border bg-card p-8">
                  <h3 className="font-serif text-xl">Connect With Us</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Follow us for updates, offers, and Apple news.
                  </p>
                  <div className="mt-6 space-y-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
                          <social.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{social.name}</p>
                          <p className="text-sm text-muted-foreground">{social.handle}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="relative h-[400px] bg-muted">
                {/* Placeholder for map - in production, integrate with Google Maps or similar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">APEX Store</p>
                    <p className="text-sm text-muted-foreground">123 Premium Avenue, Tech City</p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-foreground py-16 text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl">
                  Visit Our Store
                </h2>
                <p className="mt-2 text-background/70">
                  Experience our products in person with expert guidance.
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
