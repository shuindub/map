import { GoogleGenAI } from "@google/genai";
import { AppContext, AssistantInsight } from "../types";
import { mapAdapter } from "./mapAdapter";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple In-Memory Debounce
let timeoutId: any = null;

export const insightsEngine = {
  onContextChange: (context: AppContext, callback: (insights: AssistantInsight[]) => void) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      // Only generate insights for "data-heavy" screens to save tokens
      if (context.screen.includes("Landing") || context.screen.includes("Settings")) return;

      const contextString = mapAdapter.getLLMContextString(context);
      
      const prompt = `
        Based on this user context:
        ${contextString}
        
        Generate 3 short, strategic analytical questions or insights a seller should consider right now.
        Return ONLY a JSON array of objects with keys: id, title, description, severity (info/warning/critical).
        No markdown code blocks.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
          const insights = JSON.parse(text) as AssistantInsight[];
          callback(insights);
        }
      } catch (e) {
        console.error("Insights Engine Error", e);
      }
    }, 2000); // 2 second debounce
  }
};