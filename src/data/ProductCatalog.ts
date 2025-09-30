import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  image: z.string().optional(),
  features: z.array(z.string()),
  specifications: z.record(z.string()).optional(),
  inStock: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  relatedProducts: z.array(z.string()).default([])
})

export const CatalogSchema = z.object({
  products: z.array(ProductSchema),
  categories: z.array(z.string()),
  lastUpdated: z.string()
})

export type Product = z.infer<typeof ProductSchema>
export type Catalog = z.infer<typeof CatalogSchema>

// Sample product data
export const sampleProducts: Product[] = [
  {
    id: 'laptop-pro-16',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 Pro chip, perfect for professionals and creatives.',
    price: 2499,
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    features: [
      'M3 Pro chip with 12-core CPU',
      '18-hour battery life',
      '16.2-inch Liquid Retina XDR display',
      'Up to 22GB unified memory',
      '8TB SSD storage'
    ],
    specifications: {
      'Display': '16.2-inch Liquid Retina XDR',
      'Processor': 'Apple M3 Pro',
      'Memory': '18GB unified memory',
      'Storage': '512GB SSD',
      'Graphics': '19-core GPU',
      'Weight': '2.15 kg'
    },
    inStock: true,
    tags: ['professional', 'creative', 'portable'],
    relatedProducts: ['laptop-air-15', 'laptop-pro-14']
  },
  {
    id: 'laptop-air-15',
    name: 'MacBook Air 15"',
    description: 'Thin and light laptop with M2 chip, ideal for everyday use.',
    price: 1299,
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    features: [
      'M2 chip with 8-core CPU',
      'Up to 18-hour battery life',
      '15.3-inch Liquid Retina display',
      'Up to 24GB unified memory',
      '2TB SSD storage'
    ],
    specifications: {
      'Display': '15.3-inch Liquid Retina',
      'Processor': 'Apple M2',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Graphics': '10-core GPU',
      'Weight': '1.51 kg'
    },
    inStock: true,
    tags: ['portable', 'everyday', 'affordable'],
    relatedProducts: ['laptop-pro-16', 'laptop-pro-14']
  },
  {
    id: 'phone-15-pro',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system.',
    price: 999,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    features: [
      'Titanium design',
      'A17 Pro chip',
      'Pro camera system with 5x zoom',
      'Action Button',
      'USB-C connector'
    ],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Processor': 'A17 Pro',
      'Storage': '128GB',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': 'Up to 23 hours video playback',
      'Weight': '187 grams'
    },
    inStock: true,
    tags: ['premium', 'camera', 'latest'],
    relatedProducts: ['phone-15', 'phone-14-pro']
  },
  {
    id: 'phone-15',
    name: 'iPhone 15',
    description: 'New iPhone with Dynamic Island and advanced camera system.',
    price: 799,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=400',
    features: [
      'Dynamic Island',
      'A16 Bionic chip',
      'Advanced camera system',
      'USB-C connector',
      'Ceramic Shield front'
    ],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Processor': 'A16 Bionic',
      'Storage': '128GB',
      'Camera': '48MP Main, 12MP Ultra Wide',
      'Battery': 'Up to 20 hours video playback',
      'Weight': '171 grams'
    },
    inStock: true,
    tags: ['popular', 'camera', 'value'],
    relatedProducts: ['phone-15-pro', 'phone-14']
  },
  {
    id: 'tablet-pro-12',
    name: 'iPad Pro 12.9"',
    description: 'Most advanced iPad with M2 chip and Liquid Retina XDR display.',
    price: 1099,
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    features: [
      'M2 chip',
      '12.9-inch Liquid Retina XDR display',
      'Pro camera system',
      'Thunderbolt / USB 4',
      'Apple Pencil support'
    ],
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR',
      'Processor': 'Apple M2',
      'Storage': '128GB',
      'Camera': '12MP Wide, 10MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'Weight': '682 grams'
    },
    inStock: true,
    tags: ['professional', 'creative', 'large'],
    relatedProducts: ['tablet-air-10', 'tablet-pro-11']
  },
  {
    id: 'tablet-air-10',
    name: 'iPad Air 10.9"',
    description: 'Powerful and versatile iPad with M1 chip and all-day battery life.',
    price: 599,
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    features: [
      'M1 chip',
      '10.9-inch Liquid Retina display',
      '12MP Wide camera',
      'Touch ID',
      'Apple Pencil support'
    ],
    specifications: {
      'Display': '10.9-inch Liquid Retina',
      'Processor': 'Apple M1',
      'Storage': '64GB',
      'Camera': '12MP Wide',
      'Battery': 'Up to 10 hours',
      'Weight': '461 grams'
    },
    inStock: true,
    tags: ['versatile', 'affordable', 'portable'],
    relatedProducts: ['tablet-pro-12', 'tablet-pro-11']
  }
]

export const sampleCatalog: Catalog = {
  products: sampleProducts,
  categories: ['Computers', 'Phones', 'Tablets'],
  lastUpdated: new Date().toISOString()
}




