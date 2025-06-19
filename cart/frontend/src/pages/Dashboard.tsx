import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getUser, logout, isAuthenticated, type User } from "utils/auth";
import { ProductCard } from "components/ProductCard";
import { fetchProducts, type Product } from "utils/productService";
import { useCartStore } from "utils/cartStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Get cart total items reactively
  const totalItems = useCartStore((state) => state.totalItems);

  // Load products from DummyJSON API
  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    
    try {
      const response = await fetchProducts();
      setProducts(response.products);
      
      toast.success("Products loaded successfully!", {
        description: `Found ${response.products.length} products across ${new Set(response.products.map(p => p.category)).size} categories`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      setProductsError(errorMessage);
      
      toast.error("Failed to load products", {
        description: errorMessage,
      });
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status first
    if (!isAuthenticated()) {
      toast.error("Authentication required", {
        description: "Please login to access the dashboard",
      });
      navigate('/login');
      return;
    }

    // Get user data from stored authentication
    const userData = getUser();
    setUser(userData);
    setIsLoading(false);
    
    if (userData) {
      toast.success(`Welcome to ViewCraft, ${userData.firstName}!`, {
        description: "Ready to explore amazing products",
      });
    }

    // Load products
    loadProducts();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully", {
      description: "Thanks for using ViewCraft!",
    });
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getUserInitials = (user: User): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 transform rotate-45 rounded-sm"></div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wider">ViewCraft</h1>
                <p className="text-xs text-slate-400 font-mono">PRODUCT DISCOVERY PLATFORM</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon with Counter */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30 relative"
                  onClick={() => {
                    navigate('/cart');
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                  </svg>
                  
                  {/* Cart Counter */}
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold p-0 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                </Button>
              </div>

              {user && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-cyan-400/50">
                    <AvatarImage src={user.image} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-slate-400 text-sm font-mono">@{user.username}</p>
                  </div>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="relative">
            {/* Background geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-10 w-24 h-24 border-2 border-cyan-400/20 transform rotate-45"></div>
              <div className="absolute top-8 right-20 w-16 h-16 bg-purple-600/10 transform -rotate-12"></div>
            </div>

            <div className="relative z-10">
              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 text-sm font-mono mb-4">
                DASHBOARD
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                PRODUCT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">EXPLORER</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl">
                Discover and explore curated products in our immersive, cyberpunk-inspired interface.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                  <p className="text-slate-400 text-sm">Products Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{new Set(products.map(p => p.category)).size}</p>
                  <p className="text-slate-400 text-sm">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0.0'}
                  </p>
                  <p className="text-slate-400 text-sm">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Listing Area */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Product Gallery
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Browse our curated collection of products with advanced filtering and search
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Loading State */}
            {productsLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Loading Products</h3>
                <p className="text-slate-400">Fetching the latest products from our catalog...</p>
              </div>
            )}

            {/* Error State */}
            {productsError && !productsLoading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to Load Products</h3>
                <p className="text-slate-400 mb-6">{productsError}</p>
                <Button 
                  onClick={loadProducts}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {!productsLoading && !productsError && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-slate-400">No products are currently available in the catalog.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer accent */}
      <div className="mt-16">
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
      </div>
    </div>
  );
}