import React from 'react';
import { PageRoute } from '../types';
import { ABOUT_STORY, OFFICIAL_INFO, buildWhatsAppLink } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import {
  Award,
  Sprout,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Sun,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, isRTL } = useLanguage();
  const t = TRANSLATIONS[language];

  const pillarIcons = [
    <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    <Sun className="w-6 h-6 text-amber-500" />,
    <Sprout className="w-6 h-6 text-emerald-600" />,
    <Leaf className="w-6 h-6 text-emerald-700" />,
  ];

  return (
    <div className="w-full">
      {/* 1. Header Banner */}
      <div className="bg-[#1C3322] text-[#F9F6F0] py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="/assets/flora11.jpg"
            alt={language === 'ar' ? 'مزارع بيت الاستنبات بالدلم' : 'Istenbat Farms in Ad Dilam'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-4 backdrop-blur-xs">
            {t.about.headerTag}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-black mb-4 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {language === 'ar' ? ABOUT_STORY.headlineAr : ABOUT_STORY.headlineEn}
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#C8D9CB] leading-relaxed">
            {language === 'ar' ? OFFICIAL_INFO.missionStatementAr : OFFICIAL_INFO.missionStatementEn}
          </p>
        </div>
      </div>

      {/* 2. Official Foundation & Farm Zones */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual element */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F4EFE6]">
              <ImageWithFallback
                src="/assets/flora01.jpg"
                alt={language === 'ar' ? 'مزرعة بيت الاستنبات بالدلم' : 'Istenbat Farm Ad Dilam'}
                fallbackText={language === 'ar' ? 'طبيعة الدلم' : 'Ad Dilam Nature'}
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute bottom-4 right-4 left-4 p-4 rounded-2xl bg-[#122216]/90 backdrop-blur-md text-[#F9F6F0] border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      {language === 'ar' ? OFFICIAL_INFO.nameAr : OFFICIAL_INFO.nameEn}
                    </h4>
                    <p className="text-xs text-[#C8D9CB]">
                      {language === 'ar' ? OFFICIAL_INFO.locationAr : OFFICIAL_INFO.locationEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content text */}
            <div className="space-y-6 text-start">
              <div>
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                  {t.about.sectionPioneerTag}
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-black text-[#1C3322] mt-1 ${
                    language === 'ar' ? 'font-tajawal' : 'font-sans'
                  }`}
                >
                  {t.about.sectionPioneerTitle}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#50452d] leading-relaxed">
                {language === 'ar' ? ABOUT_STORY.overviewAr : ABOUT_STORY.overviewEn}
              </p>

              <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E7DECD] text-xs sm:text-sm text-[#50452d] leading-relaxed">
                <p className="font-bold text-[#1C3322] mb-1">{t.about.inviteTitle}</p>
                <p>{language === 'ar' ? ABOUT_STORY.invitationAr : ABOUT_STORY.invitationEn}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('experience')}
                  className="px-6 py-3 bg-[#1C3322] hover:bg-[#274730] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>{t.about.exploreStayBtn}</span>
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3 bg-white hover:bg-[#EAE2D2] text-[#1C3322] text-xs sm:text-sm font-bold rounded-xl border border-[#E7DECD] transition-colors"
                >
                  {t.about.exploreProdBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Core Pillars */}
      <section className="py-16 bg-[#F4EFE6] border-y border-[#E7DECD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#50452d] tracking-widest uppercase block mb-1">
              {t.about.pillarsTag}
            </span>
            <h2
              className={`text-2xl sm:text-4xl font-black text-[#1C3322] ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.about.pillarsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#50452d] mt-2">
              {t.about.pillarsDesc}
            </p>
          </div>

          {/* Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT_STORY.fourPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#E7DECD] shadow-xs hover:shadow-md transition-all text-start flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center mb-4">
                    {pillarIcons[idx]}
                  </div>
                  <h3 className="text-xl font-black text-[#1C3322] mb-3">
                    {language === 'ar' ? pillar.titleAr : pillar.titleEn}
                  </h3>
                  <p className="text-sm text-[#50452d] leading-relaxed">
                    {language === 'ar' ? pillar.descAr : pillar.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Certifications & Audit Section */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>{t.about.sofaTag}</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black text-[#1C3322] mb-4 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.about.sofaTitle}
          </h2>

          <p className="text-sm sm:text-base text-[#50452d] leading-relaxed max-w-3xl mx-auto mb-10">
            {t.about.sofaDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            <div className="p-6 rounded-3xl bg-white border border-[#E7DECD] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1C3322] text-base mb-1">
                  {t.about.sofaCardTitle}
                </h4>
                <p className="text-xs text-[#50452d] leading-relaxed">
                  {t.about.sofaCardDesc}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7DECD] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1C3322] text-base mb-1">
                  {t.about.almudhanCardTitle}
                </h4>
                <p className="text-xs text-[#50452d] leading-relaxed">
                  {t.about.almudhanCardDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <a
              href={buildWhatsAppLink(
                language === 'ar'
                  ? 'السلام عليكم، أود التواصل مع إدارة مؤسسة بيت الاستنبات للزراعة بالدلم.'
                  : 'Hello, I would like to contact the administration of Istenbat House Agriculture in Ad Dilam.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C3322] hover:bg-[#274730] text-white text-sm font-bold rounded-full shadow-md transition-all"
            >
              <span>{t.about.contactAdminBtn}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
