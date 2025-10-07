'use client';

import { ShoppingCart, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { loadFromStorage } from '@/store/packageSlice';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navigation() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.package);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  // Load data from localStorage when component mounts
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);
  
  // Calculate total number of items in cart
  const totalItems = Object.values(cartItems).reduce((total: number, qty: number) => total + qty, 0);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-beije-primary">
              beije.
            </Link>
          </div>

          {/* Right side - Kendi Paketini Oluştur Button + Icons */}
          <div className="flex items-center space-x-4">
            {/* Kendi Paketini Oluştur Button */}
            <Link
              href="/custom-packet"
              className="hidden md:inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-beije-primary to-beije-accent hover:from-beije-accent hover:to-beije-primary text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-sm">{t('nav.createPackage')}</span>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <ShoppingCart className="h-5 w-5 text-beije-text" />
              {/* Cart badge - Redux'tan gelen gerçek sayı */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-beije-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Profile Icon */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-beije-text" />
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-beije-text" />
                ) : (
                  <Menu className="h-6 w-6 text-beije-text" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-3 space-y-3 bg-white border-t">
            <Link
              href="/custom-packet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-beije-primary to-beije-accent text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
            >
              {t('nav.createPackage')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
