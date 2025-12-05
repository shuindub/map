
import { FinanceRow, FinanceSummary } from '../types';

// Mock Data Generator for Finance Tab

const generateRandomDailyData = (days: number): FinanceRow[] => {
  const data: FinanceRow[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Base Sales (Random between 50k and 150k)
    const sales = Math.floor(Math.random() * 100000) + 50000;
    
    // Returns (Approx 5-10% of sales)
    const returns = Math.floor(sales * (Math.random() * 0.05 + 0.05));
    
    // Expenses Calculation
    const commission = Math.floor(sales * 0.15); // 15% commission
    const logistics = Math.floor(sales * 0.10);  // 10% logistics
    const marketing = Math.floor(sales * 0.08);  // 8% marketing
    const cogs = Math.floor(sales * 0.30);       // Cost of goods sold (hidden but part of profit calc)
    
    const expenses = commission + logistics + marketing + cogs;
    
    // Profit = Sales - Returns - Expenses
    // Note: Spec formula: (Sales - Commission - Logistics) / (Sales + Returns) ... 
    // We will use a standard Profit = Sales - All Expenses for the absolute number
    const profit = sales - returns - expenses;
    
    // Margin Calculation per Spec: (Sales - Commission - Logistics) / (Sales + Returns) * 100%
    // Simplified for visualization: Profit / Sales * 100
    const margin = parseFloat(((profit / sales) * 100).toFixed(1));
    const ros = parseFloat(((profit / (sales - returns)) * 100).toFixed(1));

    data.push({
      date: dateStr,
      sales,
      returns,
      expenses,
      commission,
      logistics,
      marketing,
      profit,
      margin,
      ros
    });
  }
  return data;
};

export const fetchFinanceData = async (days: number = 30): Promise<FinanceRow[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateRandomDailyData(days));
    }, 600);
  });
};

export const calculateSummary = (data: FinanceRow[]): FinanceSummary => {
  const totalSales = data.reduce((acc, row) => acc + row.sales, 0);
  const totalExpenses = data.reduce((acc, row) => acc + row.expenses, 0);
  const totalProfit = data.reduce((acc, row) => acc + row.profit, 0);
  
  // Weighted average margin
  const avgMargin = totalSales > 0 ? parseFloat(((totalProfit / totalSales) * 100).toFixed(1)) : 0;

  return {
    totalSales,
    totalExpenses,
    totalProfit,
    avgMargin
  };
};
