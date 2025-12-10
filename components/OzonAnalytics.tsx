

import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, 
  ComposedChart, Line, Legend, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Package, Calculator, Database, 
  Search, Filter, ChevronDown, Download, Calendar, 
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle, XCircle,
  Table as TableIcon, PieChart as PieChartIcon, FileText, ArrowRight, Eye, List, FileSpreadsheet
} from 'lucide-react';
import { AppSettings, OzonProductExtended, OzonPnLItem, OzonTransaction, OzonUnitEconRow, OzonBaseRow, OzonDashboardData } from '../types';
import { translations } from '../utils/translations';
import * as OzonService from '../services/ozonService';

// --- COLUMN DEFINITIONS FOR SOURCES TABS ---
const SOURCE_COLUMNS: Record<string, string[]> = {
  prices: [
    'Артикул', 'Ozon SKU ID', 'Название', 'Статус', 'Видимость на OZON', 'На складе Ozon', 'На моих складах', 
    'Объем, л', 'Объемный вес, кг', 'Штрихкод', 'Цена до скидки, руб.', 'Текущая цена (со скидкой), руб.', 
    'Скидка, %', 'Скидка, руб.', 'Цена с учетом акции или стратегии, руб.', 'Скидка с учетом акции, %', 
    'Скидка с учетом акции, руб.', 'НДС, %', 'Настройка "Учитывать минимальную цену..."', 
    'Осталось дней действия...', 'Подключение подходящих акций', 'Рыночная цена на Ozon, руб.', 
    'Рыночная цена конкурентов, руб.', 'Моя цена на других площадках, руб.', 'Ссылка на рыночную цену конкурентов', 
    'Ссылка на рыночную цену на мои товары', 'Индекс цен', 'Ценовой индекс товара на Ozon', 
    'Ценовой индекс товара на рынке', 'Ценовой индекс товара на рынке на мои товары', 'Эквайринг', 
    'Вознаграждение Ozon, FBO, %', 'Логистика Ozon, минимум, FBO', 'Логистика Ozon, максимум, FBO', 
    'Последняя миля, FBO', 'Вознаграждение Ozon, FBS, %', 'Обработка отправления, минимум FBS', 
    'Обработка отправления, максимум FBS', 'Логистика Ozon, минимум, FBS', 'Логистика Ozon, максимум, FBS', 
    'Последняя миля, FBS', 'Цена до скидки, руб.', 'Текущая цена (со скидкой), руб.', 'Скидка, %', 'НДС, %', 
    'Себестоимость', 'Стратегия ценообразования...', 'Минимальная цена, руб.', 'Подключать подходящие акции'
  ],
  accruals: [
    'Дата начисления', 'Тип начисления', 'Номер отправления или идентификатор услуги', 'Дата принятия заказа в обработку...', 
    'Склад отгрузки', 'SKU', 'Артикул', 'Название товара или услуги', 'Количество', 'За продажу или возврат до вычета...', 
    'Ставка комиссии', 'Комиссия за продажу', 'Сборка заказа', 'Обработка отправления (Drop-off/Pick-up)', 
    'Магистраль', 'Последняя миля', 'Обратная магистраль', 'Обработка возврата', 
    'Обработка отмененного или невостребованного...', 'Обработка невыкупленного товара', 'Логистика', 
    'Индекс локализации', 'Обратная логистика', 'Итого'
  ],
  returns: [
    'Схема', 'Наименование товара', 'Номер отправления', 'Артикул товара', 'OZON SKU ID', 'Дата оформления заказа', 
    'Дата возврата', 'Статус возврата', 'Дата статуса', 'Причина возврата', 'Комментарий клиента', 
    'Количество возвращаемых товаров', 'Отправление вскрыто', 'Целевое место назначения', 'Переход в "В пункте выдачи"', 
    'Местоположение', 'Дата возврата продавцу', 'Кол-во дней хранения', 'Последний день бесплатного размещения', 
    'Штрихкод возврата', 'Стоимость хранения', 'Стоимость утилизации', 'Стоимость товара', 'Процент комиссии', 
    'Комиссия', 'Цена без комиссии'
  ],
  orders_fbs: [
    'Номер заказа', 'Номер отправления', 'Принят в обработку', 'Дата отгрузки', 'Статус', 'Дата доставки', 
    'Фактическая дата передачи в доставку', 'Сумма отправления', 'Код валюты отправления', 'Наименование товара', 
    'OZON id', 'Артикул', 'Итоговая стоимость товара', 'Код валюты товара', 'Стоимость товара для покупателя', 
    'Код валюты покупателя', 'Количество', 'Стоимость доставки', 'Связанные отправления', 'Выкуп товара', 
    'Цена товара до скидок', 'Скидка %', 'Скидка руб', 'Акции', 'Подъем на этаж', 'Верхний штрихкод', 
    'Нижний штрихкод', 'Кластер отгрузки', 'Кластер доставки', 'Регион доставки', 'Город доставки', 
    'Способ доставки', 'Сегмент клиента', 'Способ оплаты', 'Юридическое лицо', 'Имя покупателя', 'Email покупателя', 
    'Имя получателя', 'Телефон получателя', 'Адрес доставки', 'Индекс', 'Склад отгрузки', 'Перевозчик', 'Название метода'
  ],
  orders_fbo: [
    'Номер заказа', 'Номер отправления', 'Принят в обработку', 'Дата отгрузки', 'Статус', 'Дата доставки', 
    'Фактическая дата передачи в доставку', 'Сумма отправления', 'Код валюты отправления', 'Наименование товара', 
    'OZON id', 'Артикул', 'Итоговая стоимость товара', 'Код валюты товара', 'Стоимость товара для покупателя', 
    'Код валюты покупателя', 'Количество', 'Стоимость доставки', 'Связанные отправления', 'Выкуп товара', 
    'Цена товара до скидок', 'Скидка %', 'Скидка руб', 'Акции', 'Объемный вес товаров, кг', 'Кластер отгрузки', 
    'Кластер доставки', 'Склад отгрузки', 'Регион доставки', 'Город доставки', 'Способ доставки', 
    'Сегмент клиента', 'Юридическое лицо', 'Способ оплаты', 'Штрихкод ювелирного изделия'
  ],
  csv: [
    'Артикул', 'Ozon Product ID', 'SKU', 'Количество товара в кванте', 'Barcode', 'Наименование товара', 
    'Контент-рейтинг', 'Бренд', 'Статус товара', 'Отзывы', 'Рейтинг', 'Видимость на Ozon', 'Причины скрытия', 
    'Дата создания', 'Категория комиссии', 'Объем товара, л', 'Объемный вес, кг', 'Доступно к продаже по схеме FBO, шт.', 
    'Вывезти и нанести КИЗ...', 'Зарезервировано, шт', 'Доступно к продаже по схеме FBS, шт.', 
    'Доступно к продаже по схеме realFBS, шт.', 'Зарезервировано на моих складах, шт', 'Текущая цена с учетом скидки, ₽', 
    'Цена до скидки (перечеркнутая цена), ₽', 'Цена Premium, ₽', 'Рыночная цена, ₽', 
    'Актуальная ссылка на рыночную цену', 'Размер НДС, %'
  ],
  ads: [
    'SKU', 'Тип продвижения', 'ID кампании', 'Расход, ₽, с НДС', 'ДРР, %', 'Продажи, ₽', 'Заказы, шт', 
    'CTR, %', 'Показы', 'Клики', 'Стоимость заказа, ₽', 'Стоимость клика, ₽', 'Корзины', 'Конверсия в корзину, %'
  ],
  writeoff: [
    'Дата', 'Наименование товара', 'SKU', 'Артикул', 'Количество, шт.', 'Утилизация', 'Компенсация, руб.', 
    'Статус компенсации', 'Причина списания', 'Схема', 'Поставка', 'Отправление'
  ]
};

const OzonAnalytics: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const isDark = settings.theme === 'dark';
  const [activeTab, setActiveTab] = useState<'dash' | 'sku' | 'sources' | 'charts' | 'base'>('dash');

  // Sources Sub-Tab State
  const [activeSourceReport, setActiveSourceReport] = useState<string>('prices');
  const [sourceData, setSourceData] = useState<any[]>([]);

  // Data State
  const [pnlData, setPnlData] = useState<OzonPnLItem[]>([]);
  const [dashData, setDashData] = useState<OzonDashboardData | null>(null);
  const [products, setProducts] = useState<OzonProductExtended[]>([]);
  const [transactions, setTransactions] = useState<OzonTransaction[]>([]);
  const [unitEcon, setUnitEcon] = useState<OzonUnitEconRow[]>([]);
  const [baseData, setBaseData] = useState<OzonBaseRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [pnl, dash, prods, txs, ue, base] = await Promise.all([
        OzonService.fetchPnLData(),
        OzonService.fetchDashboardData(),
        OzonService.fetchProducts360(),
        OzonService.fetchTransactions(),
        OzonService.fetchUnitEcon(),
        OzonService.fetchBaseData()
      ]);
      setPnlData(pnl);
      setDashData(dash);
      setProducts(prods);
      setTransactions(txs);
      setUnitEcon(ue);
      setBaseData(base);
      setLoading(false);
    };
    loadData();
  }, []);

  // Fetch Source Report Data when activeSourceReport changes
  useEffect(() => {
    if (activeTab === 'sources') {
      const loadSource = async () => {
        setLoading(true);
        const data = await OzonService.fetchSourceReport(activeSourceReport);
        setSourceData(data);
        setLoading(false);
      };
      loadSource();
    }
  }, [activeTab, activeSourceReport]);

  const formatMoney = (val: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  const formatNum = (val: number) => new Intl.NumberFormat('ru-RU').format(val);
  
  // Helpers for P&L Visualization
  const waterfallData = pnlData.filter(i => i.type !== 'fixed' && i.type !== 'result').map(i => ({
    name: t(i.nameKey).split(' ')[0], // Short name
    value: i.type === 'expense' ? -i.value : i.value,
    fill: i.type === 'income' ? '#6366f1' : '#ef4444'
  }));
  
  // Add Net Profit to Waterfall
  const netProfitItem = pnlData.find(i => i.nameKey === 'pnl.net_profit');
  if (netProfitItem) {
    waterfallData.push({
      name: 'Прибыль',
      value: netProfitItem.value,
      fill: netProfitItem.value > 0 ? '#10b981' : '#f43f5e'
    });
  }

  // --- TABS ---
  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition-all flex-shrink-0 ${
        activeTab === id 
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={16} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6 pb-12 font-sans min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-20 z-30">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <LayoutDashboard size={28} />
               </div>
               <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-none">
                    OZON P&L / Dashboard 
                    <span className="text-sm font-normal text-slate-500 ml-2">(отчёт за февраль 2025)</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                     <CheckCircle size={12} className="text-green-500" /> Данные синхронизированы: 28.02.2025 23:59
                  </p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                 <Download size={16} /> Экспорт Excel
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                 <Filter size={16} /> Фильтры
               </button>
            </div>
         </div>

         {/* NAVIGATION TABS */}
         <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-700">
            <TabButton id="dash" label="P&L + Дашборд" icon={LayoutDashboard} />
            <TabButton id="sku" label="Аналитика SKU" icon={Package} />
            <TabButton id="sources" label="Источники" icon={Database} />
            <TabButton id="charts" label="Исходники Графики" icon={PieChartIcon} />
            <TabButton id="base" label="База" icon={Calculator} />
         </div>
      </div>

      {/* --- TAB CONTENT --- */}
      {loading && activeTab !== 'sources' ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      ) : (
      <>

      {activeTab === 'dash' && dashData && (
        <div className="space-y-6 animate-fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { title: 'ВЫРУЧКА', val: formatMoney(pnlData.find(i=>i.nameKey==='pnl.revenue')?.value || 0), sub: '+12% MoM', color: 'indigo' },
               { title: 'ВАЛОВАЯ ПРИБЫЛЬ', val: formatMoney(pnlData.find(i=>i.nameKey==='pnl.gross_margin')?.value || 0), sub: '31.4% Маржа', color: 'green' },
               { title: 'ЧИСТАЯ ПРИБЫЛЬ', val: formatMoney(pnlData.find(i=>i.nameKey==='pnl.net_profit')?.value || 0), sub: 'ROI 18%', color: (pnlData.find(i=>i.nameKey==='pnl.net_profit')?.value || 0) > 0 ? 'emerald' : 'red' },
               { title: 'ЗАКАЗЫ', val: '1 842', sub: 'ср. чек 1314 ₽', color: 'blue' }
             ].map((kpi, idx) => (
               <div key={idx} className="bg-[#1E293B] dark:bg-[#1E293B] text-white p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${kpi.color}-500`}></div>
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">{kpi.title}</p>
                  <p className="text-3xl font-bold mb-1">{kpi.val}</p>
                  <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">{kpi.sub}</p>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Left: P&L Waterfall */}
             <div className="lg:col-span-8 bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[420px] flex flex-col">
               <h3 className="font-bold text-white mb-6">P&L Waterfall: Структура Финансового Результата</h3>
               <div className="flex-1 min-h-0 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={waterfallData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10}} />
                      <YAxis stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} formatter={(val: number) => formatMoney(val)} />
                      <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                        {waterfallData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
             
             {/* Right: Top Expenses List */}
             <div className="lg:col-span-4 bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col overflow-y-auto h-[420px]">
               <h3 className="font-bold text-white mb-6">Топ Расходов</h3>
               <div className="space-y-5">
                  {pnlData.filter(i => i.type === 'expense').sort((a,b) => b.value - a.value).slice(0, 6).map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300">{t(item.nameKey)}</span>
                        <span className="font-bold">{item.share.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden relative">
                        <div className="h-full rounded-full bg-[#f43f5e]" style={{ width: `${item.share}%` }}></div>
                      </div>
                      <div className="text-right text-xs text-slate-500 mt-1">{formatMoney(item.value)}</div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Sales Movement Waterfall */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[350px]">
                <h3 className="font-bold text-lg mb-4">Продажи - общее движение товара</h3>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={dashData.waterfall_movement}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                      <YAxis stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                      <Bar dataKey="value" barSize={60} radius={[4, 4, 0, 0]}>
                         {dashData.waterfall_movement.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>

             {/* EBITDA Expenses */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[350px]">
                <h3 className="font-bold text-lg mb-4">Расходы по EBITDA</h3>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={dashData.ebitda_expenses} margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 11}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                      <Bar dataKey="value" barSize={15} radius={[0, 4, 4, 0]}>
                         {dashData.ebitda_expenses.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* ABC Analysis */}
             <div className="bg-[#1E293B] text-white p-0 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-800 border-b border-slate-700 grid grid-cols-4 font-bold text-xs text-center">
                   <div>Категория</div>
                   <div>A</div>
                   <div>B</div>
                   <div>C</div>
                </div>
                {['Выручка', 'Прибыль', 'Возвраты'].map((metric, i) => (
                   <div key={metric} className="p-4 border-b border-slate-700 last:border-0">
                      <div className="text-xs uppercase text-slate-400 mb-2 font-bold">{metric}</div>
                      <div className="grid grid-cols-4 text-center text-sm">
                         <div className="text-slate-500 font-bold">{metric}</div>
                         <div className="bg-green-500/10 text-green-400 py-1 rounded">{dashData.abc_analysis[0][metric === 'Выручка' ? 'count' : metric === 'Прибыль' ? 'profit' : 'returns']}</div>
                         <div className="bg-yellow-500/10 text-yellow-400 py-1 rounded">{dashData.abc_analysis[1][metric === 'Выручка' ? 'count' : metric === 'Прибыль' ? 'profit' : 'returns']}</div>
                         <div className="bg-red-500/10 text-red-400 py-1 rounded">{dashData.abc_analysis[2][metric === 'Выручка' ? 'count' : metric === 'Прибыль' ? 'profit' : 'returns']}</div>
                      </div>
                   </div>
                ))}
             </div>

             {/* Category Margins */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Маржа и маржинальность по категориям</h3>
                <div className="h-[250px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={dashData.category_margins} margin={{ left: 40 }}>
                         <XAxis type="number" hide />
                         <YAxis dataKey="category" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 10}} />
                         <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                         <Bar dataKey="margin" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={20}>
                           {dashData.category_margins.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill="#14B8A6" />
                           ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Sales Share Pie */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Доли продаж по категориям</h3>
                <div className="h-[250px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={dashData.sales_share_pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                            {dashData.sales_share_pie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                         </Pie>
                         <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Stock Status */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[300px]">
                <h3 className="font-bold text-lg mb-4">Статус товара на OZON</h3>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={dashData.stock_status} margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="category" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                      <Legend />
                      <Bar dataKey="selling" stackId="a" fill="#14B8A6" name="Продается" />
                      <Bar dataKey="ready" stackId="a" fill="#EAB308" name="Готов к продаже" />
                      <Bar dataKey="not_selling" stackId="a" fill="#F43F5E" name="Не продается" />
                   </BarChart>
                </ResponsiveContainer>
             </div>

             {/* Stock Capitalization */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[300px]">
                <h3 className="font-bold text-lg mb-4">Капитализация склада по себестоимости</h3>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={dashData.stock_capitalization}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="category" stroke="#94a3b8" tick={{fontSize: 10}} />
                      <YAxis stroke="#94a3b8" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                      <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* New Grid Row for Pie Charts and Geography */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Sales by Scheme */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[300px] flex gap-4">
                <div className="flex-1">
                   <h4 className="font-bold text-center mb-2">Продажи по схемам Руб</h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={dashData.scheme_sales_rub} innerRadius={40} outerRadius={60} dataKey="value" nameKey="name">
                            {dashData.scheme_sales_rub.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                         </Pie>
                         <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                         <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-center mb-2">SKU с продажами по схемам ШТ</h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={dashData.scheme_sales_pcs} innerRadius={40} outerRadius={60} dataKey="value" nameKey="name">
                            {dashData.scheme_sales_pcs.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                         </Pie>
                         <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                         <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Geography */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[300px] flex gap-4">
                 <div className="flex-1">
                    <h4 className="font-bold mb-2 text-xs">Кластеры продажи FBS</h4>
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={dashData.geo_fbs} margin={{ left: 40 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="region" type="category" stroke="#94a3b8" width={60} tick={{fontSize: 9}} />
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                          <Bar dataKey="sales" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={10} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold mb-2 text-xs">Кластеры продажи FBO</h4>
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={dashData.geo_fbo} margin={{ left: 40 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="region" type="category" stroke="#94a3b8" width={60} tick={{fontSize: 9}} />
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                          <Bar dataKey="sales" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={10} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
             </div>
          </div>
          
          {/* Bottom Grid for Index & Returns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Localization Index */}
             <div className="bg-[#1E293B] text-white p-0 rounded-2xl border border-slate-700 shadow-sm overflow-hidden h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                   <thead className="bg-slate-800 sticky top-0">
                      <tr>
                         <th className="p-3 text-left">Индекс локализации</th>
                         <th className="p-3 text-center">Коэффициент</th>
                         <th className="p-3 text-right">% К логистике</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700">
                      {dashData.localization_table.map((row, idx) => (
                         <tr key={idx} className="hover:bg-slate-700/50">
                            <td className="p-2 pl-4 text-xs font-mono">{row.range}</td>
                            <td className="p-2 text-center text-xs">{row.coeff}</td>
                            <td className={`p-2 pr-4 text-right text-xs font-bold ${row.percent_logistics > 0 ? 'text-red-400' : 'text-green-400'}`}>
                               {row.percent_logistics > 0 ? '+' : ''}{row.percent_logistics}%
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Returns & Cancellations */}
             <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-700 shadow-sm h-[300px]">
                <h3 className="font-bold text-lg mb-4">Причины отмен и возвратов</h3>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={dashData.return_reasons} margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" hide />
                      <YAxis dataKey="reason" type="category" stroke="#94a3b8" width={120} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                      <Bar dataKey="count" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={15} label={{ position: 'right', fill: '#94a3b8', fontSize: 10 }} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          {/* Ad Efficiency Footer */}
          <div className="bg-black text-white p-4 rounded-t-2xl mt-8">
             <h3 className="text-lg font-bold text-center">Эффективность рекламы</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#1E293B] p-6 rounded-b-2xl border border-slate-700 border-t-0 -mt-6">
              {/* SKU in Ads Donut */}
              <div className="h-[200px]">
                 <h4 className="text-center text-sm font-bold text-slate-300 mb-2">SKU в Рекламной компании, шт</h4>
                 <div className="relative h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={dashData.ad_performance.sku_pie} innerRadius={40} outerRadius={60} dataKey="value">
                              {dashData.ad_performance.sku_pie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                           </Pie>
                           <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                       <div className="text-2xl font-bold">{dashData.ad_performance.total_sku_ad}</div>
                       <div className="text-[10px] text-slate-400">Total</div>
                    </div>
                 </div>
              </div>

              {/* Sales from Ads Bar */}
              <div className="h-[200px]">
                 <h4 className="text-center text-sm font-bold text-slate-300 mb-2">Продажи с рекламы, ДРР (МП)</h4>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashData.ad_performance.sales_drr}>
                       <XAxis dataKey="type" stroke="#94a3b8" tick={{fontSize: 9}} />
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                       <Bar dataKey="sales" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              {/* Ad Spend Share */}
              <div className="h-[200px]">
                 <h4 className="text-center text-sm font-bold text-slate-300 mb-2">Расход на рекламу относительно общих продаж</h4>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={dashData.ad_performance.share_sales} margin={{ left: 60 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="category" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 9}} />
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} formatter={(val: number) => formatMoney(val)} />
                       <Bar dataKey="cost" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={15} label={{ position: 'right', fill: '#94a3b8', fontSize: 10, formatter: (val: number) => formatMoney(val) }} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'sku' && (
        <div className="space-y-6 animate-fade-in w-full overflow-hidden">
           {/* Detailed SKU Table Container */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-full overflow-x-auto">
              <div className="min-w-max">
                <table className="text-left text-sm border-collapse">
                   <thead className="bg-slate-50 dark:bg-[#0b1120] text-xs uppercase text-slate-500 font-bold sticky top-0 z-20 shadow-md">
                      {/* --- HEADER GROUP ROW --- */}
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                         {/* Sticky Group */}
                         <th className="sticky left-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-30" style={{width: '40px'}}></th>
                         <th colSpan={6} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 sticky left-[40px] z-30">Инфо о товаре</th>
                         
                         {/* Scrollable Groups */}
                         <th colSpan={6} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400">Цены / Реализация</th>
                         <th colSpan={5} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">Остатки на складах</th>
                         <th colSpan={7} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">Спрос / Движение</th>
                         <th colSpan={9} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400">Логистика и Комиссии</th>
                         <th colSpan={6} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">Возвраты</th>
                         <th colSpan={7} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400">Результат / P&L</th>
                         <th colSpan={4} className="p-2 text-center bg-slate-100 dark:bg-slate-900">ABC</th>
                      </tr>

                      {/* --- COLUMN HEADER ROW --- */}
                      <tr>
                         {/* Sticky Columns */}
                         <th className="p-3 sticky left-0 bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 text-center w-[40px]">
                           <input type="checkbox" className="rounded border-slate-300" />
                         </th>
                         <th className="p-3 sticky left-[40px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[140px]">Категория Наша</th>
                         <th className="p-3 sticky left-[180px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[100px]">Артикул</th>
                         <th className="p-3 sticky left-[280px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[140px]">Категория OZON</th>
                         <th className="p-3 sticky left-[420px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[120px]">Ozon SKU ID</th>
                         <th className="p-3 sticky left-[540px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[200px]">Название</th>
                         <th className="p-3 sticky left-[740px] bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 min-w-[120px] shadow-xl">Статус</th>

                         {/* Prices */}
                         <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">Реализация</th>
                         <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">РРЦ</th>
                         <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">Цена Пок.</th>
                         <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">Соинвест %</th>
                         <th className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-900/5">Схема</th>
                         <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5 border-r border-slate-200 dark:border-slate-700">Себест. МС</th>

                         {/* Stock */}
                         <th className="p-3 text-right">Остатки шт</th>
                         <th className="p-3 text-right">Ср. Запас</th>
                         <th className="p-3 text-right">Капитал.</th>
                         <th className="p-3 text-right text-red-500">Токсичный</th>
                         <th className="p-3 text-right text-slate-400 border-r border-slate-200 dark:border-slate-700">Мертвый</th>

                         {/* Demand */}
                         <th className="p-3 text-right">Заказ Руб</th>
                         <th className="p-3 text-right">Заказ Шт</th>
                         <th className="p-3 text-right">Факт Руб</th>
                         <th className="p-3 text-right">Факт Шт</th>
                         <th className="p-3 text-right">Ср. Днев.</th>
                         <th className="p-3 text-right text-red-500">OOS Дней</th>
                         <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700">Оборот дн</th>

                         {/* Logistics */}
                         <th className="p-3 text-right font-bold">Итого от МП</th>
                         <th className="p-3 text-right">Комиссия</th>
                         <th className="p-3 text-right">Сборка</th>
                         <th className="p-3 text-right">Эквайринг</th>
                         <th className="p-3 text-right">Посл. миля</th>
                         <th className="p-3 text-right">Логистика</th>
                         <th className="p-3 text-right font-bold">Лог. Итого</th>
                         <th className="p-3 text-right">Индекс лок.</th>
                         <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700">Доля лог. %</th>

                         {/* Returns */}
                         <th className="p-3 text-right">Возвр Шт</th>
                         <th className="p-3 text-right">Отмены Шт</th>
                         <th className="p-3 text-right text-red-500">Убыток Руб</th>
                         <th className="p-3 text-right">Расходы</th>
                         <th className="p-3 text-right">Бой Шт</th>
                         <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700">Бой Руб</th>

                         {/* Result */}
                         <th className="p-3 text-right">Себест. Прод.</th>
                         <th className="p-3 text-right">Расходы МП</th>
                         <th className="p-3 text-center">Продв.</th>
                         <th className="p-3 text-right">Реклама Руб</th>
                         <th className="p-3 text-right text-xs">ДРР %</th>
                         <th className="p-3 text-right font-bold bg-green-50/30 dark:bg-green-900/5">Марж. Приб.</th>
                         <th className="p-3 text-right font-bold border-r border-slate-200 dark:border-slate-700 bg-green-50/30 dark:bg-green-900/5 whitespace-nowrap">Маржа %</th>

                         {/* ABC */}
                         <th className="p-3 text-center">Выр</th>
                         <th className="p-3 text-center">Марж</th>
                         <th className="p-3 text-center">Комп</th>
                         <th className="p-3 text-center">Кат</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.map((row, idx) => (
                         <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 group">
                            {/* Sticky Left Cols */}
                            <td className="p-3 sticky left-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20">
                               <input type="checkbox" className="rounded border-slate-300" />
                            </td>
                            <td className="p-3 sticky left-[40px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">{row.category_our}</td>
                            <td className="p-3 sticky left-[180px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 text-xs font-mono whitespace-nowrap">{row.sku}</td>
                            <td className="p-3 sticky left-[280px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 text-slate-500 whitespace-nowrap">{row.category_ozon}</td>
                            <td className="p-3 sticky left-[420px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 text-xs font-mono whitespace-nowrap">{row.ozon_sku_id}</td>
                            <td className="p-3 sticky left-[540px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 min-w-[200px]">
                               <div className="flex items-center gap-2 w-full">
                                  <img src={row.image} className="w-8 h-8 rounded bg-slate-100 object-cover flex-shrink-0" />
                                  <div className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" title={row.name}>{row.name}</div>
                                </div>
                            </td>
                            <td className="p-3 sticky left-[740px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20 shadow-xl whitespace-nowrap">
                               <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  row.status === 'Готов к продаже' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  row.status === 'Out of stock' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                               }`}>{row.status}</span>
                            </td>

                            {/* Prices */}
                            <td className="p-3 text-right font-medium whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5">{formatNum(row.price_realization)}</td>
                            <td className="p-3 text-right text-slate-400 text-xs strike-through decoration-slate-400 line-through whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5">{formatNum(row.rrp)}</td>
                            <td className="p-3 text-right font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5">{formatNum(row.price_buyer)}</td>
                            <td className="p-3 text-right text-xs whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5">{row.coinvest_percent}%</td>
                            <td className="p-3 text-center bg-indigo-50/10 dark:bg-indigo-900/5"><span className="font-bold text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">{row.sales_scheme}</span></td>
                            <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 font-mono text-slate-500 whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5">{formatNum(row.cost_price)}</td>

                            {/* Stock */}
                            <td className="p-3 text-right font-bold whitespace-nowrap">{row.stock_count}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{row.avg_stock}</td>
                            <td className="p-3 text-right whitespace-nowrap">{formatMoney(row.stock_capitalization)}</td>
                            <td className="p-3 text-right text-red-500 whitespace-nowrap">{row.toxic_stock > 0 ? formatNum(row.toxic_stock) : '-'}</td>
                            <td className="p-3 text-right text-slate-400 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{row.dead_stock > 0 ? formatNum(row.dead_stock) : '-'}</td>

                            {/* Demand */}
                            <td className="p-3 text-right whitespace-nowrap">{formatNum(row.ordered_rub)}</td>
                            <td className="p-3 text-right whitespace-nowrap">{row.ordered_pcs}</td>
                            <td className="p-3 text-right text-green-600 dark:text-green-400 font-medium whitespace-nowrap">{formatNum(row.sales_fact_rub)}</td>
                            <td className="p-3 text-right font-bold whitespace-nowrap">{row.sales_fact_pcs}</td>
                            <td className="p-3 text-right whitespace-nowrap">{row.avg_daily_sales}</td>
                            <td className="p-3 text-right text-red-500 font-bold whitespace-nowrap">{row.days_to_oos > 0 ? row.days_to_oos : ''}</td>
                            <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{row.turnover_days}</td>

                            {/* Logistics */}
                            <td className="p-3 text-right font-bold whitespace-nowrap text-indigo-600 dark:text-indigo-400">{formatNum(row.total_received)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.commission)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.assembly)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.acquiring)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.last_mile)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.logistics)}</td>
                            <td className="p-3 text-right font-bold whitespace-nowrap">{formatNum(row.logistics_total)}</td>
                            <td className="p-3 text-right whitespace-nowrap">{row.localization_index}</td>
                            <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{row.logistics_share_percent}%</td>

                            {/* Returns */}
                            <td className="p-3 text-right whitespace-nowrap">{row.returns_pcs}</td>
                            <td className="p-3 text-right whitespace-nowrap">{row.cancellations_pcs}</td>
                            <td className="p-3 text-right text-red-500 whitespace-nowrap">{formatNum(row.returns_loss_rub)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.return_expenses)}</td>
                            <td className="p-3 text-right whitespace-nowrap">{row.breakage_pcs}</td>
                            <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{row.breakage_rub}</td>

                            {/* Result */}
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.total_cost_of_sales)}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.total_mp_expenses)}</td>
                            <td className="p-3 text-center whitespace-nowrap">{row.advertising_enabled ? 'Да' : 'Нет'}</td>
                            <td className="p-3 text-right text-slate-500 whitespace-nowrap">{formatNum(row.advertising_rub)}</td>
                            <td className="p-3 text-right text-xs whitespace-nowrap">{row.drr_percent}%</td>
                            <td className="p-3 text-right font-bold text-green-600 dark:text-green-400 bg-green-50/30 dark:bg-green-900/5 whitespace-nowrap">{formatMoney(row.marginal_profit)}</td>
                            <td className={`p-3 text-right font-bold border-r border-slate-100 dark:border-slate-700 bg-green-50/30 dark:bg-green-900/5 whitespace-nowrap ${row.margin_percent < 20 ? 'text-red-500' : 'text-green-600'}`}>{row.margin_percent}%</td>

                            {/* ABC */}
                            <td className="p-3 text-center whitespace-nowrap"><span className={`px-2 py-0.5 rounded text-xs font-bold ${row.abc_revenue === 'A' ? 'bg-indigo-100 text-indigo-700' : row.abc_revenue === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{row.abc_revenue}</span></td>
                            <td className="p-3 text-center whitespace-nowrap"><span className={`px-2 py-0.5 rounded text-xs font-bold ${row.abc_margin === 'A' ? 'bg-green-100 text-green-700' : row.abc_margin === 'B' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.abc_margin}</span></td>
                            <td className="p-3 text-center whitespace-nowrap font-mono text-xs">{row.abc_composite}</td>
                            <td className="p-3 text-center whitespace-nowrap"><span className="text-[10px] bg-slate-100 px-1 rounded">{row.abc_composite}X</span></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
           
           {/* Pagination / Summary Footer */}
           <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center text-sm">
              <div className="text-slate-500">
                 Всего SKU: <span className="font-bold text-slate-900 dark:text-white">{products.length}</span> | Показано: {products.length}
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">Назад</button>
                 <button className="px-3 py-1 rounded bg-indigo-600 text-white">1</button>
                 <button className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">Вперед</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="space-y-6 animate-fade-in">
           {/* Sub-Navigation for Sources */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-1 flex overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'prices', label: 'OZON Цены' },
                { id: 'accruals', label: 'OZON Начисления и компенсации по товарам' },
                { id: 'returns', label: 'OZON Возвраты FBS и FBO' },
                { id: 'orders_fbs', label: 'OZON Заказы с моих складов' },
                { id: 'orders_fbo', label: 'Заказы со складов Ozon' },
                { id: 'csv', label: 'Товары CSV' },
                { id: 'ads', label: 'Отчет по рекламе' },
                { id: 'writeoff', label: 'Отчёт о списанных товарах' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSourceReport(sub.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSourceReport === sub.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
           </div>

           {/* Dynamic Table based on Source Type */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <List size={18} /> Лог: {activeSourceReport.toUpperCase()}
                 </h3>
                 <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-mono">
                    {sourceData.length} строк
                 </span>
              </div>
              
              <div className="overflow-x-auto">
                 {loading ? (
                    <div className="p-8 text-center text-slate-500">Загрузка данных...</div>
                 ) : (
                    <table className="w-full text-sm text-left border-collapse">
                       <thead className="bg-slate-50 dark:bg-[#0b1120] text-xs uppercase text-slate-500 font-bold sticky top-0 shadow-sm">
                          <tr>
                             {SOURCE_COLUMNS[activeSourceReport]?.map((col, i) => (
                                <th key={i} className="p-3 border-b border-r border-slate-200 dark:border-slate-700 min-w-[150px] whitespace-nowrap bg-slate-50 dark:bg-[#0b1120]">
                                   {col}
                                </th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {sourceData.map((row, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                {Object.values(row).map((val: any, vIdx) => (
                                   <td key={vIdx} className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                      {typeof val === 'number' && (val > 1000 || val < -1000) ? formatNum(val) : val}
                                   </td>
                                ))}
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center h-[500px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
               <PieChartIcon size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Исходники Графики</h3>
            <p className="text-slate-500 max-w-md text-center mt-2">
               Расширенная визуализация доступна на вкладке Дашборд.
            </p>
        </div>
      )}

      {activeTab === 'base' && (
         <div className="space-y-6 animate-fade-in w-full overflow-hidden">
            {/* Base Table Container */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-full overflow-x-auto">
               <div className="min-w-max">
                 <table className="text-left text-sm border-collapse">
                    <thead className="bg-slate-50 dark:bg-[#0b1120] text-xs uppercase text-slate-500 font-bold sticky top-0 z-20 shadow-md">
                       {/* --- HEADER GROUP ROW --- */}
                       <tr className="border-b border-slate-200 dark:border-slate-700">
                          {/* Sticky Group */}
                          <th className="sticky left-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-30" style={{width: '40px'}}></th>
                          
                          {/* Scrollable Groups with Colors */}
                          <th colSpan={17} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">Данные МС</th>
                          <th colSpan={7} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-sky-50 dark:bg-sky-900/10 text-sky-700 dark:text-sky-400">Минимальная маржа по SKU 12%...</th>
                          <th colSpan={6} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">Расчет Цены</th>
                          <th colSpan={4} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400">Расходы</th>
                          <th colSpan={2} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">Базовая комиссия</th>
                          <th colSpan={1} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">Возвраты</th>
                          <th colSpan={1} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">ДРР</th>
                          <th colSpan={3} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400">ТБУ</th>
                          <th colSpan={4} className="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400">Данные OZON факт</th>
                          <th colSpan={5} className="p-2 text-center bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400">Данные OZON до обновления</th>
                       </tr>
 
                       {/* --- COLUMN HEADER ROW --- */}
                       <tr>
                          {/* Sticky Checkbox */}
                          <th className="p-3 sticky left-0 bg-slate-50 dark:bg-[#0b1120] z-30 border-r border-slate-200 dark:border-slate-700 text-center w-[40px]">
                            <input type="checkbox" className="rounded border-slate-300" />
                          </th>

                          {/* Данные МС */}
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700 min-w-[120px]">Группы сорт.</th>
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700 min-w-[100px]">Код товара</th>
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700 min-w-[100px]">Артикул</th>
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700 min-w-[200px]">Наименование</th>
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700">Категория</th>
                          <th className="p-3 border-r border-slate-200 dark:border-slate-700 min-w-[120px]">Статус</th>
                          <th className="p-3 text-right">Продажи шт</th>
                          <th className="p-3 text-right">Возвраты</th>
                          <th className="p-3 text-right">Ср. цена</th>
                          <th className="p-3 text-right">% Возвр</th>
                          <th className="p-3 text-right">Бой шт</th>
                          <th className="p-3 text-right">Маржа %</th>
                          <th className="p-3 text-right">Ср. дн. прод</th>
                          <th className="p-3 text-right">Оборот</th>
                          <th className="p-3 text-center">ABC</th>
                          <th className="p-3 text-center">Рейтинг</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700">Через дн</th>

                          {/* Мин Маржа */}
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">Розн. МС</th>
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">Наша Цена</th>
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">Маржа SKU</th>
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">ЧП</th>
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">РРЦ</th>
                          <th className="p-3 text-right bg-sky-50/30 dark:bg-sky-900/5">Цена OZON</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-sky-50/30 dark:bg-sky-900/5">Соинвест %</th>

                          {/* Расчет Цены */}
                          <th className="p-3 text-right">Мин. цена</th>
                          <th className="p-3 text-right">Со скидкой</th>
                          <th className="p-3 text-right">РРЦ</th>
                          <th className="p-3 text-right">Маржа Min</th>
                          <th className="p-3 text-right">Маржа Скид</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700">ЧП Min</th>

                          {/* Расходы */}
                          <th className="p-3 text-right bg-emerald-50/30 dark:bg-emerald-900/5">Себест.</th>
                          <th className="p-3 text-right bg-emerald-50/30 dark:bg-emerald-900/5">Упак.</th>
                          <th className="p-3 text-right bg-emerald-50/30 dark:bg-emerald-900/5">Логист.</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-emerald-50/30 dark:bg-emerald-900/5">Доля лог %</th>

                          {/* Комиссия */}
                          <th className="p-3 text-right bg-blue-50/30 dark:bg-blue-900/5">Комиссия</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/5">Эквайринг</th>

                          {/* Возвраты / ДРР */}
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/5">%</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/5">%</th>

                          {/* ТБУ */}
                          <th className="p-3 text-right bg-yellow-50/30 dark:bg-yellow-900/5">ТБУ min</th>
                          <th className="p-3 text-right bg-yellow-50/30 dark:bg-yellow-900/5">ТБУ Скид</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-yellow-50/30 dark:bg-yellow-900/5">ТБУ факт</th>

                          {/* Ozon Факт */}
                          <th className="p-3 min-w-[120px] bg-indigo-50/30 dark:bg-indigo-900/5">Статус</th>
                          <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">FBO</th>
                          <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">FBS</th>
                          <th className="p-3 text-right border-r border-slate-200 dark:border-slate-700 bg-indigo-50/30 dark:bg-indigo-900/5">ИТОГО</th>

                          {/* Ozon Old */}
                          <th className="p-3 min-w-[120px] bg-indigo-50/30 dark:bg-indigo-900/5">Статус</th>
                          <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">FBO</th>
                          <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">FBS</th>
                          <th className="p-3 text-right bg-indigo-50/30 dark:bg-indigo-900/5">ИТОГО</th>
                          <th className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-900/5">Равно</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {baseData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 group">
                             {/* Sticky Checkbox */}
                             <td className="p-3 sticky left-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 z-20">
                                <input type="checkbox" className="rounded border-slate-300" />
                             </td>

                             {/* MC Data */}
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{row.sort_group}</td>
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap text-xs font-mono">{row.product_code}</td>
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap text-xs font-mono">{row.articul}</td>
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 min-w-[200px] truncate" title={row.name}>{row.name}</td>
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap bg-indigo-50/10 dark:bg-indigo-900/5 text-indigo-600 dark:text-indigo-400 font-medium">{row.category}</td>
                             <td className="p-3 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                   row.status_mc.includes('Токсичный') ? 'bg-slate-700 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>{row.status_mc}</span>
                             </td>
                             <td className="p-3 text-right">{row.sales_pcs}</td>
                             <td className="p-3 text-right">{row.returns_cancels}</td>
                             <td className="p-3 text-right">{formatNum(row.avg_sale_price)}</td>
                             <td className={`p-3 text-right ${row.return_pct > 20 ? 'text-red-500 font-bold' : ''}`}>{formatNum(row.return_pct)}%</td>
                             <td className="p-3 text-right">{row.breakage}</td>
                             <td className={`p-3 text-right font-bold ${row.margin_pct < 20 ? 'text-red-500' : 'text-green-600'}`}>{formatNum(row.margin_pct)}%</td>
                             <td className="p-3 text-right">{row.avg_daily_sales}</td>
                             <td className="p-3 text-right">{row.turnover}</td>
                             <td className="p-3 text-center text-xs font-bold bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400">{row.abc}</td>
                             <td className="p-3 text-center">{row.rating}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 text-orange-500 font-bold">{row.days_to_stockout}</td>

                             {/* Min Margin */}
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5">{formatNum(row.retail_price_mc)}</td>
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5">{formatNum(row.our_price)}</td>
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5 text-green-600 font-medium">{row.margin_sku_pct}%</td>
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5">{formatNum(row.net_profit)}</td>
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5 text-slate-400 text-xs">{formatNum(row.rrp)}</td>
                             <td className="p-3 text-right bg-sky-50/10 dark:bg-sky-900/5">{formatNum(row.price_ozon_buyer)}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-sky-50/10 dark:bg-sky-900/5">{row.coinvest_percent}%</td>

                             {/* Calc Price */}
                             <td className="p-3 text-right font-mono">{formatNum(row.min_price)}</td>
                             <td className="p-3 text-right font-mono">{formatNum(row.price_discounted)}</td>
                             <td className="p-3 text-right text-slate-400">{formatNum(row.rrp_calc)}</td>
                             <td className="p-3 text-right">{formatNum(row.margin_min_rub)}</td>
                             <td className="p-3 text-right">{formatNum(row.margin_discount_rub)}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700">{formatNum(row.net_profit_min)}</td>

                             {/* Expenses */}
                             <td className="p-3 text-right bg-emerald-50/10 dark:bg-emerald-900/5">{formatNum(row.cogs)}</td>
                             <td className="p-3 text-right bg-emerald-50/10 dark:bg-emerald-900/5">{row.packaging}</td>
                             <td className="p-3 text-right bg-emerald-50/10 dark:bg-emerald-900/5">{row.logistics}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-emerald-50/10 dark:bg-emerald-900/5">{row.logistics_share_pct}%</td>

                             {/* Commissions */}
                             <td className="p-3 text-right bg-blue-50/10 dark:bg-blue-900/5">{row.commission_pct}%</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-blue-50/10 dark:bg-blue-900/5">{row.acquiring_pct}%</td>

                             {/* Risks / DRR */}
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-blue-50/10 dark:bg-blue-900/5">{row.risks_pct}%</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-blue-50/10 dark:bg-blue-900/5">{row.drr_pct}%</td>

                             {/* TBU */}
                             <td className="p-3 text-right bg-yellow-50/10 dark:bg-yellow-900/5">{formatNum(row.tbu_min)}</td>
                             <td className="p-3 text-right bg-yellow-50/10 dark:bg-yellow-900/5">{formatNum(row.tbu_discount)}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-yellow-50/10 dark:bg-yellow-900/5 font-bold">{formatNum(row.tbu_fact)}</td>

                             {/* Ozon Fact */}
                             <td className="p-3 bg-indigo-50/10 dark:bg-indigo-900/5 whitespace-nowrap text-xs">{row.status_ozon}</td>
                             <td className="p-3 text-right bg-indigo-50/10 dark:bg-indigo-900/5">{row.fbo_ozon}</td>
                             <td className="p-3 text-right bg-indigo-50/10 dark:bg-indigo-900/5">{row.fbs_ozon}</td>
                             <td className="p-3 text-right border-r border-slate-100 dark:border-slate-700 bg-indigo-50/10 dark:bg-indigo-900/5 font-bold">{row.total_ozon}</td>

                             {/* Ozon Old */}
                             <td className="p-3 bg-indigo-50/10 dark:bg-indigo-900/5 whitespace-nowrap text-xs">{row.status_old}</td>
                             <td className="p-3 text-right bg-indigo-50/10 dark:bg-indigo-900/5">{row.fbo_old}</td>
                             <td className="p-3 text-right bg-indigo-50/10 dark:bg-indigo-900/5">{row.fbs_old}</td>
                             <td className="p-3 text-right bg-indigo-50/10 dark:bg-indigo-900/5 font-bold">{row.total_old}</td>
                             <td className="p-3 text-center bg-indigo-50/10 dark:bg-indigo-900/5">
                                <input type="checkbox" checked={row.is_equal} readOnly className="rounded border-slate-300 text-indigo-600" />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
         </div>
      )}

      </>
      )}

    </div>
  );
};

export default OzonAnalytics;