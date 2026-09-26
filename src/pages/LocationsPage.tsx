import React, { useState, useMemo } from 'react';
import { PageRoute, StoreLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useFarmData } from '../context/FarmDataContext';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Search,
  Filter,
  CheckCircle2,
  Store,
  Compass,
  ArrowUpRight,
  Sprout,
  Building2,
} from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { locations, contactInfo } = useFarmData();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active locations only
  const activeLocations = useMemo(() => {
    return locations.filter((loc) => loc.isActive !== false);
  }, [locations]);

  // Unique Cities list (computed dynamically)
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    activeLocations.forEach((loc) => {
      const cityVal = language === 'ar' ? loc.city : (loc.cityEn || loc.city);
      if (cityVal) citySet.add(cityVal);
    });
    return Array.from(citySet);
  }, [activeLocations, language]);

  // Unique Store Chains list (computed dynamically)
  const storeChains = useMemo(() => {
    const chainSet = new Set<string>();
    activeLocations.forEach((loc) => {
      const chainVal = language === 'ar' ? loc.storeName : (loc.storeNameEn || loc.storeName);
      if (chainVal) chainSet.add(chainVal);
    });
    return Array.from(chainSet);
  }, [activeLocations, language]);

  // Filtered Locations
  const filteredLocations = useMemo(() => {
    return activeLocations.filter((loc) => {
      const cityName = language === 'ar' ? loc.city : (loc.cityEn || loc.city);
      const chainName = language === 'ar' ? loc.storeName : (loc.storeNameEn || loc.storeName);

      const matchesCity = selectedCity === 'all' || cityName === selectedCity;
      const matchesChain = selectedChain === 'all' || chainName === selectedChain;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === '' ||
        loc.storeName.toLowerCase().includes(query) ||
        (loc.storeNameEn && loc.storeNameEn.toLowerCase().includes(query)) ||
        loc.branchName.toLowerCase().includes(query) ||
        (loc.branchNameEn && loc.branchNameEn.toLowerCase().includes(query)) ||
        loc.city.toLowerCase().includes(query) ||
        (loc.cityEn && loc.cityEn.toLowerCase().includes(query));

      return matchesCity && matchesChain && matchesQuery;
    });
  }, [activeLocations, selectedCity, selectedChain, searchQuery, language]);

  return (
    <div className="w-full">
      {/* 1. Header Hero Banner */}
      <div className="bg-[#1C3322] text-[#F9F6F0] py-16 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 start-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 end-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-3 border border-white/10">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'ar' ? 'شبكة منافذ البيع والتوزيع المعتمدة' : 'Official Retailers & Stockists'}
            </span>
          </span>

          <h1
            className={`text-3xl sm:text-5xl font-black mb-4 ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {language === 'ar' ? 'أين تجد منتجاتنا؟' : 'Where to Find Our Products'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C8D9CB] leading-relaxed">
            {language === 'ar'
              ? 'تتوفر محاصيل ومنتجات مزرعة بيت الاستنبات العضوية الطازجة في كبرى سلاسل السوبرماركت ومتاجر التجزئة ومحلات الأغذية الصحية بالمملكة.'
              : 'Our 100% certified organic farm produce is stocked daily across premier supermarket chains, retail branches, and organic specialty stores in Saudi Arabia.'}
          </p>
        </div>
      </div>

      {/* 2. Main Store Locator Section */}
      <section className="py-12 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Controls: Search & City/Chain Filters */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7DECD] shadow-xs mb-10 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'ابحث باسم المتجر، الفرع، الحي، أو المدينة...'
                      : 'Search by store, branch, district or city...'
                  }
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#50452d]">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {language === 'ar'
                    ? `${filteredLocations.length} فرع متاح حالياً`
                    : `${filteredLocations.length} locations available`}
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="pt-3 border-t border-[#F0EAE1] space-y-3">
              {/* City Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#1C3322] flex items-center gap-1.5 shrink-0 me-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'ar' ? 'المدينة:' : 'City:'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedCity('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCity === 'all'
                      ? 'bg-[#1C3322] text-[#F9F6F0] shadow-xs'
                      : 'bg-[#F4EFE6] text-[#50452d] hover:bg-[#EAE2D2] border border-[#E7DECD]'
                  }`}
                >
                  {language === 'ar' ? 'كل المدن' : 'All Cities'}
                </button>

                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#1C3322] text-[#F9F6F0] shadow-xs'
                        : 'bg-[#F4EFE6] text-[#50452d] hover:bg-[#EAE2D2] border border-[#E7DECD]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Store Chain Filter Pills */}
              {storeChains.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-[#1C3322] flex items-center gap-1.5 shrink-0 me-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'ar' ? 'المتجر:' : 'Store:'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedChain('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedChain === 'all'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-[#F4EFE6] text-[#50452d] hover:bg-[#EAE2D2] border border-[#E7DECD]'
                    }`}
                  >
                    {language === 'ar' ? 'كل المتاجر' : 'All Stores'}
                  </button>

                  {storeChains.map((chain) => (
                    <button
                      key={chain}
                      type="button"
                      onClick={() => setSelectedChain(chain)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedChain === chain
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-[#F4EFE6] text-[#50452d] hover:bg-[#EAE2D2] border border-[#E7DECD]'
                      }`}
                    >
                      {chain}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Branch Cards Grid */}
          {filteredLocations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E7DECD] space-y-3">
              <Store className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-[#1C3322]">
                {language === 'ar' ? 'لا توجد فروع مطابقة لبحثك' : 'No branches found'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'جرّب إلغاء التصفية أو اختيار مدينة أخرى، كما يمكنك طلب التوصيل المباشر أو زيارة المزرعة.'
                  : 'Try clearing your filters or selecting another city, or contact us for direct farm delivery.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedChain('all');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C3322] text-white text-xs font-bold cursor-pointer"
              >
                <span>{language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredLocations.map((branch) => {
                const storeTitle = language === 'ar' ? branch.storeName : (branch.storeNameEn || branch.storeName);
                const branchTitle = language === 'ar' ? branch.branchName : (branch.branchNameEn || branch.branchName);
                const cityName = language === 'ar' ? branch.city : (branch.cityEn || branch.city);
                const notes = language === 'ar' ? branch.notesAr : (branch.notesEn || branch.notesAr);

                return (
                  <div
                    key={branch.id}
                    className="bg-white rounded-3xl p-6 border border-[#E7DECD] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-start relative overflow-hidden"
                  >
                    {/* Top ambient accent */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 opacity-60" />

                    <div>
                      {/* Top Row (Badges): Store Name Pill (Right) & City Badge (Left) */}
                      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                        <span className="text-xs font-bold text-[#1C3322] bg-emerald-50/90 px-3.5 py-1 rounded-full border border-emerald-200/90 shadow-2xs">
                          {storeTitle}
                        </span>
                        <span className="text-xs font-bold text-[#50452d] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E7DECD] flex items-center gap-1.5 shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{cityName}</span>
                        </span>
                      </div>

                      {/* Branch Title (Full Width) */}
                      <h3 className="text-lg sm:text-xl font-black text-[#1C3322] leading-snug mb-3.5 group-hover:text-emerald-800 transition-colors">
                        {branchTitle}
                      </h3>

                      {/* Location details & notes */}
                      {notes && (
                        <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-xs text-[#50452d] flex items-start gap-2 mb-5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Action: Open in Google Maps */}
                    <div className="pt-4 border-t border-[#F0EAE1]">
                      <a
                        href={branch.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                        title={language === 'ar' ? 'فتح الموقع في تطبيق خرائط جوجل' : 'Open in Google Maps App'}
                      >
                        <Navigation className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:rotate-45 transition-transform" />
                        <span>
                          {language === 'ar' ? 'فتح في خرائط جوجل 📍' : 'Open in Google Maps 📍'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-emerald-300 opacity-80" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. Direct Farmstead Visit Banner */}
          <div className="mt-14 bg-gradient-to-br from-[#1C3322] to-[#122216] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-4 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'المقر الرئيسي والمزرعة' : 'Farmstead Headquarters'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-snug">
                {language === 'ar'
                  ? 'أو تفضل بزيارة المزرعة مباشرة في الدلم وقطف محاصيلك بنفسك!'
                  : 'Or Visit Our Farm in Ad Dilam Directly to Pick Your Own Fresh Harvest!'}
              </h2>

              <p className="text-xs sm:text-sm text-[#C8D9CB] leading-relaxed">
                {language === 'ar'
                  ? `${contactInfo.locationAr} — استمتع بتجربة ريفية فريدة، تذوق عسل النحل، قطف الخضار، وصيد الأسماك وسط الطبيعة.`
                  : `${contactInfo.locationEn} — Experience a refreshing countryside retreat, raw honey apiaries, vegetable harvesting, and pond fishing.`}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.app.goo.gl/9P7vD3jW5m6E6C5d8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{language === 'ar' ? 'موقع المزرعة على الخريطة' : 'Farm Location on Maps'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('experience')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/15"
                >
                  <Compass className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'ar' ? 'استكشف السياحة والمخيم' : 'Explore Farm Experience'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
