import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Temple Journey — Sacred Map & Digital Travel Journal',
  description:
    'A personal digital record of your spiritual travels across India. Record temple visits, attach memories and photos, and build your visual map of sacred places.',
  keywords: [
    'Temple Journey',
    'Spiritual Map India',
    'Temple Tracker',
    'Pilgrimage Journal',
    'Jyotirlingas Map',
    'Sacred Travels',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] dark:bg-[#12131A] text-stone-900 dark:text-stone-100 antialiased flex flex-col selection:bg-amber-500 selection:text-white">
        {/* Desktop Navbar */}
        <Navbar />

        {/* Main Application Container */}
        <main className="flex-1 pb-24 md:pb-12">{children}</main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
