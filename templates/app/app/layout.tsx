import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/lib/store-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "APEX Store | Premium Apple Products",
  description:
      "Your destination for original Apple products. iPhone, MacBook, iPad, Apple Watch, AirPods & accessories with official warranty and premium service.",
  keywords: [
    "Apple",
    "iPhone",
    "MacBook",
    "iPad",
    "Apple Watch",
    "AirPods",
    "premium electronics",
    "original Apple products",
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
      <StoreProvider>
        {children}
      </StoreProvider>
      </body>
      </html>
  )
}