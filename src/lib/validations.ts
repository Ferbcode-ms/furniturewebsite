import { z } from "zod";

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  price: z.number().positive("Price must be positive"),
  image: z.string().min(1, "Image URL is required"), // Accept both URLs and Cloudinary URLs
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  features: z.string().optional(),
  weight: z.string().optional(),
  warranty: z.string().optional(),
  careInstructions: z.string().optional(),
  specifications: z.string().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

// Category validation schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// Order validation schemas
export const orderItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  name: z.string().min(1, "Item name is required"),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Invalid image URL"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  customer: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    notes: z.string().optional(),
  }),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "forward"]).optional(),
});

// Admin validation schemas
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Query parameter validation
export const productsQuerySchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const orderQuerySchema = z.object({
  status: z.enum(["pending", "forward"]).optional(),
  date: z.enum(["today", "all"]).optional(),
});
