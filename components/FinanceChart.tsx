
import React from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { AppSettings, FinanceRow } from '../types';
import { translations } from '../utils/translations';

interface FinanceChartProps {
  data: FinanceRow[];
  settings: AppSettings;
}

const FinanceChart: React.FC<FinanceChartProps> = ({ data, settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('fin.chart_title')}</h3>
        <div className="flex gap-2">
           {/* Mock Metric Toggles */}
           <span className="flex items-center gap-1 text-xs text-slate-500">
             <span className="w-3 h-3 bg-indigo-500 rounded-full"></span> {t('fin.sales')}
           </span>
           <span className="flex items-center gap-1 text-xs text-slate-500">
             <span className="w-3 h-3 bg-red-400 rounded-full"></span> {t('fin.expenses')}
           </span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? "#94a3b8" : "#64748b"} 
              tickLine={false} 
              axisLine={false} 
              tick={{fontSize: 12}}
              tickFormatter={(val) => val.split('-').slice(1).join('/')}
            />
            <YAxis 
              yAxisId="left" 
              stroke={isDark ? "#94a3b8" : "#64748b"} 
              tickLine={false} 
              axisLine={false} 
              tick={{fontSize: 12}} 
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke={isDark ? "#94a3b8" : "#64748b"} 
              tickLine={false} 
              axisLine={false} 
              tick={{fontSize: 12}} 
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#0f172a' : '#fff', 
                borderColor: isDark ? '#334155' : '#e2e8f0', 
                borderRadius: '8px',
                fontSize: '12px',
                color: isDark ? '#fff' : '#000'
              }} 
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar yAxisId="right" dataKey="expenses" name={t('fin.expenses')} barSize={20} fill="#f87171" radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="sales" name={t('fin.sales')} stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
            <Line yAxisId="left" type="monotone" dataKey="profit" name={t('fin.profit')} stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
