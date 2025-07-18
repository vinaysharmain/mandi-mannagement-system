import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const { message, context, type } = await req.json();

    let response;
    
    switch (type) {
      case 'search':
        // Handle intelligent search queries
        const searchResults = await aiService.intelligentSearch(message);
        return NextResponse.json({
          type: 'search',
          results: searchResults.results,
          summary: searchResults.summary,
          suggestions: searchResults.suggestions
        });

      case 'pricing':
        // Handle price optimization requests
        const { itemName, currentPrice } = JSON.parse(context || '{}');
        const pricingAdvice = await aiService.optimizePricing(itemName, currentPrice, context);
        return NextResponse.json({
          type: 'pricing',
          response: pricingAdvice,
          suggestions: [
            "Check competitor pricing",
            "Review seasonal trends",
            "Analyze demand patterns",
            "Consider bulk discounts"
          ]
        });

      case 'customer_analysis':
        // Handle customer behavior analysis
        const customerData = JSON.parse(context || '{}');
        const analysis = await aiService.analyzeCustomerBehavior(customerData);
        return NextResponse.json({
          type: 'customer_analysis',
          response: analysis,
          suggestions: [
            "Review customer purchase history",
            "Create targeted offers",
            "Improve customer retention",
            "Analyze payment patterns"
          ]
        });

      default:
        // Handle general chat queries
        const result = await aiService.processNaturalQuery(message, context);
        return NextResponse.json({
          type: 'chat',
          response: result.response,
          context: result.context,
          timestamp: result.timestamp,
          suggestions: [
            "Show me inventory insights",
            "Analyze sales trends",
            "Check customer patterns",
            "Optimize pricing strategy",
            "Review market conditions"
          ]
        });
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({ 
      response: "I'm having trouble processing your request. Please try again.",
      error: true 
    }, { status: 500 });
  }
}

// Enhanced GET endpoint for AI insights and alerts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'insights';

    switch (type) {
      case 'insights':
        const insights = await aiService.generateInsights();
        return NextResponse.json({ 
          insights: insights.map(insight => ({
            ...insight,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString()
          }))
        });

      case 'alerts':
        const alerts = await aiService.generateInventoryAlerts();
        return NextResponse.json({ 
          alerts: alerts.map(alert => ({
            ...alert,
            id: Math.random().toString(36).substr(2, 9)
          }))
        });

      case 'recommendations':
        // Get AI recommendations based on current business state
        const recommendations = await aiService.generateInsights();
        const actionableRecommendations = recommendations
          .filter(r => r.type === 'recommendation')
          .map(r => ({
            id: Math.random().toString(36).substr(2, 9),
            title: r.title,
            description: r.description,
            action: r.action,
            priority: r.confidence > 80 ? 'high' : 'medium',
            category: 'operational',
            timestamp: new Date().toISOString()
          }));

        return NextResponse.json({ recommendations: actionableRecommendations });

      default:
        return NextResponse.json({ 
          insights: [],
          error: 'Invalid request type' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({ 
      insights: [],
      error: true 
    }, { status: 500 });
  }
}