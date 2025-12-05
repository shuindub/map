import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HardDrive } from 'lucide-react';
import { getMarketInsights } from '../services/geminiService';
import { ChatMessage, AppSettings } from '../types';
import { translations } from '../utils/translations';
import * as StorageManager from '../services/storageManager';

const OracleChat: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const t = (key: string) => translations[settings.language][key] || key;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize greeting on mount or language change
  useEffect(() => {
    // Check if we have history to load from StorageManager
    const session = StorageManager.getCurrentSession();
    
    // We only load initial history if we haven't already populated messages
    if (messages.length === 0) {
      // Re-fetch logic from storage manager in case it was initialized async
      StorageManager.initializeStorage().then(({ restored, lastSteps }) => {
        if (restored && lastSteps.length > 0) {
          const restoredMessages: ChatMessage[] = [];
          lastSteps.forEach(step => {
            restoredMessages.push({
              id: `hist_user_${step.step_number}`,
              role: 'user',
              text: step.user_input,
              timestamp: new Date(step.timestamp)
            });
            restoredMessages.push({
               id: `hist_model_${step.step_number}`,
               role: 'model',
               text: step.model_output,
               timestamp: new Date(step.timestamp)
            });
          });
          
          // Add system greeting at end if needed, or just leave history
          setMessages(restoredMessages);
        } else {
           // Default Greeting
           setMessages([
            {
              id: '1',
              role: 'model',
              text: t('oracle.greeting'),
              timestamp: new Date()
            }
          ]);
        }
      });
    }
  }, [settings.language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Append language instruction to prompt
      const prompt = settings.language === 'ru' 
        ? `${userMsg.text} (Please reply in Russian language)` 
        : userMsg.text;

      const responseText = await getMarketInsights(prompt);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Save to Drive
      StorageManager.saveStep(userText, responseText);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
        <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">{t('oracle.title')}</h2>
        <div className="ml-auto flex items-center gap-2">
           {settings.isAuthenticated && <HardDrive size={14} className="text-indigo-500" title="Saving to Drive" />}
           <span className="text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">{t('oracle.online')}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-purple-600'
            }`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 dark:bg-indigo-500/20 border border-indigo-500/30 text-white dark:text-indigo-100 rounded-tr-sm' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('oracle.placeholder')}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleChat;