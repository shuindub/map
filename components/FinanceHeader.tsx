
import React from 'react';
import { Calendar, ChevronDown, Plus, DollarSign, PieChart, TrendingUp, ShoppingBag } from 'lucide-react';
import { AppSettings, FinanceSummary } from '../types';
import { translations } from '../utils/translations';

interface FinanceHeaderProps {
  summary: FinanceSummary;
  settings: AppSettings;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ summary, settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat(settings.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(val);
  };

  const SummaryCard = ({ title, value, color, icon: Icon, subValue }: { title: string, value: string, color: string, icon: any, subValue?: string }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between group hover:border-indigo-400 transition-all">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</h4>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subValue && <p className="text-xs font-medium mt-1 text-slate-500">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {t('fin.title')}
          <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">WB API</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* Date Picker Mock */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
             <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white">30 Days</button>
             <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">Week</button>
             <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">Yesterday</button>
             <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
             <button className="flex items-center gap-2 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-500">
               <Calendar size={14} />
               <span>Custom</span>
             </button>
          </div>

          <button className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
             <Plus size={16} />
             <span className="hidden sm:inline">{t('fin.add_expense')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title={t('fin.sales')} 
          value={formatMoney(summary.totalSales)} 
          color="blue" 
          icon={ShoppingBag} 
        />
        <SummaryCard 
          title={t('fin.expenses')} 
          value={formatMoney(summary.totalExpenses)} 
          color="red" 
          icon={DollarSign} 
        />
        <SummaryCard 
          title={t('fin.profit')} 
          value={formatMoney(summary.totalProfit)} 
          color="green" 
          icon={TrendingUp} 
        />
        <SummaryCard 
          title={t('fin.margin')} 
          value={`${summary.avgMargin}%`} 
          subValue="Weighted Avg"
          color="purple" 
          icon={PieChart} 
        />
      </div>
    </div>
  );
};

export default FinanceHeader;
