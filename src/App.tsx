import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FarmDataProvider, useFarmData } from './context/FarmDataContext';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { MessageCircle, ArrowUp } from 'lucide-react';

function AppContent() {
  const [route, setRoute] = useState<PageRoute>('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { language, isRTL } = useLanguage();
  const { buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  // Sync with browser URL hash and path for friendly URL sharing and navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
      const pathname = window.location.pathname.replace('/', '').trim();
      
      const target = hash || pathname;
      if (['home', 'about', 'products', 'experience', 'contact', 'admin'].includes(target)) {
        setRoute(target as PageRoute);
      } else {
        setRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newRoute: PageRoute) => {
    setRoute(newRoute);
    window.location.hash = `#/${newRoute}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin mode, render dedicated Admin view
  if (route === 'admin') {
    return <AdminPage onNavigate={navigateTo} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F9F6F0] text-[#2B2821] ${
        isRTL ? 'font-tajawal' : 'font-sans'
      } selection:bg-[#1C3322] selection:text-[#F9F6F0] overflow-x-hidden`}
    >
      {/* Sticky Glass Navbar */}
      <Navbar currentRoute={route} onNavigate={navigateTo} />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        {route === 'home' && <HomePage onNavigate={navigateTo} />}
        {route === 'about' && <AboutPage onNavigate={navigateTo} />}
        {route === 'products' && <ProductsPage onNavigate={navigateTo} />}
        {route === 'experience' && <ExperiencePage onNavigate={navigateTo} />}
        {route === 'contact' && <ContactPage onNavigate={navigateTo} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Action Buttons: WhatsApp & Scroll to Top */}
      <div
        className={`fixed bottom-6 ${
          isRTL ? 'left-6' : 'right-6'
        } z-40 flex flex-col items-center gap-3`}
      >
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            aria-label={t.common.backToTop}
            className="w-10 h-10 rounded-full bg-[#1C3322]/80 hover:bg-[#1C3322] text-white backdrop-blur-xs flex items-center justify-center shadow-md transition-all hover:scale-110"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          href={buildWhatsAppUrl(
            language === 'ar'
              ? 'السلام عليكم مزرعة استنبات، أود الاستفسار عن المنتجات العضوية وحجوزات الزيارة الريفية.'
              : 'Hello Istenbat Farm, I would like to inquire about organic produce and farm tour reservations.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.common.quickWhatsappTooltip}
          className="relative group flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
          <MessageCircle className="w-7 h-7" />
          {/* Tooltip */}
          <span
            className={`hidden group-hover:block absolute ${
              isRTL ? 'left-full ml-3' : 'right-full mr-3'
            } px-3 py-1.5 bg-[#1C3322] text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-md`}
          >
            {t.common.quickWhatsappTooltip}
          </span>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <FarmDataProvider>
        <AppContent />
      </FarmDataProvider>
    </LanguageProvider>
  );
}
