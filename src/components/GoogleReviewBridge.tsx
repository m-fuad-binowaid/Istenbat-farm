import React, { useState } from 'react';
import { Star, CheckCircle2, Copy, ExternalLink, Sparkles, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface GoogleReviewBridgeProps {
  placeId?: string;
  customReviewUrl?: string;
  className?: string;
  compact?: boolean;
}

export const GoogleReviewBridge: React.FC<GoogleReviewBridgeProps> = ({
  placeId = 'YOUR_PLACE_ID',
  customReviewUrl,
  className = '',
  compact = false,
}) => {
  const { language, isRTL } = useLanguage();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Verified Google Maps link for Istenbat Farmstead
  const GOOGLE_REVIEW_URL =
    customReviewUrl || 'https://maps.app.goo.gl/iiJmB7yHZx4ieqHj8';

  const ratingDescriptions: Record<number, { ar: string; en: string }> = {
    5: { ar: 'ممتاز جداً 🌟🌟🌟🌟🌟 - ننصح به بشدة', en: 'Exceptional 🌟🌟🌟🌟🌟 - Highly Recommended' },
    4: { ar: 'رائع جداً 🌟🌟🌟🌟 - جودة فاخرة وطبيعية', en: 'Very Good 🌟🌟🌟🌟 - High Quality' },
    3: { ar: 'جيد 🌟🌟🌟 - تجربة طيبة', en: 'Good 🌟🌟🌟 - Pleasing Experience' },
    2: { ar: 'مقبول 🌟🌟 - يحتاج بعض التطوير', en: 'Fair 🌟🌟 - Needs Improvement' },
    1: { ar: 'يحتاج تحسين 🌟', en: 'Needs Attention 🌟' },
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  // Safe clipboard helper
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  // Submit and Google Maps Handoff
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedComment = comment.trim();

    if (trimmedComment) {
      await copyToClipboard(trimmedComment);
      setIsCopied(true);
      setToastMessage(
        language === 'ar'
          ? 'تم نسخ تقييمك! جارٍ نقلك إلى خرائط Google للصقه واعتماده 🌟'
          : 'Your review was copied! Redirecting to Google Maps to paste and confirm 🌟'
      );
    } else {
      setIsCopied(false);
      setToastMessage(
        language === 'ar'
          ? 'شكراً لاختيارك التقييم! جارٍ نقلك إلى خرائط Google 🌟'
          : 'Thank you for your rating! Redirecting to Google Maps 🌟'
      );
    }

    setShowToast(true);

    // Open Google Review destination in a new window/tab
    try {
      window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Could not automatically open window:', err);
    }

    // Auto-dismiss toast banner after 8 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 8000);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`relative w-full rounded-3xl bg-[#FDFBF7] border border-[#E7DECD] shadow-sm hover:shadow-md transition-shadow overflow-hidden text-[#2B2821] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 md:p-10'
      } ${className}`}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Toast Notification */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-2xl bg-[#1C3322] text-[#F9F6F0] border border-emerald-500/30 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                {toastMessage}
              </p>
              {isCopied && (
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  {language === 'ar'
                    ? '💡 نصيحة: انقر بالزر الأيمن أو اختر "لصق" (Paste) في خانة المراجعة بقوقل ماب.'
                    : '💡 Tip: Right-click or tap "Paste" inside the Google review dialog.'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-black text-xs transition-colors"
            >
              <span>{language === 'ar' ? 'فتح قوقل ماب' : 'Open Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              aria-label={language === 'ar' ? 'إغلاق الإشعار' : 'Close notification'}
              className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Card Header & Brand Badge */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-black tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>
            {language === 'ar' ? 'تقييم تجربة المزرعة والمنتجات' : 'Farm Harvest & Experience Review'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-[#1C3322] leading-tight mb-2">
          {language === 'ar' ? 'شاركونا رأيكم بمنتجات مزارعنا 🌿' : 'Share Your Review on Our Farm Harvest 🌿'}
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-lg mx-auto font-normal">
          {language === 'ar'
            ? 'تقييمكم يسعدنا ويدعم الإنتاج الوطني بالدلم'
            : 'Your feedback delights us and supports local agriculture in Ad Dilam'}
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmitReview} className="max-w-xl mx-auto space-y-5 sm:space-y-6">
        {/* Interactive 5-Star Selector */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DECD] shadow-2xs">
          <span className="text-xs font-bold text-stone-700 mb-2">
            {language === 'ar' ? 'اختر عدد النجوم:' : 'Select your star rating:'}
          </span>

          <div
            className="flex items-center justify-center gap-1.5 sm:gap-2.5"
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((starValue) => {
              const isFilled = starValue <= activeRating;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onFocus={() => setHoverRating(starValue)}
                  onBlur={() => setHoverRating(null)}
                  aria-label={`${language === 'ar' ? 'تقييم' : 'Rate'} ${starValue} ${
                    language === 'ar' ? 'من 5 نجوم' : 'out of 5 stars'
                  }`}
                  className="p-1.5 sm:p-2 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl hover:bg-amber-50 transition-all transform active:scale-90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-150 ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.4)] scale-110'
                        : 'text-stone-300 fill-stone-100 hover:text-amber-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Dynamic Rating Feedback Text */}
          <div className="mt-2.5 text-xs font-bold text-emerald-900 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
            {language === 'ar'
              ? ratingDescriptions[activeRating]?.ar
              : ratingDescriptions[activeRating]?.en}
          </div>
        </div>

        {/* Short Optional Comment Textarea */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="review-comment" className="block text-xs font-bold text-stone-700">
            {language === 'ar' ? 'تجربتك الشخصية (اختياري):' : 'Your Personal Experience (Optional):'}
          </label>
          <div className="relative">
            <textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'اكتب تجربتك مع منتجاتنا هنا...'
                  : 'Write your experience with our products here...'
              }
              maxLength={500}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] placeholder:text-stone-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all resize-none shadow-2xs leading-relaxed"
            />
            {comment && (
              <button
                type="button"
                onClick={() => setComment('')}
                aria-label={language === 'ar' ? 'مسح النص' : 'Clear text'}
                className="absolute top-2.5 end-2.5 p-1 text-stone-400 hover:text-stone-700 text-xs rounded-md transition-colors"
              >
                {language === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-700" />
              <span>
                {language === 'ar'
                  ? 'سيتم نسخ نص تعليقك تلقائياً لتقوم بلصقه في قوقل ماب'
                  : 'Your comment will be copied automatically to paste into Google Maps'}
              </span>
            </span>
            <span>{comment.length}/500</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#1C3322] hover:bg-[#274730] text-white font-black text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer active:scale-[0.99] border border-emerald-900"
          >
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span>
              {language === 'ar'
                ? 'إرسال التقييم واعتماده في قوقل ماب ⭐️'
                : 'Submit & Confirm on Google Maps ⭐️'}
            </span>
            <ExternalLink className="w-4 h-4 text-emerald-300 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Trust & Zero-Database Reassurance Pill */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-600">
          <span className="inline-flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {language === 'ar' ? 'تقييم مباشر دون إنشاء حساب' : 'Direct review without signing up'}
            </span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <Copy className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {language === 'ar' ? 'نسخ ذكي فوري للنص' : 'Instant smart text clipboard'}
            </span>
          </span>
        </div>
      </form>
    </div>
  );
};
