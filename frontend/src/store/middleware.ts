import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './index';

// Middleware for saving state to localStorage
export const localStorageMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only save changes in package slice
  if (action.type?.startsWith('package/')) {
    try {
      const state = store.getState();
      localStorage.setItem('beije-package-state', JSON.stringify(state.package));
    } catch (error) {
      console.warn('localStorage save error:', error);
    }
  }
  
  return result;
};

// Function to load state from localStorage
export const loadFromLocalStorage = () => {
  try {
    if (typeof window === 'undefined') {
      return undefined; // localStorage not available during SSR
    }
    
    const serializedState = localStorage.getItem('beije-package-state');
    if (serializedState === null) {
      return undefined;
    }
    
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('localStorage read error:', error);
    return undefined;
  }
};
