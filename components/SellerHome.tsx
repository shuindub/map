
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, ChevronDown, MapPin, Search, ArrowUpRight, Zap, PlayCircle, 
  HelpCircle, MoreHorizontal, X 
} from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/translations';

// Mock Data for Dynamics
const dynamicsData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  orders: Math.floor(Math.random() * 5000) + 1000,
  stock: Math.floor(Math.random() * 2000) + 4000,
}));

const SellerHome: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';

  // Modal State
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);

  // Format Helpers
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat(settings.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      
      {/* 1. Banners Section */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Banner 1: Academy */}
        <div className="min-w-[300px] md:min-w-[340px] p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-indigo-50 dark:from-indigo-900/20 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 block">Academy</span>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1 leading-tight">{t('home.banner_academy')}</h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                 <PlayCircle size={10} /> MPSTATS
               </span>
               <span className="text-xs text-slate-500">{t('home.banner_academy_sub')}</span>
            </div>
          </div>
        </div>

        {/* Banner 2: Free Report */}
        <div className="min-w-[300px] md:min-w-[340px] p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all">
           <div className="relative z-10">
              <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mb-2">New</span>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('home.banner_report')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('home.banner_report_sub')}</p>
           </div>
        </div>

        {/* Banner 3: Expo */}
        <div className="min-w-[300px] md:min-w-[340px] p-6 rounded-2xl bg-slate-900 text-white shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-lg mb-1">{t('home.banner_expo')}</h3>
               <p className="text-xs text-slate-400">{t('home.banner_expo_sub')}</p>
            </div>
            <div className="text-2xl font-bold text-green-400">2 999 ₽</div>
        </div>
      </div>

      {/* 2. Top Controls (Date & SKU Search) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white">All</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">WB</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">OZ</button>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <select className="pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                  <option>05.06.2025 - 02.12.2025</option>
                  <option>Last 30 Days</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input type="text" placeholder="Search by SKU" className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
            </div>
         </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Column: Chart & Financial Summary */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamics Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-white">{t('home.dynamics_title')}</h3>
                  <div className="flex gap-4 text-xs">
                     <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer hover:opacity-80">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> {t('home.orders')}
                     </div>
                     <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer hover:opacity-80">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> {t('home.stock')}
                     </div>
                  </div>
               </div>
               <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={dynamicsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
                        <XAxis dataKey="day" stroke={isDark ? "#94a3b8" : "#cbd5e1"} tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                        <YAxis stroke={isDark ? "#94a3b8" : "#cbd5e1"} tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                        <Area type="monotone" dataKey="stock" stroke={isDark ? "#64748b" : "#cbd5e1"} strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t('home.financial_summary')}</h3>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium mb-1">{t('dash.revenue')}</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">912,00 ₽</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium mb-1">{t('home.profit')}</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">-3 929,00 ₽</p>
                  </div>
               </div>
               
               <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-slate-600 dark:text-slate-300">{t('home.deductions')}</span>
                     </div>
                     <span className="font-medium text-slate-800 dark:text-white">4 841,00 ₽</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span className="text-slate-600 dark:text-slate-300">{t('home.promotion')}</span>
                     </div>
                     <span className="font-medium text-slate-800 dark:text-white">0,00 ₽</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-slate-600 dark:text-slate-300">{t('home.profit')}</span>
                     </div>
                     <span className="font-medium text-slate-800 dark:text-white">-3 929,00 ₽</span>
                  </div>
               </div>
               
               {/* Progress Bar */}
               <div className="mt-4 flex h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <div className="h-full bg-purple-500" style={{ width: '55%' }}></div>
                  <div className="h-full bg-yellow-400" style={{ width: '0%' }}></div>
                  <div className="h-full bg-red-500" style={{ width: '45%' }}></div>
               </div>
            </div>

         </div>

         {/* Right Column: Recommendations */}
         <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white px-1 flex items-center gap-2">
               {t('home.recommendations')} 
               <HelpCircle size={14} className="text-slate-400" />
            </h3>
            
            {/* Rec Card 1 */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm leading-tight pr-4">{t('home.rec_supply')}</h4>
                  <MapPin size={16} className="text-blue-500 flex-shrink-0" />
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('home.rec_supply_desc')}</p>
               <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">View Geo-Analytics</span>
            </div>

            {/* Rec Card 2 */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm leading-tight pr-4">{t('home.rec_auto')}</h4>
                  <Zap size={16} className="text-yellow-500 flex-shrink-0" />
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('home.rec_auto_desc')}</p>
               <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">Configure Repricer</span>
            </div>
            
            {/* Promo Card */}
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="font-bold text-sm mb-2">Increase sales by 40%</h4>
                   <p className="text-xs text-indigo-100 mb-4">Sellers using auto-advertising automation see 40% more sales.</p>
                   <button className="bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Setup Now</button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20">
                   <Zap size={80} />
                </div>
             </div>
         </div>

      </div>

      {/* 4. Business Economy (Full Width) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t('home.economy_title')}</h3>
             <select className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-slate-600 dark:text-slate-300">
                <option>Comparison: Previous Period</option>
             </select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sales Column */}
            <div>
               <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-slate-800 dark:text-white">{t('home.sales')}</span>
                  <span className="text-xs text-slate-400">100%</span>
               </div>
               <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">74 883 ₽</span>
                  <span className="text-xs text-green-500 font-medium flex items-center"><ArrowUpRight size={10} /> 74 883 ₽</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '100%'}}></div>
               </div>
               
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-500 dark:text-slate-400">Revenue</span>
                     <span className="font-medium text-slate-800 dark:text-slate-200">80 637 ₽</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-500 dark:text-slate-400">Partner Programs</span>
                     <span className="font-medium text-slate-800 dark:text-slate-200">0 ₽</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-500 dark:text-slate-400">Returns</span>
                     <span className="font-medium text-slate-800 dark:text-slate-200 text-red-500">-5 754 ₽</span>
                  </div>
               </div>
            </div>

            {/* Expenses Column */}
            <div>
               <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-slate-800 dark:text-white">{t('home.expenses')}</span>
                  <span className="text-xs text-slate-400">40%</span>
               </div>
               <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">29 857 ₽</span>
                  <span className="text-xs text-green-500 font-medium flex items-center"><ArrowUpRight size={10} /> 29 857 ₽</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  <div className="h-full bg-yellow-400 rounded-full" style={{width: '40%'}}></div>
               </div>

               <div className="space-y-2 text-sm">
                  <div className="flex justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded px-1 -mx-1">
                     <span className="text-slate-500 dark:text-slate-400">{t('home.commission')} Ozon</span>
                     <div className="flex gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">24 052 ₽</span>
                        <span className="text-xs text-slate-400 w-6 text-right">32%</span>
                     </div>
                  </div>
                  <div 
                     className="flex justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded px-1 -mx-1"
                     onClick={() => setShowLogisticsModal(true)}
                  >
                     <span className="text-slate-500 dark:text-slate-400 border-b border-dotted border-slate-400 hover:text-indigo-600 transition-colors">{t('home.logistics')}</span>
                     <div className="flex gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">2 341 ₽</span>
                        <span className="text-xs text-slate-400 w-6 text-right">3%</span>
                     </div>
                  </div>
                  <div className="flex justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded px-1 -mx-1">
                     <span className="text-slate-500 dark:text-slate-400">{t('home.promotion')}</span>
                     <div className="flex gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">1 944 ₽</span>
                        <span className="text-xs text-slate-400 w-6 text-right">3%</span>
                     </div>
                  </div>
                  <div className="flex justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded px-1 -mx-1">
                     <span className="text-slate-500 dark:text-slate-400">{t('home.agents')}</span>
                     <div className="flex gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">1 510 ₽</span>
                        <span className="text-xs text-slate-400 w-6 text-right">2%</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Profit Column */}
            <div>
               <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-slate-800 dark:text-white">{t('home.profit')}</span>
                  <span className="text-xs text-slate-400">60%</span>
               </div>
               <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">45 026 ₽</span>
                  <span className="text-xs text-green-500 font-medium flex items-center"><ArrowUpRight size={10} /> 45 026 ₽</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '60%'}}></div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 mb-1">{t('home.margin')}</p>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-800 dark:text-white">60%</span>
                         <span className="text-[10px] text-green-500">↑ 60%</span>
                      </div>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 mb-1">{t('home.ros')}</p>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-800 dark:text-white">60%</span>
                         <span className="text-[10px] text-green-500">↑ 60%</span>
                      </div>
                   </div>
               </div>
            </div>

         </div>
      </div>

      {/* Logistics Modal */}
      {showLogisticsModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('home.logistics')}</h3>
                  <button onClick={() => setShowLogisticsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-1">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white">2 341 ₽</span>
                     <span className="text-sm text-red-500 font-medium">↑ 2 341 ₽</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-6">
                     <span>Total</span>
                     <span>8% of Sales</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 mb-6 flex overflow-hidden">
                     <div className="h-full bg-blue-500" style={{ width: '82%' }}></div>
                     <div className="h-full bg-purple-500" style={{ width: '10%' }}></div>
                     <div className="h-full bg-indigo-500" style={{ width: '8%' }}></div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                           <span className="text-sm text-slate-600 dark:text-slate-300">{t('home.logistics')}</span>
                        </div>
                        <div className="flex gap-4">
                           <span className="font-bold text-slate-800 dark:text-white">1 914 ₽</span>
                           <span className="text-sm text-slate-400 w-8 text-right">82%</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                           <span className="text-sm text-slate-600 dark:text-slate-300">{t('home.other_exp')}</span>
                        </div>
                        <div className="flex gap-4">
                           <span className="font-bold text-slate-800 dark:text-white">245 ₽</span>
                           <span className="text-sm text-slate-400 w-8 text-right">10%</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                           <span className="text-sm text-slate-600 dark:text-slate-300">{t('home.reverse_logistics')}</span>
                        </div>
                        <div className="flex gap-4">
                           <span className="font-bold text-slate-800 dark:text-white">182 ₽</span>
                           <span className="text-sm text-slate-400 w-8 text-right">8%</span>
                        </div>
                     </div>
                  </div>
                  
                  <button 
                     onClick={() => setShowLogisticsModal(false)}
                     className="w-full mt-8 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                     {t('home.close')}
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default SellerHome;
