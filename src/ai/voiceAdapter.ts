
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { AppContext, PersonaConfig } from "../assistant/types";
import { mapAdapter } from "../assistant/services/mapAdapter";

const MODEL_VOICE = 'gemini-2.5-flash-native-audio-preview-09-2025';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface VoiceSession {
  disconnect: () => void;
  sendAudioChunk: (data: string) => void;
}

export const voiceAdapter = {
  /**
   * Initializes a Gemini Live session with STT and TTS capabilities.
   */
  startVoiceSession: async (
    context: AppContext, 
    persona: PersonaConfig,
    onTranscript: (text: string, isUser: boolean) => void,
    onAudioData: (base64: string) => void,
    onError: (error: any) => void
  ): Promise<VoiceSession | null> => {
    
    const contextString = mapAdapter.getLLMContextString(context);
    const systemInstruction = `
      You are Linda. 
      ${persona.roleDescription}
      Current Context: ${contextString}.
      Keep responses conversational and concise.
    `;

    try {
      const session = await ai.live.connect({
        model: MODEL_VOICE,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live: Connected");
          },
          onmessage: (msg: LiveServerMessage) => {
            // Handle Model Audio (TTS)
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              onAudioData(audioData);
            }

            // Handle Transcriptions (STT)
            if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
               onTranscript(msg.serverContent.modelTurn.parts[0].text, false);
            }
          },
          onclose: () => {
            console.log("Gemini Live: Disconnected");
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            onError(err);
          }
        }
      });

      return {
        disconnect: () => {
          // session.close() if available in SDK typings
          console.log("Voice session ending");
        },
        sendAudioChunk: (base64Data: string) => {
          session.sendRealtimeInput([{ mimeType: "audio/pcm", data: base64Data }]);
        }
      };

    } catch (e) {
      console.error("Failed to init voice session", e);
      onError(e);
      return null;
    }
  }
};
