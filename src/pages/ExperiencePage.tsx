import React, { useState } from 'react';
import { PageRoute } from '../types';
import { AGRITOURISM_ACTIVITIES } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

interface ExperiencePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = () => {
  const { language } = useLanguage();
  const { buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  // Visit Inquiry Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const messageText =
      language === 'ar'
        ? `السلام عليكم ورحمة الله وبركاته،
أود الاستفسار والتنسيق لزيارة مزرعة بيت الاستنبات بالدلم:
• الاسم الكريم: ${customerName || 'زائر كريم'}
• التاريخ المقترح: ${selectedDate || 'غير محدد'}
• الاستفسارات والملاحظات: ${notes || 'أود معرفة تفاصيل الأنشطة المتاحة ومواعيد الزيارة'}

يرجى إفادتي بتفاصيل الزيارة والتنسيق. شكراً لكم!`
        : `Hello,
I would like to inquire about visiting Istenbat House Farm in Ad Dilam:
• Name: ${customerName || 'Guest'}
• Proposed Date: ${selectedDate || 'Not specified'}
• Inquiries & Notes: ${notes || 'I would like to know more about available activities and visiting hours'}

Please provide me with visit details and arrangements. Thank you!`;

    setSubmittedMessage(messageText);
    const link = buildWhatsAppUrl(messageText);
    window.open(link, '_blank');
  };

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="bg-[#1C3322] text-[#F9F6F0] py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="/assets/visitor11.jpg"
            alt={language === 'ar' ? 'الضيافة الريفية في بيت الاستنبات' : 'Istenbat Farmhouse Hospitality'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-4">
            {t.experience.headerTag}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-black mb-4 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.experience.headerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C8D9CB] leading-relaxed">
            {t.experience.headerDesc}
          </p>
        </div>
      </div>

      {/* Activity Cards Section */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#50452d] tracking-widest uppercase block mb-1">
              {t.experience.activitiesTag}
            </span>
            <h2
              className={`text-2xl sm:text-4xl font-black text-[#1C3322] ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.experience.activitiesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AGRITOURISM_ACTIVITIES.map((act) => {
              const actTitle = language === 'ar' ? act.titleAr : act.titleEn;
              const actTag = language === 'ar' ? act.tagAr : act.tagEn;
              const actDesc = language === 'ar' ? act.descriptionAr : act.descriptionEn;
              const actDetails = language === 'ar' ? act.detailsAr : act.detailsEn;

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E7DECD] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-[#F4EFE6] overflow-hidden">
                      <ImageWithFallback
                        src={act.image}
                        alt={actTitle}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-[#1C3322] text-[#F9F6F0] text-xs font-bold shadow-xs">
                        {actTag}
                      </div>
                    </div>

                    <div className="p-6 text-start space-y-3">
                      <h3 className="text-xl font-black text-[#1C3322]">{actTitle}</h3>
                      <p className="text-xs sm:text-sm text-[#50452d] leading-relaxed">
                        {actDesc}
                      </p>

                      <ul className="space-y-2 pt-3 border-t border-[#F4EFE6]">
                        {actDetails.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#50452d]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        const bookingEl = document.getElementById('booking-section');
                        if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3 bg-[#F4EFE6] hover:bg-[#1C3322] hover:text-white text-[#1C3322] text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t.experience.inquireCardBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit Inquiry Form Section */}
      <section id="booking-section" className="py-16 bg-[#F4EFE6] border-t border-[#E7DECD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.experience.bookingTag}</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-black text-[#1C3322] ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.experience.bookingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#50452d] mt-2">
              {t.experience.bookingDesc}
            </p>
          </div>

          <form
            onSubmit={handleInquirySubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7DECD] shadow-sm space-y-6 text-start"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1C3322] mb-2">
                  {t.experience.formName}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.experience.formNamePh}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7DECD] bg-[#F9F6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-[#1C3322]"
                />
              </div>

              {/* Field 2: Date */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1C3322] mb-2">
                  {t.experience.formDate}
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7DECD] bg-[#F9F6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-[#1C3322]"
                />
              </div>
            </div>

            {/* Field 3: Notes & Special Inquiries */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#1C3322] mb-2">
                {t.experience.formNotes}
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.experience.formNotesPh}
                className="w-full px-4 py-3 rounded-xl border border-[#E7DECD] bg-[#F9F6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-[#1C3322]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#1C3322] hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>{t.experience.formSubmit}</span>
            </button>

            {submittedMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
                <p className="font-bold mb-1">✓ {t.experience.formSuccess}</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
