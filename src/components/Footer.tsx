import React from 'react';
import { PageRoute } from '../types';
import { OFFICIAL_INFO } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { getAssetUrl } from '../utils/assetPath';
import { Phone, Mail, MapPin, Globe, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { contactInfo, buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  const handleNav = (route: PageRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#122216] text-[#F9F6F0] border-t border-[#2D4C35] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2D4C35]/60">
          {/* Col 1: Official Establishment & Parent Group */}
          <div className="flex flex-col gap-4">
            <a
              href="#/home"
              onClick={(e) => {
                e.preventDefault();
                handleNav('home');
              }}
              className="flex items-center gap-2.5 md:gap-3 flex-shrink-0 group focus:outline-none"
              aria-label={language === 'ar' ? OFFICIAL_INFO.nameAr : OFFICIAL_INFO.nameEn}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] p-1.5 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                <img
                  src={getAssetUrl('assets/Untitled design1234_2.jpg')}
                  alt="شعار استنبات"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col text-start leading-none">
                <span className="text-xl md:text-2xl font-black text-[#F9F6F0] tracking-tight font-tajawal">
                  استنبات
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase font-sans mt-0.5">
                  ISTENBAT
                </span>
                <span className="text-[10px] text-[#A1B8A7] mt-1">
                  {language === 'ar' ? OFFICIAL_INFO.parentGroupAr : OFFICIAL_INFO.parentGroupEn}
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-[#C8D9CB] leading-relaxed">
              {language === 'ar' ? OFFICIAL_INFO.missionStatementAr : OFFICIAL_INFO.missionStatementEn}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C3322] border border-[#3E5C45] text-[11px] text-[#A1B8A7]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t.footer.missionBadge}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase font-readex">
              {t.footer.quickLinksTitle}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#C8D9CB]">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.home}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.about}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.products}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('experience')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.experience}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.contact}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Contact Data */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase font-readex">
              {t.footer.contactInfoTitle}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#C8D9CB]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold block text-white">{t.contact.labelLocation}</span>
                  <span>{language === 'ar' ? contactInfo.locationAr : contactInfo.locationEn}</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`tel:${contactInfo.phone}`} dir="ltr" className="hover:text-white font-medium">
                    {contactInfo.phone}
                  </a>
                  <span className="text-[#8C9E91]">•</span>
                  <a href={`tel:${contactInfo.mobile}`} dir="ltr" className="hover:text-white font-medium">
                    {contactInfo.mobile}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${contactInfo.emailInfo}`} className="hover:text-white">
                  {contactInfo.emailInfo}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://${OFFICIAL_INFO.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>{OFFICIAL_INFO.website}</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Open & Visit Hours & CTA */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase font-readex">
              {t.footer.hoursTitle}
            </h3>
            <div className="p-3.5 rounded-xl bg-[#1C3322]/80 border border-[#2D4C35] text-xs text-[#C8D9CB] space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{t.footer.officialHoursLabel}</p>
                  <p>{language === 'ar' ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}</p>
                </div>
              </div>
              <div className="border-t border-[#2D4C35] pt-2">
                <p className="font-semibold text-white">{t.footer.visitHoursLabel}</p>
                <p>{language === 'ar' ? contactInfo.visitHoursAr : contactInfo.visitHoursEn}</p>
              </div>
            </div>
            <a
              href={buildWhatsAppUrl(
                language === 'ar'
                  ? 'السلام عليكم، أود الاستفسار عن حجز زيارة ريفية وتوريد المنتجات العضوية من مؤسسة بيت الاستنبات.'
                  : 'Hello, I would like to inquire about booking a farm visit and ordering organic products from Istenbat House.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-md"
            >
              <span>{t.footer.footerWhatsappBtn}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C9E91]">
          <p>
            © {new Date().getFullYear()} {language === 'ar' ? 'مؤسسة بيت الاستنبات للزراعة' : 'Istenbat House Agriculture'}. {t.footer.copyright}
          </p>
          <div className="flex items-center gap-3">
            <span>{language === 'ar' ? OFFICIAL_INFO.parentGroupAr : OFFICIAL_INFO.parentGroupEn}</span>
            <span>•</span>
            <span>{language === 'ar' ? contactInfo.locationAr : contactInfo.locationEn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
