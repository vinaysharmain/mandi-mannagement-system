"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  User, 
  Package, 
  IndianRupee,
  Calendar,
  Receipt,
  Printer,
  Save,
  X,
  Calculator,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Customer, Sale, SaleItem, Product } from '../types';

interface SalesManagementProps {
  onClose?: () => void;
}

export default function SalesManagement({ onClose }: SalesManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>({
    items: [],
    totalAmount: 0,
    taxAmount: 0,
    discountAmount: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    saleDate: new Date()
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSale, setShowNewSale] = useState(false);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Mock data initialization
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Sharma Retail Store',
        phone: '9876543210',
        address: 'Main Market, Sector 15',
        category: 'retail',
        creditLimit: 50000,
        outstandingAmount: 12000,
        paymentTerms: 30,
        totalOrders: 45,
        lastOrderDate: new Date('2024-07-15')
      },
      {
        id: '2',
        name: 'Hotel Rajdhani',
        phone: '9876543211',
        address: 'Commercial Complex, Near Station',
        category: 'hotel',
        creditLimit: 100000,
        outstandingAmount: 25000,
        paymentTerms: 15,
        totalOrders: 78,
        lastOrderDate: new Date('2024-07-17')
      },
      {
        id: '3',
        name: 'Gupta Vegetables',
        phone: '9876543212',
        address: 'Wholesale Market, Phase 2',
        category: 'wholesale',
        creditLimit: 200000,
        outstandingAmount: 0,
        paymentTerms: 7,
        totalOrders: 156,
        lastOrderDate: new Date('2024-07-16')
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
        locations: [
          { locationId: '1', locationName: 'Main Store', quantity: 500, reservedQuantity: 0, availableQuantity: 500 }
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
          { locationId: '1', locationName: 'Main Store', quantity: 800, reservedQuantity: 0, availableQuantity: 800 }
        ]
      },
      {
        id: '3',
        name: 'Onions',
        category: 'Vegetables',
        unit: 'kg',
        currentStock: 300,
        minStockLevel: 100,
        maxStockLevel: 800,
        avgPurchasePrice: 30,
        avgSellingPrice: 42,
        lastUpdated: new Date(),
        perishable: false,
        locations: [
          { locationId: '1', locationName: 'Main Store', quantity: 300, reservedQuantity: 0, availableQuantity: 300 }
        ]
      }
    ];

    const mockSales: Sale[] = [
      {
        id: '1',
        customerId: '1',
        items: [
          { productId: '1', productName: 'Tomatoes', quantity: 10, unit: 'kg', rate: 35, amount: 350 },
          { productId: '2', productName: 'Potatoes', quantity: 5, unit: 'kg', rate: 28, amount: 140 }
        ],
        totalAmount: 490,
        taxAmount: 0,
        discountAmount: 0,
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        saleDate: new Date('2024-07-18'),
        billNumber: 'BILL-001'
      }
    ];

    setCustomers(mockCustomers);
    setProducts(mockProducts);
    setSales(mockSales);
  }, []);

  const addItemToSale = (product: Product, quantity: number, rate: number) => {
    const newItem: SaleItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      unit: product.unit,
      rate,
      amount: quantity * rate
    };

    setCurrentSale(prev => {
      const updatedItems = [...(prev.items || []), newItem];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount,
        taxAmount: totalAmount * 0.05, // 5% tax
      };
    });
  };

  const removeItemFromSale = (index: number) => {
    setCurrentSale(prev => {
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

  const completeSale = () => {
    if (!selectedCustomer || !currentSale.items?.length) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      items: currentSale.items,
      totalAmount: currentSale.totalAmount || 0,
      taxAmount: currentSale.taxAmount || 0,
      discountAmount: currentSale.discountAmount || 0,
      paymentMethod: currentSale.paymentMethod || 'cash',
      paymentStatus: currentSale.paymentStatus || 'pending',
      saleDate: new Date(),
      billNumber: `BILL-${String(sales.length + 1).padStart(3, '0')}`
    };

    setSales(prev => [...prev, newSale]);
    setCurrentSale({
      items: [],
      totalAmount: 0,
      taxAmount: 0,
      discountAmount: 0,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      saleDate: new Date()
    });
    setSelectedCustomer(null);
    setShowNewSale(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const recentSales = sales.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-600">Create bills, manage sales, and track transactions</p>
        </div>
        <button
          onClick={() => setShowNewSale(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Sale Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{sales.length ? Math.round(sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length) : 0}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{sales.filter(s => s.paymentStatus === 'pending').length}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        sale.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {showNewSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Sale</h3>
                <button 
                  onClick={() => setShowNewSale(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCustomerSelect(true)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50"
                  >
                    {selectedCustomer ? (
                      <div>
                        <div className="font-medium">{selectedCustomer.name}</div>
                        <div className="text-sm text-gray-500">{selectedCustomer.phone}</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Select Customer</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Products</label>
                <div className="relative mb-4">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">₹{product.avgSellingPrice}/{product.unit}</p>
                          <p className="text-sm text-gray-500">Stock: {product.currentStock} {product.unit}</p>
                        </div>
                        <button
                          onClick={() => addItemToSale(product, 1, product.avgSellingPrice)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sale Items */}
              {currentSale.items && currentSale.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Items</label>
                  <div className="space-y-2">
                    {currentSale.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {item.unit} × ₹{item.rate} = ₹{item.amount}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItemFromSale(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={currentSale.paymentMethod}
                    onChange={(e) => setCurrentSale(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={currentSale.paymentStatus}
                    onChange={(e) => setCurrentSale(prev => ({ ...prev, paymentStatus: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{(currentSale.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>₹{(currentSale.taxAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>₹{(currentSale.discountAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{((currentSale.totalAmount || 0) + (currentSale.taxAmount || 0) - (currentSale.discountAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={completeSale}
                  disabled={!selectedCustomer || !currentSale.items?.length}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Complete Sale</span>
                </button>
                <button
                  onClick={() => setShowNewSale(false)}
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

      {/* Customer Selection Modal */}
      {showCustomerSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Select Customer</h3>
                <button 
                  onClick={() => setShowCustomerSelect(false)}
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerSelect(false);
                    }}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                        <div className="text-sm text-gray-500">{customer.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Credit: ₹{customer.creditLimit.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Outstanding: ₹{customer.outstandingAmount.toLocaleString()}</div>
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