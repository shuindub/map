
import { GoogleGenAI } from "@google/genai";
import { AppContext, AssistantMessage, PersonaConfig } from "../assistant/types";
import { mapAdapter } from "../assistant/services/mapAdapter";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_TEXT = 'gemini-2.5-flash';

export const aiCore = {
  /**
   * Starts a text-based chat session and streams the response.
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

    // Map internal history to Gemini Content format
    const contents = history
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Append current message
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
      const responseStream = await ai.models.generateContentStream({
        model: MODEL_TEXT,
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("AI Core Text Error:", error);
      yield "I'm having trouble connecting to the neural core right now.";
    }
  }
};
