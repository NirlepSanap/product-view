// Types for order and payment functionality

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: ShippingAddress;
}

export interface CheckoutState {
  step: 'cart' | 'shipping' | 'payment' | 'confirmation';
  shippingAddress: Partial<ShippingAddress>;
  paymentMethod: Partial<PaymentMethod>;
  order?: Order;
  isProcessing: boolean;
  error?: string;
}

// Payment validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Mock payment responses
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  orderId?: string;
}

export interface PaymentProcessor {
  processPayment: (orderData: {
    amount: number;
    paymentMethod: PaymentMethod;
    shippingAddress: ShippingAddress;
  }) => Promise<PaymentResponse>;
}