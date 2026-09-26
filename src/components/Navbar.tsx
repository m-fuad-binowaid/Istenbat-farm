import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { OFFICIAL_INFO } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { getAssetUrl } from '../utils/assetPath';
import { Menu, X, Phone, Calendar, ArrowLeft, ArrowRight, Globe } from 'lucide-react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { contactInfo } = useFarmData();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageRoute; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'products', label: t.nav.products },
    { id: 'locations', label: t.nav.locations },
    { id: 'experience', label: t.nav.experience },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVisitCtaClick = () => {
    setMobileMenuOpen(false);
    if (currentRoute === 'home') {
      const el = document.getElementById('visit-inquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    } else if (currentRoute === 'experience') {
      const el = document.getElementById('booking-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    onNavigate('experience');
    setTimeout(() => {
      const el = document.getElementById('booking-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top micro-bar with official data */}
      <div className="hidden md:block bg-[#122216] text-[#E7DECD] text-xs py-2 px-6 border-b border-[#2D4C35]/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {t.nav.topBarText}
            </span>
            <span className="text-[#8C9E91]">•</span>
            <span>{language === 'ar' ? contactInfo.locationAr : contactInfo.locationEn}</span>
            <span className="text-[#8C9E91]">•</span>
            <span>{language === 'ar' ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+966501207704"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">{contactInfo.mobile || contactInfo.phone || '0501207704'}</span>
            </a>
            <span className="text-[#8C9E91]">|</span>
            <a
              href={`https://wa.me/${contactInfo.whatsappRaw || '966501207704'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {t.nav.mobilePrefix} {contactInfo.whatsapp || contactInfo.mobile}
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F9F6F0]/95 backdrop-blur-md shadow-md border-b border-[#E7DECD] py-2.5'
            : 'bg-[#F9F6F0]/90 backdrop-blur-sm border-b border-[#E7DECD]/70 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo Lockup (Icon + Native Typography) */}
          <a
            href="#/home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-2.5 md:gap-3 flex-shrink-0 group focus:outline-none"
            aria-label={t.nav.brandTitle}
          >
            <img
              src={getAssetUrl('logo.png')}
              alt="شعار مزرعة بيت الاستنبات - Istenbat Farm"
              className="h-10 md:h-12 w-auto object-contain mix-blend-multiply transition-transform group-hover:scale-105 flex-shrink-0"
            />
            <div className="flex flex-col text-start justify-center select-none leading-none flex-shrink-0">
              {language === 'ar' ? (
                <>
                  <span className="text-[10px] md:text-xs font-semibold text-[#1C3322]/80 tracking-normal font-tajawal">
                    مزرعة بيت الاستنبات
                  </span>
                  <span className="text-lg md:text-2xl font-black text-[#1C3322] tracking-tight leading-none my-0.5 font-tajawal">
                    استنبات
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#1C3322]/65 uppercase font-sans">
                    ISTENBAT
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] md:text-xs font-semibold text-[#1C3322]/80 tracking-normal font-sans">
                    Istenbat House Farm
                  </span>
                  <span className="text-lg md:text-2xl font-black text-[#1C3322] tracking-tight leading-none my-0.5 font-sans">
                    ISTENBAT
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#1C3322]/65 uppercase font-sans">
                    ORGANIC FARMSTEAD
                  </span>
                </>
              )}
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F4EFE6]/80 p-1.5 rounded-full border border-[#E7DECD]">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1C3322] text-[#F9F6F0] shadow-xs'
                      : 'text-[#2B2821] hover:text-[#1C3322] hover:bg-[#EAE2D2]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTA, Language Switcher & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-[#F4EFE6] text-[#1C3322] text-xs font-bold border border-[#E7DECD] shadow-xs transition-colors shrink-0"
              aria-label={t.nav.switchLangAria}
              title={t.nav.switchLangAria}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.nav.switchLangText}</span>
            </button>

            {/* Farm Visit CTA Button (Hidden on Mobile < md, visible and single-line on desktop) */}
            <button
              onClick={handleVisitCtaClick}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C3322] hover:bg-[#274730] text-[#F9F6F0] text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t.nav.bookCta}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#1C3322] hover:bg-[#F4EFE6] border border-[#E7DECD] transition-colors shrink-0"
              aria-label={t.nav.menuAria}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-auto z-50 bg-[#F9F6F0] border-b border-[#E7DECD] shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="max-w-md mx-auto px-5 py-5 flex flex-col gap-3">
            {/* Prominent High-End Visit CTA Button inside Drawer */}
            <button
              onClick={handleVisitCtaClick}
              className="w-full py-3.5 px-5 bg-[#1C3322] hover:bg-[#274730] text-white font-bold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
            >
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>{t.nav.bookCta}</span>
            </button>

            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-start font-bold text-base transition-colors ${
                    isActive
                      ? 'bg-[#1C3322] text-[#F9F6F0]'
                      : 'text-[#2B2821] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 opacity-70" />
                  ) : (
                    <ArrowRight className="w-4 h-4 opacity-70" />
                  )}
                </button>
              );
            })}
            <div className="pt-4 mt-2 border-t border-[#E7DECD] flex flex-col gap-2 text-sm text-[#50452d]">
              <div className="flex items-center justify-between">
                <span>{t.nav.topBarLocation}</span>
                <a
                  href="tel:+966501207704"
                  dir="ltr"
                  className="font-bold text-[#1C3322]"
                >
                  {contactInfo.mobile || contactInfo.phone || '0501207704'}
                </a>
              </div>
              <div className="text-xs text-[#8C7A5B]">
                {language === 'ar' ? OFFICIAL_INFO.workingHoursAr : OFFICIAL_INFO.workingHoursEn}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
