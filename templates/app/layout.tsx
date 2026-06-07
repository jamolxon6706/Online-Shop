import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/lib/store-context"

// ─── Fontlar (display:swap = tez ko'rinadi) ───────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",          // ← muhim: FOIT oldini oladi
  preload: true,
  fallback: ["system-ui", "arial"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",          // ← muhim
  preload: false,           // Display font — keyinroq yuklasa ham bo'ladi
  fallback: ["Georgia", "serif"],
})

// ─── Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "APEX Store | Premium Apple Products",
    template: "%s | APEX Store",
  },
  description:
    "Your destination for original Apple products. iPhone, MacBook, iPad, Apple Watch, AirPods & accessories with official warranty and premium service.",
  keywords: [
    "Apple", "iPhone", "MacBook", "iPad",
    "Apple Watch", "AirPods", "premium electronics",
    "original Apple products",
  ],
  // Open Graph — ijtimoiy tarmoqlar uchun
  openGraph: {
    type: "website",
    siteName: "APEX Store",
    title: "APEX Store | Premium Apple Products",
    description: "Premium Apple products with official warranty",
  },
  // Preconnect hints — tez yuklash uchun
  other: {
    "dns-prefetch": "//fonts.googleapis.com",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)",  color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect: tashqi resurslarni oldindan ulash */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* API serverga preconnect */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} />
      </head>
      <body className="font-sans antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
