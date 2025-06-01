import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Sale, Supply } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Молоко',
    category: 'Молочные продукты',
    price: 89.90,
    cost: 65.50,
    stock: 45,
    supplier: 'ООО "Молочный завод"',
    lastRestocked: '2025-05-25',
  },
  {
    id: '2',
    name: 'Хлеб белый',
    category: 'Хлебобулочные изделия',
    price: 45.50,
    cost: 30.20,
    stock: 30,
    supplier: 'ООО "Хлебозавод №1"',
    lastRestocked: '2025-05-30',
  },
  {
    id: '3',
    name: 'Яблоки Голден',
    category: 'Фрукты',
    price: 129.90,
    cost: 95.00,
    stock: 50,
    supplier: 'ИП Иванов',
    lastRestocked: '2025-05-28',
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2025-05-30T14:30:00',
    products: [
      {
        productId: '1',
        productName: 'Молоко',
        quantity: 2,
        price: 89.90,
        total: 179.80,
      },
      {
        productId: '2',
        productName: 'Хлеб белый',
        quantity: 1,
        price: 45.50,
        total: 45.50,
      },
    ],
    total: 225.30,
    paymentMethod: 'card',
  },
  {
    id: '2',
    date: '2025-05-30T15:45:00',
    products: [
      {
        productId: '3',
        productName: 'Яблоки Голден',
        quantity: 1.5,
        price: 129.90,
        total: 194.85,
      },
    ],
    total: 194.85,
    paymentMethod: 'cash',
  },
];

const mockSupplies: Supply[] = [
  {
    id: '1',
    date: '2025-05-25T09:00:00',
    supplier: 'ООО "Молочный завод"',
    products: [
      {
        productId: '1',
        productName: 'Молоко',
        quantity: 50,
        cost: 65.50,
        total: 3275.00,
      },
    ],
    total: 3275.00,
    status: 'delivered',
  },
  {
    id: '2',
    date: '2025-06-02T10:00:00',
    supplier: 'ООО "Хлебозавод №1"',
    products: [
      {
        productId: '2',
        productName: 'Хлеб белый',
        quantity: 40,
        cost: 30.20,
        total: 1208.00,
      },
    ],
    total: 1208.00,
    status: 'pending',
  },
];

interface DataState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  supplies: Supply[];
  addSupply: (supply: Omit<Supply, 'id'>) => void;
  updateSupplyStatus: (id: string, status: Supply['status']) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      products: mockProducts,
      addProduct(product) {
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        }));
      },
      updateProduct(product) {
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        }));
      },
      deleteProduct(id) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      
      sales: mockSales,
      addSale(sale) {
        set((state) => ({
          sales: [...state.sales, { ...sale, id: Date.now().toString() }],
        }));
      },
      
      supplies: mockSupplies,
      addSupply(supply) {
        set((state) => ({
          supplies: [...state.supplies, { ...supply, id: Date.now().toString() }],
        }));
      },
      updateSupplyStatus(id, status) {
        set((state) => ({
          supplies: state.supplies.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        }));
      },
    }),
    {
      name: 'grocery-store-data',
    }
  )
);
