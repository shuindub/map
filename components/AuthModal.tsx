import React from 'react';
import { Shield, AlertTriangle, UserCheck } from 'lucide-react';
import { CLIENT_ID } from '../services/driveService';

interface AuthModalProps {
  onLogin: () => void;
  onDemoLogin: () => void;
  onSkip: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onDemoLogin, onSkip }) => {
  const isConfigured = CLIENT_ID && !CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <img src="https://i.ibb.co/WW00J7Cv/MAP-2.png" alt="MAP Logo" className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security Protocol</h2>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          MAP Analytics requires secure access to synchronize tactical data. Choose your authentication level.
        </p>

        {!isConfigured && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3 text-sm text-red-800 dark:text-red-200">
            <AlertTriangle className="flex-shrink-0" size={20} />
            <div>
              <strong>Configuration Required:</strong>
              <p className="mt-1">Please set your <code className="bg-red-100 dark:bg-black/30 px-1 rounded">CLIENT_ID</code> in <i>services/driveService.ts</i> to enable Google Auth.</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={onLogin}
            disabled={!isConfigured}
            className="w-full py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 bg-white rounded-full p-0.5" />
            Authenticate via Google
          </button>

          <button 
            onClick={onDemoLogin}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <UserCheck size={18} />
            Login as Demo Seller
          </button>
          
          <button 
            onClick={onSkip}
            className="w-full py-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium rounded-xl transition-all text-sm"
          >
            Continue without Saving (Incognito)
          </button>
        </div>
        
        <p className="text-center mt-4 text-[10px] text-slate-400">
          Secure encrypted connection.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;