
import React, { useState, useMemo } from 'react';
import { SaleItem } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from './ui/Button';
import { PlusIcon, TrashIcon } from './Icons';

interface SaleFormProps {
  onSave: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ onSave }) => {
  const { state, dispatch } = useAppContext();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const availableProducts = useMemo(() => {
    return state.products.filter(p => p.quantity > 0 && !items.find(i => i.productId === p.id));
  }, [state.products, items]);

  const handleAddItem = () => {
    if (!selectedProductId || quantity <= 0) return;

    const product = state.products.find(p => p.id === selectedProductId);
    if (!product || product.quantity < quantity) {
        alert("Not enough stock for this item.");
        return;
    }
    
    setItems([
      ...items,
      {
        productId: selectedProductId,
        quantity: quantity,
        priceAtSale: product.price,
      },
    ]);
    setSelectedProductId('');
    setQuantity(1);
  };
  
  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.priceAtSale * item.quantity, 0);
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
        alert("Please add at least one item to the sale.");
        return;
    }
    dispatch({ type: 'RECORD_SALE', payload: { items, totalAmount } });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Add Items to Sale</h4>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a product</option>
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>{product.name} ({product.quantity} in stock)</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <Button type="button" onClick={handleAddItem} size="md" variant="secondary" className="h-10">
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Current Sale</h4>
        <div className="border rounded-lg border-gray-200 dark:border-gray-700 p-2 space-y-2">
        {items.length > 0 ? (
            items.map(item => {
                const product = state.products.find(p => p.id === item.productId);
                return (
                    <div key={item.productId} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div>
                            <p className="font-medium">{product?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.quantity} x ${item.priceAtSale.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-semibold">${(item.quantity * item.priceAtSale).toFixed(2)}</p>
                            <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                );
            })
        ) : <p className="text-center text-gray-500 dark:text-gray-400 py-2">No items added yet.</p>}
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold">Total: <span className="text-primary-600 dark:text-primary-400">${totalAmount.toFixed(2)}</span></p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={items.length === 0}>Complete Sale</Button>
      </div>
    </form>
  );
};

export default SaleForm;
