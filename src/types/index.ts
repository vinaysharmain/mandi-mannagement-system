// Core types for the Mandi Management System
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  avgPurchasePrice: number;
  avgSellingPrice: number;
  lastUpdated: Date;
  perishable: boolean;
  shelfLife?: number; // in days
  locations: StockLocation[];
}

export interface StockLocation {
  locationId: string;
  locationName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface StockEntry {
  id: string;
  productId: string;
  lotNumber: string;
  supplierId: string;
  quantity: number;
  purchasePrice: number;
  entryDate: Date;
  expiryDate?: Date;
  quality: 'A' | 'B' | 'C';
  location: string;
  vehicleNumber?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  creditLimit: number;
  outstandingAmount: number;
  paymentTerms: number; // days
  photo?: string;
  lastOrderDate?: Date;
  totalOrders: number;
  category: 'retail' | 'wholesale' | 'restaurant' | 'hotel';
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  location: string;
  productsSupplied: string[];
  rating: number;
  paymentTerms: number;
  outstandingPayments: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  paymentMethod: 'cash' | 'credit' | 'upi' | 'cheque';
  paymentStatus: 'paid' | 'pending' | 'partial';
  saleDate: Date;
  billNumber: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  discount?: number;
  taxRate?: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  taxAmount: number;
  purchaseDate: Date;
  billNumber: string;
  vehicleNumber?: string;
  status: 'pending' | 'received' | 'partial';
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  lotNumber: string;
  quality: 'A' | 'B' | 'C';
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'alert' | 'recommendation' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  action?: string;
  category: 'inventory' | 'pricing' | 'customer' | 'supplier' | 'finance' | 'market';
  createdAt: Date;
  status: 'new' | 'acknowledged' | 'acted' | 'dismissed';
}

export interface MarketData {
  productId: string;
  productName: string;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketTrend: 'up' | 'down' | 'stable';
  demandLevel: 'low' | 'medium' | 'high';
  supplyLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  outstandingReceivables: number;
  outstandingPayables: number;
  cashBalance: number;
  bankBalance: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
}

export interface CrateTracking {
  id: string;
  crateType: string;
  totalCrates: number;
  availableCrates: number;
  issuedCrates: number;
  customerId?: string;
  issueDate?: Date;
  returnDate?: Date;
  condition: 'good' | 'damaged' | 'lost';
}

export interface WeightEntry {
  id: string;
  productId: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  scaleName: string;
  timestamp: Date;
  operator: string;
}