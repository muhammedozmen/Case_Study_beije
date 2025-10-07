import Navigation from '@/components/Navigation';
import PackageInfo from '@/components/PackageInfo';
import CustomPackage from '@/components/CustomPackage';
import Footer from '@/components/Footer';
import ClientOnly from '@/components/ClientOnly';

export default function CustomPacketPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClientOnly fallback={
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-beije-primary">beije.</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-beije-primary to-beije-accent text-white font-semibold rounded-full">
                  <span className="text-sm">Kendi Paketini Oluştur</span>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <svg className="h-5 w-5 text-beije-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg className="h-5 w-5 text-beije-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      }>
        <Navigation />
      </ClientOnly>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-fade-in">
          <PackageInfo />
          <ClientOnly fallback={
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-card p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-100 rounded"></div>
                  <div className="h-16 bg-gray-100 rounded"></div>
                  <div className="h-16 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          }>
            <CustomPackage />
          </ClientOnly>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
