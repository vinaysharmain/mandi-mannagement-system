"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Clock,
  MapPin,
  Bot,
  Zap
} from 'lucide-react';
import { Product, StockEntry, AIInsight } from '../types';

interface InventoryManagementProps {
  onClose?: () => void;
}

export default function InventoryManagement({ onClose }: InventoryManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showStockEntry, setShowStockEntry] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Tomatoes',
        category: 'Vegetables',
        unit: 'kg',
        currentStock: 500,
        minStockLevel: 100,
        maxStockLevel: 1000,
        avgPurchasePrice: 25,
        avgSellingPrice: 35,
        lastUpdated: new Date(),
        perishable: true,
        shelfLife: 7,
        locations: [
          { locationId: '1', locationName: 'Main Store', quantity: 300, reservedQuantity: 50, availableQuantity: 250 },
          { locationId: '2', locationName: 'Cold Storage', quantity: 200, reservedQuantity: 0, availableQuantity: 200 }
        ]
      },
      {
        id: '2',
        name: 'Potatoes',
        category: 'Vegetables',
        unit: 'kg',
        currentStock: 800,
        minStockLevel: 200,
        maxStockLevel: 1500,
        avgPurchasePrice: 20,
        avgSellingPrice: 28,
        lastUpdated: new Date(),
        perishable: false,
        locations: [
          { locationId: '1', locationName: 'Main Store', quantity: 800, reservedQuantity: 100, availableQuantity: 700 }
        ]
      },
      {
        id: '3',
        name: 'Onions',
        category: 'Vegetables',
        unit: 'kg',
        currentStock: 50,
        minStockLevel: 100,
        maxStockLevel: 800,
        avgPurchasePrice: 30,
        avgSellingPrice: 42,
        lastUpdated: new Date(),
        perishable: false,
        locations: [
          { locationId: '1', locationName: 'Main Store', quantity: 50, reservedQuantity: 0, availableQuantity: 50 }
        ]
      },
      {
        id: '4',
        name: 'Apples',
        category: 'Fruits',
        unit: 'kg',
        currentStock: 300,
        minStockLevel: 50,
        maxStockLevel: 500,
        avgPurchasePrice: 80,
        avgSellingPrice: 120,
        lastUpdated: new Date(),
        perishable: true,
        shelfLife: 14,
        locations: [
          { locationId: '2', locationName: 'Cold Storage', quantity: 300, reservedQuantity: 30, availableQuantity: 270 }
        ]
      }
    ];

    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'alert',
        title: 'Low Stock Alert: Onions',
        description: 'Onion stock is below minimum level. Current: 50kg, Minimum: 100kg',
        confidence: 95,
        impact: 'high',
        timeframe: 'immediate',
        action: 'Reorder immediately',
        category: 'inventory',
        createdAt: new Date(),
        status: 'new'
      },
      {
        id: '2',
        type: 'prediction',
        title: 'Demand Surge: Tomatoes',
        description: 'AI predicts 40% increase in tomato demand next week due to festival season',
        confidence: 87,
        impact: 'medium',
        timeframe: '7 days',
        action: 'Increase stock by 300kg',
        category: 'inventory',
        createdAt: new Date(),
        status: 'new'
      },
      {
        id: '3',
        type: 'optimization',
        title: 'Storage Optimization',
        description: 'Move 100kg potatoes from main store to free up space for incoming fresh produce',
        confidence: 78,
        impact: 'low',
        timeframe: '2 days',
        action: 'Relocate stock',
        category: 'inventory',
        createdAt: new Date(),
        status: 'new'
      }
    ];

    setProducts(mockProducts);
    setAiInsights(mockInsights);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: Product) => {
    if (product.currentStock < product.minStockLevel) return 'low';
    if (product.currentStock > product.maxStockLevel) return 'high';
    return 'normal';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product);
    const statusColor = getStockStatusColor(stockStatus);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {stockStatus.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-lg font-semibold text-gray-900">{product.currentStock} {product.unit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-lg font-semibold text-gray-900">
              {product.locations.reduce((sum, loc) => sum + loc.availableQuantity, 0)} {product.unit}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Stock Level</span>
            <span>{Math.round((product.currentStock / product.maxStockLevel) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                stockStatus === 'low' ? 'bg-red-500' : 
                stockStatus === 'high' ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((product.currentStock / product.maxStockLevel) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-600">Purchase Price</p>
            <p className="font-medium">₹{product.avgPurchasePrice}/{product.unit}</p>
          </div>
          <div>
            <p className="text-gray-600">Selling Price</p>
            <p className="font-medium">₹{product.avgSellingPrice}/{product.unit}</p>
          </div>
        </div>

        {product.perishable && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Shelf Life: {product.shelfLife} days</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedProduct(product)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 inline mr-1" />
            View Details
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const AIInsightCard = ({ insight }: { insight: AIInsight }) => {
    const getInsightColor = (type: string) => {
      switch (type) {
        case 'alert': return 'border-red-200 bg-red-50';
        case 'prediction': return 'border-blue-200 bg-blue-50';
        case 'recommendation': return 'border-green-200 bg-green-50';
        case 'optimization': return 'border-purple-200 bg-purple-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    };

    return (
      <div className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">
              {insight.type.toUpperCase()} • {insight.confidence}% confidence
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            insight.impact === 'critical' ? 'bg-red-100 text-red-800' :
            insight.impact === 'high' ? 'bg-orange-100 text-orange-800' :
            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {insight.impact.toUpperCase()}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
        <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">⏱️ {insight.timeframe}</span>
          {insight.action && (
            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
              {insight.action}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your stock with AI-powered insights</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Inventory Insights</h3>
          </div>
          <span className="text-sm text-gray-500">{aiInsights.length} active insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Spices">Spices</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Package className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Products ({filteredProducts.length})
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Low Stock</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Overstock</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Stock Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-medium">{selectedProduct.currentStock} {selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Level:</span>
                      <span className="font-medium">{selectedProduct.minStockLevel} {selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Level:</span>
                      <span className="font-medium">{selectedProduct.maxStockLevel} {selectedProduct.unit}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span className="font-medium">₹{selectedProduct.avgPurchasePrice}/{selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-medium">₹{selectedProduct.avgSellingPrice}/{selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margin:</span>
                      <span className="font-medium text-green-600">
                        ₹{selectedProduct.avgSellingPrice - selectedProduct.avgPurchasePrice}/{selectedProduct.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Location-wise Stock</h4>
                <div className="space-y-3">
                  {selectedProduct.locations.map((location) => (
                    <div key={location.locationId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">{location.locationName}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {location.availableQuantity} {selectedProduct.unit} available
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium ml-2">{location.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reserved:</span>
                          <span className="font-medium ml-2">{location.reservedQuantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium ml-2">{location.availableQuantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Stock Entry
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Transfer Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}