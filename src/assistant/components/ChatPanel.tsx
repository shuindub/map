import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext';
import { aiCore } from '../services/aiCore';
import { AppContext } from '../types';

interface ChatPanelProps {
  appContext: AppContext;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ appContext }) => {
  const { session, persona } = useAssistant();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userText = input;
    setInput('');
    
    // Add User Message
    session.addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now()
    });

    setIsStreaming(true);

    // Add Placeholder AI Message
    session.addMessage({
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: '', // Will stream into this
      timestamp: Date.now()
    });

    try {
      const stream = aiCore.sendTextMessage(userText, appContext, persona.current, session.messages);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          session.updateLastMessage(fullResponse);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
              {msg.role === 'user' ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Linda..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 p-1.5 bg-purple-600 rounded-lg text-white disabled:opacity-50 hover:bg-purple-500 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;