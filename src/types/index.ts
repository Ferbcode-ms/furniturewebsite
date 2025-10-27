// Product types
export interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  tag?: string; // For backward compatibility
  dimensions?: string;
  materials?: string;
  features?: string;
  weight?: string;
  warranty?: string;
  careInstructions?: string;
  specifications?: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  parentId?: string;
  isSubCategory?: boolean;
  description?: string;
  image?: string;
}

export interface HierarchicalCategory {
  name: string;
  image?: string;
  subCategories: string[];
}

// Order types
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  _id: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "forward";
  items: OrderItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    companyName?: string;
    gstVat?: string;
    notes?: string;
  };
  userEmail?: string;
  totals?: {
    subtotal?: number;
    shipping?: number;
    grandTotal?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  ok?: boolean;
}

export interface CategoriesResponse {
  categories: string[];
  hierarchical: HierarchicalCategory[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface OrdersResponse {
  orders: Order[];
}

// Form types
export interface ProductForm {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
}

export interface OrderForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}
