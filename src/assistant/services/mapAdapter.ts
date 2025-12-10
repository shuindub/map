import { AppSettings, Tab } from '../../types';
import { AppContext } from '../types';

export const mapAdapter = {
  /**
   * Normalizes the raw App state into a clean context object for the AI.
   * This function is READ-ONLY and does not mutate the app state.
   */
  normalizeContext: (activeTab: Tab, settings: AppSettings): AppContext => {
    
    // Infer marketplace from tab
    let marketplace = 'general';
    if (activeTab === Tab.OZON_ANALYTICS) marketplace = 'ozon';
    if (activeTab === Tab.PRODUCTS) marketplace = 'multi-channel';
    
    // Map internal Tab enums to readable screen names
    const screenMap: Record<Tab, string> = {
      [Tab.LANDING]: 'Home / Overview',
      [Tab.DASHBOARD]: 'Main Dashboard',
      [Tab.FINANCE]: 'Financial Analytics',
      [Tab.TOOLS]: 'Tools Catalog',
      [Tab.PRODUCTS]: 'Product Management',
      [Tab.COMPETITORS]: 'Competitor Intelligence',
      [Tab.SEO]: 'SEO & Keywords',
      [Tab.NICHE]: 'Niche Analysis',
      [Tab.ORACLE]: 'Legacy Oracle Panel',
      [Tab.OZON_ANALYTICS]: 'Ozon External Analytics (P&L, Unit Econ)',
    };

    return {
      screen: screenMap[activeTab] || 'Unknown Screen',
      marketplace,
      language: settings.language,
      theme: settings.theme,
      userRole: settings.isAuthenticated ? 'Authenticated Seller' : 'Guest',
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Generates a stringified prompt segment for the LLM.
   */
  getLLMContextString: (context: AppContext): string => {
    return `
      CURRENT APPLICATION CONTEXT:
      - User Screen: ${context.screen}
      - Marketplace Focus: ${context.marketplace}
      - Language: ${context.language}
      - User Status: ${context.userRole}
      - Time: ${context.timestamp}
    `.trim();
  }
};