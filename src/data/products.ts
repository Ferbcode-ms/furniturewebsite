export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  tag?: string;
};

export type ProductWithCategory = Product & {
  category: string;
};

export const trending: Product[] = [
  {
    id: "sofa-1",
    name: "Modern Sofa",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  },
  {
    id: "lamp-1",
    name: "Pendant Lights",
    price: 1000,
    image:
      "https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnVybml0dXJlfGVufDB8fDB8fHww",
  },
  {
    id: "dining-1",
    name: "Dining Set",
    price: 600,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
  },
];

export const arrivals: Product[] = [
  {
    id: "chair-1",
    name: "The Fidel Chair",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    tag: "Starting",
  },
  {
    id: "table-1",
    name: "Coffee Table",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
    tag: "30+ Variants",
  },
  {
    id: "velvet-1",
    name: "Velvet Collection",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    tag: "30+ Variants",
  },
];

export const categories = [
  "Living room",
  "Bedroom",
  "Office",
  "Dining Room",
  "Kitchen Room",
];

// Unified catalog used by /products page
export const allProducts: ProductWithCategory[] = [
  {
    id: "sofa-1",
    name: "Modern Sofa",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    category: "Living room",
  },
  {
    id: "lamp-1",
    name: "Pendant Lights",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1504198266285-165a3b981d1d?w=800&q=80",
    category: "Living room",
  },
  {
    id: "dining-1",
    name: "Dining Set",
    price: 600,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    category: "Dining Room",
  },
  {
    id: "chair-1",
    name: "The Fidel Chair",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    tag: "Starting",
    category: "Living room",
  },
  {
    id: "table-1",
    name: "Coffee Table",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
    tag: "30+ Variants",
    category: "Living room",
  },
  {
    id: "velvet-1",
    name: "Velvet Collection",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    tag: "30+ Variants",
    category: "Bedroom",
  },
  {
    id: "office-chair-1",
    name: "Ergo Office Chair",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1582582429416-0d7a8a7a1e52?w=800&q=80",
    category: "Office",
  },
  {
    id: "desk-1",
    name: "Standing Desk",
    price: 740,
    image:
      "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&q=80",
    category: "Office",
  },
  {
    id: "bed-1",
    name: "Queen Bed Frame",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8f?w=800&q=80",
    category: "Bedroom",
  },
  {
    id: "stool-1",
    name: "Kitchen Bar Stool",
    price: 140,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    category: "Kitchen Room",
  },
];
