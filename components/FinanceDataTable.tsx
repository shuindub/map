
import React, { useState } from 'react';
import { Download, SlidersHorizontal, ChevronRight, ChevronLeft, Search, Filter, X } from 'lucide-react';
import { AppSettings, FinanceRow } from '../types';
import { translations } from '../utils/translations';

interface FinanceDataTableProps {
  data: FinanceRow[];
  settings: AppSettings;
}

const FinanceDataTable: React.FC<FinanceDataTableProps> = ({ data, settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat(settings.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredData = data.filter(row => row.date.includes(searchTerm));

  return (
    <div className="flex gap-6 h-[600px] relative">
      {/* Main Table Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder={t('fin.search')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
             />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isFilterOpen 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{t('fin.settings')}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-slate-50 dark:bg-[#0b1120] text-xs uppercase font-bold text-slate-500 dark:text-slate-400 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 min-w-[100px]">{t('fin.col_date')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">{t('fin.col_sales')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">{t('fin.col_returns')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right text-red-500">{t('fin.col_expenses')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">{t('fin.col_comm')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">{t('fin.col_log')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">{t('fin.col_mark')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right font-bold text-slate-800 dark:text-white">{t('fin.col_profit')}</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">{t('fin.col_margin')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-indigo-900/10 transition-colors group">
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{row.date}</td>
                  <td className="p-4 text-right font-medium text-indigo-600 dark:text-indigo-400">{formatMoney(row.sales)}</td>
                  <td className="p-4 text-right text-slate-500">{formatMoney(row.returns)}</td>
                  <td className="p-4 text-right text-red-500 font-medium">{formatMoney(row.expenses)}</td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">{formatMoney(row.commission)}</td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">{formatMoney(row.logistics)}</td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">{formatMoney(row.marketing)}</td>
                  <td className="p-4 text-right font-bold text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10">{formatMoney(row.profit)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.margin > 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {row.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Filter Panel */}
      <div className={`bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-xl absolute right-0 top-0 h-full transition-all duration-300 transform z-20 ${isFilterOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0 opacity-0'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
           <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <Filter size={16} /> Filters
           </h3>
           <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600">
             <X size={20} />
           </button>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
           <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Visible Columns</h4>
              <div className="space-y-2">
                 {['Sales', 'Returns', 'Expenses', 'Commission', 'Logistics', 'Marketing', 'Profit', 'Margin'].map(col => (
                   <label key={col} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      {col}
                   </label>
                 ))}
              </div>
           </div>
           
           <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Value Filters</h4>
              <div className="space-y-3">
                 <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Margin Less Than</label>
                    <input type="number" placeholder="20" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-sm" />
                 </div>
                 <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Profit Greater Than</label>
                    <input type="number" placeholder="10000" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-sm" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDataTable;
