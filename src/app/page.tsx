"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Bot,
  BarChart3,
  AlertTriangle,
  Settings,
  Bell,
  MessageCircle,
  Brain,
  Zap,
} from "lucide-react";
import InventoryManagement from "../components/InventoryManagement";
import SalesManagement from "../components/SalesManagement";
import CustomerManagement from "../components/CustomerManagement";
import PurchaseManagement from "../components/PurchaseManagement";
import AISearch from "../components/AISearch";
import AIQuickActions from "../components/AIQuickActions";

interface DashboardStats {
  totalStock: number;
  todaySales: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockItems: number;
  todayRevenue: number;
}

interface AIInsight {
  type: "prediction" | "alert" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStock: 0,
    todaySales: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayRevenue: 0,
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load AI insights from API
  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        const response = await fetch('/api/ai');
        const data = await response.json();
        if (data.insights) {
          setAiInsights(data.insights);
        }
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        // Fallback to mock data
        const mockInsights: AIInsight[] = [
          {
            type: "prediction",
            title: "Tomato Demand Surge Expected",
            description: "AI predicts 30% increase in tomato demand next week based on weather patterns and historical data.",
            confidence: 85,
            action: "Increase tomato inventory",
          },
          {
            type: "alert",
            title: "Price Fluctuation Alert",
            description: "Onion prices showing unusual volatility. Consider hedging strategies.",
            confidence: 92,
            action: "Review pricing strategy",
          },
          {
            type: "recommendation",
            title: "Optimal Stocking Suggestion",
            description: "Based on seasonal trends, reduce potato stock by 15% and increase leafy vegetables by 25%.",
            confidence: 78,
            action: "Adjust inventory levels",
          },
        ];
        setAiInsights(mockInsights);
      }
    };

    fetchAIInsights();

    // Mock stats
    setStats({
      totalStock: 15420,
      todaySales: 342,
      totalCustomers: 1240,
      pendingOrders: 28,
      lowStockItems: 12,
      todayRevenue: 45600,
    });

    // Initial chat message
    setChatMessages([
      {
        id: '1',
        type: 'ai',
        message: 'Hi! I\'m your AI assistant for mandi operations. I can help you with inventory management, price predictions, demand forecasting, and more. What would you like to know?',
        timestamp: new Date()
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          context: `Current stats: ${JSON.stringify(stats)}`
        }),
      });

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: data.response || "I'm having trouble processing your request. Please try again.",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultSelect = (result: any) => {
    // Handle search result selection - navigate to relevant section
    switch (result.type) {
      case 'inventory':
        setActiveTab('inventory');
        break;
      case 'customer':
        setActiveTab('customers');
        break;
      case 'sale':
        setActiveTab('sales');
        break;
      case 'purchase':
        setActiveTab('purchases');
        break;
      case 'insight':
        setAiChatOpen(true);
        break;
      case 'action':
        // Handle specific actions
        console.log('Action required:', result.action);
        break;
      default:
        setAiChatOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    setAiChatOpen(true);
  };

  const handleAIActionClick = (action: string) => {
    switch (action) {
      case 'price_optimization':
        setNewMessage("Help me optimize prices for my top selling items based on market conditions");
        setAiChatOpen(true);
        break;
      case 'inventory_analysis':
        setNewMessage("Analyze my current inventory levels and suggest optimizations");
        setAiChatOpen(true);
        break;
      case 'customer_analysis':
        setNewMessage("Show me insights about my customer buying patterns");
        setAiChatOpen(true);
        break;
      case 'sales_forecast':
        setNewMessage("What are the sales forecasts for the next week?");
        setAiChatOpen(true);
        break;
      case 'pricing':
        setActiveTab('inventory');
        break;
      case 'inventory':
        setActiveTab('inventory');
        break;
      case 'customer':
        setActiveTab('customers');
        break;
      case 'sales':
        setActiveTab('sales');
        break;
      default:
        setAiChatOpen(true);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AIInsightCard = ({ insight }: { insight: AIInsight }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              insight.type === "prediction"
                ? "bg-blue-100 text-blue-800"
                : insight.type === "alert"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {insight.type.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {insight.confidence}% confidence
        </span>
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
      {insight.action && (
        <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
          {insight.action}
        </button>
      )}
    </div>
  );

  const Navigation = () => (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Mandi Management
            </h1>
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              AI Powered
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "inventory", label: "Inventory", icon: Package },
              { id: "purchases", label: "Purchases", icon: ShoppingCart },
              { id: "sales", label: "Sales", icon: TrendingUp },
              { id: "customers", label: "Customers", icon: Users },
              { id: "billing", label: "Billing", icon: DollarSign },
              { id: "reports", label: "Reports", icon: Calendar },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-80">
            <AISearch 
              onResultSelect={handleSearchResultSelect}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button
            onClick={() => setAiChatOpen(!aiChatOpen)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </button>
        </div>
      </div>
    </nav>
  );

  const DashboardContent = () => (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Stock"
          value={stats.totalStock.toLocaleString()}
          icon={Package}
          color="bg-blue-500"
          trend={5.2}
        />
        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          icon={ShoppingCart}
          color="bg-green-500"
          trend={12.5}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-purple-500"
          trend={3.1}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Calendar}
          color="bg-orange-500"
          trend={-2.3}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="bg-red-500"
          trend={-8.1}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-500"
          trend={18.2}
        />
      </div>

      {/* AI Quick Actions */}
      <AIQuickActions onActionClick={handleAIActionClick} />

      {/* AI Insights Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              AI Insights & Predictions
            </h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Insights
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <AIInsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "New Stock Entry",
            icon: Package,
            desc: "Add new inventory",
            color: "bg-blue-500",
            action: () => setActiveTab("inventory")
          },
          {
            title: "Quick Bill",
            icon: DollarSign,
            desc: "Generate customer bill",
            color: "bg-green-500",
            action: () => setActiveTab("billing")
          },
          {
            title: "Stock Transfer",
            icon: TrendingUp,
            desc: "Transfer to other location",
            color: "bg-purple-500",
            action: () => setActiveTab("inventory")
          },
          {
            title: "AI Price Optimizer",
            icon: Bot,
            desc: "Optimize pricing with AI",
            color: "bg-orange-500",
            action: () => setAiChatOpen(true)
          },
        ].map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
          >
            <div
              className={`p-3 rounded-lg ${action.color} w-fit mb-4 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const AIChat = () => (
    <div
      className={`fixed right-6 bottom-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        aiChatOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={() => setAiChatOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="p-4 h-64 overflow-y-auto">
        <div className="space-y-3">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-blue-50 text-blue-900 ml-4' 
                  : 'bg-gray-50 text-gray-700 mr-4'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-50 p-3 rounded-lg mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        {activeTab === "dashboard" && <DashboardContent />}
        {activeTab === "inventory" && <InventoryManagement />}
        {activeTab === "purchases" && <PurchaseManagement />}
        {activeTab === "sales" && <SalesManagement />}
        {activeTab === "customers" && <CustomerManagement />}
        {activeTab === "billing" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Billing & Invoicing</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Billing features coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === "reports" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Reports features coming soon...</p>
            </div>
          </div>
        )}
      </main>
      <AIChat />
    </div>
  );
}
