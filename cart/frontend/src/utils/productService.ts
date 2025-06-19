// Product types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// API base URL
const API_BASE_URL = 'https://dummyjson.com';

/**
 * Fetch all products from DummyJSON API
 */
export async function fetchProducts(): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch products: ${error.message}`
        : 'Failed to fetch products'
    );
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: Product = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch product: ${error.message}`
        : 'Failed to fetch product'
    );
  }
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format rating to 1 decimal place
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Generate star rating display
 */
export function getStarRating(rating: number): { filled: number; half: boolean; empty: number } {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  
  return { filled, half, empty };
}