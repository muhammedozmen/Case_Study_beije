'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  tr: {
    // Navigation
    'nav.createPackage': 'Kendi Paketini Oluştur',
    
    // Homepage
    'home.welcome': 'Hoş Geldiniz',
    'home.subtitle': 'Kendi özel paketinizi oluşturun ve ihtiyacınıza göre kişiselleştirin',
    'home.startButton': 'Paket Oluşturmaya Başla',
    'home.autoDelivery': '2 ayda bir otomatik gönderim ile rahatlık',
    'home.personalPackage': 'Kişisel Paket',
    'home.personalPackageDesc': 'İhtiyacınıza göre özelleştirilebilir paketler',
    'home.autoDeliveryTitle': 'Otomatik Gönderim',
    'home.autoDeliveryDesc': '2 ayda bir düzenli teslimat',
    'home.naturalProducts': 'Doğal Ürünler',
    'home.naturalProductsDesc': 'Organik ve güvenli malzemeler',
    
    // Custom Package
    'package.title': 'Kendi Paketini Oluştur',
    'package.menstrualProducts': 'Menstrüel Ürünler',
    'package.supportiveProducts': 'Destekleyici Ürünler',
    'package.addToCart': 'Sepete Ekle',
    'package.customPackage': 'Özel Paketin',
    'package.autoDelivery': '2 ayda bir gönderim',
    'package.description': 'Kişisel ihtiyacına yönelik istediğin miktarda Ped, Günlük Ped, Tampon veya destekleyici ürünler ekleyerek kendine özel bir paket oluşturabilirsin.',
    
    // Product names
    'product.standartPed': 'Standart Ped',
    'product.superPed': 'Süper Ped',
    'product.superPlusPed': 'Süper+ Ped',
    'product.gunlukPed': 'Günlük Ped',
    'product.superGunlukPed': 'Süper Günlük Ped',
    'product.tangaGunlukPed': 'Tanga Günlük Ped',
    'product.miniTampon': 'Mini Tampon',
    'product.standartTampon': 'Standart Tampon',
    'product.superTampon': 'Süper Tampon',
    'product.isiPaketi2li': '2\'li Paket Isı Bandı',
    'product.isiPaketi4lu': '4\'lü Paket Isı Bandı',
    'product.cycleEssentials': 'beije Cycle Essentials',
    'product.cranberryEssentials': 'beije Cranberry Essentials',
    
    // Product categories
    'category.beijePed': 'beije Ped',
    'category.beijeGunlukPed': 'beije Günlük Ped',
    'category.beijeTampon': 'beije Tampon',
    'category.isiBandi': 'Isı Bandı',
    'category.beijeCycleEssentials': 'beije Cycle Essentials',
    'category.beijeCranberryEssentials': 'beije Cranberry Essentials',
    
    // Product descriptions
    'description.beijePed': 'Çoğu beije kullanıcısı normal yoğunlukta bir regl dönemi için abonelik paketinde 20 Standart, 20 Süper Ped tercih ediyor.',
    'description.beijeGunlukPed': 'Kullanıcılarımızın %68\'i akıntıları olan günlerde Standart Günlük Ped\'i, regllerinin son günlerinde veya daha yoğun akıntıları olan günlerde ise Süper Günlük Ped\'i tercih ediyor.',
    'description.isiBandi': 'Isı Bandı\'nı hem kas ağrıların hem de regl ağrıların için kullanabilirsin!',
    'description.beijeCycleEssentials': 'Cycle Essentials\'ın bir şişesi, iki aylık döngüne yetecek miktarda, 32 kapsül içerir.',
    'description.beijeCranberryEssentials': 'Cranberry Essentials\'ın bir şişesi, tamami vegan bileşenlerden oluşan 30 kapsül içerir.',
    
    // Summary section
    'summary.pedPackages': 'Ped Paketleri',
    'summary.dailyPadPackages': 'Günlük Ped Paketleri', 
    'summary.tamponPackages': 'Tampon Paketleri',
    'summary.heatPadPackages': 'Isı Bandı Paketleri',
    'summary.cycleEssentialsPackages': 'Cycle Essentials Paketleri',
    'summary.cranberryEssentialsPackages': 'Cranberry Essentials Paketleri',
    
    // Tooltips
    'tooltip.deletePadPackages': 'Ped paketlerini sil',
    'tooltip.deleteDailyPadPackages': 'Günlük ped paketlerini sil',
    'tooltip.deleteTamponPackages': 'Tampon paketlerini sil',
    'tooltip.deleteHeatPadPackages': 'Isı bandı paketlerini sil',
    'tooltip.deleteCycleEssentials': 'Cycle Essentials paketini sil',
    'tooltip.deleteCranberryEssentials': 'Cranberry Essentials paketini sil',
    
    // Cart
    'cart.title': 'Sepetim',
    'cart.empty': 'Sepetiniz boş',
    'cart.emptyDesc': 'Sepetinize ürün eklemek için paket oluşturma sayfasına gidin.',
    'cart.goToPackage': 'Paket Oluşturmaya Git',
    'cart.clearCart': 'Sepeti Temizle',
    'cart.total': 'Toplam',
    'cart.confirmClear': 'Sepeti tamamen boşaltmak istediğinizden emin misiniz?',
    'cart.completeOrder': 'Siparişi Tamamla',
    'cart.continueShopping': 'Alışverişe Devam Et',
    'cart.autoDeliveryNote': '2 ayda bir otomatik gönderim',
    
    // Footer
    'footer.copyright': '© 2025 beije. Tüm hakları saklıdır.',
    'footer.description': 'Kişisel ihtiyacına yönelik özel paketini oluştur.',
    'footer.language': 'Dil',
  },
  en: {
    // Navigation
    'nav.createPackage': 'Create Your Package',
    
    // Homepage
    'home.welcome': 'Welcome',
    'home.subtitle': 'Create your custom package and personalize it according to your needs',
    'home.startButton': 'Start Creating Package',
    'home.autoDelivery': 'Convenience with automatic delivery every 2 months',
    'home.personalPackage': 'Personal Package',
    'home.personalPackageDesc': 'Customizable packages according to your needs',
    'home.autoDeliveryTitle': 'Automatic Delivery',
    'home.autoDeliveryDesc': 'Regular delivery every 2 months',
    'home.naturalProducts': 'Natural Products',
    'home.naturalProductsDesc': 'Organic and safe materials',
    
    // Custom Package
    'package.title': 'Create Your Package',
    'package.menstrualProducts': 'Menstrual Products',
    'package.supportiveProducts': 'Supportive Products',
    'package.addToCart': 'Add to Cart',
    'package.customPackage': 'Your Custom Package',
    'package.autoDelivery': 'Delivery every 2 months',
    'package.description': 'You can create your own package by adding your preferred amount of Pads, Pantyliners, Tampons and other supporting products to meet your personal needs.',
    
    // Product names
    'product.standartPed': 'Standard Pad',
    'product.superPed': 'Super Pad',
    'product.superPlusPed': 'Super+ Pad',
    'product.gunlukPed': 'Daily Pad',
    'product.superGunlukPed': 'Super Daily Pad',
    'product.tangaGunlukPed': 'Thong Daily Pad',
    'product.miniTampon': 'Mini Tampon',
    'product.standartTampon': 'Standard Tampon',
    'product.superTampon': 'Super Tampon',
    'product.isiPaketi2li': '2-Pack Heat Pad',
    'product.isiPaketi4lu': '4-Pack Heat Pad',
    'product.cycleEssentials': 'beije Cycle Essentials',
    'product.cranberryEssentials': 'beije Cranberry Essentials',
    
    // Product categories
    'category.beijePed': 'beije Pad',
    'category.beijeGunlukPed': 'beije Daily Pad',
    'category.beijeTampon': 'beije Tampon',
    'category.isiBandi': 'Heat Pad',
    'category.beijeCycleEssentials': 'beije Cycle Essentials',
    'category.beijeCranberryEssentials': 'beije Cranberry Essentials',
    
    // Product descriptions
    'description.beijePed': 'Most beije users prefer 20 Standard and 20 Super Pads in their subscription package for an average period flow.',
    'description.beijeGunlukPed': '68% of our users prefer the Standard Pantyliner on days they have a discharge, and the Super Pantyliner on the last days of their periods or on days with heavier discharge.',
    'description.isiBandi': 'You can use the Heating Patch for both muscle pain and menstrual cramps.',
    'description.beijeCycleEssentials': 'One bottle of Cycle Essentials contains 32 capsules, enough for two cycles.',
    'description.beijeCranberryEssentials': 'One bottle of Cranberry Essentials contains 30 capsules made entirely from vegan ingredients.',
    
    // Summary section
    'summary.pedPackages': 'Pad Packages',
    'summary.dailyPadPackages': 'Daily Pad Packages',
    'summary.tamponPackages': 'Tampon Packages', 
    'summary.heatPadPackages': 'Heat Pad Packages',
    'summary.cycleEssentialsPackages': 'Cycle Essentials Packages',
    'summary.cranberryEssentialsPackages': 'Cranberry Essentials Packages',
    
    // Tooltips
    'tooltip.deletePadPackages': 'Delete pad packages',
    'tooltip.deleteDailyPadPackages': 'Delete daily pad packages',
    'tooltip.deleteTamponPackages': 'Delete tampon packages',
    'tooltip.deleteHeatPadPackages': 'Delete heat pad packages',
    'tooltip.deleteCycleEssentials': 'Delete Cycle Essentials package',
    'tooltip.deleteCranberryEssentials': 'Delete Cranberry Essentials package',
    
    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Go to the package creation page to add products to your cart.',
    'cart.goToPackage': 'Go to Package Creation',
    'cart.clearCart': 'Clear Cart',
    'cart.total': 'Total',
    'cart.confirmClear': 'Are you sure you want to completely empty the cart?',
    'cart.completeOrder': 'Complete Order',
    'cart.continueShopping': 'Continue Shopping',
    'cart.autoDeliveryNote': 'Automatic delivery every 2 months',
    
    // Footer
    'footer.copyright': '© 2025 beije. All rights reserved.',
    'footer.description': 'Create your custom package according to your personal needs.',
    'footer.language': 'Language',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('beije-language') as Language;
      if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beije-language', lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
