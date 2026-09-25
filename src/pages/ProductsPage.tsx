import React, { useState, useMemo } from 'react';
import { PageRoute, Product } from '../types';
import { HEALTH_VIDEOS } from '../data/content';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { VideoModal } from '../components/VideoModal';
import {
  ShieldCheck,
  Package,
  Play,
  Check,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<{ id: string; title: string } | null>(null);
  const { language } = useLanguage();
  const { products, categories: dynamicCategories, buildWhatsAppUrl } = useFarmData();
  const t = TRANSLATIONS[language];

  const categoryTabs = useMemo(() => {
    return [
      { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
      ...dynamicCategories.map((cat) => ({
        id: cat.id,
        label: language === 'ar' ? cat.nameAr : cat.nameEn,
      })),
    ];
  }, [dynamicCategories, language]);

  // Only display available products or show stock status
  const filteredProducts = useMemo(() => {
    // Show products that are available (isAvailable !== false)
    const availableList = products.filter((p) => p.isAvailable !== false);
    if (selectedCategory === 'all') return availableList;
    return availableList.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="bg-[#1C3322] text-[#F9F6F0] py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-3">
            {t.products.headerTag}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-black mb-3 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {t.products.headerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C8D9CB] leading-relaxed">
            {t.products.headerDesc}
          </p>
        </div>
      </div>

      {/* Category Filter Tabs & Catalog Section */}
      <section className="py-14 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Tabs Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E7DECD]">
            <div className="flex items-center gap-2 text-[#50452d] text-xs sm:text-sm font-bold">
              <Filter className="w-4 h-4 text-emerald-800" />
              <span>{t.products.filterLabel}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categoryTabs.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1C3322] text-[#F9F6F0] shadow-xs ring-2 ring-emerald-600/30'
                        : 'bg-white text-[#2B2821] hover:bg-[#EAE2D2] border border-[#E7DECD]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => {
              const productName = language === 'ar' ? product.nameAr : product.nameEn;
              const productDesc = language === 'ar' ? product.descriptionAr : product.descriptionEn;
              const matchedCat = dynamicCategories.find((c) => c.id === product.category);
              const productCatLabel =
                (language === 'ar' ? matchedCat?.nameAr : matchedCat?.nameEn) ||
                (language === 'ar' ? product.categoryLabelAr : product.categoryLabelEn) ||
                product.category;
              const productWeight = language === 'ar' ? product.weightAr : product.weightEn;
              const productBadge = language === 'ar' ? product.badgeAr : product.badgeEn;
              const productBenefits = language === 'ar' ? product.benefitsAr : product.benefitsEn;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E7DECD] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image container */}
                    <div className="relative w-full aspect-4/3 bg-[#F4EFE6] overflow-hidden p-4 flex items-center justify-center">
                      <ImageWithFallback
                        src={product.image}
                        alt={productName}
                        fallbackText={productName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top badges */}
                      <div className="absolute top-3 end-3 flex flex-col gap-1.5 items-end">
                        {productBadge && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#1C3322] text-emerald-300 text-[11px] font-black shadow-xs">
                            {productBadge}
                          </span>
                        )}
                        {product.isCertifiedOrganic && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-bold shadow-xs">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>{t.products.certifiedBadge}</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[#2B2821] text-[11px] font-semibold border border-[#E7DECD]">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-[#50452d]" />
                          <span>{productWeight}</span>
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 text-start space-y-3">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {productCatLabel}
                      </span>

                      <div>
                        <h3 className="text-lg font-black text-[#1C3322] line-clamp-1">{productName}</h3>
                      </div>

                      <p className="text-xs text-[#50452d] leading-relaxed line-clamp-2">
                        {productDesc}
                      </p>

                      {/* Benefits bullets */}
                      <ul className="space-y-1 pt-1 border-t border-[#F4EFE6]">
                        {productBenefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="text-[11px] text-[#50452d] flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card footer / WhatsApp order trigger */}
                  <div className="p-5 pt-0">
                    <a
                      href={buildWhatsAppUrl(
                        language === 'ar'
                          ? `السلام عليكم، أود الاستفسار وطلب منتج من مزارع بيت الاستنبات: (${product.nameAr} - ${product.weightAr})`
                          : `Hello, I would like to inquire about ordering from Istenbat House Farm: (${product.nameEn} - ${product.weightEn})`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#1C3322] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>{t.products.orderWhatsapp}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Health & Benefits Video Hub */}
      <section className="py-16 bg-[#F4EFE6] border-t border-[#E7DECD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.products.videoSectionTag}</span>
            </div>
            <h2
              className={`text-2xl sm:text-4xl font-black text-[#1C3322] ${
                language === 'ar' ? 'font-tajawal' : 'font-sans'
              }`}
            >
              {t.products.videoSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#50452d] mt-2">
              {t.products.videoSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HEALTH_VIDEOS.map((video) => {
              const videoTitle = language === 'ar' ? video.titleAr : video.titleEn;
              const videoSubtitle = language === 'ar' ? video.subtitleAr : video.subtitleEn;
              const videoCategory = language === 'ar' ? video.categoryAr : video.categoryEn;
              const videoDuration = language === 'ar' ? video.durationAr : video.durationEn;

              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoModal({ id: video.youtubeId, title: videoTitle })}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E7DECD] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative aspect-video bg-black/90 overflow-hidden">
                      <ImageWithFallback
                        src={video.thumbnail}
                        alt={videoTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#1C3322] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-[#1C3322] translate-x-[-1px]" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                        {videoDuration}
                      </span>
                    </div>

                    <div className="p-5 text-start space-y-2">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {videoCategory}
                      </span>
                      <h3 className="text-base font-bold text-[#1C3322] group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {videoTitle}
                      </h3>
                      <p className="text-xs text-[#50452d] leading-relaxed line-clamp-2">
                        {videoSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="w-full py-2.5 rounded-xl bg-[#F4EFE6] group-hover:bg-[#1C3322] group-hover:text-white text-[#1C3322] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                      <span>{t.products.watchVideoBtn}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Modal Trigger */}
      {activeVideoModal && (
        <VideoModal
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          youtubeId={activeVideoModal.id}
          title={activeVideoModal.title}
        />
      )}
    </div>
  );
};
