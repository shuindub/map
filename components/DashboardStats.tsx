import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ComposedChart
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, AlertTriangle, Eye } from 'lucide-react';
import { SalesMetric, AppSettings } from '../types';
import { translations } from '../utils/translations';

// Enhanced Mock Data including Lost Revenue
const data: SalesMetric[] = [
  { date: '01 Nov', revenue: 4000, orders: 240, avgCheck: 16.6, lostRevenue: 1200 },
  { date: '02 Nov', revenue: 3000, orders: 139, avgCheck: 21.5, lostRevenue: 2800 },
  { date: '03 Nov', revenue: 5000, orders: 980, avgCheck: 2.0, lostRevenue: 500 },
  { date: '04 Nov', revenue: 2780, orders: 390, avgCheck: 7.1, lostRevenue: 1500 },
  { date: '05 Nov', revenue: 4890, orders: 480, avgCheck: 3.9, lostRevenue: 200 },
  { date: '06 Nov', revenue: 2390, orders: 380, avgCheck: 6.2, lostRevenue: 1800 },
  { date: '07 Nov', revenue: 3490, orders: 430, avgCheck: 8.1, lostRevenue: 1100 },
  { date: '08 Nov', revenue: 6490, orders: 630, avgCheck: 10.3, lostRevenue: 300 },
  { date: '09 Nov', revenue: 5490, orders: 530, avgCheck: 10.3, lostRevenue: 450 },
  { date: '10 Nov', revenue: 7200, orders: 710, avgCheck: 10.1, lostRevenue: 100 },
];

const categoryData = [
  { name: 'Electronics', sales: 42000, potential: 12000 },
  { name: 'Fashion', sales: 38000, potential: 8000 },
  { name: 'Home', sales: 25000, potential: 15000 },
  { name: 'Beauty', sales: 21000, potential: 3000 },
  { name: 'Sports', sales: 18000, potential: 6000 },
];

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  subValue?: string;
  change: number; 
  icon: React.ElementType;
  color?: string;
  settings: AppSettings;
}> = ({ title, value, subValue, change, icon: Icon, color = 'indigo', settings }) => (
  <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm dark:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-lg bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Date Range & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
           <span className="text-sm text-slate-500 dark:text-slate-400">{t('dash.period')}</span>
           <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
             <option>Last 30 Days</option>
             <option>Last 7 Days</option>
             <option>Yesterday</option>
           </select>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">{t('dash.update')}</button>
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">{t('dash.export')}</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard settings={settings} title={t('dash.revenue')} value="$44,680" subValue="+12k" change={12.5} icon={DollarSign} color="indigo" />
        <StatCard settings={settings} title={t('dash.lost_revenue')} value="$8,390" subValue="Stockouts" change={-5.4} icon={AlertTriangle} color="red" />
        <StatCard settings={settings} title={t('dash.orders')} value="1,842" change={8.2} icon={ShoppingCart} color="blue" />
        <StatCard settings={settings} title={t('dash.avg_check')} value="$24.15" change={2.1} icon={Package} color="emerald" />
        <StatCard settings={settings} title={t('dash.visibility')} value="84%" subValue="Top 100" change={4.5} icon={Eye} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm dark:shadow-lg">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('dash.chart_title')}</h3>
             <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> {t('dash.revenue')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-400"></div> {t('dash.lost_revenue')}</div>
             </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis dataKey="date" stroke={isDark ? "#94a3b8" : "#64748b"} tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    color: isDark ? '#f8fafc' : '#0f172a', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Bar dataKey="lostRevenue" barSize={20} fill="#ef4444" opacity={isDark ? 0.5 : 0.7} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Potential */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm dark:shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t('dash.cat_potential')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t('dash.cat_desc')}</p>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} horizontal={false} />
                <XAxis type="number" stroke={isDark ? "#94a3b8" : "#64748b"} tick={{fontSize: 10}} hide />
                <YAxis dataKey="name" type="category" stroke={isDark ? "#94a3b8" : "#64748b"} tick={{fontSize: 12, fontWeight: 500}} width={80} />
                <Tooltip 
                  cursor={{fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.2}} 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    color: isDark ? '#f8fafc' : '#0f172a', 
                    borderRadius: '8px' 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar name={t('dash.revenue')} dataKey="sales" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar name={t('dash.lost_revenue')} dataKey="potential" stackId="a" fill={isDark ? "#334155" : "#cbd5e1"} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;