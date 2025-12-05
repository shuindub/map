
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

// --- Ozon Analytics Types ---
export interface OzonCategory {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  sales: number;
  revenue: number;
  avg_price: number;
  sku: number;
  sku_sold: number;
  sku_sold_pct: number;
  avg_sales_per_item: number;
  avg_sales_per_sold_item: number;
  sellers: number;
  sellers_with_sales: number;
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
