
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import SaleForm from '../SaleForm';
import { PlusIcon } from '../Icons';
import { useAppContext, } from '../../context/AppContext';
import { Sale } from '../../types';
import Receipt from '../Receipt';

const SaleHistoryItem: React.FC<{ sale: Sale; onShowReceipt: (sale: Sale) => void; }> = ({ sale, onShowReceipt }) => {
    const { getProductById } = useAppContext();
    return (
        <li className="py-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sale ID: {sale.id.slice(-6)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(sale.dateTime).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">${sale.totalAmount.toFixed(2)}</p>
                    <button onClick={() => onShowReceipt(sale)} className="text-sm text-blue-500 hover:underline">View Receipt</button>
                </div>
            </div>
            <ul className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                {sale.items.map(item => {
                    const product = getProductById(item.productId);
                    return (
                        <li key={item.productId} className="text-sm text-gray-600 dark:text-gray-300">
                            {item.quantity} x {product?.name || 'Unknown Product'} @ ${item.priceAtSale.toFixed(2)}
                        </li>
                    )
                })}
            </ul>
        </li>
    );
};


const SalesPage: React.FC = () => {
    const { state } = useAppContext();
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [receiptModalSale, setReceiptModalSale] = useState<Sale | null>(null);

    const handleRecordSale = () => {
        setIsSaleModalOpen(true);
    };

    const closeSaleModal = () => {
        setIsSaleModalOpen(false);
    };

    const handleShowReceipt = (sale: Sale) => {
        setReceiptModalSale(sale);
    }
    
    const closeReceiptModal = () => {
        setReceiptModalSale(null);
    }

    return (
        <div>
            <Card>
                <Button onClick={handleRecordSale} fullWidth>
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Record New Sale
                </Button>
            </Card>

            <Card className="mt-4" title="Sales History">
                {state.sales.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {state.sales.map(sale => (
                           <SaleHistoryItem key={sale.id} sale={sale} onShowReceipt={handleShowReceipt}/>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No sales recorded yet.</p>
                )}
            </Card>

            <Modal isOpen={isSaleModalOpen} onClose={closeSaleModal} title="Record a New Sale">
                <SaleForm onSave={closeSaleModal} />
            </Modal>
            
            <Modal isOpen={!!receiptModalSale} onClose={closeReceiptModal} title="Sale Receipt">
                {receiptModalSale && <Receipt sale={receiptModalSale} />}
            </Modal>
        </div>
    );
};

export default SalesPage;
