'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-beije-text mb-6">
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          
          <div className="space-y-4">
            <Link
              href="/custom-packet"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-beije-primary to-beije-accent hover:from-beije-accent hover:to-beije-primary text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              {t('home.startButton')}
            </Link>
            
            <p className="text-sm text-beije-muted">
              {t('home.autoDelivery')}
            </p>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-beije-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🩸</span>
            </div>
            <h3 className="text-lg font-semibold text-beije-text mb-2">{t('home.personalPackage')}</h3>
            <p className="text-beije-muted">{t('home.personalPackageDesc')}</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚚</span>
            </div>
            <h3 className="text-lg font-semibold text-beije-text mb-2">{t('home.autoDeliveryTitle')}</h3>
            <p className="text-beije-muted">{t('home.autoDeliveryDesc')}</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💚</span>
            </div>
            <h3 className="text-lg font-semibold text-beije-text mb-2">{t('home.naturalProducts')}</h3>
            <p className="text-beije-muted">{t('home.naturalProductsDesc')}</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
