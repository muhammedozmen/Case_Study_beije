'use client';

import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { loadFromStorage, updateCartItem, clearCart } from '@/store/packageSlice';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Product information (colors and prices only, names will be translated dynamically)
const PRODUCT_INFO = {
  standartPed: { color: '#FF6B35', price: 15 },
  superPed: { color: '#E53E3E', price: 18 },
  superPlusPed: { color: '#C53030', price: 20 },
  gunlukPed: { color: '#FFA500', price: 12 },
  superGunlukPed: { color: '#FF8C00', price: 14 },
  tangaGunlukPed: { color: '#FFD700', price: 13 },
  miniTampon: { color: '#9B59B6', price: 16 },
  standartTampon: { color: '#8E44AD', price: 18 },
  superTampon: { color: '#7D3C98', price: 20 },
  isiPaketi2li: { color: '#FF6B35', price: 99.50 },
  isiPaketi4lu: { color: '#FF6B35', price: 187.55 },
  cycleEssentials: { color: '#FF6B35', price: 440 },
  cranberryEssentials: { color: '#8B5A3C', price: 345 },
};

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems, cartTotalPrice } = useSelector((state: RootState) => state.package);
  const { t } = useLanguage();
  
  // Load data from localStorage when component mounts
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);
  
  // Filter cart items (only those greater than 0)
  const cartProducts = Object.entries(cartItems)
    .filter(([_, quantity]) => (quantity as number) > 0)
    .map(([productKey, quantity]) => ({
      key: productKey as keyof typeof PRODUCT_INFO,
      quantity: quantity as number,
      name: t(`product.${productKey}`), // Get translated name
      ...PRODUCT_INFO[productKey as keyof typeof PRODUCT_INFO],
    }));

  const handleClearCart = () => {
    if (confirm(t('cart.confirmClear'))) {
      dispatch(clearCart());
    }
  };

  const handleUpdateQuantity = (productKey: string, newQuantity: number) => {
    dispatch(updateCartItem({ product: productKey as any, quantity: newQuantity }));
  };

  if (cartProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-beije-text mb-4">{t('cart.empty')}</h2>
        <p className="text-beije-muted mb-8">
          {t('cart.emptyDesc')}
        </p>
        <Link
          href="/custom-packet"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-beije-primary to-beije-accent hover:from-beije-accent hover:to-beije-primary text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
{t('cart.goToPackage')}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-beije-text">{t('cart.title')}</h1>
        <button
          onClick={handleClearCart}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('cart.clearCart')}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cartProducts.map((product) => (
            <div key={product.key} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: product.color }}
                  >
                    <span className="text-white font-semibold">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-beije-text">{product.name}</h3>
                    <p className="text-beije-muted text-sm">
                      {formatCurrency(product.price)} / adet
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(product.key, Math.max(0, product.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-beije-text">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(product.key, product.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-beije-text">
                      {formatCurrency(product.price * product.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleUpdateQuantity(product.key, 0)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-beije-text">{t('cart.total')}:</span>
            <span className="text-2xl font-bold text-beije-primary">
              {formatCurrency(cartTotalPrice)}
            </span>
          </div>
          
          <div className="space-y-3">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-beije-primary to-beije-accent hover:from-beije-accent hover:to-beije-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
{t('cart.completeOrder')}
            </button>
            
            <Link
              href="/custom-packet"
              className="block w-full py-3 px-6 text-center border-2 border-beije-primary text-beije-primary hover:bg-beije-primary hover:text-white font-semibold rounded-xl transition-all duration-300"
            >
{t('cart.continueShopping')}
            </Link>
          </div>
          
          <p className="text-center text-beije-muted text-sm mt-4">
{t('cart.autoDeliveryNote')}
          </p>
        </div>
      </div>
    </div>
  );
}
