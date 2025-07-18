"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  Package,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerManagementProps {
  onClose?: () => void;
}

export default function CustomerManagement({ onClose }: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    category: 'retail',
    creditLimit: 0,
    paymentTerms: 30,
    outstandingAmount: 0,
    totalOrders: 0
  });

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Sharma Retail Store',
        phone: '9876543210',
        email: 'sharma@example.com',
        address: 'Main Market, Sector 15, Chandigarh',
        gstNumber: '03AAAAA0000A1Z5',
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
        email: 'rajdhani@example.com',
        address: 'Commercial Complex, Near Railway Station',
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
        email: 'gupta@example.com',
        address: 'Wholesale Market, Phase 2, Mohali',
        gstNumber: '03BBBBB0000B2Y6',
        category: 'wholesale',
        creditLimit: 200000,
        outstandingAmount: 0,
        paymentTerms: 7,
        totalOrders: 156,
        lastOrderDate: new Date('2024-07-16')
      },
      {
        id: '4',
        name: 'Golden Restaurant',
        phone: '9876543213',
        email: 'golden@example.com',
        address: 'Food Street, Sector 22',
        category: 'restaurant',
        creditLimit: 75000,
        outstandingAmount: 8500,
        paymentTerms: 20,
        totalOrders: 89,
        lastOrderDate: new Date('2024-07-14')
      },
      {
        id: '5',
        name: 'Singh Retail',
        phone: '9876543214',
        email: 'singh@example.com',
        address: 'Local Market, Sector 35',
        category: 'retail',
        creditLimit: 30000,
        outstandingAmount: 5000,
        paymentTerms: 45,
        totalOrders: 23,
        lastOrderDate: new Date('2024-07-12')
      }
    ];

    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || customer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name!,
      phone: newCustomer.phone!,
      email: newCustomer.email,
      address: newCustomer.address!,
      gstNumber: newCustomer.gstNumber,
      category: newCustomer.category!,
      creditLimit: newCustomer.creditLimit!,
      outstandingAmount: 0,
      paymentTerms: newCustomer.paymentTerms!,
      totalOrders: 0
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      category: 'retail',
      creditLimit: 0,
      paymentTerms: 30,
      outstandingAmount: 0,
      totalOrders: 0
    });
    setShowAddCustomer(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'retail': return 'bg-blue-100 text-blue-800';
      case 'wholesale': return 'bg-green-100 text-green-800';
      case 'hotel': return 'bg-purple-100 text-purple-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatus = (customer: Customer) => {
    if (customer.outstandingAmount === 0) return { status: 'clear', color: 'text-green-600' };
    if (customer.outstandingAmount > customer.creditLimit * 0.8) return { status: 'high', color: 'text-red-600' };
    return { status: 'normal', color: 'text-yellow-600' };
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => {
    const paymentStatus = getPaymentStatus(customer);
    const utilizationPercent = (customer.outstandingAmount / customer.creditLimit) * 100;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.phone}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(customer.category)}`}>
            {customer.category.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{customer.address}</span>
          </div>
          {customer.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Credit Limit</p>
            <p className="font-semibold text-gray-900">₹{customer.creditLimit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Outstanding</p>
            <p className={`font-semibold ${paymentStatus.color}`}>
              ₹{customer.outstandingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Credit Utilization</span>
            <span>{utilizationPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                utilizationPercent > 80 ? 'bg-red-500' : 
                utilizationPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-600">Total Orders</p>
            <p className="font-medium">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment Terms</p>
            <p className="font-medium">{customer.paymentTerms} days</p>
          </div>
        </div>

        {customer.lastOrderDate && (
          <div className="mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last Order: {customer.lastOrderDate.toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setSelectedCustomer(customer);
              setShowCustomerDetails(true);
            }}
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

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.lastOrderDate && 
      new Date().getTime() - c.lastOrderDate.getTime() < 30 * 24 * 60 * 60 * 1000).length,
    totalOutstanding: customers.reduce((sum, c) => sum + c.outstandingAmount, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length || 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your customer relationships and credit</p>
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Orders/Customer</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgOrderValue.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Clear</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Customers ({filteredCustomers.length})
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
                <button 
                  onClick={() => setShowAddCustomer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newCustomer.category}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={newCustomer.gstNumber}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, gstNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter GST number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter credit limit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (days)</label>
                  <input
                    type="number"
                    value={newCustomer.paymentTerms}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, paymentTerms: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment terms"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={addCustomer}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                <button 
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedCustomer.category}</span>
                    </div>
                    {selectedCustomer.gstNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST Number:</span>
                        <span className="font-medium">{selectedCustomer.gstNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Limit:</span>
                      <span className="font-medium">₹{selectedCustomer.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span className="font-medium">{selectedCustomer.paymentTerms} days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Outstanding Amount</h5>
                  <p className="text-2xl font-bold text-red-600">₹{selectedCustomer.outstandingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Total Orders</h5>
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Last Order</h5>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedCustomer.lastOrderDate?.toLocaleDateString() || 'No orders yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}