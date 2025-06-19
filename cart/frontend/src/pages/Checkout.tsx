import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCartStore, formatPrice, calculateDiscountedPrice } from "utils/cartStore";
import { logout, getUser } from "utils/auth";
import type { ShippingAddress, PaymentFormData } from "utils/orderTypes";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
    clearCart
  } = useCartStore();
  
  const user = getUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentData, setPaymentData] = useState<Partial<PaymentFormData>>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      toast.error("Cart is empty", {
        description: "Add some items to your cart before checking out",
      });
      navigate('/dashboard');
    }
  }, [items.length, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully", {
      description: "Thanks for using ViewCraft!",
    });
    navigate('/login');
  };

  // Validation functions
  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingAddress.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.email?.trim()) newErrors.email = 'Email is required';
    if (!shippingAddress.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!shippingAddress.address1?.trim()) newErrors.address1 = 'Address is required';
    if (!shippingAddress.city?.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state?.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Email validation
    if (shippingAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.cardNumber?.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentData.expiryDate?.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentData.cvv?.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentData.cardholderName?.trim()) newErrors.cardholderName = 'Cardholder name is required';
    
    // Card number validation (basic)
    if (paymentData.cardNumber && !/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Expiry date validation (MM/YY format)
    if (paymentData.expiryDate && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Please enter date in MM/YY format';
    }
    
    // CVV validation
    if (paymentData.cvv && !/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Please enter a valid 3-4 digit CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Format card number input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return match;
    }
  };
  
  // Format expiry date input (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (currentStep === 'shipping' && validateShipping()) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && validatePayment()) {
      setCurrentStep('review');
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateShipping() || !validatePayment()) {
      toast.error("Please check your information", {
        description: "There are errors in your form",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      clearCart();
      
      toast.success("Order placed successfully!", {
        description: "Your order has been confirmed",
      });
      
      // Navigate to confirmation (or back to dashboard for now)
      navigate('/dashboard');
      
    } catch (error) {
      toast.error("Payment failed", {
        description: "Please try again or use a different payment method",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 transform rotate-45 rounded-sm"></div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-wider">ViewCraft</h1>
                  <p className="text-xs text-slate-400 font-mono">CHECKOUT</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Cart
              </Button>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:block">
                  <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-sm font-mono">@{user.username}</p>
                </div>
              )}
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 text-sm font-mono mb-4">
            SECURE CHECKOUT
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            CHECKOUT
          </h2>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {['shipping', 'payment', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {index < ['shipping', 'payment', 'review'].indexOf(currentStep) ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-mono uppercase ${
                  currentStep === step ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  {step}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address1" className="text-slate-300">Address</Label>
                    <Input
                      id="address1"
                      value={shippingAddress.address1 || ''}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                      className={`bg-white/5 border-white/20 text-white ${errors.address1 ? 'border-red-500' : ''}`}
                      placeholder="123 Main Street"
                    />
                    {errors.address1 && <p className="text-red-400 text-sm mt-1">{errors.address1}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address2" className="text-slate-300">Address Line 2 (Optional)</Label>
                    <Input
                      id="address2"
                      value={shippingAddress.address2 || ''}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-slate-300">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-slate-300">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="NY"
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-slate-300">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.zipCode ? 'border-red-500' : ''}`}
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 'payment' && (
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName" className="text-slate-300">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentData.cardholderName || ''}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className={`bg-white/5 border-white/20 text-white ${errors.cardholderName ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.cardholderName && <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber" className="text-slate-300">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber || ''}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                      className={`bg-white/5 border-white/20 text-white ${errors.cardNumber ? 'border-red-500' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-slate-300">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate || ''}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.expiryDate ? 'border-red-500' : ''}`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-slate-300">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv || ''}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        className={`bg-white/5 border-white/20 text-white ${errors.cvv ? 'border-red-500' : ''}`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 'review' && (
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address Review */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Shipping Address</h3>
                    <div className="text-slate-300 text-sm space-y-1">
                      <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p>{shippingAddress.address1}</p>
                      {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.email}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  {/* Payment Method Review */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Payment Method</h3>
                    <div className="text-slate-300 text-sm">
                      <p>•••• •••• •••• {paymentData.cardNumber?.slice(-4)}</p>
                      <p>{paymentData.cardholderName}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  {/* Order Items Review */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
                        const itemTotal = discountedPrice * item.quantity;
                        
                        return (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div>
                                <p className="text-white">{item.title}</p>
                                <p className="text-slate-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-cyan-400 font-semibold">{formatPrice(itemTotal)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={handlePrevStep}
                disabled={currentStep === 'shipping'}
                className="text-slate-400 hover:text-slate-300 hover:bg-slate-400/10 border border-slate-400/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous
              </Button>
              
              {currentStep === 'review' ? (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order {formatPrice(totalPrice)}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8"
                >
                  Continue
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
                    const itemTotal = discountedPrice * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-white text-xs truncate">{item.title}</p>
                            <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-cyan-400 text-xs font-semibold">{formatPrice(itemTotal)}</p>
                      </div>
                    );
                  })}
                </div>
                
                <Separator className="bg-white/10" />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Subtotal ({totalItems} items)</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Tax (8%)</span>
                    <span className="text-white">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-400 font-semibold">FREE</span>
                    ) : (
                      <span className="text-white">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-cyan-400 font-bold text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}