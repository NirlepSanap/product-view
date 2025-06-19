import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice, formatRating, getStarRating, type Product } from "utils/productService";
import { useCartStore } from "utils/cartStore";

interface Props {
  product: Product;
}

/**
 * ProductCard component displaying product information
 * with neo-brutalist cyberpunk design and cart functionality
 */
export function ProductCard({ product }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const stars = getStarRating(product.rating);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Handle card click
  const handleCardClick = () => {
    toast.info(`Viewing ${product.title}`, {
      description: `${product.brand} • ${product.category}`,
    });
  };

  // Calculate discount price if applicable
  const discountedPrice = product.discountPercentage > 0 
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  return (
    <Card 
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Geometric accent shapes */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 transform rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border border-pink-400/30 transform -rotate-12 transition-transform duration-300 group-hover:rotate-12"></div>
      
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
          )}
          
          {!imageError ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Discount badge */}
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 text-xs font-bold">
              -{Math.round(product.discountPercentage)}%
            </Badge>
          )}
          
          {/* Stock indicator */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={`px-2 py-1 text-xs font-mono ${
                product.stock > 10 
                  ? 'bg-green-500/20 border border-green-400/50 text-green-400'
                  : product.stock > 0
                  ? 'bg-yellow-500/20 border border-yellow-400/50 text-yellow-400'
                  : 'bg-red-500/20 border border-red-400/50 text-red-400'
              }`}
            >
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </Badge>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand and Category */}
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-500/20 border border-purple-400/50 text-purple-400 text-xs font-mono">
              {product.brand}
            </Badge>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          
          {/* Product Title */}
          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {/* Filled stars */}
              {Array.from({ length: stars.filled }).map((_, i) => (
                <svg key={`filled-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
              
              {/* Half star */}
              {stars.half && (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" clipPath="inset(0 50% 0 0)" />
                </svg>
              )}
              
              {/* Empty stars */}
              {Array.from({ length: stars.empty }).map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-slate-400 font-mono">
              {formatRating(product.rating)}
            </span>
          </div>
          
          {/* Price */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {discountedPrice ? (
                <>
                  <span className="text-xl font-bold text-cyan-400">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-cyan-400">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <Button
                className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transform transition-all duration-200 ${
                  isHovered ? 'scale-105 shadow-lg shadow-green-500/25' : ''
                } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={product.stock === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.stock > 0) {
                    useCartStore.getState().addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      thumbnail: product.thumbnail,
                      category: product.category,
                      brand: product.brand || 'Unknown',
                      rating: product.rating,
                      discountPercentage: product.discountPercentage
                    });
                  }
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                className={`border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transform transition-all duration-200 ${
                  isHovered ? 'scale-105' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success("Added to wishlist!", {
                    description: product.title,
                  });
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;