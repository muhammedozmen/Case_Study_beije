'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          {/* Main content - always centered */}
          <div className="text-center text-beije-muted text-sm mb-4 md:mb-0">
            <p>{t('footer.copyright')}</p>
            <p className="mt-2">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Language Selector - absolute positioned to right on desktop */}
          <div className="flex justify-center md:justify-end md:absolute md:right-0 md:top-0 items-center space-x-2">
            <span className="text-sm text-beije-muted">{t('footer.language')}:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'tr'
                    ? 'bg-beije-primary text-white'
                    : 'text-gray-600 hover:text-beije-primary'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-beije-primary text-white'
                    : 'text-gray-600 hover:text-beije-primary'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
