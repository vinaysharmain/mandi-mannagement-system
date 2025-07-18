import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Bot, 
  ArrowRight,
  Sparkles,
  Clock,
  Target
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
}

interface AIQuickActionsProps {
  onActionClick?: (action: string) => void;
}

const AIQuickActions: React.FC<AIQuickActionsProps> = ({ onActionClick }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai?type=recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        {
          id: '1',
          title: 'Optimize Tomato Pricing',
          description: 'Current tomato prices are 12% below market average. Increase by ₹3/kg for optimal profit.',
          action: 'Adjust pricing strategy',
          priority: 'high',
          category: 'pricing',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Restock Low Inventory',
          description: '12 items are running low. Prioritize restocking onions, potatoes, and rice.',
          action: 'Review inventory levels',
          priority: 'high',
          category: 'inventory',
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Contact Inactive Customers',
          description: '5 regular customers haven\'t ordered in 7+ days. Reach out to prevent churn.',
          action: 'Customer outreach',
          priority: 'medium',
          category: 'customer',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'customer':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'sales':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const quickActions = [
    {
      title: 'Smart Price Check',
      description: 'AI-powered price optimization',
      icon: DollarSign,
      color: 'bg-green-500',
      action: 'price_optimization'
    },
    {
      title: 'Inventory Insights',
      description: 'Real-time stock analysis',
      icon: Package,
      color: 'bg-blue-500',
      action: 'inventory_analysis'
    },
    {
      title: 'Customer Patterns',
      description: 'Behavioral analysis & trends',
      icon: Users,
      color: 'bg-purple-500',
      action: 'customer_analysis'
    },
    {
      title: 'Sales Forecast',
      description: 'AI demand prediction',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      action: 'sales_forecast'
    }
  ];

  const handleActionClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Quick Actions</h2>
        </div>
        <button 
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.action)}
            className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className={`p-2 rounded-lg ${action.color} w-fit mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h3>
            <p className="text-xs text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>

      {/* AI Recommendations */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Bot className="w-4 h-4 mr-2" />
          AI Recommendations
        </h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div 
                key={rec.id}
                className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                onClick={() => handleActionClick(rec.category)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(rec.category)}
                    <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-purple-600">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-xs">{rec.action}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(rec.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={() => handleActionClick('view_all_recommendations')}
          className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          View All AI Recommendations
        </button>
      </div>
    </div>
  );
};

export default AIQuickActions;