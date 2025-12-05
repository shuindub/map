
import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, BarChart2, Sparkles, LogOut, Settings, 
  Search, Layers, Zap, Home, Sun, Moon, Languages, Grid, Wallet
} from 'lucide-react';
import { Tab, AppSettings } from '../types';
import { translations } from '../utils/translations';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  settings: AppSettings;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  const groups = [
    {
      label: t('nav.main'),
      items: [
        { id: Tab.LANDING, label: t('nav.home'), icon: Home },
        { id: Tab.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: Tab.FINANCE, label: t('nav.finance'), icon: Wallet },
        { id: Tab.TOOLS, label: t('nav.tools'), icon: Grid },
      ]
    },
    {
      label: t('nav.market'),
      items: [
        { id: Tab.PRODUCTS, label: t('nav.products'), icon: ShoppingBag },
        { id: Tab.NICHE, label: t('nav.niche'), icon: Layers },
        { id: Tab.COMPETITORS, label: t('nav.competitors'), icon: BarChart2 },
        { id: Tab.SEO, label: t('nav.seo'), icon: Search },
      ]
    },
    {
      label: t('nav.ai'),
      items: [
        { id: Tab.ORACLE, label: t('nav.oracle'), icon: Sparkles },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-2xl transition-all duration-300">
      {/* Brand Header */}
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-200 dark:border-slate-800/50 h-[72px] md:h-auto">
        <img src="https://i.ibb.co/WW00J7Cv/MAP-2.png" alt="MAP Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0" />
        <div className="hidden md:block overflow-hidden">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none tracking-tight">MAP</h1>
          <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider whitespace-nowrap">Analytics Suite</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 md:px-3 space-y-6 scrollbar-hide">
        {groups.map((group, idx) => (
          <div key={idx}>
            <h3 className="hidden md:block px-3 mb-2 text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider truncate">{group.label}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-300'
                    }`}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-300'}`} />
                    <span className="hidden md:block font-medium text-sm truncate">{item.label}</span>
                    
                    {item.id === Tab.ORACLE && (
                      <span className="absolute right-2 top-2 md:right-3 md:top-auto flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mx-1 md:mx-3 p-2 md:p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center md:items-start">
           <div className="flex items-center gap-0 md:gap-2 mb-0 md:mb-2">
             <Zap size={16} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
             <span className="hidden md:block text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{t('nav.pro')}</span>
           </div>
           <p className="hidden md:block text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
             {t('nav.pro_desc')}
           </p>
        </div>
      </div>

      <div className="p-2 md:p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <button 
            onClick={settings.toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-0 md:px-3 py-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium"
            title={settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden md:inline">{settings.theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          
          <button 
            onClick={() => settings.setLanguage(settings.language === 'en' ? 'ru' : 'en')}
            className="flex-1 flex items-center justify-center gap-2 px-0 md:px-3 py-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium"
            title="Switch Language"
          >
            <Languages size={16} />
            <span className="hidden md:inline">{settings.language.toUpperCase()}</span>
          </button>
        </div>

        <button className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm" title={t('nav.settings')}>
          <Settings size={20} />
          <span className="hidden md:block">{t('nav.settings')}</span>
        </button>
        <button className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm" title={t('nav.logout')}>
          <LogOut size={20} />
          <span className="hidden md:block">{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
