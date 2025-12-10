

import { OzonPnLItem, OzonProductExtended, OzonUnitEconRow, OzonBaseRow, OzonTransaction, SourceReportPrices, SourceReportAccruals, SourceReportReturns, SourceReportOrders, SourceReportCSV, SourceReportAds, SourceReportWriteOff, OzonDashboardData } from '../types';

// Mock Data Generators matching the "Data Dictionary" and "Row Dictionary"

// --- P&L Generator ---
export const fetchPnLData = async (): Promise<OzonPnLItem[]> => {
  // Hardcoded logic to simulate the waterfall described in TZ
  const revenue = 2540000;
  const cogs = 729046;
  const commission = 476004;
  const logistics = 409751;
  const marketing = 30663;
  const acquiring = 19720;
  const returns = 29377;
  
  const grossMargin = revenue - cogs - commission - logistics - marketing - acquiring - returns;
  
  const payroll = 465600;
  const rent = 75076;
  const taxes = 19541;
  const software = 27930;
  
  const netProfit = grossMargin - payroll - rent - taxes - software;

  const items: OzonPnLItem[] = [
    { id: '1', nameKey: 'pnl.revenue', value: revenue, share: 100, type: 'income', level: 1 },
    { id: '2', nameKey: 'pnl.cogs', value: cogs, share: (cogs/revenue)*100, type: 'expense', level: 2 },
    { id: '3', nameKey: 'pnl.commission', value: commission, share: (commission/revenue)*100, type: 'expense', level: 2 },
    { id: '4', nameKey: 'pnl.logistics', value: logistics, share: (logistics/revenue)*100, type: 'expense', level: 2 },
    { id: '5', nameKey: 'pnl.marketing', value: marketing, share: (marketing/revenue)*100, type: 'expense', level: 2 },
    { id: '6', nameKey: 'pnl.acquiring', value: acquiring, share: (acquiring/revenue)*100, type: 'expense', level: 2 },
    { id: '7', nameKey: 'pnl.returns', value: returns, share: (returns/revenue)*100, type: 'expense', level: 2 },
    { id: '8', nameKey: 'pnl.gross_margin', value: grossMargin, share: (grossMargin/revenue)*100, type: 'result', level: 3 },
    { id: '9', nameKey: 'pnl.payroll', value: payroll, share: (payroll/revenue)*100, type: 'fixed', level: 4 },
    { id: '10', nameKey: 'pnl.rent', value: rent, share: (rent/revenue)*100, type: 'fixed', level: 4 },
    { id: '11', nameKey: 'pnl.taxes', value: taxes, share: (taxes/revenue)*100, type: 'fixed', level: 4 },
    { id: '12', nameKey: 'pnl.software', value: software, share: (software/revenue)*100, type: 'fixed', level: 4 },
    { id: '13', nameKey: 'pnl.net_profit', value: netProfit, share: (netProfit/revenue)*100, type: 'result', level: 5 },
  ];
  
  return new Promise(resolve => setTimeout(() => resolve(items), 600));
};

// --- Dashboard Data Generator ---
export const fetchDashboardData = async (): Promise<OzonDashboardData> => {
  const data: OzonDashboardData = {
    waterfall_movement: [
      { name: 'Заказано', value: 3521417, fill: '#EAB308' },
      { name: 'Выкуп', value: 2544869, fill: '#10B981' },
      { name: 'Отмена/Возврат', value: 976548, fill: '#F43F5E' }
    ],
    ebitda_expenses: [
      { name: 'Себестоимость', value: 729046, share: 30.1, fill: '#0EA5E9' },
      { name: 'ФОТ', value: 465600, share: 19.2, fill: '#14B8A6' },
      { name: 'Комиссия', value: 476004, share: 19.7, fill: '#0EA5E9' },
      { name: 'Логистика', value: 409751, share: 16.9, fill: '#0EA5E9' },
      { name: 'Реклама', value: 30663, share: 1.3, fill: '#0EA5E9' },
      { name: 'Расходы FBO', value: 88424, share: 3.7, fill: '#0EA5E9' },
      { name: 'Списание/Бой', value: 49452, share: 2.0, fill: '#EAB308' }
    ],
    abc_analysis: [
      { category: 'A', count: 91, revenue: 16, profit: 12, returns: 579 },
      { category: 'B', count: 2, revenue: 58, profit: 54, returns: 95 },
      { category: 'C', count: 0, revenue: 0, profit: 474, returns: 33 }
    ],
    category_margins: [
      { category: 'Посуда', margin: 333351, margin_percent: 28 },
      { category: 'Оборудование', margin: 230671, margin_percent: 29 },
      { category: 'Комплектующие', margin: 104375, margin_percent: 31 },
      { category: 'СИЗ', margin: 37843, margin_percent: 18 }
    ],
    sales_share_pie: [
      { name: 'Посуда', value: 1195965, fill: '#0F766E' },
      { name: 'Оборудование', value: 797021, fill: '#8B5CF6' },
      { name: 'Комплектующие', value: 338046, fill: '#F59E0B' },
      { name: 'СИЗ', value: 213837, fill: '#6366F1' }
    ],
    stock_status: [
      { category: 'Посуда', selling: 416, ready: 6, not_selling: 422 },
      { category: 'Оборудование', selling: 66, ready: 0, not_selling: 66 },
      { category: 'Комплектующие', selling: 166, ready: 3, not_selling: 169 },
      { category: 'СИЗ', selling: 42, ready: 3, not_selling: 45 },
      { category: 'ИТОГО', selling: 690, ready: 12, not_selling: 702 }
    ],
    stock_capitalization: [
       { category: 'Посуда', value: 1400000 },
       { category: 'Оборудование', value: 900000 },
       { category: 'Комплектующие', value: 500000 },
       { category: 'СИЗ', value: 200000 }
    ],
    turnover_issues: [
      { category: 'Посуда', no_sales: 422, out_of_stock: 0, toxic: 0 },
      { category: 'Оборудование', no_sales: 66, out_of_stock: 0, toxic: 0 },
      { category: 'Комплектующие', no_sales: 174, out_of_stock: 0, toxic: 0 },
      { category: 'СИЗ', no_sales: 45, out_of_stock: 0, toxic: 0 },
      { category: 'ИТОГО', no_sales: 707, out_of_stock: 0, toxic: 0 }
    ],
    scheme_sales_rub: [
       { name: 'FBS', value: 2469874, fill: '#F59E0B' },
       { name: 'FBO', value: 74995, fill: '#14B8A6' }
    ],
    scheme_sales_pcs: [
       { name: 'FBS', value: 418, fill: '#F59E0B' },
       { name: 'FBO', value: 5, fill: '#14B8A6' }
    ],
    geo_fbs: [
      { region: 'Москва-Запад', sales: 441427, share: 16.9 },
      { region: 'Москва-Восток', sales: 439374, share: 16.8 },
      { region: 'Санкт-Петербург', sales: 530310, share: 20.3 },
      { region: 'Поволжье', sales: 391108, share: 15.0 },
      { region: 'Дон', sales: 200395, share: 7.7 },
      { region: 'Юг', sales: 168768, share: 6.5 },
      { region: 'Урал', sales: 176829, share: 6.8 },
      { region: 'Сибирь', sales: 148626, share: 5.7 }
    ],
    geo_fbo: [
      { region: 'Москва', sales: 5030, share: 7.7 },
      { region: 'Санкт-Петербург', sales: 7004, share: 10.7 },
      { region: 'Поволжье', sales: 45206, share: 68.9 },
      { region: 'Дон', sales: 3517, share: 5.4 }
    ],
    localization_table: [
      { range: '0%', coeff: 1.5, percent_logistics: 50.00 },
      { range: '30%', coeff: 1.4, percent_logistics: 40.00 },
      { range: '35%', coeff: 1.3, percent_logistics: 30.00 },
      { range: '45%', coeff: 1.2, percent_logistics: 20.00 },
      { range: '60%', coeff: 1.1, percent_logistics: 10.00 },
      { range: '65%', coeff: 1.0, percent_logistics: 0.00 },
      { range: '75%', coeff: 0.95, percent_logistics: -5.00 },
      { range: '85%', coeff: 0.85, percent_logistics: -15.00 },
      { range: '90%', coeff: 0.80, percent_logistics: -20.00 },
      { range: '95%', coeff: 0.50, percent_logistics: -50.00 },
    ],
    return_reasons: [
      { reason: 'Не удалось доставить заказ', count: 89, share: 27.4 },
      { reason: 'Не доволен качеством', count: 15, share: 4.6 },
      { reason: 'Покупатель передумал', count: 15, share: 4.6 },
      { reason: 'Неполная комплектация', count: 4, share: 1.2 },
      { reason: 'Покупатель отменил', count: 7, share: 2.2 },
      { reason: 'Товар поврежден', count: 9, share: 2.8 },
      { reason: 'Брак', count: 3, share: 0.9 }
    ],
    ad_performance: {
       sku_pie: [
         { name: 'В рекламе', value: 39, fill: '#F59E0B' },
         { name: 'Без рекламы', value: 87, fill: '#14B8A6' },
         { name: 'Нет в наличии', value: 38, fill: '#8B5CF6' }
       ],
       sales_drr: [
         { type: 'Трафареты', sales: 497470, drr: 12.9, cost: 64302 },
         { type: 'Вывод в топ', sales: 389651, drr: 4.2, cost: 16179 },
         { type: 'Продвижение', sales: 59818, drr: 18.0, cost: 10774 }
       ],
       share_sales: [
         { category: 'Посуда', cost: 38554, share: 3.5 },
         { category: 'Оборудование', cost: 23228, share: 2.9 },
         { category: 'Комплектующие', cost: 10384, share: 3.1 },
         { category: 'СИЗ', cost: 18737, share: 8.8 }
       ],
       total_sku_ad: 179,
       total_drr: 9.6
    }
  };
  return new Promise(resolve => setTimeout(() => resolve(data), 700));
};

// --- Product Registry Generator ---
const CATEGORIES = ['Посуда', 'Оборудование', 'Комплектующие', 'СИЗ', 'Дом и сад', 'Аптека'];
const SALES_SCHEMES = ['FBO', 'FBS'] as const;

export const fetchProducts360 = async (): Promise<OzonProductExtended[]> => {
  const products: OzonProductExtended[] = [];
  for (let i = 1; i <= 50; i++) {
    const price = 1500 + Math.floor(Math.random() * 50000);
    const cost = Math.floor(price * 0.4);
    const orderedPcs = Math.floor(Math.random() * 100);
    const orderedRub = orderedPcs * price;
    const salesPcs = Math.floor(orderedPcs * 0.9); // Some cancellations
    const salesRub = salesPcs * price;
    
    // Expenses
    const commission = Math.floor(salesRub * (0.15 + Math.random() * 0.05));
    const logistics = salesPcs * (100 + Math.random() * 200);
    const assembly = salesPcs * 30;
    const acquiring = Math.floor(salesRub * 0.015);
    const lastMile = Math.floor(salesPcs * 50);
    const logisticsTotal = logistics + assembly + lastMile;
    
    const adCost = Math.floor(salesRub * (Math.random() * 0.15));
    
    // Returns
    const returnsPcs = Math.floor(salesPcs * 0.05);
    const returnExpenses = returnsPcs * 150;
    const returnsLoss = returnsPcs * (price * 0.2); // Loss of value
    
    const totalExpenses = commission + logisticsTotal + acquiring + adCost + returnExpenses;
    const cogsTotal = salesPcs * cost;
    
    const marginRub = salesRub - cogsTotal - totalExpenses;
    const marginPct = salesRub > 0 ? (marginRub / salesRub) * 100 : 0;

    const status = marginPct < 10 ? 'Токсичный' : (Math.random() > 0.8 ? 'Out of stock' : 'Готов к продаже');
    const abcRev = i < 10 ? 'A' : (i < 30 ? 'B' : 'C');
    const abcMar = i < 15 ? 'A' : (i < 35 ? 'B' : 'C');

    products.push({
      id: `p-${i}`,
      image: `https://picsum.photos/40/40?random=${i}`,
      
      // Info
      category_our: CATEGORIES[i % CATEGORIES.length],
      sku: `${501201000 + i}`,
      category_ozon: 'Дом и Сад',
      ozon_sku_id: `${160490000 + i}`,
      name: `Товар Ozon ${i} - ${CATEGORIES[i % CATEGORIES.length]} Profi`,
      status: status,
      
      // Price
      price_realization: price,
      rrp: Math.floor(price * 1.3),
      price_buyer: Math.floor(price * 0.9),
      coinvest_percent: parseFloat((Math.random() * 20).toFixed(2)),
      sales_scheme: SALES_SCHEMES[Math.floor(Math.random() * 2)],
      cost_price: cost,
      
      // Warehouse
      stock_count: Math.floor(Math.random() * 500),
      avg_stock: Math.floor(Math.random() * 400),
      stock_capitalization: Math.floor(Math.random() * 500) * cost,
      toxic_stock: status === 'Токсичный' ? Math.floor(Math.random() * 500) * cost : 0,
      dead_stock: Math.random() > 0.9 ? Math.floor(Math.random() * 100) * cost : 0,
      
      // Demand
      ordered_rub: orderedRub,
      ordered_pcs: orderedPcs,
      sales_fact_rub: salesRub,
      sales_fact_pcs: salesPcs,
      avg_daily_sales: parseFloat((salesPcs / 30).toFixed(2)),
      days_to_oos: Math.floor(Math.random() * 90),
      turnover_days: Math.floor(Math.random() * 60),
      
      // Logistics
      total_received: salesRub - commission - logisticsTotal - acquiring,
      commission: commission,
      assembly: assembly,
      acquiring: acquiring,
      last_mile: lastMile,
      logistics: logistics,
      logistics_total: logisticsTotal,
      localization_index: Math.floor(50 + Math.random() * 50),
      logistics_share_percent: salesRub > 0 ? parseFloat(((logisticsTotal / salesRub) * 100).toFixed(1)) : 0,
      
      // Returns
      returns_pcs: returnsPcs,
      cancellations_pcs: Math.floor(orderedPcs * 0.05),
      returns_loss_rub: Math.floor(returnsLoss),
      return_expenses: returnExpenses,
      breakage_pcs: Math.random() > 0.95 ? 1 : 0,
      breakage_rub: Math.random() > 0.95 ? cost : 0,
      
      // Result
      total_cost_of_sales: cogsTotal,
      total_mp_expenses: totalExpenses,
      advertising_enabled: adCost > 0,
      advertising_rub: adCost,
      drr_percent: salesRub > 0 ? parseFloat(((adCost / salesRub) * 100).toFixed(1)) : 0,
      marginal_profit: marginRub,
      margin_percent: parseFloat(marginPct.toFixed(1)),
      
      // ABC
      abc_revenue: abcRev,
      abc_margin: abcMar,
      abc_composite: `${abcRev}${abcRev}${abcMar === 'C' ? 'X' : ''}`
    });
  }
  return new Promise(resolve => setTimeout(() => resolve(products), 800));
};

// --- Unit Economics Generator ---
export const fetchUnitEcon = async (): Promise<OzonUnitEconRow[]> => {
  const rows: OzonUnitEconRow[] = [];
  for (let i = 1; i <= 20; i++) {
    const cogs = 800 + Math.floor(Math.random() * 200);
    const pack = 50;
    const log = 150;
    const commPct = 0.15;
    const target = 0.20;
    
    // Min Price Formula: (COGS + Pack + Log) / (1 - Comm - Target)
    const minPrice = Math.floor((cogs + pack + log) / (1 - commPct - target));
    
    rows.push({
      id: `ue-${i}`,
      sku: `OZ-${10000+i}`,
      name: `Ozon Product ${i}`,
      cogs,
      packaging: pack,
      dimensions: '20x15x10',
      commission_pct: commPct * 100,
      logistics: log,
      current_price: minPrice + 200,
      target_margin: target * 100,
      min_price: minPrice,
      profit_check: minPrice - cogs - pack - log - (minPrice * commPct)
    });
  }
  return new Promise(resolve => setTimeout(() => resolve(rows), 700));
};

// --- Base Data Generator ---
export const fetchBaseData = async (): Promise<OzonBaseRow[]> => {
  const rows: OzonBaseRow[] = [];
  for (let i = 1; i <= 30; i++) {
    const cost = 1000 + Math.floor(Math.random() * 5000);
    const price = Math.floor(cost * 2.5);
    const discountPrice = Math.floor(price * 0.8);
    const stock = Math.floor(Math.random() * 100);
    const margin = discountPrice - cost - (discountPrice * 0.2) - 200; // rough calc
    const marginPct = (margin / discountPrice) * 100;
    const status = stock > 0 ? 'Готов к продаже' : 'Out of stock';
    
    rows.push({
      id: `base-${i}`,
      sort_group: 'Адаптер (ловушка)',
      product_code: `${501201040 + i}`,
      articul: `${501201040 + i}`,
      name: `Товар Base ${i}`,
      category: 'Посуда',
      status_mc: status === 'Готов к продаже' ? '20/80 Формир...' : 'Токсичный...',
      sales_pcs: Math.floor(Math.random() * 50),
      returns_cancels: Math.floor(Math.random() * 5),
      avg_sale_price: discountPrice,
      return_pct: parseFloat((Math.random() * 30).toFixed(2)),
      breakage: 0,
      margin_pct: parseFloat(marginPct.toFixed(2)),
      avg_daily_sales: parseFloat((Math.random() * 2).toFixed(2)),
      turnover: parseFloat((Math.random() * 5).toFixed(1)),
      abc: i < 10 ? 'AAY' : 'BBX',
      rating: 5,
      days_to_stockout: stock === 0 ? 'Out of stock' : `${Math.floor(stock / 2)}`,
      
      retail_price_mc: price,
      our_price: price,
      margin_sku_pct: 35,
      net_profit: Math.floor(margin),
      rrp: Math.floor(price * 1.3),
      price_ozon_buyer: discountPrice,
      coinvest_pct: 0,
      
      min_price: Math.floor(cost * 1.5),
      price_discounted: discountPrice,
      rrp_calc: Math.floor(price * 1.3),
      margin_min_rub: Math.floor(margin * 0.5),
      margin_discount_rub: Math.floor(margin),
      net_profit_min: Math.floor(margin * 0.5),
      
      cogs: cost,
      packaging: 50,
      logistics: 200,
      logistics_share_pct: 12.5,
      
      commission_pct: 20,
      acquiring_pct: 1.5,
      
      risks_pct: 3,
      drr_pct: 6,
      
      tbu_min: 2247,
      tbu_discount: 2382,
      tbu_fact: 2382,
      
      status_ozon: 'Готов к продаже',
      fbo_ozon: 0,
      fbs_ozon: stock,
      total_ozon: stock,
      
      status_old: 'Готов к продаже',
      fbo_old: 0,
      fbs_old: stock,
      total_old: stock,
      is_equal: true
    });
  }
  return new Promise(resolve => setTimeout(() => resolve(rows), 700));
};

// --- Transactions Generator ---
export const fetchTransactions = async (): Promise<OzonTransaction[]> => {
  const txs: OzonTransaction[] = [];
  const types = ['revenue', 'commission', 'logistics', 'marketing', 'return'] as const;
  
  for (let i = 1; i <= 30; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = type === 'revenue' ? 1500 : -200;
    
    txs.push({
      id: `tx-${i}`,
      date: new Date().toISOString().split('T')[0],
      type: type,
      amount: amount,
      order_id: `ORD-${999000+i}`,
      sku: `OZ-${10000 + (i % 10)}`
    });
  }
  return new Promise(resolve => setTimeout(() => resolve(txs), 500));
};

// --- New Source Reports Generators ---

export const fetchSourceReport = async (reportType: string): Promise<any[]> => {
  const count = 30;
  
  if (reportType === 'prices') {
    return Array.from({ length: count }, (_, i) => ({
      articul: `501201${100+i}`,
      ozon_sku_id: `688876${i}`,
      name: `Термостойкий стакан ${i}00мл`,
      status: 'Готов к продаже',
      visibility_ozon: 'да',
      stock_ozon: Math.floor(Math.random() * 10),
      stock_own: Math.floor(Math.random() * 50),
      volume_l: 12,
      volume_weight_kg: 2,
      barcode: `20000000023${i}`,
      price_before_disc: 12999,
      price_current: 9999,
      discount_pct: 24,
      discount_rub: 3000,
      price_promo: 9999,
      discount_promo_pct: 37,
      discount_promo_rub: 4791,
      vat_pct: 20,
      min_price_setting: 'Нет',
      min_price_days: 0,
      auto_action: 'Нет',
      market_price_ozon: 10500,
      market_price_competitor: 9500,
      my_price_other: 9900,
      link_competitor: 'https://ozon.ru/item...',
      link_my: 'https://ozon.ru/item...',
      price_index: 'Выгодный',
      price_index_ozon: 1.0,
      price_index_market: 0.95,
      price_index_market_my: 1.05,
      acquiring: 1.5,
      reward_ozon_fbo_pct: 19,
      logistics_ozon_min_fbo: 63,
      logistics_ozon_max_fbo: 200,
      last_mile_fbo: 30,
      reward_ozon_fbs_pct: 19,
      processing_min_fbs: 50,
      processing_max_fbs: 100,
      logistics_ozon_min_fbs: 70,
      logistics_ozon_max_fbs: 250,
      last_mile_fbs: 30,
      price_before_disc_2: 12999,
      price_current_2: 9999,
      discount_pct_2: 24,
      vat_pct_2: 20,
      cogs: 5000,
      strategy: 'Нет',
      min_price: 8000,
      connect_actions: 'Да'
    } as SourceReportPrices));
  }
  
  if (reportType === 'accruals') {
    return Array.from({ length: count }, (_, i) => ({
      date_accrual: `01.02.2025`,
      type_accrual: 'Оплата эквайринга',
      number_shipment: `0105933321-00${i}`,
      date_acceptance: '19.01.2025',
      warehouse_shipment: 'Склад отгрузки',
      sku: `15416779${i}`,
      articul: `50120280${i}`,
      name: 'Комбинезон защитный многоразовый',
      qty: 2,
      amount_before_comm: 0,
      commission_rate: '0%',
      commission_amount: 0,
      assembly: 0,
      processing_dropoff: 0,
      magistral: 0,
      last_mile: 0,
      return_magistral: 0,
      return_processing: 0,
      cancelled_processing: 0,
      unredeemed_processing: 0,
      logistics: 0,
      localization_index: 0,
      reverse_logistics: 0,
      total: -148
    } as SourceReportAccruals));
  }

  if (reportType === 'returns') {
    return Array.from({ length: count }, (_, i) => ({
      scheme: 'FBS',
      name: 'Мерный цилиндр',
      number_shipment: `0143113883-0006-${i}`,
      articul: `50120237${i}`,
      ozon_sku_id: `129237002${i}`,
      date_order: '19.02.2025 9:17',
      date_return: '28.02.2025 13:12',
      status_return: 'Ожидает отправки продавцу',
      date_status: '28.02.2025 13:12',
      reason: 'Не удалось доставить заказ',
      comment: 'Клиент отказался',
      qty: 1,
      is_opened: 'Нет',
      target_destination: 'R:LAB/426344/Склад',
      transit_pickup: 'R:LAB/426344/Склад',
      location: 'БАРНАУЛ_ХАБ_ДАЛЬНЯЯ',
      date_return_seller: '05.03.2025',
      days_storage: 0,
      last_day_free: '05.03.2025',
      barcode_return: `2028319635-0061-${i}`,
      cost_storage: 0,
      cost_disposal: 0,
      cost_item: 0,
      commission_pct: 0,
      commission_amount: 0,
      price_no_comm: 0
    } as SourceReportReturns));
  }

  if (reportType === 'orders_fbs' || reportType === 'orders_fbo') {
    return Array.from({ length: count }, (_, i) => ({
      order_number: `0145750920-00${i}`,
      shipment_number: `0145750920-00${i}`,
      accepted_at: '28.02.2025',
      shipment_date: '28.02.2025',
      status: 'Ожидает сборки',
      delivery_date: '',
      actual_delivery_date: '',
      amount_shipment: 913,
      currency_shipment: 'RUB',
      name: 'Ступка с пестиком',
      ozon_id: `160496891${i}`,
      articul: `50120219${i}`,
      total_cost: 913,
      currency_item: 'RUB',
      cost_buyer: 814,
      currency_buyer: 'RUB',
      qty: 1,
      cost_delivery: 0,
      linked_shipments: '',
      buyout: '',
      price_before_disc: 1200,
      discount_pct: 32,
      discount_rub: 287,
      actions: '',
      cluster_shipment: 'Москва',
      cluster_delivery: 'Москва',
      region_delivery: 'Москва',
      city_delivery: 'Москва',
      delivery_method: 'Курьер',
      client_segment: 'Классический',
      payment_method: 'Карта',
      legal_entity: 'Нет',
      warehouse_shipment: 'Основной',
      // FBS specific details added if needed for both
    } as SourceReportOrders));
  }

  if (reportType === 'csv') {
    return Array.from({ length: count }, (_, i) => ({
      articul: `501201${100+i}`,
      ozon_product_id: `3508670${69+i}`,
      sku: `6888760${95+i}`,
      qty_in_quantum: 0,
      barcode: `20000000023${i}`,
      name: 'Мерная емкость',
      content_rating: '92.5',
      brand: 'R:LAB',
      status: 'Готов к продаже',
      reviews: 361,
      rating: 4.9,
      visibility: 'Показывается',
      reasons_hidden: '',
      date_created: '25.08.2022 14:1',
      category_commission: 'Дом и сад',
      volume_l: 12.00,
      volume_weight_kg: 2.4,
      fbo_available: 0,
      fbo_kiz: 0,
      reserved: 0,
      fbs_available: 10,
      realfbs_available: 0,
      reserved_own: 0,
      price_current: 9999,
      price_before_disc: 12999,
      price_premium: 9500,
      price_market: 10000,
      link_market: '',
      vat_pct: 20
    } as SourceReportCSV));
  }

  if (reportType === 'ads') {
    return Array.from({ length: count }, (_, i) => ({
      sku: `97597858${i}`,
      type: 'Вывод в топ',
      campaign_id: `1275315${i}`,
      expense: 398,
      drr_pct: 12.5,
      sales: 0,
      orders: 0,
      ctr: 3.36,
      impressions: 952,
      clicks: 32,
      cost_order: 0,
      cost_click: 12,
      carts: 3,
      conversion_cart_pct: 9
    } as SourceReportAds));
  }

  if (reportType === 'writeoff') {
    return Array.from({ length: count }, (_, i) => ({
      date: '06.02.2025',
      name: 'Магнитная мешалка 10л',
      sku: '971590208',
      articul: '501201727',
      qty: 2,
      disposal: -750,
      compensation: 0,
      status_compensation: 'Без компенсации',
      reason: 'Вы не забрали',
      scheme: 'Fbo',
      supply: '20000100000',
      shipment: ''
    } as SourceReportWriteOff));
  }

  return [];
};