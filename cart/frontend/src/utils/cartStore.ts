import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Types for cart functionality
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  brand?: string;
  rating: number;
  discountPercentage?: number;
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface CartActions {
  // Cart management
  addItem: (product: Omit<CartItem, 'quantity' | 'addedAt'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  
  // Cart UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Calculations
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

// Constants for calculations
const TAX_RATE = 0.08; // 8% tax
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;

// Create the cart store with persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,

      // Add item to cart
      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          get().updateQuantity(product.id, existingItem.quantity + 1);
        } else {
          // Add new item
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            addedAt: new Date()
          };
          
          set((state) => ({
            items: [...state.items, newItem]
          }));
          
          get().calculateTotals();
          
          toast.success(`${product.title} added to cart`, {
            description: 'Item has been added to your shopping cart',
          });
        }
      },

      // Remove item from cart
      removeItem: (id) => {
        const { items } = get();
        const item = items.find(item => item.id === id);
        
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
        
        get().calculateTotals();
        
        if (item) {
          toast.success(`${item.title} removed from cart`, {
            description: 'Item has been removed from your cart',
          });
        }
      },

      // Update item quantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        }));
        
        get().calculateTotals();
      },

      // Clear all items
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0
        });
        
        toast.success('Cart cleared', {
          description: 'All items have been removed from your cart',
        });
      },

      // Cart UI controls
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Calculate totals
      calculateTotals: () => {
        const { items } = get();
        
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => {
          const itemPrice = item.discountPercentage 
            ? item.price * (1 - item.discountPercentage / 100)
            : item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        
        const tax = subtotal * TAX_RATE;
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const totalPrice = subtotal + tax + shipping;
        
        set({
          totalItems,
          subtotal: Number(subtotal.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          totalPrice: Number(totalPrice.toFixed(2))
        });
      },
    }),
    {
      name: 'viewcraft-cart', // localStorage key
      partialize: (state) => ({ 
        items: state.items,
        // Don't persist UI state
      }),
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration
        if (state) {
          state.calculateTotals();
        }
      },
    }
  )
);

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateDiscountedPrice = (price: number, discount?: number): number => {
  if (!discount) return price;
  return price * (1 - discount / 100);
};

// Export for easy access
export default useCartStore;