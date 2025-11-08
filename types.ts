// Fix: Import React to provide the React namespace for types like React.Dispatch.
import React from 'react';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  reorderLevel: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  dateTime: string;
  customerInfo?: {
    name: string;
    email: string;
  };
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  productId: string;
}

export enum Page {
  Dashboard = 'Dashboard',
  Inventory = 'Inventory',
  Sales = 'Sales',
  Reports = 'Reports',
  Settings = 'Settings',
}

export type Action =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'RECORD_SALE'; payload: Omit<Sale, 'id' | 'dateTime'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

export interface AppState {
  products: Product[];
  sales: Sale[];
  notifications: Notification[];
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getProductById: (id: string) => Product | undefined;
}