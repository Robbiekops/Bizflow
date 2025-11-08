
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Organic Green Tea',
    sku: 'OGT-001',
    category: 'Beverages',
    price: 12.99,
    quantity: 85,
    reorderLevel: 20,
  },
  {
    id: 'prod_2',
    name: 'Artisan Sourdough Bread',
    sku: 'ASB-002',
    category: 'Bakery',
    price: 6.50,
    quantity: 15,
    reorderLevel: 10,
  },
  {
    id: 'prod_3',
    name: 'Handmade Coffee Mug',
    sku: 'HCM-003',
    category: 'Homeware',
    price: 25.00,
    quantity: 40,
    reorderLevel: 15,
  },
  {
    id: 'prod_4',
    name: 'Gourmet Chocolate Bar',
    sku: 'GCB-004',
    category: 'Confectionery',
    price: 8.99,
    quantity: 120,
    reorderLevel: 30,
  },
  {
    id: 'prod_5',
    name: 'Eco-friendly Tote Bag',
    sku: 'ETB-005',
    category: 'Accessories',
    price: 18.00,
    quantity: 8,
    reorderLevel: 10,
  },
];
