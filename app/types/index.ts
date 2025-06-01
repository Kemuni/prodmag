export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'director' | 'manager' | 'employee';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  supplier: string;
  lastRestocked: string;
}

export interface Sale {
  id: string;
  date: string;
  products: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Supply {
  id: string;
  date: string;
  supplier: string;
  products: SupplyItem[];
  total: number;
  status: 'pending' | 'delivered' | 'canceled';
}

export interface SupplyItem {
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
  total: number;
}

export interface SalesAnalytics {
  dailySales: { date: string; total: number }[];
  monthlySales: { month: string; total: number }[];
  topProducts: { productId: string; productName: string; total: number }[];
}
