
import { OzonCategory } from '../types';

// Mock Data Generator
const CATEGORY_NAMES_RU = [
  'Электроника', 'Одежда', 'Дом и сад', 'Детские товары', 'Красота и здоровье',
  'Бытовая техника', 'Спорт и отдых', 'Строительство и ремонт', 'Продукты питания', 'Аптека',
  'Автотовары', 'Книги', 'Мебель', 'Зоотовары', 'Ювелирные украшения'
];

const CATEGORY_NAMES_EN = [
  'Electronics', 'Apparel', 'Home & Garden', 'Kids', 'Health & Beauty',
  'Appliances', 'Sports', 'Construction', 'Groceries', 'Pharmacy',
  'Automotive', 'Books', 'Furniture', 'Pet Supplies', 'Jewelry'
];

const generateMockData = (lang: 'en' | 'ru'): OzonCategory[] => {
  const names = lang === 'ru' ? CATEGORY_NAMES_RU : CATEGORY_NAMES_EN;
  
  return names.map((name, idx) => {
    const revenue = Math.floor(Math.random() * 5000000000) + 100000000;
    const avgPrice = Math.floor(Math.random() * 5000) + 500;
    const sales = Math.floor(revenue / avgPrice);
    const sku = Math.floor(Math.random() * 500000) + 10000;
    const skuSold = Math.floor(sku * (Math.random() * 0.3 + 0.05));
    
    return {
      id: `ozon_cat_${idx}`,
      name: name,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(2)),
      reviews: Math.floor(Math.random() * 50000),
      sales: sales,
      revenue: revenue,
      avg_price: avgPrice,
      sku: sku,
      sku_sold: skuSold,
      sku_sold_pct: parseFloat(((skuSold / sku) * 100).toFixed(1)),
      avg_sales_per_item: parseFloat((sales / sku).toFixed(1)),
      avg_sales_per_sold_item: parseFloat((sales / skuSold).toFixed(1)),
      sellers: Math.floor(sku / 10),
      sellers_with_sales: Math.floor((sku / 10) * (Math.random() * 0.4 + 0.1)),
    };
  });
};

export const fetchCategories = async (lang: 'en' | 'ru'): Promise<OzonCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData(lang));
    }, 800); // Simulate network delay
  });
};

export interface ChartData {
  name: string;
  value: number;
}

export const fetchSalesChart = (data: OzonCategory[]): ChartData[] => {
  return data
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map(item => ({ name: item.name, value: item.sales }));
};

export const fetchRevenueChart = (data: OzonCategory[]): ChartData[] => {
  return data
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(item => ({ name: item.name, value: item.revenue }));
};
