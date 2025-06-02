export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager_id: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  contact_person: string;
}

export interface Product {
  id: string;
  name: string;
  department_id: string;
  supplier_id: string;
  grade: string;
  price: number;
  current_quantity: number;
  min_threshold: number;
  expiry_date: string;
  storage_cond: string;
}

export interface Sale {
  id: string;
  creation_date: string;
  cashier_id: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export type SupplyStatus = 'pending' | 'received' | 'completed' | 'cancelled';

export interface Supply {
  id: string;
  supplier_id: string;
  supply_date: string;
  total_cost: number;
  approved_by: string;
  status: SupplyStatus;
}

export interface SupplyItem {
  id: string;
  supply_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}


export interface ProductWithDetails extends Product {
  department_name?: string;
  supplier_name?: string;
}

export interface SaleWithDetails extends Sale {
  product_name?: string;
  cashier_name?: string;
}

export interface SupplyWithDetails extends Supply {
  supplier_name?: string;
  approver_name?: string;
  items?: SupplyItemWithDetails[];
  item_count?: number;
}

export interface SupplyItemWithDetails extends SupplyItem {
  product_name?: string;
  total?: number;
}

export interface SalesAnalytics {
  dailySales: { date: string; total: number }[];
  monthlySales: { month: string; total: number }[];
  topProducts: { product_id: string; product_name: string; total: number }[];
}
