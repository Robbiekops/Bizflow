
import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { Sale, SaleItem } from '../../types';

const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <Card>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
    </Card>
);

const DashboardPage: React.FC = () => {
    const { state } = useAppContext();
    const { products, sales } = state;

    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const filterSalesByDate = (sales: Sale[], startDate: Date) => sales.filter(sale => new Date(sale.dateTime) >= startDate);

        const salesToday = filterSalesByDate(sales, today);
        const salesThisWeek = filterSalesByDate(sales, startOfWeek);
        const salesThisMonth = filterSalesByDate(sales, startOfMonth);

        const totalSales = (sales: Sale[]) => sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        const totalInventoryValue = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        
        const lowStockItems = products.filter(p => p.quantity <= p.reorderLevel).sort((a,b) => a.quantity - b.quantity);
        
        const salesByProduct = sales.reduce((acc, sale) => {
            sale.items.forEach((item: SaleItem) => {
                acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
            });
            return acc;
        }, {} as Record<string, number>);

        const topSellingProducts = Object.entries(salesByProduct)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, 5)
            .map(([productId, quantity]) => ({
                product: products.find(p => p.id === productId),
                quantity,
            }));

        return {
            salesToday: totalSales(salesToday),
            salesThisWeek: totalSales(salesThisWeek),
            salesThisMonth: totalSales(salesThisMonth),
            totalInventoryValue,
            lowStockItems,
            topSellingProducts
        };
    }, [products, sales]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard title="Sales Today" value={`$${stats.salesToday.toFixed(2)}`} />
                <StatCard title="Sales This Week" value={`$${stats.salesThisWeek.toFixed(2)}`} />
                <StatCard title="Sales This Month" value={`$${stats.salesThisMonth.toFixed(2)}`} />
            </div>

            <div className="col-span-1">
                 <StatCard title="Total Inventory Value" value={`$${stats.totalInventoryValue.toFixed(2)}`} />
            </div>
             <div className="col-span-1">
                <StatCard title="Low Stock Items" value={stats.lowStockItems.length.toString()} subtext="Items at or below reorder level"/>
            </div>
             <div className="col-span-1">
                <StatCard title="Products" value={products.length.toString()} subtext="Total distinct products"/>
            </div>

            <Card title="Low on Stock" className="col-span-1 md:col-span-2 lg:col-span-3">
                {stats.lowStockItems.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {stats.lowStockItems.slice(0, 5).map(product => (
                            <li key={product.id} className="py-2 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                                </div>
                                <span className="text-red-500 font-bold">{product.quantity} left</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No items are low on stock. Well done!</p>
                )}
            </Card>
            
            <Card title="Top Selling Products" className="col-span-1 md:col-span-2 lg:col-span-3">
                {stats.topSellingProducts.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {stats.topSellingProducts.map(({ product, quantity }) => product && (
                            <li key={product.id} className="py-2 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                                </div>
                                <span className="font-bold">{quantity} sold</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No sales recorded yet.</p>
                )}
            </Card>

        </div>
    );
};

export default DashboardPage;
