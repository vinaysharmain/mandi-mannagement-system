import { google } from '@ai-sdk/google';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// Configure Gemini with API key
const geminiModel = google('gemini-1.5-flash-latest');

// Define interfaces for type safety
interface BusinessContext {
  inventory: {
    totalItems: number;
    lowStockItems: number;
    expiringItems: number;
    topSellingItems: string[];
    categories: string[];
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number;
    topCustomers: string[];
    creditCustomers: number;
  };
  sales: {
    todaySales: number;
    todayRevenue: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
  market: {
    currentSeason: string;
    upcomingFestivals: string[];
    weatherImpact: string;
    priceVolatility: string;
  };
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalOrders: number;
  lastOrderDate?: string;
  creditLimit: number;
  outstandingAmount: number;
  category: string;
  purchaseHistory?: Array<{
    date: string;
    amount: number;
    items: string[];
  }>;
}

interface QueryContext {
  currentTime?: string;
  userQuery?: string;
  [key: string]: unknown;
}

interface Insight {
  type: 'alert' | 'recommendation' | 'insight';
  title: string;
  description: string;
  confidence: number;
  action: string;
}

interface Alert {
  type: 'alert';
  title: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Define the schema for intelligent search results
const SearchResultSchema = z.object({
  results: z.array(z.object({
    type: z.enum(['inventory', 'customer', 'sale', 'purchase', 'insight', 'action']),
    title: z.string(),
    description: z.string(),
    data: z.record(z.unknown()),
    relevance: z.number(),
    action: z.string().optional()
  })),
  summary: z.string(),
  suggestions: z.array(z.string())
});

export class AIService {
  private businessContext: BusinessContext = {
    inventory: {
      totalItems: 0,
      lowStockItems: 0,
      expiringItems: 0,
      topSellingItems: [],
      categories: []
    },
    customers: {
      totalCustomers: 0,
      activeCustomers: 0,
      topCustomers: [],
      creditCustomers: 0
    },
    sales: {
      todaySales: 0,
      todayRevenue: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0
    },
    market: {
      currentSeason: '',
      upcomingFestivals: [],
      weatherImpact: '',
      priceVolatility: ''
    }
  };

  constructor() {
    this.updateBusinessContext();
  }

  // Update business context with latest data
  async updateBusinessContext() {
    // This would typically fetch from your database
    this.businessContext = {
      inventory: {
        totalItems: 1500,
        lowStockItems: 12,
        expiringItems: 8,
        topSellingItems: ['Tomatoes', 'Onions', 'Potatoes', 'Rice', 'Wheat'],
        categories: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy']
      },
      customers: {
        totalCustomers: 1240,
        activeCustomers: 890,
        topCustomers: ['Sharma Retail', 'Gupta Wholesale', 'Singh Traders'],
        creditCustomers: 45
      },
      sales: {
        todaySales: 342,
        todayRevenue: 45600,
        weeklyGrowth: 12.5,
        monthlyGrowth: 8.3
      },
      market: {
        currentSeason: 'monsoon',
        upcomingFestivals: ['Diwali', 'Dussehra'],
        weatherImpact: 'moderate',
        priceVolatility: 'high'
      }
    };
  }

  // Intelligent search across all business data
  async intelligentSearch(query: string) {
    const searchPrompt = `
    You are an AI assistant for a mandi (agricultural market) management system. 
    Based on the user's search query, provide intelligent search results.
    
    Current Business Context:
    ${JSON.stringify(this.businessContext, null, 2)}
    
    User Query: "${query}"
    
    Analyze the query and provide relevant results from inventory, customers, sales, purchases, insights, and actionable recommendations.
    Focus on practical, actionable information that helps with mandi operations.
    
    For each result, provide:
    - type: category of result
    - title: clear, descriptive title
    - description: detailed explanation
    - data: relevant data points
    - relevance: score from 0-100
    - action: suggested action if applicable
    
    Also provide:
    - summary: brief overview of findings
    - suggestions: related queries the user might want to explore
    `;

    try {
      const result = await generateObject({
        model: geminiModel,
        schema: SearchResultSchema,
        prompt: searchPrompt,
        maxTokens: 1000,
      });

      return result.object;
    } catch (error) {
      console.error('Search error:', error);
      return {
        results: [],
        summary: "I'm having trouble searching right now. Please try again.",
        suggestions: []
      };
    }
  }

  // Generate contextual insights based on current data
  async generateInsights() {
    const insightPrompt = `
    Based on the current business context, generate 3-5 AI-powered insights for mandi management.
    
    Business Context:
    ${JSON.stringify(this.businessContext, null, 2)}
    
    Focus on:
    - Inventory optimization
    - Sales opportunities
    - Risk management
    - Customer retention
    - Market trends
    - Seasonal patterns
    
    For each insight, provide confidence level, impact assessment, and actionable recommendations.
    `;

    try {
      const result = await generateText({
        model: geminiModel,
        prompt: insightPrompt,
        maxTokens: 800,
      });

      return this.parseInsights(result.text);
    } catch (error) {
      console.error('Insights error:', error);
      return [];
    }
  }

  // Natural language query processing
  async processNaturalQuery(query: string, context?: QueryContext) {
    const enhancedContext = {
      ...this.businessContext,
      ...context,
      currentTime: new Date().toISOString(),
      userQuery: query
    };

    const systemPrompt = `
    You are an expert AI assistant for mandi (agricultural market) management. 
    You have deep knowledge of:
    - Inventory management and optimization
    - Agricultural market trends and pricing
    - Customer relationship management
    - Sales and purchase analytics
    - Supply chain management
    - Financial analysis for agricultural businesses
    - Weather impact on agricultural markets
    - Seasonal demand patterns
    
    Current Business Context:
    ${JSON.stringify(enhancedContext, null, 2)}
    
    Provide detailed, actionable responses. When possible, include:
    - Specific numbers and data points
    - Actionable recommendations
    - Timeline for implementation
    - Potential risks or considerations
    - Related insights or suggestions
    
    Be conversational but professional, and always focus on practical business value.
    `;

    try {
      const result = await generateText({
        model: geminiModel,
        system: systemPrompt,
        prompt: query,
        maxTokens: 600,
      });

      return {
        response: result.text,
        context: enhancedContext,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Query processing error:', error);
      return {
        response: "I'm having trouble processing your request right now. Please try again.",
        context: enhancedContext,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Price optimization recommendations
  async optimizePricing(itemName: string, currentPrice: number, context?: QueryContext) {
    const pricingPrompt = `
    As a mandi pricing expert, analyze the optimal price for "${itemName}" 
    currently priced at ₹${currentPrice}.
    
    Consider:
    - Current market conditions
    - Seasonal factors
    - Supply and demand
    - Competition
    - Customer sensitivity
    - Profit margins
    
    Business Context:
    ${JSON.stringify(this.businessContext, null, 2)}
    
    Provide specific pricing recommendations with reasoning.
    `;

    try {
      const result = await generateText({
        model: geminiModel,
        prompt: pricingPrompt,
        maxTokens: 400,
      });

      return result.text;
    } catch (error) {
      console.error('Price optimization error:', error);
      return "Unable to generate pricing recommendations right now.";
    }
  }

  // Smart inventory alerts
  async generateInventoryAlerts() {
    const alertPrompt = `
    Based on the current inventory situation, generate important alerts and recommendations.
    
    Focus on:
    - Low stock items that need restocking
    - Items approaching expiry
    - Overstocked items
    - Seasonal demand changes
    - Supply chain risks
    
    Business Context:
    ${JSON.stringify(this.businessContext, null, 2)}
    
    Format as actionable alerts with priority levels.
    `;

    try {
      const result = await generateText({
        model: geminiModel,
        prompt: alertPrompt,
        maxTokens: 500,
      });

      return this.parseAlerts(result.text);
    } catch (error) {
      console.error('Inventory alerts error:', error);
      return [];
    }
  }

  // Customer behavior analysis
  async analyzeCustomerBehavior(customerData: CustomerData) {
    const analysisPrompt = `
    Analyze customer behavior patterns and provide insights.
    
    Customer Data:
    ${JSON.stringify(customerData, null, 2)}
    
    Business Context:
    ${JSON.stringify(this.businessContext, null, 2)}
    
    Provide insights on:
    - Purchase patterns
    - Seasonal preferences
    - Credit behavior
    - Loyalty indicators
    - Upselling opportunities
    - Retention risks
    `;

    try {
      const result = await generateText({
        model: geminiModel,
        prompt: analysisPrompt,
        maxTokens: 500,
      });

      return result.text;
    } catch (error) {
      console.error('Customer analysis error:', error);
      return "Unable to analyze customer behavior right now.";
    }
  }

  // Helper methods
  private parseInsights(text: string): Insight[] {
    // Parse the AI response into structured insights
    const lines = text.split('\n').filter(line => line.trim());
    const insights: Insight[] = [];
    
    let currentInsight: Insight | null = null;
    
    for (const line of lines) {
      if (line.includes('Insight') || line.includes('Alert') || line.includes('Recommendation')) {
        if (currentInsight) {
          insights.push(currentInsight);
        }
        currentInsight = {
          type: line.includes('Alert') ? 'alert' : 'recommendation',
          title: line.trim(),
          description: '',
          confidence: 75,
          action: ''
        };
      } else if (currentInsight && line.trim()) {
        if (line.includes('Action:') || line.includes('Recommendation:')) {
          currentInsight.action = line.replace(/Action:|Recommendation:/, '').trim();
        } else {
          currentInsight.description += line.trim() + ' ';
        }
      }
    }
    
    if (currentInsight) {
      insights.push(currentInsight);
    }
    
    return insights;
  }

  private parseAlerts(text: string): Alert[] {
    // Parse AI response into structured alerts
    const lines = text.split('\n').filter(line => line.trim());
    const alerts: Alert[] = [];
    
    for (const line of lines) {
      if (line.includes('Alert') || line.includes('Warning') || line.includes('Action Required')) {
        alerts.push({
          type: 'alert',
          title: line.trim(),
          priority: line.includes('Critical') ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return alerts;
  }
}

export const aiService = new AIService();