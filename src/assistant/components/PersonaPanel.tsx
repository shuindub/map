import React from 'react';
import { UserCheck, Shield, TrendingUp } from 'lucide-react';
import { useAssistant, PERSONAS } from '../context/AssistantContext';

const PersonaPanel: React.FC = () => {
  const { persona } = useAssistant();

  return (
    <div className="p-4 h-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select Personality</h3>
      <div className="space-y-3">
        {PERSONAS.map((p) => {
          const isActive = persona.current.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => persona.setPersona(p.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                isActive 
                  ? 'bg-indigo-600/20 border-indigo-500' 
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${isActive ? 'text-indigo-400' : 'text-slate-200'}`}>
                  {p.name}
                </span>
                {isActive && <UserCheck size={16} className="text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{p.roleDescription}</p>
              <span className="text-[10px] uppercase bg-black/30 px-2 py-1 rounded text-slate-500">
                {p.style}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaPanel;