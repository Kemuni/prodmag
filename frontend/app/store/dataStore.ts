import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Sale, Supply, Department, Supplier, SupplyItem, SaleItem } from '../types';

// Мок-данные для отделов
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Молочные продукты',
    description: 'Молоко, сыр, йогурты и другие молочные продукты',
    manager_id: '1'
  },
  {
    id: '2',
    name: 'Хлебобулочные изделия',
    description: 'Хлеб, выпечка, сдоба',
    manager_id: '2'
  },
  {
    id: '3',
    name: 'Фрукты и овощи',
    description: 'Свежие фрукты и овощи',
    manager_id: '3'
  }
];

// Мок-данные для поставщиков
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'ООО "Молочный завод"',
    phone: '+7 (495) 123-45-67',
    contact_person: 'Иванов Иван Иванович'
  },
  {
    id: '2',
    name: 'ООО "Хлебозавод №1"',
    phone: '+7 (495) 234-56-78',
    contact_person: 'Петров Петр Петрович'
  },
  {
    id: '3',
    name: 'ИП Сидоров',
    phone: '+7 (495) 345-67-89',
    contact_person: 'Сидоров Сидор Сидорович'
  }
];

// Мок-данные для продуктов
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Молоко',
    department_id: '1',
    supplier_id: '1',
    grade: 'Высший',
    price: 89.90,
    current_quantity: 45,
    min_threshold: 10,
    expiry_date: '2025-07-10',
    storage_cond: 'Хранить при температуре 2-6°C'
  },
  {
    id: '2',
    name: 'Хлеб белый',
    department_id: '2',
    supplier_id: '2',
    grade: 'Первый сорт',
    price: 45.50,
    current_quantity: 30,
    min_threshold: 5,
    expiry_date: '2025-06-05',
    storage_cond: 'Хранить при комнатной температуре'
  },
  {
    id: '3',
    name: 'Яблоки Голден',
    department_id: '3',
    supplier_id: '3',
    grade: 'Высший',
    price: 129.90,
    current_quantity: 50,
    min_threshold: 15,
    expiry_date: '2025-06-20',
    storage_cond: 'Хранить при температуре 10-15°C'
  },
];

// Мок-данные для продаж
const mockSales: Sale[] = [
  {
    id: '1',
    creation_date: '2025-05-30T14:30:00',
    cashier_id: '1'
  },
  {
    id: '2',
    creation_date: '2025-05-30T15:20:00',
    cashier_id: '1'
  },
  {
    id: '3',
    creation_date: '2025-05-30T16:45:00',
    cashier_id: '2'
  },
];

// Мок-данные для элементов продажи
const mockSaleItems: SaleItem[] = [
  {
    id: '1',
    sale_id: '1',
    product_id: '1',
    quantity: 2,
    unit_price: 89.90
  },
  {
    id: '2',
    sale_id: '2',
    product_id: '2',
    quantity: 1,
    unit_price: 45.50
  },
  {
    id: '3',
    sale_id: '3',
    product_id: '3',
    quantity: 3,
    unit_price: 129.90
  }
];

// Мок-данные для поставок
const mockSupplies: Supply[] = [
  {
    id: '1',
    supplier_id: '1',
    supply_date: '2025-05-25',
    total_cost: 3275.00,
    approved_by: '1',
    status: 'completed'
  },
  {
    id: '2',
    supplier_id: '2',
    supply_date: '2025-05-28',
    total_cost: 1510.00,
    approved_by: '1',
    status: 'pending'
  }
];

// Мок-данные для элементов поставки
const mockSupplyItems: SupplyItem[] = [
  {
    id: '1',
    supply_id: '1',
    product_id: '1',
    quantity: 50,
    unit_price: 65.50
  },
  {
    id: '2',
    supply_id: '2',
    product_id: '2',
    quantity: 50,
    unit_price: 30.20
  }
];

interface DataState {
  // Отделы
  departments: Department[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  
  // Поставщики
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  
  // Продукты
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Продажи
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => string;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  
  // Элементы продажи
  saleItems: SaleItem[];
  addSaleItem: (item: Omit<SaleItem, 'id'>) => void;
  updateSaleItem: (item: SaleItem) => void;
  deleteSaleItem: (id: string) => void;
  
  // Поставки
  supplies: Supply[];
  addSupply: (supply: Omit<Supply, 'id'>) => void;
  updateSupply: (supply: Supply) => void;
  deleteSupply: (id: string) => void;
  
  // Элементы поставки
  supplyItems: SupplyItem[];
  addSupplyItem: (item: Omit<SupplyItem, 'id'>) => void;
  updateSupplyItem: (item: SupplyItem) => void;
  deleteSupplyItem: (id: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      // Отделы
      departments: mockDepartments,
      addDepartment: (department) => set((state) => ({
        departments: [...state.departments, { ...department, id: Date.now().toString() }]
      })),
      updateDepartment: (department) => set((state) => ({
        departments: state.departments.map((d) => d.id === department.id ? department : d)
      })),
      deleteDepartment: (id) => set((state) => ({
        departments: state.departments.filter((d) => d.id !== id)
      })),
      
      // Поставщики
      suppliers: mockSuppliers,
      addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplier, id: Date.now().toString() }]
      })),
      updateSupplier: (supplier) => set((state) => ({
        suppliers: state.suppliers.map((s) => s.id === supplier.id ? supplier : s)
      })),
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id)
      })),
      
      // Продукты
      products: mockProducts,
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Date.now().toString() }]
      })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map((p) => p.id === product.id ? product : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
      
      // Продажи
      sales: mockSales,
      addSale: (sale) => {
        const id = Date.now().toString();
        set((state) => ({
          sales: [...state.sales, { ...sale, id }]
        }));
        return id;
      },
      updateSale: (sale) => set((state) => ({
        sales: state.sales.map((s) => s.id === sale.id ? sale : s)
      })),
      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter((s) => s.id !== id)
      })),
      
      // Элементы продажи
      saleItems: mockSaleItems,
      addSaleItem: (item) => set((state) => ({
        saleItems: [...state.saleItems, { ...item, id: Date.now().toString() }]
      })),
      updateSaleItem: (item) => set((state) => ({
        saleItems: state.saleItems.map((s) => s.id === item.id ? item : s)
      })),
      deleteSaleItem: (id) => set((state) => ({
        saleItems: state.saleItems.filter((s) => s.id !== id)
      })),
      
      // Поставки
      supplies: mockSupplies,
      addSupply: (supply) => set((state) => ({
        supplies: [...state.supplies, { ...supply, id: Date.now().toString() }]
      })),
      updateSupply: (supply) => set((state) => ({
        supplies: state.supplies.map((s) => s.id === supply.id ? supply : s)
      })),
      deleteSupply: (id) => set((state) => ({
        supplies: state.supplies.filter((s) => s.id !== id)
      })),
      
      // Элементы поставки
      supplyItems: mockSupplyItems,
      addSupplyItem: (item) => set((state) => ({
        supplyItems: [...state.supplyItems, { ...item, id: Date.now().toString() }]
      })),
      updateSupplyItem: (item) => set((state) => ({
        supplyItems: state.supplyItems.map((s) => s.id === item.id ? item : s)
      })),
      deleteSupplyItem: (id) => set((state) => ({
        supplyItems: state.supplyItems.filter((s) => s.id !== id)
      })),
    }),
    {
      name: 'grocery-store-data',
    }
  )
);
