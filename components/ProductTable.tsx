import React from 'react';
import { Product, AppSettings } from '../types';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, AlertTriangle, Eye } from 'lucide-react';
import { translations } from '../utils/translations';

const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Noise Cancelling Headphones', sku: 'K&R-001', category: 'Electronics', price: 299, sales: 1240, stock: 45, rating: 4.8, trend: 'up', image: 'https://picsum.photos/50/50?random=1', lostRevenue: 0, visibility: 95 },
  { id: '2', name: 'Ergonomic Office Chair', sku: 'K&R-002', category: 'Furniture', price: 189, sales: 850, stock: 2, rating: 4.5, trend: 'up', image: 'https://picsum.photos/50/50?random=2', lostRevenue: 2400, visibility: 88 },
  { id: '3', name: 'Organic Face Serum', sku: 'K&R-003', category: 'Beauty', price: 45, sales: 3200, stock: 150, rating: 4.9, trend: 'flat', image: 'https://picsum.photos/50/50?random=3', lostRevenue: 0, visibility: 92 },
  { id: '4', name: 'Smart Yoga Mat', sku: 'K&R-004', category: 'Sports', price: 89, sales: 430, stock: 0, rating: 4.2, trend: 'down', image: 'https://picsum.photos/50/50?random=4', lostRevenue: 4500, visibility: 45 },
  { id: '5', name: 'Mechanical Keyboard RGB', sku: 'K&R-005', category: 'Electronics', price: 120, sales: 980, stock: 8, rating: 4.7, trend: 'up', image: 'https://picsum.photos/50/50?random=5', lostRevenue: 120, visibility: 78 },
];

const ProductTable: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('prod.title')}</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400">{t('prod.subtitle')}</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors">
              {t('prod.filter')}
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
              {t('prod.export')}
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">{t('prod.col_info')}</th>
              <th className="p-4 text-right">{t('prod.col_price')}</th>
              <th className="p-4 text-right">{t('prod.col_sales')}</th>
              <th className="p-4 text-right text-red-500 dark:text-red-400">{t('prod.col_lost')}</th>
              <th className="p-4 text-center">{t('prod.col_vis')}</th>
              <th className="p-4 text-center">{t('prod.col_stock')}</th>
              <th className="p-4 text-center">{t('prod.col_trend')}</th>
              <th className="p-4 text-right">{t('prod.col_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-300 font-bold">
                        {product.rating}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors cursor-pointer">{product.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                        <span>{product.sku}</span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right text-slate-800 dark:text-slate-200 font-medium">${product.price}</td>
                <td className="p-4 text-right text-slate-800 dark:text-slate-200 font-bold">{product.sales}</td>
                <td className="p-4 text-right">
                  {product.lostRevenue > 0 ? (
                    <div className="flex items-center justify-end gap-1 text-red-500 dark:text-red-400 font-medium">
                       <AlertTriangle size={12} />
                       ${product.lostRevenue}
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">-</span>
                  )}
                </td>
                <td className="p-4 text-center">
                   <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-300">
                      <Eye size={14} className={product.visibility > 80 ? 'text-green-500 dark:text-green-400' : 'text-yellow-500 dark:text-yellow-400'} />
                      <span className="text-xs">{product.visibility}%</span>
                   </div>
                   <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${product.visibility > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${product.visibility}%`}}></div>
                   </div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                    product.stock < 10 
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                      : product.stock < 50
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                        : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                  }`}>
                    {product.stock} {t('prod.units')}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {product.trend === 'up' && <div className="p-1 bg-green-500/10 rounded-lg inline-block"><ArrowUpRight size={16} className="text-green-600 dark:text-green-400" /></div>}
                  {product.trend === 'down' && <div className="p-1 bg-red-500/10 rounded-lg inline-block"><ArrowDownRight size={16} className="text-red-600 dark:text-red-400" /></div>}
                  {product.trend === 'flat' && <span className="text-slate-400 dark:text-slate-500 text-lg">−</span>}
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
         <span>{t('prod.showing')}</span>
         <div className="flex gap-1">
            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">Prev</button>
            <button className="px-3 py-1 bg-indigo-600 rounded text-white">1</button>
            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">2</button>
            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">3</button>
            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">Next</button>
         </div>
      </div>
    </div>
  );
};

export default ProductTable;