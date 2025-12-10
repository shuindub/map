import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssistantMessage, AssistantInsight, PersonaConfig, AssistantMode } from '../types';

export const PERSONAS: PersonaConfig[] = [
  { id: 'analyst', name: 'Analyst', roleDescription: 'You are a data-driven analyst focusing on margins and ROI.', style: 'Formal and precise.' },
  { id: 'creative', name: 'Creative', roleDescription: 'You are a marketing specialist focusing on SEO and content.', style: 'Energetic and inspiring.' },
  { id: 'risk', name: 'Risk Officer', roleDescription: 'You are a pessimistic risk manager looking for stockouts and losses.', style: 'Cautious and warning.' },
];

interface AssistantState {
  ui: {
    isOpen: boolean;
    activeMode: AssistantMode;
    toggleOpen: () => void;
    setMode: (mode: AssistantMode) => void;
  };
  session: {
    messages: AssistantMessage[];
    addMessage: (msg: AssistantMessage) => void;
    updateLastMessage: (content: string) => void;
  };
  persona: {
    current: PersonaConfig;
    setPersona: (id: string) => void;
  };
  audio: {
    isListening: boolean;
    isSpeaking: boolean;
    setListening: (val: boolean) => void;
    setSpeaking: (val: boolean) => void;
  };
  insights: {
    list: AssistantInsight[];
    setInsights: (list: AssistantInsight[]) => void;
  };
}

const AssistantContext = createContext<AssistantState | null>(null);

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AssistantMode>('chat');

  // Session State
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: 'init', role: 'model', content: 'Hello! I am Linda. How can I help you analyze your data today?', timestamp: Date.now() }
  ]);

  // Persona State
  const [currentPersona, setCurrentPersona] = useState<PersonaConfig>(PERSONAS[0]);

  // Audio State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Insights State
  const [insights, setInsights] = useState<AssistantInsight[]>([]);

  // Actions
  const toggleOpen = () => setIsOpen(prev => !prev);
  const setMode = (mode: AssistantMode) => setActiveMode(mode);
  
  const addMessage = (msg: AssistantMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const newHistory = [...prev];
      if (newHistory.length > 0) {
        newHistory[newHistory.length - 1].content = content;
      }
      return newHistory;
    });
  };

  const setPersona = (id: string) => {
    const p = PERSONAS.find(x => x.id === id);
    if (p) setCurrentPersona(p);
  };

  const value: AssistantState = {
    ui: { isOpen, activeMode, toggleOpen, setMode },
    session: { messages, addMessage, updateLastMessage },
    persona: { current: currentPersona, setPersona },
    audio: { isListening, isSpeaking, setListening: setIsListening, setSpeaking: setIsSpeaking },
    insights: { list: insights, setInsights }
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) throw new Error("useAssistant must be used within AssistantProvider");
  return context;
};