import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext';
import { aiCore } from '../services/aiCore';
import { AppContext } from '../types';

interface VoicePanelProps {
  appContext: AppContext;
}

const VoicePanel: React.FC<VoicePanelProps> = ({ appContext }) => {
  const { audio, persona, session } = useAssistant();
  const [status, setStatus] = useState<string>('Ready to Connect');
  const [activeSession, setActiveSession] = useState<any>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (activeSession) {
        // activeSession.close(); // If API supports it
        audio.setListening(false);
      }
    };
  }, []);

  const toggleSession = async () => {
    if (audio.isListening) {
      // Stop
      audio.setListening(false);
      setStatus('Disconnected');
      if (activeSession) {
        // activeSession.disconnect(); 
        setActiveSession(null);
      }
    } else {
      // Start
      setStatus('Connecting to Gemini Live...');
      audio.setListening(true);
      
      const s = await aiCore.startVoiceSession(
        appContext, 
        persona.current,
        (text) => {
           // Transcript update
           setStatus(`Listening: ${text.substring(0, 30)}...`);
        },
        (audioData) => {
           // Play audio logic would go here (Web Audio API)
           audio.setSpeaking(true);
           setTimeout(() => audio.setSpeaking(false), 500); // Mock speaking state
        }
      );

      if (s) {
        setActiveSession(s);
        setStatus('Live Session Active');
      } else {
        setStatus('Connection Failed');
        audio.setListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 text-center relative overflow-hidden">
      {/* Background Pulse */}
      {audio.isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-64 h-64 bg-purple-500/10 rounded-full animate-ping"></div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-white mb-2">Gemini Live</h3>
        <p className="text-sm text-slate-400">{status}</p>
      </div>

      {/* Visualizer */}
      <div className="h-32 flex items-center justify-center gap-2">
        {audio.isListening ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="audio-bar w-3 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-full"
                style={{ 
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  height: audio.isSpeaking ? '60%' : '20%' 
                }} 
              />
            ))}
          </>
        ) : (
          <div className="text-slate-600">
            <Activity size={64} />
          </div>
        )}
      </div>

      <button
        onClick={toggleSession}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl border-4 ${
          audio.isListening 
            ? 'bg-red-500 border-red-400 shadow-red-500/50 hover:bg-red-600' 
            : 'bg-indigo-600 border-indigo-400 shadow-indigo-500/50 hover:bg-indigo-500'
        }`}
      >
        {audio.isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
      </button>

      <p className="text-xs text-slate-500 max-w-xs">
        Microphone permission required. Audio is streamed directly to Google's Neural Cloud.
      </p>
    </div>
  );
};

export default VoicePanel;