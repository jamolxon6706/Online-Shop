export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  badge?: string
  monthly?: number
  description?: string
  colors?: string[]
  storage?: string[]
  features?: string[]
  specs?: Record<string, string>
  inStock?: boolean
  rating?: number
  reviews?: number
}

export const products: Product[] = [
  // iPhones
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    category: "iphone",
    badge: "New",
    monthly: 100,
    description: "iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: ["256GB", "512GB", "1TB"],
    features: [
      "A17 Pro chip with 6-core GPU",
      "Pro camera system with 48MP Main",
      "5x Optical zoom",
      "Action button",
      "Titanium design",
      "USB-C with USB 3 speeds"
    ],
    specs: {
      "Display": "6.7-inch Super Retina XDR",
      "Chip": "A17 Pro",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Storage": "256GB / 512GB / 1TB",
      "Water Resistance": "IP68"
    },
    inStock: true,
    rating: 4.9,
    reviews: 1247
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    price: 999,
    originalPrice: 1099,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80",
    category: "iphone",
    badge: "Popular",
    monthly: 84,
    description: "iPhone 15 Pro. Titanium design. A17 Pro chip. Customizable Action button. 48MP camera system.",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    features: [
      "A17 Pro chip",
      "Pro camera system",
      "3x Optical zoom",
      "Action button",
      "Titanium design"
    ],
    specs: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A17 Pro",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      "Battery": "Up to 23 hours video playback"
    },
    inStock: true,
    rating: 4.8,
    reviews: 982
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    price: 799,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1699694927232-6568a3615b07?w=800&auto=format&fit=crop&q=80",
    category: "iphone",
    monthly: 67,
    description: "iPhone 15. Dynamic Island. 48MP camera. A16 Bionic chip.",
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    features: [
      "A16 Bionic chip",
      "48MP camera",
      "Dynamic Island",
      "USB-C"
    ],
    specs: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A16 Bionic",
      "Camera": "48MP Main + 12MP Ultra Wide"
    },
    inStock: true,
    rating: 4.7,
    reviews: 756
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    price: 699,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&auto=format&fit=crop&q=80",
    category: "iphone",
    badge: "Sale",
    monthly: 59,
    description: "iPhone 14. A powerful camera system. Emergency SOS via satellite.",
    colors: ["Blue", "Purple", "Yellow", "Midnight", "Starlight", "Red"],
    storage: ["128GB", "256GB", "512GB"],
    inStock: true,
    rating: 4.6,
    reviews: 1523
  },

  // MacBooks
  {
    id: "macbook-pro-16-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    price: 3499,
    originalPrice: 3699,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    category: "macbook",
    badge: "Pro",
    monthly: 292,
    description: "The most powerful MacBook Pro ever. M3 Max chip with up to 128GB unified memory.",
    colors: ["Space Black", "Silver"],
    storage: ["512GB", "1TB", "2TB", "4TB", "8TB"],
    features: [
      "M3 Max chip",
      "Up to 128GB unified memory",
      "Up to 22 hours battery",
      "Liquid Retina XDR display",
      "Six speakers with Spatial Audio"
    ],
    specs: {
      "Display": "16.2-inch Liquid Retina XDR",
      "Chip": "M3 Max",
      "Memory": "36GB / 48GB / 64GB / 128GB",
      "Battery": "Up to 22 hours"
    },
    inStock: true,
    rating: 4.9,
    reviews: 432
  },
  {
    id: "macbook-pro-14-m3-pro",
    name: "MacBook Pro 14\" M3 Pro",
    price: 1999,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    category: "macbook",
    badge: "New",
    monthly: 167,
    description: "MacBook Pro 14-inch with M3 Pro chip. Supercharged for pros.",
    colors: ["Space Black", "Silver"],
    storage: ["512GB", "1TB", "2TB"],
    features: [
      "M3 Pro chip",
      "Up to 36GB unified memory",
      "Up to 17 hours battery",
      "ProMotion display"
    ],
    specs: {
      "Display": "14.2-inch Liquid Retina XDR",
      "Chip": "M3 Pro",
      "Memory": "18GB / 36GB"
    },
    inStock: true,
    rating: 4.8,
    reviews: 567
  },
  {
    id: "macbook-air-15-m3",
    name: "MacBook Air 15\" M3",
    price: 1299,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    category: "macbook",
    badge: "Popular",
    monthly: 109,
    description: "MacBook Air 15-inch with M3 chip. Strikingly thin. Impressively big.",
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    features: [
      "M3 chip",
      "15.3-inch Liquid Retina display",
      "Up to 18 hours battery",
      "MagSafe charging"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 892
  },
  {
    id: "macbook-air-13-m3",
    name: "MacBook Air 13\" M3",
    price: 1099,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    category: "macbook",
    monthly: 92,
    description: "MacBook Air 13-inch with M3 chip. Supercharged by M3.",
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storage: ["256GB", "512GB", "1TB"],
    inStock: true,
    rating: 4.7,
    reviews: 1234
  },

  // iPads
  {
    id: "ipad-pro-13-m4",
    name: "iPad Pro 13\" M4",
    price: 1299,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    category: "ipad",
    badge: "New",
    monthly: 109,
    description: "The new iPad Pro. Impossibly thin. Incredibly powerful. M4 chip.",
    colors: ["Space Black", "Silver"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    features: [
      "M4 chip",
      "Ultra Retina XDR display",
      "Apple Pencil Pro support",
      "Thunderbolt / USB 4"
    ],
    specs: {
      "Display": "13-inch Ultra Retina XDR",
      "Chip": "M4",
      "Camera": "12MP Wide + 12MP Ultra Wide"
    },
    inStock: true,
    rating: 4.9,
    reviews: 234
  },
  {
    id: "ipad-pro-11-m4",
    name: "iPad Pro 11\" M4",
    price: 999,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
    category: "ipad",
    badge: "New",
    monthly: 84,
    description: "iPad Pro 11-inch with M4 chip. Pro performance in a portable size.",
    colors: ["Space Black", "Silver"],
    storage: ["256GB", "512GB", "1TB"],
    inStock: true,
    rating: 4.8,
    reviews: 345
  },
  {
    id: "ipad-air-13",
    name: "iPad Air 13\"",
    price: 799,
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=80",
    category: "ipad",
    monthly: 67,
    description: "iPad Air. Fresh Air. M2 chip. Larger display.",
    colors: ["Space Gray", "Blue", "Purple", "Starlight"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    inStock: true,
    rating: 4.7,
    reviews: 567
  },
  {
    id: "ipad-10th-gen",
    name: "iPad 10th Generation",
    price: 449,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80",
    category: "ipad",
    badge: "Sale",
    monthly: 38,
    description: "iPad. Colorful. Powerful. Delightful.",
    colors: ["Blue", "Pink", "Yellow", "Silver"],
    storage: ["64GB", "256GB"],
    inStock: true,
    rating: 4.6,
    reviews: 789
  },

  // Apple Watch
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    price: 799,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    category: "watch",
    badge: "Pro",
    monthly: 67,
    description: "The most rugged and capable Apple Watch ever. Adventure awaits.",
    colors: ["Titanium"],
    features: [
      "49mm titanium case",
      "S9 SiP chip",
      "Up to 36 hours battery",
      "Action button",
      "Precision dual-frequency GPS"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 432
  },
  {
    id: "apple-watch-series-9",
    name: "Apple Watch Series 9",
    price: 399,
    originalPrice: 449,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    category: "watch",
    badge: "Popular",
    monthly: 34,
    description: "Smarter. Brighter. Mightier. The ultimate device for a healthy life.",
    colors: ["Midnight", "Starlight", "Silver", "Pink", "Red"],
    features: [
      "S9 SiP chip",
      "Always-On Retina display",
      "Double Tap gesture",
      "Blood oxygen app"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1567
  },
  {
    id: "apple-watch-se",
    name: "Apple Watch SE",
    price: 249,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    category: "watch",
    monthly: 21,
    description: "All the essentials. Light on price.",
    colors: ["Midnight", "Starlight", "Silver"],
    inStock: true,
    rating: 4.6,
    reviews: 892
  },

  // AirPods
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    price: 249,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
    category: "airpods",
    badge: "Popular",
    monthly: 21,
    description: "Rebuilt from the sound up. Active Noise Cancellation. Adaptive Audio.",
    features: [
      "H2 chip",
      "Active Noise Cancellation",
      "Adaptive Audio",
      "Conversation Awareness",
      "USB-C charging case"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 2345
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    price: 549,
    image: "https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=800&auto=format&fit=crop&q=80",
    category: "airpods",
    badge: "Premium",
    monthly: 46,
    description: "The ultimate over-ear headphones. High-fidelity audio.",
    colors: ["Space Gray", "Silver", "Green", "Sky Blue", "Pink"],
    features: [
      "H1 chip",
      "Active Noise Cancellation",
      "Spatial Audio",
      "20 hours battery"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 678
  },
  {
    id: "airpods-3",
    name: "AirPods 3rd Generation",
    price: 169,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&auto=format&fit=crop&q=80",
    category: "airpods",
    monthly: 15,
    description: "All-new design. Spatial Audio with dynamic head tracking.",
    features: [
      "Spatial Audio",
      "Adaptive EQ",
      "Force sensor",
      "30 hours total battery"
    ],
    inStock: true,
    rating: 4.6,
    reviews: 1234
  },
  {
    id: "airpods-2",
    name: "AirPods 2nd Generation",
    price: 129,
    originalPrice: 149,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&auto=format&fit=crop&q=80",
    category: "airpods",
    badge: "Sale",
    monthly: 11,
    description: "Effortless setup. Magical experience.",
    inStock: true,
    rating: 4.5,
    reviews: 3456
  },

  // Accessories
  {
    id: "magsafe-charger",
    name: "MagSafe Charger",
    price: 39,
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    description: "Wireless charging for iPhone and AirPods.",
    inStock: true,
    rating: 4.6,
    reviews: 2345
  },
  {
    id: "magic-keyboard",
    name: "Magic Keyboard",
    price: 99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    description: "A remarkably comfortable typing experience.",
    colors: ["White", "Black"],
    inStock: true,
    rating: 4.7,
    reviews: 1234
  },
  {
    id: "magic-mouse",
    name: "Magic Mouse",
    price: 79,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    description: "Multi-Touch surface for intuitive gesture controls.",
    colors: ["White", "Black"],
    inStock: true,
    rating: 4.5,
    reviews: 987
  },
  {
    id: "apple-pencil-pro",
    name: "Apple Pencil Pro",
    price: 129,
    image: "https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    badge: "New",
    description: "The most advanced Apple Pencil. Squeeze. Roll. Find My.",
    inStock: true,
    rating: 4.8,
    reviews: 567
  },
  {
    id: "iphone-15-silicone-case",
    name: "iPhone 15 Silicone Case",
    price: 49,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    description: "Designed to complement iPhone 15. MagSafe compatible.",
    colors: ["Black", "White", "Blue", "Green", "Orange", "Pink"],
    inStock: true,
    rating: 4.6,
    reviews: 1567
  },
  {
    id: "20w-usb-c-adapter",
    name: "20W USB-C Power Adapter",
    price: 19,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    category: "accessories",
    description: "Fast, efficient charging at home, in the office, or on the go.",
    inStock: true,
    rating: 4.7,
    reviews: 3456
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products
  return products.filter(p => p.category === category)
}

export function getBestSellers(): Product[] {
  return products.filter(p => p.badge === 'Popular' || p.badge === 'Pro').slice(0, 8)
}

export function getNewArrivals(): Product[] {
  return products.filter(p => p.badge === 'New').slice(0, 8)
}

export function searchProducts(query: string): Product[] {
  const searchLower = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(searchLower) ||
    p.category.toLowerCase().includes(searchLower) ||
    p.description?.toLowerCase().includes(searchLower)
  )
}

export const categories = [
  { slug: 'iphone', name: 'iPhone', icon: 'Smartphone', description: 'The latest iPhone models' },
  { slug: 'macbook', name: 'MacBook', icon: 'Laptop', description: 'Powerful laptops for work and play' },
  { slug: 'ipad', name: 'iPad', icon: 'Tablet', description: 'Versatile tablets for every task' },
  { slug: 'watch', name: 'Apple Watch', icon: 'Watch', description: 'Smart watches for health and fitness' },
  { slug: 'airpods', name: 'AirPods', icon: 'Headphones', description: 'Premium wireless audio' },
  { slug: 'accessories', name: 'Accessories', icon: 'Package', description: 'Complete your Apple experience' },
]
