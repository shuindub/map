import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/translations';

// Interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPWA: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const t = (key: string) => translations[settings.language][key] || key;

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-bounce-slow">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 border border-indigo-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="https://i.ibb.co/WW00J7Cv/MAP-2.png" alt="MAP Logo" className="w-10 h-10 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {settings.language === 'ru' ? 'Установить приложение' : 'Install App'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.language === 'ru' ? 'Добавить MAP на главный экран' : 'Add MAP to your home screen'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
          <button 
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-md"
          >
            {settings.language === 'ru' ? 'Добавить' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;