"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Truck, 
  Package, 
  IndianRupee,
  Calendar,
  User,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
  X,
  Save,
  Calculator,
  Scale,
  QrCode
} from 'lucide-react';
import { Purchase, PurchaseItem, Supplier, Product } from '../types';

interface PurchaseManagementProps {
  onClose?: () => void;
}

export default function PurchaseManagement({ onClose }: PurchaseManagementProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<Purchase>>({
    items: [],
    totalAmount: 0,
    taxAmount: 0,
    status: 'pending',
    purchaseDate: new Date()
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPurchase, setShowNewPurchase] = useState(false);
  const [showSupplierSelect, setShowSupplierSelect] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [newItem, setNewItem] = useState({
    productId: '',
    productName: '',
    quantity: 0,
    rate: 0,
    lotNumber: '',
    quality: 'A' as 'A' | 'B' | 'C'
  });

  // Mock data initialization
  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'Raghav Farms',
        phone: '9876543210',
        location: 'Kurukshetra, Haryana',
        productsSupplied: ['Tomatoes', 'Potatoes', 'Onions'],
        rating: 4.8,
        paymentTerms: 7,
        outstandingPayments: 15000
      },
      {
        id: '2',
        name: 'Punjab Vegetables Co.',
        phone: '9876543211',
        location: 'Ludhiana, Punjab',
        productsSupplied: ['Cauliflower', 'Cabbage', 'Carrots'],
        rating: 4.5,
        paymentTerms: 15,
        outstandingPayments: 25000
      },
      {
        id: '3',
        name: 'Himachal Fruit Growers',
        phone: '9876543212',
        location: 'Shimla, Himachal Pradesh',
        productsSupplied: ['Apples', 'Pears', 'Plums'],
        rating: 4.9,
        paymentTerms: 10,
        outstandingPayments: 0
      }
    ];

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
        locations: []
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
        locations: []
      },
      {
        id: '3',
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
        locations: []
      }
    ];

    const mockPurchases: Purchase[] = [
      {
        id: '1',
        supplierId: '1',
        items: [
          { 
            productId: '1', 
            productName: 'Tomatoes', 
            quantity: 200, 
            unit: 'kg', 
            rate: 25, 
            amount: 5000,
            lotNumber: 'LOT001',
            quality: 'A'
          },
          { 
            productId: '2', 
            productName: 'Potatoes', 
            quantity: 500, 
            unit: 'kg', 
            rate: 20, 
            amount: 10000,
            lotNumber: 'LOT002',
            quality: 'A'
          }
        ],
        totalAmount: 15000,
        taxAmount: 750,
        purchaseDate: new Date('2024-07-18'),
        billNumber: 'PO-001',
        vehicleNumber: 'HR-05-AB-1234',
        status: 'received'
      },
      {
        id: '2',
        supplierId: '3',
        items: [
          { 
            productId: '3', 
            productName: 'Apples', 
            quantity: 100, 
            unit: 'kg', 
            rate: 80, 
            amount: 8000,
            lotNumber: 'LOT003',
            quality: 'A'
          }
        ],
        totalAmount: 8000,
        taxAmount: 400,
        purchaseDate: new Date('2024-07-17'),
        billNumber: 'PO-002',
        vehicleNumber: 'HP-12-CD-5678',
        status: 'pending'
      }
    ];

    setSuppliers(mockSuppliers);
    setProducts(mockProducts);
    setPurchases(mockPurchases);
  }, []);

  const addItemToPurchase = () => {
    if (!newItem.productId || !newItem.quantity || !newItem.rate) return;

    const product = products.find(p => p.id === newItem.productId);
    if (!product) return;

    const purchaseItem: PurchaseItem = {
      productId: newItem.productId,
      productName: product.name,
      quantity: newItem.quantity,
      unit: product.unit,
      rate: newItem.rate,
      amount: newItem.quantity * newItem.rate,
      lotNumber: newItem.lotNumber || `LOT${Date.now()}`,
      quality: newItem.quality
    };

    setCurrentPurchase(prev => {
      const updatedItems = [...(prev.items || []), purchaseItem];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount,
        taxAmount: totalAmount * 0.05, // 5% tax
      };
    });

    setNewItem({
      productId: '',
      productName: '',
      quantity: 0,
      rate: 0,
      lotNumber: '',
      quality: 'A'
    });
  };

  const removeItemFromPurchase = (index: number) => {
    setCurrentPurchase(prev => {
      const updatedItems = prev.items?.filter((_, i) => i !== index) || [];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount,
        taxAmount: totalAmount * 0.05,
      };
    });
  };

  const completePurchase = () => {
    if (!selectedSupplier || !currentPurchase.items?.length) return;

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      supplierId: selectedSupplier.id,
      items: currentPurchase.items,
      totalAmount: currentPurchase.totalAmount || 0,
      taxAmount: currentPurchase.taxAmount || 0,
      purchaseDate: new Date(),
      billNumber: `PO-${String(purchases.length + 1).padStart(3, '0')}`,
      vehicleNumber: currentPurchase.vehicleNumber,
      status: currentPurchase.status || 'pending'
    };

    setPurchases(prev => [...prev, newPurchase]);
    setCurrentPurchase({
      items: [],
      totalAmount: 0,
      taxAmount: 0,
      status: 'pending',
      purchaseDate: new Date()
    });
    setSelectedSupplier(null);
    setShowNewPurchase(false);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'partial': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    totalPurchases: purchases.length,
    pendingPurchases: purchases.filter(p => p.status === 'pending').length,
    totalValue: purchases.reduce((sum, p) => sum + p.totalAmount, 0),
    avgPurchaseValue: purchases.length ? purchases.reduce((sum, p) => sum + p.totalAmount, 0) / purchases.length : 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Management</h2>
          <p className="text-gray-600">Manage supplier purchases and stock entries</p>
        </div>
        <button
          onClick={() => setShowNewPurchase(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase</span>
        </button>
      </div>

      {/* Purchase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPurchases}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Purchase</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(stats.avgPurchaseValue).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Purchases</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => {
                const supplier = suppliers.find(s => s.id === purchase.supplierId);
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{supplier?.name || 'Unknown'}</div>
                        <div className="text-gray-500">{supplier?.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{purchase.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.vehicleNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                        {getStatusIcon(purchase.status)}
                        <span className="ml-1">{purchase.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showNewPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Purchase Order</h3>
                <button 
                  onClick={() => setShowNewPurchase(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Supplier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <button
                  onClick={() => setShowSupplierSelect(true)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  {selectedSupplier ? (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{selectedSupplier.name}</div>
                        <div className="text-sm text-gray-500">{selectedSupplier.location}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">Select Supplier</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                  <div className="relative">
                    <Truck className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="HR-05-AB-1234"
                      value={currentPurchase.vehicleNumber || ''}
                      onChange={(e) => setCurrentPurchase(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={currentPurchase.purchaseDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setCurrentPurchase(prev => ({ ...prev, purchaseDate: new Date(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Add Items */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Add Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select
                      value={newItem.productId}
                      onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        setNewItem(prev => ({ 
                          ...prev, 
                          productId: e.target.value,
                          productName: product?.name || '',
                          rate: product?.avgPurchasePrice || 0
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                    <input
                      type="number"
                      value={newItem.rate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, rate: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                    <select
                      value={newItem.quality}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quality: e.target.value as 'A' | 'B' | 'C' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="C">Grade C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <button
                      onClick={addItemToPurchase}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Items */}
              {currentPurchase.items && currentPurchase.items.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Purchase Items</h4>
                  <div className="space-y-3">
                    {currentPurchase.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {item.unit} × ₹{item.rate} = ₹{item.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Lot: {item.lotNumber} • Quality: {item.quality}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItemFromPurchase(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{(currentPurchase.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>₹{(currentPurchase.taxAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{((currentPurchase.totalAmount || 0) + (currentPurchase.taxAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={completePurchase}
                  disabled={!selectedSupplier || !currentPurchase.items?.length}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Create Purchase Order</span>
                </button>
                <button
                  onClick={() => setShowNewPurchase(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Selection Modal */}
      {showSupplierSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Select Supplier</h3>
                <button 
                  onClick={() => setShowSupplierSelect(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-3">
                {filteredSuppliers.map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setShowSupplierSelect(false);
                    }}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{supplier.location}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Supplies: {supplier.productsSupplied.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Rating: {supplier.rating}/5</div>
                        <div className="text-sm text-gray-500">Terms: {supplier.paymentTerms} days</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}