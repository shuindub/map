
import React, { useEffect, useState } from 'react';
import FinanceHeader from './FinanceHeader';
import FinanceChart from './FinanceChart';
import FinanceDataTable from './FinanceDataTable';
import { AppSettings, FinanceRow, FinanceSummary } from '../types';
import * as FinanceService from '../services/financeDataService';

interface FinanceTabProps {
  settings: AppSettings;
}

const FinanceTab: React.FC<FinanceTabProps> = ({ settings }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinanceRow[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({ totalSales: 0, totalExpenses: 0, totalProfit: 0, avgMargin: 0 });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const rows = await FinanceService.fetchFinanceData(30);
      setData(rows);
      setSummary(FinanceService.calculateSummary(rows));
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <FinanceHeader summary={summary} settings={settings} />
      <FinanceChart data={data} settings={settings} />
      <FinanceDataTable data={data} settings={settings} />
    </div>
  );
};

export default FinanceTab;
