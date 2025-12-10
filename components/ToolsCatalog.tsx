
import React from 'react';
import { 
  BarChart2, ShoppingCart, ShoppingBag, 
  Gavel, Calculator, CreditCard, MessageSquare, 
  ScanSearch, Target, FileText, Settings, 
  Code, Download, ExternalLink, Zap
} from 'lucide-react';
import { AppSettings, Tab } from '../types';
import { translations } from '../utils/translations';

interface ToolGroupProps {
  title: string;
  items: ToolItem[];
  settings: AppSettings;
  onToolClick: (id: string) => void;
}

interface ToolItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  tag?: 'new' | 'ai' | 'free';
  external?: boolean;
}

const ToolGroup: React.FC<ToolGroupProps> = ({ title, items, settings, onToolClick }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => onToolClick(item.id)}
            className="flex items-start p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group text-left relative overflow-hidden"
          >
            <div className={`p-3 rounded-lg mr-4 flex-shrink-0 ${
              item.tag === 'ai' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : item.tag === 'free'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
            }`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t(item.labelKey)}
                </span>
                {item.tag && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    item.tag === 'new' 
                      ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/30'
                      : item.tag === 'ai'
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30'
                  }`}>
                    {t(`tools.tag_${item.tag}`)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {settings.language === 'ru' 
                  ? 'Доступен полный функционал.' 
                  : 'Full functionality available.'}
              </p>
            </div>
            {item.external && (
              <ExternalLink size={14} className="absolute top-4 right-4 text-slate-300 dark:text-slate-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

interface ToolsCatalogProps {
  settings: AppSettings;
  setActiveTab: (tab: Tab) => void;
}

const ToolsCatalog: React.FC<ToolsCatalogProps> = ({ settings, setActiveTab }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  const handleToolClick = (id: string) => {
    if (id === 'ozon-an') {
      setActiveTab(Tab.OZON_ANALYTICS);
    }
    // Add other redirects here
  };

  const groups = [
    {
      title: t('tools.cat_market'),
      items: [
        { id: 'wb-an', labelKey: 'tools.ext_wb', icon: BarChart2, tag: 'ai' },
        { id: 'ozon-an', labelKey: 'tools.ext_ozon', icon: ShoppingBag, tag: 'ai' },
        { id: 'ym-an', labelKey: 'tools.ext_ym', icon: ShoppingCart },
      ] as ToolItem[]
    },
    {
      title: t('tools.cat_wb'),
      items: [
        { id: 'wb-cab', labelKey: 'tools.wb_cab', icon: Settings, tag: 'new' },
        { id: 'wb-bid', labelKey: 'tools.wb_bidder', icon: Gavel, tag: 'ai' },
        { id: 'wb-cards', labelKey: 'tools.wb_cards', icon: CreditCard, tag: 'ai' },
        { id: 'wb-reply', labelKey: 'tools.wb_reply', icon: MessageSquare, tag: 'ai' },
      ] as ToolItem[]
    },
    {
      title: t('tools.cat_universal'),
      items: [
        { id: 'sku-360', labelKey: 'tools.uni_sku', icon: ScanSearch, tag: 'ai' },
        { id: 'price-man', labelKey: 'tools.uni_price', icon: Target },
        { id: 'seo-tools', labelKey: 'tools.uni_seo', icon: FileText },
      ] as ToolItem[]
    },
    {
      title: t('tools.cat_free'),
      items: [
        { id: 'plugin', labelKey: 'tools.free_plugin', icon: Download, tag: 'free' },
        { id: 'calc', labelKey: 'tools.free_calc', icon: Calculator, tag: 'free' },
        { id: 'blog', labelKey: 'tools.free_blog', icon: ExternalLink, tag: 'free', external: true },
        { id: 'api', labelKey: 'tools.free_api', icon: Code, tag: 'free', external: true },
      ] as ToolItem[]
    }
  ];

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
         <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Zap className="text-yellow-300 fill-current" />
              {t('tools.title')}
            </h2>
            <p className="text-indigo-100 max-w-2xl">{t('tools.subtitle')}</p>
         </div>
      </div>

      <div className="space-y-2">
        {groups.map((group, idx) => (
          <ToolGroup 
            key={idx} 
            title={group.title} 
            items={group.items} 
            settings={settings}
            onToolClick={handleToolClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default ToolsCatalog;
