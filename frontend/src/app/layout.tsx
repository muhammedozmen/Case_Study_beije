import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beije - Kendi Paketini Oluştur',
  description: 'Kişisel ihtiyacına yönelik özel paketini oluştur. Ped, günlük ped ve tampon seçenekleri ile 2 ayda bir otomatik gönderim.',
  keywords: ['beije', 'ped', 'tampon', 'günlük ped', 'özel paket', 'kadın hijyeni'],
  authors: [{ name: 'Beije' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Beije - Kendi Paketini Oluştur',
    description: 'Kişisel ihtiyacına yönelik özel paketini oluştur.',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beije - Kendi Paketini Oluştur',
    description: 'Kişisel ihtiyacına yönelik özel paketini oluştur.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
