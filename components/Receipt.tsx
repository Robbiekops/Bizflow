
import React from 'react';
import { Sale } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from './ui/Button';

interface ReceiptProps {
  sale: Sale;
}

const Receipt: React.FC<ReceiptProps> = ({ sale }) => {
  const { getProductById } = useAppContext();

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if(printContent) {
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (WinPrint) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const styles = isDarkMode ? `
              <style>
                body { background-color: #1f2937; color: #f9fafb; font-family: sans-serif; padding: 20px; }
                h2, h3 { color: #d1d5db; }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 8px; border-bottom: 1px solid #4b5563; }
                th { color: #9ca3af; }
                .total { font-weight: bold; font-size: 1.2em; }
              </style>
            ` : `
              <style>
                body { font-family: sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                .total { font-weight: bold; font-size: 1.2em; }
              </style>
            `;
            WinPrint.document.write(styles + printContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
        }
    }
  };

  return (
    <div>
      <div id="receipt-content">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">BizFlow Store</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sale Receipt</p>
        </div>
        <div className="mb-4">
          <p><strong>Sale ID:</strong> {sale.id.slice(-8)}</p>
          <p><strong>Date:</strong> {new Date(sale.dateTime).toLocaleString()}</p>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="py-2">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map(item => {
              const product = getProductById(item.productId);
              return (
                <tr key={item.productId}>
                  <td className="py-2">{product?.name || 'Unknown Product'}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.priceAtSale.toFixed(2)}</td>
                  <td className="text-right">${(item.quantity * item.priceAtSale).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 text-right">
          <p className="text-lg font-bold total">Total: ${sale.totalAmount.toFixed(2)}</p>
        </div>
        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            <p>Thank you for your business!</p>
        </div>
      </div>
       <div className="mt-6 flex justify-end">
         <Button onClick={handlePrint}>Print Receipt</Button>
       </div>
    </div>
  );
};

export default Receipt;
