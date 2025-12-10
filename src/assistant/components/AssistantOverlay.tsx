import React, { useEffect } from 'react';
import { MessageSquare, Mic, Sparkles, User, X, Maximize2 } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext';
import { AppSettings, Tab } from '../../types';
import { mapAdapter } from '../services/mapAdapter';
import { insightsEngine } from '../services/insightsEngine';

// Panels
import ChatPanel from './ChatPanel';
import VoicePanel from './VoicePanel';
import InsightsPanel from './InsightsPanel';
import PersonaPanel from './PersonaPanel';

import '../styles/assistant.css';

interface AssistantOverlayProps {
  activeTab: Tab;
  settings: AppSettings;
}

const AssistantOverlay: React.FC<AssistantOverlayProps> = ({ activeTab, settings }) => {
  const { ui, insights } = useAssistant();
  
  // Normalize context for the internal engine
  const appContext = mapAdapter.normalizeContext(activeTab, settings);

  // Trigger insights engine on context change
  useEffect(() => {
    insightsEngine.onContextChange(appContext, (newInsights) => {
      insights.setInsights(newInsights);
    });
  }, [activeTab]);

  const renderContent = () => {
    switch (ui.activeMode) {
      case 'chat': return <ChatPanel appContext={appContext} />;
      case 'voice': return <VoicePanel appContext={appContext} />;
      case 'insights': return <InsightsPanel />;
      case 'persona': return <PersonaPanel />;
      default: return <ChatPanel appContext={appContext} />;
    }
  };

  return (
    <div className="assistant-overlay-container font-sans text-white">
      
      {/* Main Panel */}
      <div className={`assistant-panel ${!ui.isOpen ? 'closed' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-bold text-sm tracking-wide">Linda AI</span>
          </div>
          <button onClick={ui.toggleOpen} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="assistant-content bg-slate-900/30">
          {renderContent()}
        </div>

        {/* Bottom Nav */}
        <div className="flex justify-around p-3 bg-slate-900/80 border-t border-white/10 backdrop-blur-lg">
          <NavBtn 
            icon={MessageSquare} 
            isActive={ui.activeMode === 'chat'} 
            onClick={() => ui.setMode('chat')} 
          />
          <NavBtn 
            icon={Mic} 
            isActive={ui.activeMode === 'voice'} 
            onClick={() => ui.setMode('voice')} 
          />
          <NavBtn 
            icon={Sparkles} 
            isActive={ui.activeMode === 'insights'} 
            onClick={() => ui.setMode('insights')} 
            badge={insights.list.length}
          />
          <NavBtn 
            icon={User} 
            isActive={ui.activeMode === 'persona'} 
            onClick={() => ui.setMode('persona')} 
          />
        </div>
      </div>

      {/* FAB (Floating Action Button) */}
      <button 
        className="assistant-fab" 
        onClick={ui.toggleOpen}
        title="Open Linda AI"
      >
        {ui.isOpen ? <X size={28} className="text-white" /> : <Sparkles size={28} className="text-white" />}
      </button>
    </div>
  );
};

const NavBtn: React.FC<{ icon: any, isActive: boolean, onClick: () => void, badge?: number }> = ({ icon: Icon, isActive, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg transition-all relative ${
      isActive ? 'text-indigo-400 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    {badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border border-slate-900">
        {badge}
      </span>
    )}
  </button>
);

export default AssistantOverlay;