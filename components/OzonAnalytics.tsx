
import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  ArrowUp, ArrowDown, Download, HelpCircle, RefreshCcw, ExternalLink, Filter, Search, ChevronRight, Settings
} from 'lucide-react';
import { AppSettings, OzonCategory } from '../types';
import { translations } from '../utils/translations';
import * as OzonService from '../services/ozonService';

// MPStats-inspired colors
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];

const OzonAnalytics: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';

  // State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OzonCategory[]>([]);
  const [filteredData, setFilteredData] = useState<OzonCategory[]>([]);
  const [chartSales, setChartSales] = useState<OzonService.ChartData[]>([]);
  const [chartRevenue, setChartRevenue] = useState<OzonService.ChartData[]>([]);
  
  // Table State
  const [sortField, setSortField] = useState<keyof OzonCategory>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Formatting
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat(settings.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB', // Always RUB for Ozon usually, or toggleable
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat(settings.language === 'ru' ? 'ru-RU' : 'en-US').format(val);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const rawData = await OzonService.fetchCategories(settings.language);
      setData(rawData);
      setFilteredData(rawData);
      setChartSales(OzonService.fetchSalesChart(rawData));
      setChartRevenue(OzonService.fetchRevenueChart(rawData));
      setLoading(false);
    };
    loadData();
  }, [settings.language]);

  // Handle Sort
  const handleSort = (field: keyof OzonCategory) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Handle Filter & Search
  useEffect(() => {
    let res = [...data];
    if (searchTerm) {
      res = res.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Sort
    res.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(res);
    // Update charts based on filtered data? MPStats does this.
    setChartSales(OzonService.fetchSalesChart(res));
    setChartRevenue(OzonService.fetchRevenueChart(res));
    setCurrentPage(1);
  }, [data, searchTerm, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Totals for footer
  const totalRevenue = filteredData.reduce((acc, item) => acc + item.revenue, 0);
  const totalSales = filteredData.reduce((acc, item) => acc + item.sales, 0);

  // --- Render Helpers ---

  const SortIcon = ({ field }: { field: keyof OzonCategory }) => {
    if (sortField !== field) return <div className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-30"><ArrowDown size={12} /></div>;
    return sortOrder === 'asc' 
      ? <ArrowUp size={12} className="ml-1 text-indigo-500" /> 
      : <ArrowDown size={12} className="ml-1 text-indigo-500" />;
  };

  const Th = ({ field, label, align = 'right' }: { field: keyof OzonCategory, label: string, align?: 'left'|'right'|'center' }) => (
    <th 
      onClick={() => handleSort(field)}
      className={`p-3 text-${align} text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-700 select-none border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0 whitespace-nowrap`}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Home</span>
              <ChevronRight size={10} />
              <span>External Analytics</span>
              <ChevronRight size={10} />
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Ozon</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             {t('ozon.title')}
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">BETA</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('ozon.subtitle')}</p>
        </div>
        
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-sm font-medium border border-slate-200 dark:border-slate-600 transition-colors">
              <HelpCircle size={16} />
              {t('ozon.guide')}
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-sm font-medium border border-indigo-200 dark:border-indigo-800 transition-colors">
              <RefreshCcw size={16} />
              {t('ozon.currency')}
           </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">{t('ozon.chart_sales')}</h3>
          <div className="flex-1 h-64 w-full">
            {loading ? (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-700/50 animate-pulse rounded-full opacity-20"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartSales}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatNumber(value)}
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                  />
                  <Legend 
                     layout="vertical" 
                     verticalAlign="middle" 
                     align="right"
                     iconType="circle"
                     formatter={(value, entry: any) => <span className="text-slate-600 dark:text-slate-400 text-xs ml-1">{value}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">{t('ozon.chart_rev')}</h3>
          <div className="flex-1 h-64 w-full">
            {loading ? (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-700/50 animate-pulse rounded-full opacity-20"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartRevenue}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatMoney(value)}
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                  />
                  <Legend 
                     layout="vertical" 
                     verticalAlign="middle" 
                     align="right"
                     iconType="circle"
                     formatter={(value, entry: any) => <span className="text-slate-600 dark:text-slate-400 text-xs ml-1">{value}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center bg-slate-50 dark:bg-slate-900/50">
           <div className="flex items-center gap-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder={t('prod.filter')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
           </div>
           
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                <Filter size={16} />
                <span>Columns</span>
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 shadow-md shadow-indigo-500/20">
                <Download size={16} />
                <span>CSV</span>
             </button>
           </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto relative">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
                <Th field="name" label={t('ozon.col_cat')} align="left" />
                <Th field="rating" label={t('ozon.col_rating')} align="center" />
                <Th field="reviews" label={t('ozon.col_reviews')} />
                <Th field="sales" label={t('ozon.col_sales')} />
                <Th field="revenue" label={t('ozon.col_revenue')} />
                <Th field="avg_price" label={t('ozon.col_price')} />
                <Th field="sku" label={t('ozon.col_sku')} />
                <Th field="sku_sold" label={t('ozon.col_sku_sold')} />
                <Th field="sku_sold_pct" label={t('ozon.col_sku_pct')} align="center" />
                <Th field="avg_sales_per_item" label={t('ozon.col_avg_sales')} />
                <Th field="sellers" label={t('ozon.col_sellers')} />
                <Th field="sellers_with_sales" label={t('ozon.col_sellers_sold')} />
                <th className="p-3 bg-slate-50 dark:bg-[#0b1120] border-b border-l border-slate-200 dark:border-slate-700 text-center sticky right-0 z-20 w-16">
                   <Settings size={14} className="mx-auto text-slate-400" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                 // Skeleton Rows
                 [...Array(5)].map((_, i) => (
                   <tr key={i} className="animate-pulse">
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div></td>
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-10 mx-auto"></div></td>
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 ml-auto"></div></td>
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 ml-auto"></div></td>
                     <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                     <td className="p-4" colSpan={6}></td>
                     <td className="p-4"></td>
                   </tr>
                 ))
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-indigo-900/10 transition-colors group">
                    <td className="p-3 border-r border-slate-100 dark:border-slate-800 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer flex items-center gap-2">
                       <span className="truncate max-w-[200px]" title={row.name}>{row.name}</span>
                       <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                    </td>
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <span className={`px-1.5 py-0.5 rounded ${row.rating > 4.5 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                        {row.rating}
                      </span>
                    </td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatNumber(row.reviews)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">{formatNumber(row.sales)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white">{formatMoney(row.revenue)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatMoney(row.avg_price)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatNumber(row.sku)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatNumber(row.sku_sold)}</td>
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col items-center">
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{row.sku_sold_pct}%</span>
                         <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${Math.min(row.sku_sold_pct, 100)}%` }}></div>
                         </div>
                      </div>
                    </td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{row.avg_sales_per_item}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatNumber(row.sellers)}</td>
                    <td className="p-3 text-right border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{formatNumber(row.sellers_with_sales)}</td>
                    <td className="p-3 text-center sticky right-0 bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-indigo-900/10 border-l border-slate-200 dark:border-slate-700 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                       <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-indigo-600">
                         <ExternalLink size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Totals Footer */}
            {!loading && (
              <tfoot className="bg-slate-100 dark:bg-slate-900 border-t-2 border-slate-300 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase">
                 <tr>
                    <td className="p-3">TOTAL</td>
                    <td className="p-3 text-center">-</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right">{formatNumber(totalSales)}</td>
                    <td className="p-3 text-right">{formatMoney(totalRevenue)}</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right">{formatNumber(filteredData.reduce((a,b) => a+b.sku, 0))}</td>
                    <td className="p-3" colSpan={6}></td>
                 </tr>
              </tfoot>
            )}
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
           <div>{t('prod.showing').replace('1-5', `${(currentPage-1)*itemsPerPage + 1}-${Math.min(currentPage*itemsPerPage, filteredData.length)}`).replace('124', filteredData.length.toString())}</div>
           <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OzonAnalytics;
