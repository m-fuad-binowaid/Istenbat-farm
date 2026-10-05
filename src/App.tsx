import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FarmDataProvider, useFarmData } from './context/FarmDataContext';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { LocationsPage } from './pages/LocationsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { MessageCircle, ArrowUp } from 'lucide-react';

function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { language, isRTL } = useLanguage();
  const { buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F9F6F0] text-[#2B2821] ${
        isRTL ? 'font-tajawal' : 'font-sans'
      } selection:bg-[#1C3322] selection:text-[#F9F6F0] overflow-x-hidden`}
    >
      <ScrollToTopOnNavigation />

      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

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
            className="w-10 h-10 rounded-full bg-[#1C3322]/80 hover:bg-[#1C3322] text-white backdrop-blur-xs flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
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
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FarmDataProvider>
    </LanguageProvider>
  );
}
