
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import ProductTable from './components/ProductTable';
import OracleChat from './components/OracleChat';
import LandingPage from './components/LandingPage';
import ToolsCatalog from './components/ToolsCatalog';
import OzonAnalytics from './components/OzonAnalytics';
import SellerHome from './components/SellerHome';
import FinanceTab from './components/FinanceTab';
import AuthModal from './components/AuthModal';
import InstallPWA from './components/InstallPWA';
import { Tab, Language, Theme, AppSettings } from './types';
import { Search, Bell, User, Layers, Globe, RotateCw } from 'lucide-react';
import { translations } from './utils/translations';
import * as DriveService from './services/driveService';
import * as StorageManager from './services/storageManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LANDING);
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  
  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle Theme Change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Init Google Auth on Mount
  useEffect(() => {
    // We delay the auth modal until the user actually enters the app from landing page
    DriveService.initTokenClient((response) => {
      if (response && response.access_token) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        // Initialize Storage
        StorageManager.initializeStorage().then((result) => {
          if (result.restored) {
            console.log("History restored from Drive");
          }
        });
      }
    });
  }, []);

  const handleLogin = () => {
    DriveService.requestAccessToken();
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Stay on landing tab to show SellerHome
    setActiveTab(Tab.LANDING);
  };

  const handleEnterApp = () => {
    // Direct entry, no forced auth check
    setActiveTab(Tab.DASHBOARD);
  };

  const handleRotate = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        // Attempt to lock orientation (Android/Chrome only)
        if (screen.orientation && 'lock' in screen.orientation) {
          // @ts-ignore
          screen.orientation.lock('landscape').catch(console.error);
        }
      }).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        if (screen.orientation && 'unlock' in screen.orientation) {
          screen.orientation.unlock();
        }
      }
    }
  };

  // App Settings Object
  const settings: AppSettings = {
    theme,
    language,
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
    setLanguage: (lang) => setLanguage(lang),
    isAuthenticated,
    login: handleLogin
  };

  const t = (key: string) => translations[language][key] || key;

  // If on Landing Page AND NOT Authenticated, render public Landing
  if (activeTab === Tab.LANDING && !isAuthenticated) {
    return (
      <>
        <InstallPWA settings={settings} />
        {showAuthModal && (
          <AuthModal 
            onLogin={handleLogin} 
            onDemoLogin={handleDemoLogin}
            onSkip={() => setShowAuthModal(false)} 
          />
        )}
        <LandingPage 
          onEnter={handleEnterApp} 
          onOpenAuth={() => setShowAuthModal(true)}
          settings={settings} 
        />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.LANDING:
        // Authenticated 'Home' view
        return <SellerHome settings={settings} />;
      case Tab.DASHBOARD:
        return <DashboardStats settings={settings} />;
      case Tab.FINANCE:
        return <FinanceTab settings={settings} />;
      case Tab.TOOLS:
        return <ToolsCatalog settings={settings} />;
      case Tab.OZON_ANALYTICS:
        return <OzonAnalytics settings={settings} />;
      case Tab.PRODUCTS:
        return <ProductTable settings={settings} />;
      case Tab.ORACLE:
        return <OracleChat settings={settings} />;
      case Tab.COMPETITORS:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-fade-in px-4">
             <div className="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xl">
                <Globe size={40} className="text-indigo-500 dark:text-indigo-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">{t('title.competitors')}</h3>
             <p className="text-sm max-w-md text-center">{language === 'ru' ? 'Отслеживание 450,000+ SKU конкурентов на 12 маркетплейсах. Запустите новый трекер для начала.' : 'Tracking 450,000+ competitor SKUs across 12 marketplaces. Initialize a new tracker to begin.'}</p>
             <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors">
               {language === 'ru' ? 'Добавить конкурента' : 'Add Competitor'}
             </button>
          </div>
        );
      case Tab.SEO:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-fade-in px-4">
             <div className="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xl">
                <Search size={40} className="text-purple-500 dark:text-purple-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">{t('title.seo')}</h3>
             <p className="text-sm max-w-md text-center">{language === 'ru' ? 'Анализ плотности ключей, частотности и отслеживание позиций. Доступ к базе ключей Rakhu.' : 'Analyze keyword density, search frequency, and position tracking. Access the Rakhu Keyword Database.'}</p>
          </div>
        );
      case Tab.NICHE:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-fade-in px-4">
             <div className="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xl">
                <Layers size={40} className="text-pink-500 dark:text-pink-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">{t('title.niche')}</h3>
             <p className="text-sm max-w-md text-center">{language === 'ru' ? 'Найдите возможности голубого океана с высоким потенциалом маржи. Сверка со скоростью трендов.' : 'Identify blue ocean opportunities with high margin potential. Cross-reference with trend velocity.'}</p>
          </div>
        );
      default:
        return <DashboardStats settings={settings} />;
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case Tab.LANDING: return isAuthenticated ? t('nav.home') : t('title.overview');
      case Tab.DASHBOARD: return t('title.dashboard');
      case Tab.FINANCE: return t('title.finance');
      case Tab.TOOLS: return t('title.tools');
      case Tab.OZON_ANALYTICS: return t('ozon.title');
      case Tab.PRODUCTS: return t('title.products');
      case Tab.ORACLE: return t('title.oracle');
      case Tab.COMPETITORS: return t('title.competitors');
      case Tab.SEO: return t('title.seo');
      case Tab.NICHE: return t('title.niche');
      default: return t('title.overview');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-300">
      <InstallPWA settings={settings} />
      
      {showAuthModal && (
        <AuthModal 
          onLogin={handleLogin} 
          onDemoLogin={handleDemoLogin}
          onSkip={() => setShowAuthModal(false)} 
        />
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} settings={settings} />
      
      {/* Adjusted margin left for mobile (ml-16) vs desktop (ml-64) */}
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 z-40 py-2 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-sm transition-colors duration-300">
          <div className="min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2 truncate">
              <span className="truncate">{getTitle()}</span>
              {activeTab === Tab.ORACLE && <span className="text-[10px] md:text-xs bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 flex-shrink-0">{t('app.ai_active')}</span>}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm truncate hidden md:block">MAP Analytics Suite v2.4</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={t('app.search')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-72 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm dark:shadow-lg"
              />
            </div>

            {/* Mobile Rotate Button */}
            <button 
              onClick={handleRotate}
              className="md:hidden relative p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all"
              title="Rotate / Fullscreen"
            >
              <RotateCw size={20} />
            </button>
            
            <button className="relative p-2 md:p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800 shadow-sm shadow-red-500/50"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Victoria W.</p>
                <div className="flex items-center justify-end gap-1">
                  <p className="text-xs text-indigo-500 dark:text-indigo-400">{t('app.member')}</p>
                  {isAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Connected to Drive"></span>}
                </div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-500/30 overflow-hidden shadow-lg cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all">
                <img 
                  src="https://i.ibb.co/8WtWxRz/telegram-peer-photo-size-2-4327766011780638646-1-0-0.jpg" 
                  alt="Victoria W." 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
