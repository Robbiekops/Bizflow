
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Action, Product, AppContextType, Notification, SaleItem } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'RECORD_SALE': {
      const newSale = {
        ...action.payload,
        id: `sale_${new Date().getTime()}`,
        dateTime: new Date().toISOString(),
      };

      const newProducts = [...state.products];
      const newNotifications = [...state.notifications];

      newSale.items.forEach((item: SaleItem) => {
        const productIndex = newProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          const product = newProducts[productIndex];
          const newQuantity = product.quantity - item.quantity;
          newProducts[productIndex] = { ...product, quantity: newQuantity };

          if (newQuantity <= product.reorderLevel) {
            const existingNotification = newNotifications.find(n => n.productId === product.id && !n.read);
            if (!existingNotification) {
                newNotifications.push({
                    id: `notif_${new Date().getTime()}_${product.id}`,
                    message: `${product.name} is low on stock (${newQuantity} remaining). Reorder level is ${product.reorderLevel}.`,
                    date: new Date().toISOString(),
                    read: false,
                    productId: product.id,
                });
            }
          }
        }
      });

      return {
        ...state,
        products: newProducts,
        sales: [newSale, ...state.sales],
        notifications: newNotifications,
      };
    }
    case 'MARK_NOTIFICATION_READ': {
        return {
            ...state,
            notifications: state.notifications.map(n => n.id === action.payload ? {...n, read: true} : n)
        }
    }
    default:
      return state;
  }
};

const getInitialState = (): AppState => {
    try {
        const storedState = localStorage.getItem('bizflow-state');
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Quick check to ensure products array is not empty after parsing
            if (Array.isArray(parsedState.products) && parsedState.products.length > 0) {
                 return parsedState;
            }
        }
    } catch (e) {
        console.error("Failed to parse state from localStorage", e);
    }
    return {
      products: INITIAL_PRODUCTS,
      sales: [],
      notifications: [],
    };
}


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('bizflow-state', JSON.stringify(state));
  }, [state]);

  const getProductById = (id: string): Product | undefined => {
    return state.products.find(p => p.id === id);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getProductById }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
