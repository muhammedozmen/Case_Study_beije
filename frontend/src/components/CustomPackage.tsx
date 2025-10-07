'use client';

import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RootState } from '@/store';
import { resetSelections, addToCart, loadFromStorage, updateSelection } from '@/store/packageSlice';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductSelector from './ProductSelector';

export default function CustomPackage() {
  const dispatch = useDispatch();
  const { selections, totalPrice, isValid } = useSelector((state: RootState) => state.package);
  const { t } = useLanguage();
  
  // Load data from localStorage when component mounts
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);
  
  const [activeTab, setActiveTab] = useState<'menstrual' | 'supportive'>('menstrual');
  const [expandedSections, setExpandedSections] = useState({
    isiPedi: true,
    gunlukPed: false,
    tampon: false,
    cycleEssentials: false,
    cranberryEssentials: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddToCart = () => {
    if (isValid) {
      dispatch(addToCart());
      alert('Ürünler sepete eklendi! 🛒');
    }
  };

  const handleReset = () => {
    dispatch(resetSelections());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sol Taraf - Ürün Seçimi */}
      <div className="lg:col-span-2">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('menstrual')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'menstrual'
                ? 'border-beije-primary text-beije-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
{t('package.menstrualProducts')}
          </button>
          <button
            onClick={() => setActiveTab('supportive')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'supportive'
                ? 'border-beije-primary text-beije-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
{t('package.supportiveProducts')}
          </button>
        </div>

        {/* Menstrüel Ürünler Tab */}
        {activeTab === 'menstrual' && (
          <div className="space-y-4">
            {/* beije Ped Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('isiPedi')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🩸</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.beijePed')}</h3>
                </div>
                {expandedSections.isiPedi ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.isiPedi && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <span className="text-green-600 mr-2">💚</span>
{t('description.beijePed')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <ProductSelector
                      productType="standartPed"
                      title={t('product.standartPed')}
                      color="#FF6B35"
                      description=""
                    />
                    <ProductSelector
                      productType="superPed"
                      title={t('product.superPed')}
                      color="#E53E3E"
                      description=""
                    />
                    <ProductSelector
                      productType="superPlusPed"
                      title={t('product.superPlusPed')}
                      color="#C53030"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>

            {/* beije Günlük Ped Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('gunlukPed')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🌸</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.beijeGunlukPed')}</h3>
                </div>
                {expandedSections.gunlukPed ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.gunlukPed && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <span className="text-green-600 mr-2">💚</span>
{t('description.beijeGunlukPed')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <ProductSelector
                      productType="gunlukPed"
                      title={t('product.gunlukPed')}
                      color="#FFA500"
                      description=""
                    />
                    <ProductSelector
                      productType="superGunlukPed"
                      title={t('product.superGunlukPed')}
                      color="#FF8C00"
                      description=""
                    />
                    <ProductSelector
                      productType="tangaGunlukPed"
                      title={t('product.tangaGunlukPed')}
                      color="#FFD700"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>

            {/* beije Tampon Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('tampon')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🌺</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.beijeTampon')}</h3>
                </div>
                {expandedSections.tampon ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.tampon && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-3 mt-4">
                    <ProductSelector
                      productType="miniTampon"
                      title={t('product.miniTampon')}
                      color="#9B59B6"
                      description=""
                    />
                    <ProductSelector
                      productType="standartTampon"
                      title={t('product.standartTampon')}
                      color="#8E44AD"
                      description=""
                    />
                    <ProductSelector
                      productType="superTampon"
                      title={t('product.superTampon')}
                      color="#7D3C98"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Destekleyici Ürünler Tab */}
        {activeTab === 'supportive' && (
          <div className="space-y-4">
            {/* İşi Bandı Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('isiPedi')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👁️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.isiBandi')}</h3>
                </div>
                {expandedSections.isiPedi ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.isiPedi && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <span className="text-green-600 mr-2">💚</span>
{t('description.isiBandi')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <ProductSelector
                      productType="isiPaketi2li"
                      title={t('product.isiPaketi2li')}
                      color="#FF6B35"
                      description=""
                    />
                    <ProductSelector
                      productType="isiPaketi4lu"
                      title={t('product.isiPaketi4lu')}
                      color="#FF6B35"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>

            {/* beije Cycle Essentials */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('cycleEssentials')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.beijeCycleEssentials')}</h3>
                </div>
                {expandedSections.cycleEssentials ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.cycleEssentials && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <span className="text-green-600 mr-2">💚</span>
{t('description.beijeCycleEssentials')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <ProductSelector
                      productType="cycleEssentials"
                      title={t('product.cycleEssentials')}
                      color="#FF6B35"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>

            {/* beije Cranberry Essentials */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('cranberryEssentials')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('category.beijeCranberryEssentials')}</h3>
                </div>
                {expandedSections.cranberryEssentials ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.cranberryEssentials && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-4">
                    <p className="text-sm text-green-800 flex items-start">
                      <span className="text-green-600 mr-2">💚</span>
{t('description.beijeCranberryEssentials')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <ProductSelector
                      productType="cranberryEssentials"
                      title={t('product.cranberryEssentials')}
                      color="#8B5A3C"
                      description=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sağ Taraf - Özel Paketin */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">{t('package.autoDelivery')}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('package.customPackage')}</h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {t('package.description')}
          </p>

          {/* Seçilen Ürünler Listesi */}
          <div className="space-y-4 mb-6">
            {/* Ped Paketleri */}
            {(selections.standartPed > 0 || selections.superPed > 0 || selections.superPlusPed > 0) && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.pedPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'standartPed', quantity: 0 }));
                      dispatch(updateSelection({ product: 'superPed', quantity: 0 }));
                      dispatch(updateSelection({ product: 'superPlusPed', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deletePadPackages')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {selections.standartPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.standartPed} x Standart Ped</span>
                      <span className="font-medium">₺{(selections.standartPed * 15).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.superPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.superPed} x Süper Ped</span>
                      <span className="font-medium">₺{(selections.superPed * 18).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.superPlusPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.superPlusPed} x Süper+ Ped</span>
                      <span className="font-medium">₺{(selections.superPlusPed * 20).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Günlük Ped Paketleri */}
            {(selections.gunlukPed > 0 || selections.superGunlukPed > 0 || selections.tangaGunlukPed > 0) && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.dailyPadPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'gunlukPed', quantity: 0 }));
                      dispatch(updateSelection({ product: 'superGunlukPed', quantity: 0 }));
                      dispatch(updateSelection({ product: 'tangaGunlukPed', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deleteDailyPadPackages')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {selections.gunlukPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.gunlukPed} x Günlük Ped</span>
                      <span className="font-medium">₺{(selections.gunlukPed * 12).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.superGunlukPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.superGunlukPed} x Süper Günlük Ped</span>
                      <span className="font-medium">₺{(selections.superGunlukPed * 14).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.tangaGunlukPed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.tangaGunlukPed} x Tanga Günlük Ped</span>
                      <span className="font-medium">₺{(selections.tangaGunlukPed * 13).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tampon Paketleri */}
            {(selections.miniTampon > 0 || selections.standartTampon > 0 || selections.superTampon > 0) && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.tamponPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'miniTampon', quantity: 0 }));
                      dispatch(updateSelection({ product: 'standartTampon', quantity: 0 }));
                      dispatch(updateSelection({ product: 'superTampon', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deleteTamponPackages')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {selections.miniTampon > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.miniTampon} x Mini Tampon</span>
                      <span className="font-medium">₺{(selections.miniTampon * 16).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.standartTampon > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.standartTampon} x Standart Tampon</span>
                      <span className="font-medium">₺{(selections.standartTampon * 18).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.superTampon > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.superTampon} x Süper Tampon</span>
                      <span className="font-medium">₺{(selections.superTampon * 20).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Isı Bandı Paketleri */}
            {(selections.isiPaketi2li > 0 || selections.isiPaketi4lu > 0) && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.heatPadPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'isiPaketi2li', quantity: 0 }));
                      dispatch(updateSelection({ product: 'isiPaketi4lu', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deleteHeatPadPackages')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {selections.isiPaketi2li > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.isiPaketi2li} x 2'li Paket Isı Bandı</span>
                      <span className="font-medium">₺{(selections.isiPaketi2li * 99.50).toFixed(2)}</span>
                    </div>
                  )}
                  {selections.isiPaketi4lu > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">{selections.isiPaketi4lu} x 4'lü Paket Isı Bandı</span>
                      <span className="font-medium">₺{(selections.isiPaketi4lu * 187.55).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cycle Essentials Paketleri */}
            {selections.cycleEssentials > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.cycleEssentialsPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'cycleEssentials', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deleteCycleEssentials')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">{selections.cycleEssentials} x beije Cycle Essentials</span>
                    <span className="font-medium">₺{(selections.cycleEssentials * 440).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cranberry Essentials Paketleri */}
            {selections.cranberryEssentials > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{t('summary.cranberryEssentialsPackages')}</h4>
                  <button 
                    onClick={() => {
                      dispatch(updateSelection({ product: 'cranberryEssentials', quantity: 0 }));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('tooltip.deleteCranberryEssentials')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.086 1.086A1 1 0 012.5 14.5L4 13V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">{selections.cranberryEssentials} x beije Cranberry Essentials</span>
                    <span className="font-medium">₺{(selections.cranberryEssentials * 345).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
              isValid
                ? 'bg-gray-800 hover:bg-gray-900 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
{isValid ? `${t('package.addToCart')} (${formatCurrency(totalPrice || 0)})` : `${t('package.addToCart')} (₺0,00)`}
          </button>

          {isValid && (
            <p className="text-center text-gray-500 text-sm mt-3">
{t('cart.autoDeliveryNote')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
