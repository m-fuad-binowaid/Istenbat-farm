import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  src: string;
  altAr: string;
  altEn: string;
}

export const FARM_GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 20 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: `farm-gallery-${num}`,
    src: `/assets/gallery/farm-gallery-${num}.jpg`,
    altAr: `مقتطفات من مزرعة بيت الاستنبات بالدلم - صورة ${i + 1}`,
    altEn: `Moments from Istenbat House Farm Ad Dilam - Photo ${i + 1}`,
  };
});

export const FarmVisualCatalog: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const t = TRANSLATIONS[language];
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState<number>(0);

  // Subtle vertical parallax on window scroll
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Only calculate when section is visible in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        // Calculate relative position from center (-1 to +1)
        const centerDistance = rect.top + rect.height / 2 - windowHeight / 2;
        // Subtle offset range between -16px and +16px
        const offset = Math.max(-16, Math.min(16, (centerDistance / windowHeight) * 28));
        setParallaxOffset(offset);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Scroll horizontal track
  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = trackRef.current.clientWidth * 0.75;
    const multiplier = direction === 'right' ? 1 : -1;
    trackRef.current.scrollBy({
      left: multiplier * scrollAmount,
      behavior: 'smooth',
    });
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        if (isRTL) {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev - 1 + FARM_GALLERY_PHOTOS.length) % FARM_GALLERY_PHOTOS.length
          );
        } else {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev + 1) % FARM_GALLERY_PHOTOS.length
          );
        }
      } else if (e.key === 'ArrowLeft') {
        if (isRTL) {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev + 1) % FARM_GALLERY_PHOTOS.length
          );
        } else {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev - 1 + FARM_GALLERY_PHOTOS.length) % FARM_GALLERY_PHOTOS.length
          );
        }
      }
    },
    [selectedPhotoIndex, isRTL]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex]);

  const showNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) =>
      prev === null ? 0 : (prev + 1) % FARM_GALLERY_PHOTOS.length
    );
  };

  const showPrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) =>
      prev === null ? 0 : (prev - 1 + FARM_GALLERY_PHOTOS.length) % FARM_GALLERY_PHOTOS.length
    );
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#FAF7F2] text-[#2B2821] border-t border-[#E5DFD3] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Heading & Desktop Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-black tracking-wide mb-3">
              <span>{t.home.galleryTag}</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C3322] ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.home.galleryTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#686358] mt-2 max-w-2xl leading-relaxed">
              {t.home.gallerySub}
            </p>
          </div>

          {/* Desktop Carousel Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTrack(isRTL ? 'right' : 'left')}
              aria-label={language === 'ar' ? 'السابق' : 'Previous'}
              className="w-11 h-11 rounded-full bg-white border border-[#E5DFD3] shadow-sm hover:shadow hover:bg-[#F3EFE6] text-[#1C3322] flex items-center justify-center transition-all active:scale-95"
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(isRTL ? 'left' : 'right')}
              aria-label={language === 'ar' ? 'التالي' : 'Next'}
              className="w-11 h-11 rounded-full bg-white border border-[#E5DFD3] shadow-sm hover:shadow hover:bg-[#F3EFE6] text-[#1C3322] flex items-center justify-center transition-all active:scale-95"
            >
              {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Horizontal Fluid Carousel Track with Subtle Parallax Depth */}
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FARM_GALLERY_PHOTOS.map((photo, index) => {
            // Subtle alternating parallax depth factor so adjacent cards shift with pleasant dimension
            const depthFactor = index % 2 === 0 ? 1 : 0.7;
            const currentShift = parallaxOffset * depthFactor;

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative flex-shrink-0 w-60 sm:w-72 aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md bg-[#E8E2D5] cursor-pointer snap-start transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Parallax inner container with subtle scale buffer and smooth 60fps vertical translation */}
                <div
                  className="w-full h-full relative overflow-hidden transition-transform duration-75 ease-out will-change-transform"
                  style={{
                    transform: `translate3d(0, ${currentShift}px, 0) scale(1.08)`,
                  }}
                >
                  <img
                    src={photo.src}
                    alt={language === 'ar' ? photo.altAr : photo.altEn}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  />
                </div>

                {/* Discreet hover affordance (Expand Icon ⛶ / Zoom) */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-11 h-11 rounded-full bg-white/90 text-[#1C3322] shadow-lg flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
        >
          {/* Top-corner Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex(null);
            }}
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={isRTL ? showNextPhoto : showPrevPhoto}
            aria-label={language === 'ar' ? 'السابق' : 'Previous'}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={isRTL ? showPrevPhoto : showNextPhoto}
            aria-label={language === 'ar' ? 'التالي' : 'Next'}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* High-Resolution Photo Viewer */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center max-w-[92vw] max-h-[88vh]"
          >
            <img
              src={FARM_GALLERY_PHOTOS[selectedPhotoIndex].src}
              alt={
                language === 'ar'
                  ? FARM_GALLERY_PHOTOS[selectedPhotoIndex].altAr
                  : FARM_GALLERY_PHOTOS[selectedPhotoIndex].altEn
              }
              referrerPolicy="no-referrer"
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl md:rounded-2xl shadow-2xl transition-all duration-300 select-none"
            />

            {/* Photo Counter Pill (subtle) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono">
              {selectedPhotoIndex + 1} / {FARM_GALLERY_PHOTOS.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
