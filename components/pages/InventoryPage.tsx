
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ProductForm from '../ProductForm';
import { PlusIcon, EditIcon, TrashIcon } from '../Icons';

const InventoryListItem: React.FC<{ product: Product; onEdit: (product: Product) => void; onDelete: (id: string) => void; }> = ({ product, onEdit, onDelete }) => {
  const stockLevelPercentage = (product.quantity / (product.reorderLevel * 2 + 1)) * 100;
  let stockColorClass = 'bg-green-500';
  if (product.quantity <= product.reorderLevel) {
    stockColorClass = 'bg-red-500';
  } else if (product.quantity <= product.reorderLevel * 1.5) {
    stockColorClass = 'bg-yellow-500';
  }

  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-md font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
          <p className="text-md font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span>SKU: {product.sku}</span>
          <span>In Stock: <span className="font-bold">{product.quantity}</span></span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div className={`${stockColorClass} h-1.5 rounded-full`} style={{ width: `${Math.min(stockLevelPercentage, 100)}%` }}></div>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0 flex gap-2">
        <button onClick={() => onEdit(product)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"><EditIcon className="w-5 h-5"/></button>
        <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><TrashIcon className="w-5 h-5" /></button>
      </div>
    </li>
  );
};

const InventoryPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return state.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [state.products, searchQuery]);

  return (
    <div>
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Search products by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto flex-grow px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900 dark:text-gray-100"
                />
                <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Add Product
                </Button>
            </div>
        </Card>
        
        <Card className="mt-4">
            {filteredProducts.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.map(product => (
                        <InventoryListItem key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No products found. Add one to get started!</p>
            )}
        </Card>
      
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
            <ProductForm product={editingProduct} onSave={closeModal} />
        </Modal>
    </div>
  );
};

export default InventoryPage;
