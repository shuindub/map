import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { AppContext, AssistantMessage, PersonaConfig } from "../types";
import { mapAdapter } from "./mapAdapter";

// Initialize API Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants
const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_VOICE = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const aiCore = {
  /**
   * Sends a text message to Gemini and returns a stream.
   */
  sendTextMessage: async function* (
    userMessage: string, 
    context: AppContext, 
    persona: PersonaConfig,
    history: AssistantMessage[]
  ) {
    const contextString = mapAdapter.getLLMContextString(context);
    
    const systemInstruction = `
      You are Linda, an AI Assistant for the MAP Analytics Suite.
      ${persona.roleDescription}
      ${persona.style}
      
      CONTEXT:
      ${contextString}
      
      Keep responses concise and markdown formatted.
    `;

    // Convert internal history to Gemini format (simplified)
    // In a real app, you would map this properly to Content objects
    const contents = [
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    try {
      const responseStream = await ai.models.generateContentStream({
        model: MODEL_TEXT,
        contents: contents, // Simplified for this demo, usually includes history
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("AI Core Text Error:", error);
      yield "I'm having trouble connecting to the neural core right now.";
    }
  },

  /**
   * Initiates a Gemini Live session.
   * Note: This uses the modern WebSocket 'connect' method from @google/genai
   */
  startVoiceSession: async (
    context: AppContext, 
    persona: PersonaConfig,
    onMessage: (text: string) => void,
    onAudioData: (base64: string) => void
  ) => {
    const contextString = mapAdapter.getLLMContextString(context);
    
    try {
      // 1. Setup Audio Contexts (Browser side)
      // Note: In a real implementation, we would handle the AudioWorklet/ScriptProcessor here
      // For this architecture demo, we define the Session connection logic.
      
      const session = await ai.live.connect({
        model: MODEL_VOICE,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are Linda. ${persona.roleDescription}. Context: ${contextString}`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            console.log("Linda Voice Connected");
          },
          onmessage: (msg: LiveServerMessage) => {
            // Handle Text Transcription
            if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
              onMessage(msg.serverContent.modelTurn.parts[0].text);
            }
            
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              onAudioData(audioData);
            }
          },
          onclose: () => {
            console.log("Linda Voice Disconnected");
          },
          onerror: (err) => {
            console.error("Linda Voice Error", err);
          }
        }
      });

      return session;

    } catch (e) {
      console.error("Failed to start voice session", e);
      return null;
    }
  }
};