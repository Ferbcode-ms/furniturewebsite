export interface CategoryDoc {
  _id: string;
  name: string;
  description?: string;
  parentId?: string | null; // null for main categories, string for sub-categories
  isSubCategory?: boolean;
  createdAt?: string | Date;
}

export interface ProductDoc {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  tags?: string[];
  dimensions?: string;
  materials?: string;
  features?: string;
  weight?: string;
  warranty?: string;
  careInstructions?: string;
  specifications?: string;
  createdAt?: string | Date;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderDoc {
  _id: string;
  items: OrderItem[];
  customer?: Record<string, unknown>;
  totals?: {
    subtotal?: number;
    shipping?: number;
    grandTotal?: number;
  };
  userEmail?: string;
  status?: "pending" | "forward";
  createdAt?: string | Date;
  total?: number;
}
