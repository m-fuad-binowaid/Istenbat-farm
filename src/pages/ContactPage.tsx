import React, { useState } from 'react';
import { PageRoute } from '../types';
import { OFFICIAL_INFO } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { FarmInteractiveMap } from '../components/FarmInteractiveMap';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  MessageCircle,
  Navigation,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { language } = useLanguage();
  const { contactInfo, buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTopic, setFormTopic] = useState(t.contact.formTopics[0]);
  const [formMessage, setFormMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullText =
      language === 'ar'
        ? `السلام عليكم ورحمة الله،
استفسار جديد عبر الموقع الرسمي لمؤسسة بيت الاستنبات للزراعة بالدلم:
• الاسم: ${formName}
• رقم الجوال: ${formPhone}
• نوع الاستفسار: ${formTopic}
• نص الرسالة: ${formMessage}
`
        : `Hello,
New inquiry from Istenbat House Farm official website:
• Name: ${formName}
• Phone: ${formPhone}
• Subject: ${formTopic}
• Message: ${formMessage}
`;
    setSentSuccess(true);
    const link = buildWhatsAppUrl(fullText);
    window.open(link, '_blank');
  };

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="bg-[#1C3322] text-[#F9F6F0] py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-3">
            {t.contact.headerTag}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-black mb-3 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.contact.headerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C8D9CB] leading-relaxed">
            {t.contact.headerDesc}
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Official Contact Info Box */}
            <div className="lg:col-span-5 space-y-6 text-start">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DECD] shadow-xs space-y-6">
                <h2
                  className={`text-xl font-black text-[#1C3322] pb-3 border-b border-[#E7DECD] ${
                    language === 'ar' ? 'font-tajawal' : 'font-sans'
                  }`}
                >
                  {t.contact.infoBoxTitle}
                </h2>

                <ul className="space-y-4 text-xs sm:text-sm text-[#50452d]">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#1C3322] font-bold mb-0.5">{t.contact.labelLocation}</strong>
                      <span>{language === 'ar' ? contactInfo.locationAr : contactInfo.locationEn}</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#1C3322] font-bold mb-0.5">{t.contact.labelPhone}</strong>
                      <div className="flex flex-wrap items-center gap-3">
                        <a href="tel:+966501207704" dir="ltr" className="text-emerald-800 font-bold hover:underline">
                          {contactInfo.mobile || '0501207704'}
                        </a>
                        <a
                          href={`https://wa.me/${contactInfo.whatsappRaw || '966501207704'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#1C3322] font-bold mb-0.5">{t.contact.labelEmail}</strong>
                      <div className="flex flex-col gap-0.5">
                        <a href={`mailto:${contactInfo.emailInfo}`} className="text-emerald-800 font-medium hover:underline">
                          {contactInfo.emailInfo}
                        </a>
                        <a href={`mailto:${OFFICIAL_INFO.emailCare}`} className="text-emerald-800/80 hover:underline text-xs">
                          {OFFICIAL_INFO.emailCare}
                        </a>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#1C3322] font-bold mb-0.5">{t.contact.labelHours}</strong>
                      <span>{language === 'ar' ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#1C3322] font-bold mb-0.5">{t.contact.labelWebsite}</strong>
                      <a
                        href={`https://${OFFICIAL_INFO.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-800 hover:underline flex items-center gap-1 font-sans"
                      >
                        <span>{OFFICIAL_INFO.website}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick direct chat card */}
              <div className="p-6 rounded-3xl bg-[#1C3322] text-[#F9F6F0] flex flex-col gap-3">
                <h3
                  className={`font-bold text-base text-emerald-300 ${
                    language === 'ar' ? 'font-tajawal' : 'font-sans'
                  }`}
                >
                  {t.contact.instantChatTitle}
                </h3>
                <p className="text-xs text-[#C8D9CB] leading-relaxed">
                  {t.contact.instantChatDesc}
                </p>
                <a
                  href={`https://wa.me/${OFFICIAL_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-bold text-xs sm:text-sm rounded-xl text-center shadow-md transition-colors"
                >
                  {t.contact.instantChatBtn} ({OFFICIAL_INFO.whatsapp})
                </a>
              </div>
            </div>

            {/* Right Col: Interactive Contact Form & Location Map Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DECD] shadow-xs text-start">
                <h2
                  className={`text-xl font-black text-[#1C3322] mb-6 ${
                    language === 'ar' ? 'font-tajawal' : 'font-sans'
                  }`}
                >
                  {t.contact.formTitle}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1C3322] mb-1">
                        {t.contact.formLabelName}
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t.contact.formNamePh}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C3322] mb-1">
                        {t.contact.formLabelPhone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder={t.contact.formPhonePh}
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1">
                      {t.contact.formLabelTopic}
                    </label>
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                    >
                      {t.contact.formTopics.map((topic, idx) => (
                        <option key={idx} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1">
                      {t.contact.formLabelMsg}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder={t.contact.formMsgPh}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1C3322] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.formSubmitBtn}</span>
                  </button>
                </form>

                {sentSuccess && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.contact.formSuccess}</span>
                  </div>
                )}
              </div>

              {/* Interactive Google Map & Stylized SVG Farm Blueprint with Zone Markers */}
              <FarmInteractiveMap />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
