/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript xatolarini build paytida ko'rsatish
  typescript: {
    ignoreBuildErrors: false, // Xatolarni ko'rish uchun false
  },

  // ─── Rasm optimizatsiyasi ────────────────────────────────
  images: {
    unoptimized: false, // TRUE = sekin! FALSE = tez (WebP/AVIF)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 kun cache
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**", // Production domeningiz
        pathname: "/media/**",
      },
    ],
  },

  // ─── Kompressiya ─────────────────────────────────────────
  compress: true,

  // ─── Bundle analyzer (ixtiyoriy) ─────────────────────────
  // pnpm add -D @next/bundle-analyzer
  // ANALYZE=true pnpm build

  // ─── Headers: caching & security ─────────────────────────
  async headers() {
    return [
      {
        // Statik fayllar — 1 yil cache
        source: "/:path*.(ico|png|jpg|jpeg|svg|gif|webp|avif|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // API xavfsizlik headerlari
        source: "/api/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // Admin sahifasi — cache yo'q
        source: "/admin(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ]
  },

  // ─── Experimental ────────────────────────────────────────
  experimental: {
    // Server components optimizatsiyasi
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "recharts",
    ],
  },
}

export default nextConfig
