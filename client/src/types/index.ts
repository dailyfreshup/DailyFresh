export type OrderStatus = "Placed" | "Confirmed" | "Delivered" | "Cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  lat: number;
  lng: number;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  isPopular: boolean;
  discount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  user: string | { id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  shippingAddress: Omit<Address, "id" | "isDefault">;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  isPaid: boolean;
  createdAt: string;
}
