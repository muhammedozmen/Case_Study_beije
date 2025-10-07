'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function PackageInfo() {
  const { t } = useLanguage();

  return (
    <div className="bg-beije-neutral rounded-2xl p-6 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-beije-text text-center">
        {t('package.title')}
      </h1>
    </div>
  );
}
