export type AssistantMode = 'chat' | 'voice' | 'insights' | 'persona';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface AssistantInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface PersonaConfig {
  id: string;
  name: string;
  roleDescription: string;
  style: string;
}

export interface AppContext {
  screen: string;
  marketplace?: string;
  language: string;
  theme: string;
  userRole: string;
  [key: string]: any;
}