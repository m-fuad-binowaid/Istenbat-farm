import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import {
  OFFICIAL_INFO,
  TRUST_BADGES,
  WHAT_WE_OFFER,
  GOOGLE_REVIEWS,
} from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { getAssetUrl } from '../utils/assetPath';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { VideoModal } from '../components/VideoModal';
import { FarmVisualCatalog } from '../components/FarmVisualCatalog';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Sprout,
  Calendar,
  MessageCircle,
  Play,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Quote,
  Star,
  HeartHandshake,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

const HERO_SLIDES = [
  {
    id: 'sunflowers',
    src: '/assets/hero-sunflowers.jpg',
    altAr: 'حقول عباد الشمس والزهور - مزرعة بيت الاستنبات',
    altEn: 'Sunflowers and flower fields - Istenbat House Farm',
  },
  {
    id: 'camping',
    src: '/assets/hero-camping.jpg',
    altAr: 'المخيم والجلسة الريفية - مزرعة بيت الاستنبات',
    altEn: 'Rural camping and farm stay - Istenbat House Farm',
  },
  {
    id: 'crops',
    src: '/assets/hero-crops.jpg',
    altAr: 'الحقول الخضراء ومحاصيل الدلم',
    altEn: 'Green crop fields and Al-Dilam harvest - Istenbat House Farm',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroParallaxY, setHeroParallaxY] = useState(0);
  const { language, isRTL } = useLanguage();
  const { contactInfo, buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  // Subtle 60fps hardware-accelerated parallax on window scroll
  useEffect(() => {
    let animId: number;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 900) {
        // Subtle offset between 0 and 50px for the hero background
        setHeroParallaxY(Math.min(60, scrollY * 0.22));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case 'sofa':
        return <Award className="w-8 h-8 text-amber-500" />;
      case 'quality':
        return <ShieldCheck className="w-8 h-8 text-emerald-600" />;
      case 'organic':
        return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
      case 'eco-friendly':
        return <QrCode className="w-8 h-8 text-emerald-700" />;
      default:
        return <Sprout className="w-8 h-8 text-emerald-600" />;
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION WITH AUTOMATED 3-IMAGE CROSSFADE SLIDER */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center bg-[#122216] text-white overflow-hidden">
        {/* Automated Crossfade Slides with Hardware-Accelerated Parallax */}
        <div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(0, ${heroParallaxY}px, 0) scale(1.08)`,
          }}
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <img
                key={slide.id}
                src={getAssetUrl(slide.src)}
                alt={language === 'ar' ? slide.altAr : slide.altEn}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            );
          })}
        </div>

        {/* Contrast & Readability Gradient (Crucial) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C3322]/90 via-black/50 to-black/60 z-10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.home.heroTag}</span>
          </div>

          {/* Clean Main Headline */}
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] mb-6 drop-shadow-md ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.home.heroTitle}
          </h1>

          {/* Clean Sub-paragraph */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-[#C8D9CB] mb-10 leading-relaxed font-normal">
            {t.home.heroDesc}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-black text-base rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Sprout className="w-5 h-5 text-[#122216]" />
              <span>{t.home.exploreProductsBtn}</span>
            </button>

            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-full border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>{t.home.watchTourBtn}</span>
            </button>
          </div>

          {/* Quick Metrics & Location Bar */}
          <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-black/20 rounded-xl backdrop-blur-xs">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-readex">
                {t.home.statOrganicVal}
              </span>
              <span className="text-xs text-[#C8D9CB]">{t.home.statOrganicSub}</span>
            </div>
            <div className="p-3 bg-black/20 rounded-xl backdrop-blur-xs">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-readex">
                {t.home.statFreshVal}
              </span>
              <span className="text-xs text-[#C8D9CB]">{t.home.statFreshSub}</span>
            </div>
            <div className="p-3 bg-black/20 rounded-xl backdrop-blur-xs">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-readex">
                {t.home.statSustainableVal}
              </span>
              <span className="text-xs text-[#C8D9CB]">{t.home.statSustainableSub}</span>
            </div>
            <div className="p-3 bg-black/20 rounded-xl backdrop-blur-xs">
              <span className="block text-2xl sm:text-3xl font-black text-amber-300 font-readex">
                {t.home.statLocationVal}
              </span>
              <span className="text-xs text-[#C8D9CB]">{t.home.statLocationSub}</span>
            </div>
          </div>
        </div>

        {/* Slide Navigation Indicators */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`انتقل إلى الشريحة ${index + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  isActive
                    ? 'w-7 sm:w-8 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* 2. WHAT WE OFFER SECTION */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#50452d] tracking-widest uppercase font-readex block mb-1">
              {t.home.offerTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C3322]">
              {t.home.offerTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHAT_WE_OFFER.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl overflow-hidden bg-white border border-[#E7DECD] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={language === 'ar' ? item.titleAr : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 text-white">
                    <h3 className="text-lg font-black">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <p className="text-sm text-[#50452d] leading-relaxed mb-6">
                    {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>
                  <button
                    onClick={() => onNavigate(item.id === 'fruits-veg' ? 'products' : 'experience')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>{t.home.learnMoreBtn}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL QUALITY PILLARS & TRUST BADGES */}
      <section className="py-14 bg-[#F4EFE6] border-y border-[#E7DECD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#50452d] tracking-widest uppercase font-readex block mb-1">
              {t.home.pillarsTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C3322]">
              {t.home.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DECD] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] flex items-center justify-center mb-4">
                    {getBadgeIcon(badge.id)}
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2">
                    {language === 'ar' ? badge.codeAr : badge.codeEn}
                  </span>
                  <h3 className="text-base font-bold text-[#1C3322] mb-2">
                    {language === 'ar' ? badge.titleAr : badge.titleEn}
                  </h3>
                  <p className="text-xs text-[#50452d] leading-relaxed">
                    {language === 'ar' ? badge.descAr : badge.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED DOCUMENTARY VIDEO EMBED */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C3322]/10 text-[#1C3322] text-xs font-bold mb-2">
                <Play className="w-3.5 h-3.5 fill-[#1C3322]" />
                {t.home.docuTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C3322]">
                {t.home.docuTitle}
              </h2>
            </div>
            <a
              href="https://youtu.be/3HvxXYrXoIs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t.home.watchOnYoutube}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black group">
            <iframe
              src="https://www.youtube.com/embed/3HvxXYrXoIs?rel=0"
              title={t.home.docuTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#F4EFE6] border border-[#E7DECD] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#50452d]">
            <span className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700 shrink-0" />
              {t.home.docuBannerText}
            </span>
            <button
              onClick={() => onNavigate('about')}
              className="font-bold text-[#1C3322] hover:underline shrink-0"
            >
              {t.home.readStoryBtn}
            </button>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED GOOGLE MAPS REVIEWS */}
      <section className="py-16 md:py-20 bg-[#122216] text-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide mb-3">
              <span>{t.home.vloggersTag}</span>
            </span>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black text-white ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.home.vloggersTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#A1B8A7] mt-3 leading-relaxed">
              {t.home.vloggersSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOOGLE_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-3xl bg-[#1C3322] border border-white/10 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 transition-all duration-300"
              >
                <div>
                  {/* Top: Quote Icon & Golden Rating Stars */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Quote className="w-8 h-8 text-emerald-400/30 shrink-0" />
                    <div className="flex items-center gap-1" dir="ltr">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Body: Authentic Review Text */}
                  <p className="text-sm text-[#E7DECD] leading-relaxed mb-6 font-normal">
                    {language === 'ar' ? review.textAr : review.textEn}
                  </p>
                </div>

                {/* Footer: Author & Google Maps Verified Badge */}
                <div className="border-t border-[#2D4C35] pt-4 mt-auto">
                  <h4 className="text-sm font-bold text-white tracking-wide mb-1">
                    {review.author}
                  </h4>
                  <span className="inline-flex items-center text-xs text-emerald-400/90 font-medium">
                    {language === 'ar' ? review.badgeAr : review.badgeEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FARM VISUAL CATALOG (مقتطفات من المزرعة) */}
      <FarmVisualCatalog />

      {/* 7. QUICK WHATSAPP CALLOUT */}
      <section id="visit-inquiry" className="py-16 bg-[#1C3322] text-[#F9F6F0] border-t border-[#2D4C35]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6">
            <HeartHandshake className="w-8 h-8 text-emerald-400" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-4 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.home.ctaCardTitle}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C8D9CB] mb-8 leading-relaxed">
            {t.home.ctaCardSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={buildWhatsAppUrl(
                language === 'ar'
                  ? 'السلام عليكم، أود الاستفسار عن منتجات بيت الاستنبات العضوية وحجز جولة ريفية.'
                  : 'Hello, I would like to inquire about Istenbat organic products and book a farm tour.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-black text-base rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {t.home.ctaWhatsappBtn} ({contactInfo.whatsapp})
              </span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-7 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-sm rounded-full border border-white/30 transition-all cursor-pointer"
            >
              {t.home.ctaContactBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        youtubeId="3HvxXYrXoIs"
        title={t.home.videoModalTitle}
      />
    </div>
  );
};
