import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PackageState, ProductType } from './types';
import { loadFromLocalStorage } from './middleware';

const initialState: PackageState = {
  selections: {
    standartPed: 0,
    superPed: 0,
    superPlusPed: 0,
    gunlukPed: 0,
    superGunlukPed: 0,
    tangaGunlukPed: 0,
    miniTampon: 0,
    standartTampon: 0,
    superTampon: 0,
    isiPaketi2li: 0,
    isiPaketi4lu: 0,
    cycleEssentials: 0,
    cranberryEssentials: 0,
  },
  totalPrice: 0,
  isValid: false,
  isLoading: false,
  cartItems: {
    standartPed: 0,
    superPed: 0,
    superPlusPed: 0,
    gunlukPed: 0,
    superGunlukPed: 0,
    tangaGunlukPed: 0,
    miniTampon: 0,
    standartTampon: 0,
    superTampon: 0,
    isiPaketi2li: 0,
    isiPaketi4lu: 0,
    cycleEssentials: 0,
    cranberryEssentials: 0,
  },
  cartTotalPrice: 0,
};

// Merge loaded state from localStorage with initial state
const getInitialState = (): PackageState => {
  // Always return initialState during SSR
  if (typeof window === 'undefined') {
    return initialState;
  }
  
  const savedState = loadFromLocalStorage();
  if (savedState) {
    return {
      ...initialState,
      ...savedState,
    };
  }
  return initialState;
};

// Product prices
const PRODUCT_PRICES = {
  standartPed: 15,
  superPed: 18,
  superPlusPed: 20,
  gunlukPed: 12,
  superGunlukPed: 14,
  tangaGunlukPed: 13,
  miniTampon: 16,
  standartTampon: 18,
  superTampon: 20,
  isiPaketi2li: 99.5,
  isiPaketi4lu: 187.55,
  cycleEssentials: 440,
  cranberryEssentials: 345,
  // Temporary - for legacy tampon field
  tampon: 16,
} as const;

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    updateSelection: (state, action: PayloadAction<{ product: ProductType; quantity: number }>) => {
      const { product, quantity } = action.payload;
      
      // Prevent negative values
      if (quantity < 0) return;
      
      state.selections[product] = quantity;
      
      // Calculate total price
      state.totalPrice = Object.entries(state.selections).reduce((total, [key, qty]) => {
        const productKey = key as ProductType;
        const price = PRODUCT_PRICES[productKey];
        
        // Price validation
        if (price === undefined || isNaN(price)) {
          console.error(`Price not found for product: ${productKey}`);
          return total;
        }
        
        const itemTotal = qty * price;
        return total + itemTotal;
      }, 0);
      
      // Check if at least one product is selected
      state.isValid = Object.values(state.selections).some(qty => qty > 0);
    },
    
    incrementSelection: (state, action: PayloadAction<ProductType>) => {
      const product = action.payload;
      state.selections[product] += 1;
      
      // Update total price
      state.totalPrice = Object.entries(state.selections).reduce((total, [key, qty]) => {
        const productKey = key as ProductType;
        const price = PRODUCT_PRICES[productKey];
        
        // Price validation
        if (price === undefined || isNaN(price)) {
          console.error(`Price not found for product: ${productKey}`);
          return total;
        }
        
        const itemTotal = qty * price;
        return total + itemTotal;
      }, 0);
      
      state.isValid = Object.values(state.selections).some(qty => qty > 0);
    },
    
    decrementSelection: (state, action: PayloadAction<ProductType>) => {
      const product = action.payload;
      if (state.selections[product] > 0) {
        state.selections[product] -= 1;
      }
      
      // Update total price
      state.totalPrice = Object.entries(state.selections).reduce((total, [key, qty]) => {
        const productKey = key as ProductType;
        const price = PRODUCT_PRICES[productKey];
        
        // Price validation
        if (price === undefined || isNaN(price)) {
          console.error(`Price not found for product: ${productKey}`);
          return total;
        }
        
        const itemTotal = qty * price;
        return total + itemTotal;
      }, 0);
      
      state.isValid = Object.values(state.selections).some(qty => qty > 0);
    },
    
    resetSelections: (state) => {
      state.selections = {
        standartPed: 0,
        superPed: 0,
        superPlusPed: 0,
        gunlukPed: 0,
        superGunlukPed: 0,
        tangaGunlukPed: 0,
        miniTampon: 0,
        standartTampon: 0,
        superTampon: 0,
        isiPaketi2li: 0,
        isiPaketi4lu: 0,
        cycleEssentials: 0,
        cranberryEssentials: 0,
      };
      state.totalPrice = 0;
      state.isValid = false;
      
      // Also clear localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('beije-package-state');
        }
      } catch (error) {
        console.warn('localStorage temizleme hatası:', error);
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    addToCart: (state) => {
      // Add current selections to cart
      Object.keys(state.selections).forEach(key => {
        const productKey = key as ProductType;
        state.cartItems[productKey] += state.selections[productKey];
      });
      
      // Calculate cart total price
      state.cartTotalPrice = Object.entries(state.cartItems).reduce((total, [key, qty]) => {
        const productKey = key as ProductType;
        return total + (qty * PRODUCT_PRICES[productKey]);
      }, 0);
      
      // Reset selections (after adding to cart)
      state.selections = {
        standartPed: 0,
        superPed: 0,
        superPlusPed: 0,
        gunlukPed: 0,
        superGunlukPed: 0,
        tangaGunlukPed: 0,
        miniTampon: 0,
        standartTampon: 0,
        superTampon: 0,
        isiPaketi2li: 0,
        isiPaketi4lu: 0,
        cycleEssentials: 0,
        cranberryEssentials: 0,
      };
      state.totalPrice = 0;
      state.isValid = false;
    },
    
    loadFromStorage: (state) => {
      const savedState = loadFromLocalStorage();
      if (savedState) {
        Object.assign(state, savedState);
      }
    },
    
    updateCartItem: (state, action: PayloadAction<{ product: ProductType; quantity: number }>) => {
      const { product, quantity } = action.payload;
      
      // Prevent negative values
      if (quantity < 0) return;
      
      state.cartItems[product] = quantity;
      
      // Recalculate cart total price
      state.cartTotalPrice = Object.entries(state.cartItems).reduce((total, [key, qty]) => {
        const productKey = key as ProductType;
        return total + (qty * PRODUCT_PRICES[productKey]);
      }, 0);
    },
    
    clearCart: (state) => {
      state.cartItems = {
        standartPed: 0,
        superPed: 0,
        superPlusPed: 0,
        gunlukPed: 0,
        superGunlukPed: 0,
        tangaGunlukPed: 0,
        miniTampon: 0,
        standartTampon: 0,
        superTampon: 0,
        isiPaketi2li: 0,
        isiPaketi4lu: 0,
        cycleEssentials: 0,
        cranberryEssentials: 0,
      };
      state.cartTotalPrice = 0;
    },
  },
});

export const {
  updateSelection,
  incrementSelection,
  decrementSelection,
  resetSelections,
  setLoading,
  addToCart,
  loadFromStorage,
  updateCartItem,
  clearCart,
} = packageSlice.actions;

export default packageSlice.reducer;
