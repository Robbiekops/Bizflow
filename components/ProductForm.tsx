
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import Input from './ui/Input';
import Button from './ui/Button';

interface ProductFormProps {
  product: Product | null;
  onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave }) => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    reorderLevel: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        reorderLevel: product.reorderLevel.toString(),
      });
    } else {
        setFormData({ name: '', sku: '', category: '', price: '', quantity: '', reorderLevel: '' });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: product ? product.id : `prod_${new Date().getTime()}`,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      reorderLevel: parseInt(formData.reorderLevel, 10),
    };

    if (product) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: newProduct });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="name" name="name" label="Product Name" value={formData.name} onChange={handleChange} required />
      <Input id="sku" name="sku" label="SKU" value={formData.sku} onChange={handleChange} required />
      <Input id="category" name="category" label="Category" value={formData.category} onChange={handleChange} required />
      <Input id="price" name="price" label="Price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
      <Input id="quantity" name="quantity" label="Quantity in Stock" type="number" value={formData.quantity} onChange={handleChange} required />
      <Input id="reorderLevel" name="reorderLevel" label="Reorder Level" type="number" value={formData.reorderLevel} onChange={handleChange} required />
      <div className="flex justify-end pt-2">
        <Button type="submit">
          {product ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
