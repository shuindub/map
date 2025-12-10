import React from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext';

const InsightsPanel: React.FC = () => {
  const { insights } = useAssistant();

  if (insights.list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
        <Lightbulb size={48} className="mb-4 opacity-50" />
        <p>Linda is analyzing the current screen...</p>
        <p className="text-xs mt-2">Switch tabs to generate new insights.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Proactive Intelligence</h3>
      {insights.list.map((item) => (
        <div 
          key={item.id} 
          className={`p-4 rounded-xl border ${
            item.severity === 'critical' ? 'bg-red-900/20 border-red-500/50' :
            item.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/50' :
            'bg-slate-800 border-slate-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${
              item.severity === 'critical' ? 'text-red-400' :
              item.severity === 'warning' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {item.severity === 'critical' ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightsPanel;