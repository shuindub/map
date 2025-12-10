

export interface SalesMetric {
  date: string;
  revenue: number;
  orders: number;
  avgCheck: number;
  lostRevenue: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  sales: number;
  stock: number;
  rating: number;
  category: string;
  trend: 'up' | 'down' | 'flat';
  lostRevenue: number;
  visibility: number; // 0-100%
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  growth: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Tab {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE', // New Financial Analytics Tab
  TOOLS = 'TOOLS',
  PRODUCTS = 'PRODUCTS',
  COMPETITORS = 'COMPETITORS',
  SEO = 'SEO',
  NICHE = 'NICHE',
  ORACLE = 'ORACLE',
  OZON_ANALYTICS = 'OZON_ANALYTICS'
}

export type Language = 'en' | 'ru';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  language: Language;
  theme: Theme;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  login: () => void;
}

// --- Storage Types ---

export interface StorageStep {
  timestamp: string;
  step_number: number;
  user_input: string;
  model_output: string;
  image_inputs?: string[];
  image_outputs?: string[];
}

export interface StorageSession {
  sessionId: string;
  sessionName: string;
  currentStep: number;
}

// --- History Engine Types (Local) ---
export interface HistoryStep {
  step: number;
  timestamp: string;
  userInput: string;
  modelOutput: string;
  imageInputs?: string[];
  imageOutputs?: string[];
}

// --- Finance Analytics Types ---
export interface FinanceRow {
  date: string;
  sales: number;
  returns: number;
  expenses: number;
  commission: number;
  logistics: number;
  marketing: number;
  profit: number;
  margin: number; // %
  ros: number; // %
}

export interface FinanceSummary {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  avgMargin: number;
}

// --- Ozon Analytics Types (v2.0 Architecture) ---

export interface OzonPnLItem {
  id: string;
  nameKey: string; // Translation key
  value: number;
  share: number; // %
  type: 'income' | 'expense' | 'fixed' | 'result';
  level: 1 | 2 | 3 | 4 | 5;
  trend?: number;
}

export interface OzonProductExtended {
  id: string;
  image: string;
  
  // -- Info Group --
  category_our: string;
  sku: string; // Articul
  category_ozon: string;
  ozon_sku_id: string;
  name: string;
  status: string;

  // -- Price & Realization Group --
  price_realization: number; // Наша Цена / Реализация
  rrp: number; // РРЦ
  price_buyer: number; // Цена покупателя Факт
  coinvest_percent: number; // Соинвест %
  sales_scheme: 'FBO' | 'FBS';
  cost_price: number; // Себестоимость МС Руб
  
  // -- Warehouse Data Group --
  stock_count: number; // Остатки на складах Шт
  avg_stock: number; // Средний товарный запас
  stock_capitalization: number; // Капитализация склада
  toxic_stock: number; // Токсичный сток
  dead_stock: number; // Мертвый сток
  
  // -- Demand / Movement Group --
  ordered_rub: number; // Заказано Руб
  ordered_pcs: number; // Заказано Шт
  sales_fact_rub: number; // Продажи Факт Руб
  sales_fact_pcs: number; // Продажи Факт Шт
  avg_daily_sales: number; // Среднедневные продажи
  days_to_oos: number; // Out of stock days
  turnover_days: number; // Оборачиваемость
  
  // -- Logistics & Commissions Group --
  total_received: number; // Итого Получено от МП
  commission: number; // Комиссия
  assembly: number; // Сборка
  acquiring: number; // Эквайринг
  last_mile: number; // Последняя миля
  logistics: number; // Логистика
  logistics_total: number; // Логистика Итого
  localization_index: number; // Индекс локализации
  logistics_share_percent: number; // Доля расхода на логистику
  
  // -- Returns Group --
  returns_pcs: number; // Возвраты Шт
  cancellations_pcs: number; // Отмены Шт
  returns_loss_rub: number; // Убыток от возвратов
  return_expenses: number; // Расход на возвраты
  breakage_pcs: number; // Бой шт
  breakage_rub: number; // Бой руб
  
  // -- Result Group --
  total_cost_of_sales: number; // Себестоимость продаж
  total_mp_expenses: number; // Итого расходы по МП
  advertising_enabled: boolean; // Продвижение (Да/Нет)
  advertising_rub: number; // Расходы на РК
  drr_percent: number; // ДРР
  marginal_profit: number; // Маржинальная прибыль
  margin_percent: number; // Маржинальность
  
  // -- ABC Group --
  abc_revenue: 'A'|'B'|'C';
  abc_margin: 'A'|'B'|'C';
  abc_composite: string; // e.g. "AA", "CCX"
}

export interface OzonDashboardData {
  waterfall_movement: { name: string; value: number; fill: string; isTotal?: boolean; start?: number; end?: number }[];
  ebitda_expenses: { name: string; value: number; share: number; fill: string }[];
  abc_analysis: { category: string; count: number; revenue: number; profit: number; returns: number }[];
  category_margins: { category: string; margin: number; margin_percent: number }[];
  sales_share_pie: { name: string; value: number; fill: string }[];
  stock_status: { category: string; selling: number; ready: number; not_selling: number }[];
  stock_capitalization: { category: string; value: number }[];
  turnover_issues: { category: string; no_sales: number; out_of_stock: number; toxic: number }[];
  scheme_sales_rub: { name: string; value: number; fill: string }[];
  scheme_sales_pcs: { name: string; value: number; fill: string }[];
  geo_fbs: { region: string; sales: number; share: number }[];
  geo_fbo: { region: string; sales: number; share: number }[];
  localization_table: { range: string; coeff: number; percent_logistics: number }[];
  return_reasons: { reason: string; count: number; share: number }[];
  ad_performance: {
    sku_pie: { name: string; value: number; fill: string }[];
    sales_drr: { type: string; sales: number; drr: number; cost: number }[];
    share_sales: { category: string; cost: number; share: number }[];
    total_sku_ad: number;
    total_drr: number;
  };
}

export interface OzonUnitEconRow {
  id: string;
  sku: string;
  name: string;
  cogs: number; // Input
  packaging: number; // Input
  dimensions: string; // Input (LxWxH)
  commission_pct: number; // Ref
  logistics: number; // Auto
  current_price: number; // Ref
  target_margin: number; // Input
  min_price: number; // Calculated
  profit_check: number; // Calculated
}

export interface OzonBaseRow {
  id: string;
  // Данные МС
  sort_group: string;
  product_code: string;
  articul: string;
  name: string;
  category: string;
  status_mc: string;
  sales_pcs: number;
  returns_cancels: number;
  avg_sale_price: number;
  return_pct: number;
  breakage: number;
  margin_pct: number;
  avg_daily_sales: number;
  turnover: number;
  abc: string;
  rating: number;
  days_to_stockout: string; // "Out of stock" or number

  // Январь / Факт
  retail_price_mc: number;
  our_price: number;
  margin_sku_pct: number;
  net_profit: number;
  rrp: number;
  price_ozon_buyer: number;
  coinvest_pct: number;

  // Расчет Цены
  min_price: number;
  price_discounted: number;
  rrp_calc: number;
  margin_min_rub: number;
  margin_discount_rub: number;
  net_profit_min: number;

  // Расходы
  cogs: number;
  packaging: number;
  logistics: number;
  logistics_share_pct: number;

  // Комиссии
  commission_pct: number;
  acquiring_pct: number;

  // Риски
  risks_pct: number;
  
  // ДРР
  drr_pct: number;

  // ТБУ
  tbu_min: number;
  tbu_discount: number;
  tbu_fact: number;

  // Данные OZON факт
  status_ozon: string;
  fbo_ozon: number;
  fbs_ozon: number;
  total_ozon: number;

  // Данные OZON до обновления
  status_old: string;
  fbo_old: number;
  fbs_old: number;
  total_old: number;
  is_equal: boolean;
}

export interface OzonTransaction {
  id: string;
  date: string;
  type: 'revenue' | 'commission' | 'logistics' | 'marketing' | 'return';
  amount: number;
  order_id: string;
  sku: string;
}

// --- Source Report Interfaces ---

export interface SourceReportPrices {
  articul: string;
  ozon_sku_id: string;
  name: string;
  status: string;
  visibility_ozon: string;
  stock_ozon: number;
  stock_own: number;
  volume_l: number;
  volume_weight_kg: number;
  barcode: string;
  price_before_disc: number;
  price_current: number;
  discount_pct: number;
  discount_rub: number;
  price_promo: number;
  discount_promo_pct: number;
  discount_promo_rub: number;
  vat_pct: number;
  min_price_setting: string;
  min_price_days: number;
  auto_action: string;
  market_price_ozon: number;
  market_price_competitor: number;
  my_price_other: number;
  link_competitor: string;
  link_my: string;
  price_index: string;
  price_index_ozon: number;
  price_index_market: number;
  price_index_market_my: number;
  acquiring: number;
  reward_ozon_fbo_pct: number;
  logistics_ozon_min_fbo: number;
  logistics_ozon_max_fbo: number;
  last_mile_fbo: number;
  reward_ozon_fbs_pct: number;
  processing_min_fbs: number;
  processing_max_fbs: number;
  logistics_ozon_min_fbs: number;
  logistics_ozon_max_fbs: number;
  last_mile_fbs: number;
  price_before_disc_2: number;
  price_current_2: number;
  discount_pct_2: number;
  vat_pct_2: number;
  cogs: number;
  strategy: string;
  min_price: number;
  connect_actions: string;
}

export interface SourceReportAccruals {
  date_accrual: string;
  type_accrual: string;
  number_shipment: string;
  date_acceptance: string;
  warehouse_shipment: string;
  sku: string;
  articul: string;
  name: string;
  qty: number;
  amount_before_comm: number;
  commission_rate: string;
  commission_amount: number;
  assembly: number;
  processing_dropoff: number;
  magistral: number;
  last_mile: number;
  return_magistral: number;
  return_processing: number;
  cancelled_processing: number;
  unredeemed_processing: number;
  logistics: number;
  localization_index: number;
  reverse_logistics: number;
  total: number;
}

export interface SourceReportReturns {
  scheme: string;
  name: string;
  number_shipment: string;
  articul: string;
  ozon_sku_id: string;
  date_order: string;
  date_return: string;
  status_return: string;
  date_status: string;
  reason: string;
  comment: string;
  qty: number;
  is_opened: string;
  target_destination: string;
  transit_pickup: string;
  location: string;
  date_return_seller: string;
  days_storage: number;
  last_day_free: string;
  barcode_return: string;
  cost_storage: number;
  cost_disposal: number;
  cost_item: number;
  commission_pct: number;
  commission_amount: number;
  price_no_comm: number;
}

export interface SourceReportOrders {
  order_number: string;
  shipment_number: string;
  accepted_at: string;
  shipment_date: string;
  status: string;
  delivery_date: string;
  actual_delivery_date: string;
  amount_shipment: number;
  currency_shipment: string;
  name: string;
  ozon_id: string;
  articul: string;
  total_cost: number;
  currency_item: string;
  cost_buyer: number;
  currency_buyer: string;
  qty: number;
  cost_delivery: number;
  linked_shipments: string;
  buyout: string;
  price_before_disc: number;
  discount_pct: number;
  discount_rub: number;
  actions: string;
  volume_weight?: number; // FBO specific
  floor_delivery?: string; // FBS specific
  barcode_upper?: string;
  barcode_lower?: string;
  cluster_shipment: string;
  cluster_delivery: string;
  region_delivery: string;
  city_delivery: string;
  delivery_method: string;
  client_segment: string;
  payment_method: string;
  legal_entity: string;
  buyer_name?: string; // FBS specific
  email?: string;
  recipient?: string;
  phone?: string;
  address?: string;
  zip?: string;
  warehouse_shipment: string;
  carrier?: string; // FBS specific
  method_name?: string; // FBS specific
  jewelry_barcode?: string; // FBO specific
}

export interface SourceReportCSV {
  articul: string;
  ozon_product_id: string;
  sku: string;
  qty_in_quantum: number;
  barcode: string;
  name: string;
  content_rating: string;
  brand: string;
  status: string;
  reviews: number;
  rating: number;
  visibility: string;
  reasons_hidden: string;
  date_created: string;
  category_commission: string;
  volume_l: number;
  volume_weight_kg: number;
  fbo_available: number;
  fbo_kiz: number;
  reserved: number;
  fbs_available: number;
  realfbs_available: number;
  reserved_own: number;
  price_current: number;
  price_before_disc: number;
  price_premium: number;
  price_market: number;
  link_market: string;
  vat_pct: number;
}

export interface SourceReportAds {
  sku: string;
  type: string;
  campaign_id: string;
  expense: number;
  drr_pct: number;
  sales: number;
  orders: number;
  ctr: number;
  impressions: number;
  clicks: number;
  cost_order: number;
  cost_click: number;
  carts: number;
  conversion_cart_pct: number;
}

export interface SourceReportWriteOff {
  date: string;
  name: string;
  sku: string;
  articul: string;
  qty: number;
  disposal: number;
  compensation: number;
  status_compensation: string;
  reason: string;
  scheme: string;
  supply: string;
  shipment: string;
}