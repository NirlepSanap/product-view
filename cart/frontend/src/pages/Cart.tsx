import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCartStore, formatPrice, calculateDiscountedPrice } from "utils/cartStore";
import { logout, getUser } from "utils/auth";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart
  } = useCartStore();
  
  const user = getUser();

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully", {
      description: "Thanks for using ViewCraft!",
    });
    navigate('/login');
  };

  // Handle quantity change
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Handle proceed to checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Cart is empty", {
        description: "Add some items to your cart before checking out",
      });
      return;
    }
    navigate('/checkout');
  };

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
                  <p className="text-xs text-slate-400 font-mono">SHOPPING CART</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
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
            SHOPPING CART
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">CART</span>
          </h2>
          <p className="text-xl text-slate-300">
            {totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Your cart is empty</h3>
            <p className="text-slate-400 mb-8">Add some products to get started</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
                const itemTotal = discountedPrice * item.quantity;
                
                return (
                  <Card key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex-shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-purple-500/20 border border-purple-400/50 text-purple-400 text-xs">
                              {item.brand}
                            </Badge>
                            <span className="text-xs text-slate-400 font-mono">{item.category}</span>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-slate-600'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-slate-400">{item.rating}</span>
                          </div>
                        </div>
                        
                        {/* Price and Controls */}
                        <div className="text-right space-y-3">
                          {/* Price */}
                          <div>
                            {item.discountPercentage ? (
                              <div className="space-y-1">
                                <div className="text-lg font-bold text-cyan-400">
                                  {formatPrice(discountedPrice)}
                                </div>
                                <div className="text-sm text-slate-500 line-through">
                                  {formatPrice(item.price)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-cyan-400">
                                {formatPrice(item.price)}
                              </div>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </Button>
                            
                            <span className="w-8 text-center text-white font-mono">{item.quantity}</span>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </Button>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-lg font-bold text-white">
                            {formatPrice(itemTotal)}
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 text-xs"
                            onClick={() => removeItem(item.id)}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Clear Cart Button */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Subtotal ({totalItems} items)</span>
                    <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* Tax */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Tax (8%)</span>
                    <span className="text-white font-semibold">{formatPrice(tax)}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Shipping</span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <div>
                          <span className="text-green-400 font-semibold">FREE</span>
                          <div className="text-xs text-slate-400">Orders over $50</div>
                        </div>
                      ) : (
                        <span className="text-white font-semibold">{formatPrice(shipping)}</span>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  {/* Total */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-cyan-400 font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 mt-6"
                  >
                    Proceed to Checkout
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                  
                  {/* Continue Shopping */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30 mt-2"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}