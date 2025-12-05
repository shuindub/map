import React from 'react';
import { ArrowRight, BarChart2, Globe, Layers, Zap, Shield, Rocket, Sun, Moon, Languages, HardDrive } from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/translations';

interface LandingPageProps {
  onEnter: () => void;
  onOpenAuth: () => void;
  settings: AppSettings;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onOpenAuth, settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/WW00J7Cv/MAP-2.png" alt="MAP Logo" className="w-10 h-10 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MAP</h1>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hidden md:block">Marketplace Analytics Platform</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t('land.nav_cap')}</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t('land.nav_pricing')}</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t('land.nav_api')}</a>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
              <button onClick={onOpenAuth} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors" title="Connect Drive">
                <HardDrive size={20} />
              </button>
              <button onClick={settings.toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => settings.setLanguage(settings.language === 'en' ? 'ru' : 'en')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1">
                <Languages size={20} />
                <span className="text-xs font-bold">{settings.language.toUpperCase()}</span>
              </button>
            </div>

            <button 
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-[#0f172a] hover:bg-slate-800 dark:hover:bg-indigo-50 font-bold rounded-lg transition-all transform hover:scale-105"
            >
              {t('land.signin')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-900/20 dark:to-[#0f172a] -z-10 pointer-events-none transition-colors duration-300" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200 dark:bg-purple-600/10 blur-[120px] rounded-full -z-10 opacity-50 dark:opacity-100 transition-all" />
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-600/10 blur-[120px] rounded-full -z-10 opacity-50 dark:opacity-100 transition-all" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wide">
              <Zap size={12} className="text-yellow-600 dark:text-yellow-400" />
              <span>{t('land.hero_tag')}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-indigo-100 dark:to-indigo-400">
              {t('land.hero_title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {t('land.hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onEnter}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
              >
                <span>{t('land.launch')}</span>
                <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
                <Rocket size={18} className="text-slate-400" />
                <span>{t('land.demo')}</span>
              </button>
            </div>
            <div className="pt-4 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0f172a] bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
              </div>
              <p>{t('land.trusted')} <span className="text-slate-800 dark:text-slate-300 font-semibold">2,400+</span> {t('land.sellers')}</p>
            </div>
          </div>

          <div className="relative">
             <div className="relative z-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl p-2 transition-colors duration-300">
                <div className="rounded-xl overflow-hidden bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 relative transition-colors duration-300">
                   {/* Fake UI Preview */}
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none"></div>
                   <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/20 border border-red-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/20 border border-yellow-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/20 border border-green-500/50"></div>
                      </div>
                      <div className="h-2 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                   </div>
                   <div className="p-6 grid grid-cols-2 gap-4 opacity-90 dark:opacity-80">
                      <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"></div>
                      <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"></div>
                      <div className="col-span-2 h-48 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-end p-4 gap-2">
                        <div className="w-full bg-indigo-200 dark:bg-indigo-500/20 h-[40%] rounded-t-sm"></div>
                        <div className="w-full bg-indigo-300 dark:bg-indigo-500/40 h-[70%] rounded-t-sm"></div>
                        <div className="w-full bg-indigo-400 dark:bg-indigo-500/60 h-[50%] rounded-t-sm"></div>
                        <div className="w-full bg-indigo-500 dark:bg-indigo-500/80 h-[90%] rounded-t-sm"></div>
                        <div className="w-full bg-indigo-600 dark:bg-indigo-500 h-[60%] rounded-t-sm"></div>
                      </div>
                   </div>
                </div>
             </div>
             {/* Floating Elements */}
             <div className="absolute -right-6 top-20 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 animate-bounce-slow">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                      <BarChart2 size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Daily Revenue</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">+$12,450</p>
                   </div>
                </div>
             </div>
             <div className="absolute -left-6 bottom-20 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 animate-bounce-slow" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                      <Shield size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Competitor Alert</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Price Drop Detected</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">12M+</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{t('land.stat_skus')}</p>
           </div>
           <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">98%</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{t('land.stat_acc')}</p>
           </div>
           <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">2.4s</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{t('land.stat_speed')}</p>
           </div>
           <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">24/7</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{t('land.stat_ai')}</p>
           </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 bg-white dark:bg-[#0f172a] transition-colors duration-300">
         <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('land.everything')}</h2>
               <p className="text-slate-600 dark:text-slate-400">{t('land.everything_sub')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: t('land.feat_market'), desc: t('land.feat_market_desc'), icon: Globe, color: 'text-blue-500 dark:text-blue-400' },
                 { title: t('land.feat_spy'), desc: t('land.feat_spy_desc'), icon: Shield, color: 'text-red-500 dark:text-red-400' },
                 { title: t('land.feat_seo'), desc: t('land.feat_seo_desc'), icon: Layers, color: 'text-purple-500 dark:text-purple-400' },
                 { title: t('land.feat_unit'), desc: t('land.feat_unit_desc'), icon: BarChart2, color: 'text-green-500 dark:text-green-400' },
                 { title: t('land.feat_ai'), desc: t('land.feat_ai_desc'), icon: Zap, color: 'text-yellow-500 dark:text-yellow-400' },
                 { title: t('land.feat_oracle'), desc: t('land.feat_oracle_desc'), icon: Rocket, color: 'text-pink-500 dark:text-pink-400' },
               ].map((feature, i) => (
                 <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all group shadow-sm dark:shadow-none">
                    <div className={`w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                       <feature.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120] text-center transition-colors duration-300">
         <div className="flex items-center justify-center gap-2 mb-6 opacity-50 text-slate-900 dark:text-white">
            <img src="https://i.ibb.co/WW00J7Cv/MAP-2.png" alt="MAP Logo" className="w-6 h-6 object-contain" />
            <span className="font-bold">MAP</span>
         </div>
         <p className="text-slate-500 text-sm">© 2026 MAP. {t('land.rights')}</p>
      </div>
    </div>
  );
};

export default LandingPage;