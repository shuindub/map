
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mic, MicOff, Send, Paperclip, Minimize2, Activity, Sparkles, MoreHorizontal 
} from 'lucide-react';
import { aiCore } from '../ai/aiCore';
import { voiceAdapter, VoiceSession } from '../ai/voiceAdapter';
import { mapAdapter } from './services/mapAdapter';
import { AppSettings, Tab } from '../types';
import { AssistantMessage, PersonaConfig } from './types';

// Updated Real Avatars
const AVATARS = [
  '/linda/1.png',
  '/linda/2.png',
  '/linda/3.png',
  '/linda/4.png'
];

interface AssistantOverlayProps {
  activeTab?: Tab;
  settings?: AppSettings;
}

export const AssistantOverlay: React.FC<AssistantOverlayProps> = ({ 
  activeTab = Tab.DASHBOARD, 
  settings = { theme: 'dark', language: 'en', isAuthenticated: true } as AppSettings 
}) => {
  // --- State ---
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Start position: Bottom Right with some padding
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: 'init', role: 'model', content: 'Hello! I am Linda. How can I help you analyze your data today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'online' | 'typing...' | 'listening...' | 'speaking'>('online');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Random avatar on mount
  const [avatarUrl] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  
  // --- Refs ---
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 }); // Mouse position at start
  const itemStartPos = useRef({ x: 0, y: 0 }); // Item position at start
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeVoiceSession = useRef<VoiceSession | null>(null);

  // --- Helpers ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded]);

  // Handle resize to keep widget on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Drag Logic (Improved) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag if interacting with controls
    if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    itemStartPos.current = { x: position.x, y: position.y };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    
    let newX = itemStartPos.current.x + deltaX;
    let newY = itemStartPos.current.y + deltaY;

    // Boundaries
    const width = 60; // Approximate collapsed width
    const height = 60;
    
    newX = Math.max(10, Math.min(window.innerWidth - width - 10, newX));
    newY = Math.max(10, Math.min(window.innerHeight - height - 10, newY));

    setPosition({ x: newX, y: newY });
  }, []);

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // --- Panel Positioning ---
  const getPanelStyle = () => {
    const PANEL_WIDTH = 380;
    const PANEL_HEIGHT = 600;
    const MARGIN = 20;

    let left = position.x;
    let top = position.y - PANEL_HEIGHT;

    // Flip Horizontal if too close to right edge
    if (position.x + PANEL_WIDTH > window.innerWidth) {
      left = position.x - PANEL_WIDTH + 60; // 60 is widget width
    }

    // Flip Vertical if too close to top edge (rare, but good to have)
    if (top < MARGIN) {
      top = position.y + 70; // Open downwards
    }

    // Hard Boundaries for expanded state
    left = Math.max(MARGIN, Math.min(window.innerWidth - PANEL_WIDTH - MARGIN, left));
    top = Math.max(MARGIN, Math.min(window.innerHeight - PANEL_HEIGHT - MARGIN, top));

    return { left, top };
  };

  // --- AI Logic ---
  const getContext = () => mapAdapter.normalizeContext(activeTab, settings);
  
  const persona: PersonaConfig = {
    id: 'linda',
    name: 'Linda',
    roleDescription: 'You are Linda, an intelligent marketplace analytics assistant.',
    style: 'Concise, professional, and data-driven.'
  };

  const handleSendMessage = async () => {
    if (!input.trim() || status === 'typing...') return;

    const userText = input;
    setInput('');
    setStatus('typing...');

    // User Msg
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now()
    }]);

    // AI Placeholder
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'model',
      content: '',
      timestamp: Date.now()
    }]);

    try {
      const stream = aiCore.sendTextMessage(userText, getContext(), persona, messages);
      let fullContent = '';
      
      for await (const chunk of stream) {
        if (chunk) {
          fullContent += chunk;
          setMessages(prev => prev.map(m => 
            m.id === aiMsgId ? { ...m, content: fullContent } : m
          ));
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.map(m => 
        m.id === aiMsgId ? { ...m, content: "Connection interrupted." } : m
      ));
    } finally {
      setStatus('online');
    }
  };

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      // Stop
      setIsVoiceMode(false);
      setStatus('online');
      activeVoiceSession.current?.disconnect();
      activeVoiceSession.current = null;
    } else {
      // Start
      setIsVoiceMode(true);
      setStatus('listening...');
      
      const session = await voiceAdapter.startVoiceSession(
        getContext(),
        persona,
        (text, isUser) => {
           // On transcript
           console.log("Transcript:", text);
        },
        (audioData) => {
           // Mock speaking state for UI since we don't have full audio context setup in this view
           setStatus('speaking');
           setTimeout(() => setStatus('listening...'), 3000); 
        },
        (err) => {
           setStatus('online');
           setIsVoiceMode(false);
        }
      );

      if (session) {
        activeVoiceSession.current = session;
      }
    }
  };

  // --- Render ---

  if (!isExpanded) {
    return (
      <div 
        ref={dragRef}
        onMouseDown={handleMouseDown}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[9999] cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
      >
        <div 
          onClick={(e) => {
            if (!isDragging.current) setIsExpanded(true);
          }}
          className="relative w-16 h-16 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden group"
        >
          <img 
            src={avatarUrl} 
            alt="Linda" 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
            onError={(e) => {
              // Fallback
              (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/150?u=linda-fallback';
            }}
          />
          
          {/* Online Dot */}
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          
          {/* Tooltip */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-white/10">
            Ask Linda
          </div>
        </div>
      </div>
    );
  }

  const panelPos = getPanelStyle();

  return (
    <div 
      style={{ left: panelPos.left, top: panelPos.top }}
      className="fixed z-[9999] flex flex-col w-[380px] h-[600px] max-w-[90vw] max-h-[80vh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden font-sans transition-all duration-300 ease-out"
    >
      {/* --- Drag Handle / Header --- */}
      <div 
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={avatarUrl} alt="AI" className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm" />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
              status === 'online' ? 'bg-green-500' : 
              status === 'listening...' ? 'bg-red-500 animate-pulse' :
              status === 'speaking' ? 'bg-purple-500 animate-pulse' :
              'bg-yellow-500'
            }`}></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Linda AI</h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{status}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleVoiceMode}
            className={`p-2 rounded-full transition-all ${
              isVoiceMode 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isVoiceMode ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button 
            onClick={() => setIsExpanded(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-[#0b1120]/50">
        {isVoiceMode ? (
          /* Voice Visualizer */
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
             <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-20 absolute inset-0 ${status === 'listening...' ? 'animate-ping' : ''}`}></div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
                   <Mic size={40} className="text-white" />
                </div>
             </div>
             
             {/* Waveform Animation */}
             <div className="flex items-center gap-1 h-8">
               {[...Array(8)].map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-1.5 rounded-full ${status === 'speaking' ? 'animate-bounce bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                   style={{ 
                     height: status === 'speaking' ? '60%' : '20%', 
                     animationDuration: '0.8s',
                     animationDelay: `${i * 0.1}s` 
                   }}
                 ></div>
               ))}
             </div>
             <p className="text-sm text-slate-500 font-medium">
               {status === 'speaking' ? 'Linda is speaking...' : status === 'listening...' ? 'Listening...' : 'Ready'}
             </p>
          </div>
        ) : (
          /* Chat List */
          <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.content || <span className="animate-pulse">...</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* --- Input Area --- */}
      {!isVoiceMode && (
        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-transparent focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
            <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Paperclip size={20} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none max-h-24 py-2.5"
              rows={1}
              style={{ minHeight: '40px' }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="p-2 bg-indigo-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:shadow-none hover:bg-indigo-500 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
