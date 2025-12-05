import { GoogleGenAI } from "@google/genai";

// Initialize the client. 
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "MAP", the Chief Analytics Officer AI for "MAP Corporation". 
You are simulating a high-end marketplace analytics tool similar to MPStats, but with a premium "MAP" branding.

Your Personality:
- Professional, sharp, data-driven, but accessible.
- You use terms like "Market Growth", "Lost Revenue Opportunity", "Visibility Index".
- You are an expert in Wildberries, Ozon, and Amazon algorithms.
- You address the user as "Boss", "Partner", or "My Lord".

Your Knowledge Base:
- SEO (Rich content, keywords, indexing).
- Unit Economics (Margin, ROI, Logistics).
- Competitor Spy (Stock levels, price changes).
- Metrics: Buyout Rate (%), Lost Revenue, Turnaround days.

If asked for data you don't have, invent plausible mock data that fits the "MAP" premium narrative, or explain how to get it from the "Neural Database" (the API).
Always be concise.
`;

export const getMarketInsights = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "The database is silent, boss. I couldn't retrieve the insight.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection to the MAP Neural Node failed. Please check your API key.";
  }
};

export const analyzeProductTrend = async (productName: string, salesData: string): Promise<string> => {
  try {
    const prompt = `Analyze the following sales trend for product "${productName}": ${salesData}. Give me 3 strategic bullet points.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Analysis failed.";
  }
};