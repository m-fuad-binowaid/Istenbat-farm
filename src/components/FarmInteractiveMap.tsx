import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { OFFICIAL_INFO } from '../data/content';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Layers,
  Sparkles,
  Fish,
  Trees,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';

export interface FarmZone {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  descAr: string;
  descEn: string;
  iconType: 'greenhouse' | 'pond' | 'visitor' | 'camping' | 'apiary';
  color: string;
  coords: { x: number; y: number }; // Percentage inside SVG map: x (0-100), y (0-100)
}

export const FARM_ZONES: FarmZone[] = [
  {
    id: 'zone-greenhouses',
    nameAr: 'البيوت المحمية ووحدات الاستنبات',
    nameEn: 'Greenhouses & Sprouting Units',
    categoryAr: 'الإنتاج الزراعي العضوي',
    categoryEn: 'Organic Agriculture',
    descAr:
      'بيوت محمية مبردة لزراعة الخضار العضوية النظيفة مع إمكانية القطف المباشر، بجانب غرف استنبات الشعير المائي.',
    descEn:
      'Climate-controlled greenhouses for fresh organic vegetables with direct picking, alongside hydroponic barley chambers.',
    iconType: 'greenhouse',
    color: '#10B981', // Emerald
    coords: { x: 38, y: 34 },
  },
  {
    id: 'zone-pond',
    nameAr: 'بحيرة الأسماك والاستزراع السمكي',
    nameEn: 'Aquaculture Fish Pond',
    categoryAr: 'الاستزراع والأنشطة المائية',
    categoryEn: 'Aquaculture & Activities',
    descAr:
      'بحيرة مائية عذبة للأسماك تحيط بها مساحات خضراء وأشجار ظليلة تتيح تجربة صيد ممتعة للأطفال والعائلات.',
    descEn:
      'Freshwater fish pond framed by scenic greenery, offering relaxing recreational fishing for children and families.',
    iconType: 'pond',
    color: '#0284C7', // Sky Blue
    coords: { x: 68, y: 44 },
  },
  {
    id: 'zone-visitor',
    nameAr: 'نُزل الضيافة وجلسات الزوار',
    nameEn: 'Visitor Lodge & Gathering Lawns',
    categoryAr: 'مرافق الضيافة والاستقبال',
    categoryEn: 'Hospitality & Welcome',
    descAr:
      'المقر الرئيسي لاستقبال الزوار، جلسات عائلية مجهزة، متجر المنتجات الطازجة (عسل، بيض، أجبان)، ومرافق متكاملة.',
    descEn:
      'Main visitor hospitality center, seated family lawns, fresh farm store (honey, eggs, cheese), and full amenities.',
    iconType: 'visitor',
    color: '#F59E0B', // Amber
    coords: { x: 50, y: 68 },
  },
  {
    id: 'zone-camping',
    nameAr: 'مخيمات المبيت ومسارات الدراجات',
    nameEn: 'Campsites & Cycling Tracks',
    categoryAr: 'السياحة الريفية والمغامرة',
    categoryEn: 'Rural Tourism & Adventure',
    descAr:
      'مواقع تخييم مجهزة ومفتوحة على الطبيعة الريفية مع مسارات رملية مخصصة لركوب الدراجات الهوائية ومحبي النزهات.',
    descEn:
      'Dedicated rustic campsites under the stars and scenic trails for cycling enthusiasts and outdoor picnics.',
    iconType: 'camping',
    color: '#8B5CF6', // Purple
    coords: { x: 80, y: 26 },
  },
  {
    id: 'zone-apiary',
    nameAr: 'مناحل العسل وأشجار السدر',
    nameEn: 'Honey Apiaries & Sidr Groves',
    categoryAr: 'إنتاج العسل الطبيعي',
    categoryEn: 'Raw Honey Production',
    descAr:
      'منطقة خلايا النحل الطبيعية المستخلصة من أزهار وأشجار السدر والبرسيم بالدلم لإنتاج أجود أنواع العسل الخام.',
    descEn:
      'Natural bee apiaries surrounded by blooming Sidr and clover trees for pure unpasteurized raw honey.',
    iconType: 'apiary',
    color: '#D97706', // Golden
    coords: { x: 22, y: 62 },
  },
];

export const FarmInteractiveMap: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'google' | 'zones'>('google');
  const [selectedZone, setSelectedZone] = useState<FarmZone>(FARM_ZONES[0]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'مؤسسة بيت الاستنبات للزراعة الدلم King Abdullah Rd Ad Dilam'
  )}`;

  // Google Maps Embed (Search embed around Ad Dilam coordinates)
  const embedSrc =
    'https://maps.google.com/maps?q=23.991200,47.165000+(Istenbat%20House%20Farm%20-%20%D9%85%D8%B2%D8%B1%D8%B9%D8%A9%20%D8%A8%D9%8A%D8%AA%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%86%D8%A8%D8%A7%D8%AA)&t=m&z=14&ie=UTF8&iwloc=B&output=embed';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7DECD] shadow-sm space-y-5 text-start">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DECD]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'ar'
                ? 'موقع المزرعة والخريطة التفاعلية'
                : 'Interactive Farm Map & Location'}
            </span>
          </div>
          <h3
            className={`text-lg sm:text-xl font-black text-[#1C3322] ${
              language === 'ar' ? 'font-tajawal' : 'font-sans'
            }`}
          >
            {language === 'ar'
              ? 'مزرعة بيت الاستنبات - الدلم'
              : 'Istenbat House Farm - Ad Dilam'}
          </h3>
        </div>

        {/* Tab Switcher: Live Google Map vs Interactive Zones Layout */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-2xl border border-[#E7DECD] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'google'
                ? 'bg-[#1C3322] text-white shadow-xs'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            {language === 'ar' ? 'خريطة Google المباشرة' : 'Live Google Map'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('zones')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'zones'
                ? 'bg-[#1C3322] text-white shadow-xs'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مخطط المناطق والقطاعات' : 'Farm Zones Plan'}</span>
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#E7DECD] bg-[#F9F6F0] shadow-inner">
        {activeTab === 'google' ? (
          /* Google Maps View with stylized overlay */
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[340px]">
            <iframe
              src={embedSrc}
              title="Istenbat House Farm Google Maps Location"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Quick Badge overlay in corner */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E7DECD] shadow-md flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-start">
                <div className="text-[11px] font-bold text-[#1C3322] leading-tight">
                  {language === 'ar' ? 'طريق الملك عبدالله' : 'King Abdullah Rd'}
                </div>
                <div className="text-[10px] text-[#6B5E43] leading-tight">
                  {language === 'ar' ? 'الدلم 16312، الخرج' : 'Ad Dilam 16312, Al Kharj'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Stylized SVG Blueprint Map */
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[360px] bg-[#172E1E] select-none overflow-hidden">
            {/* Stylized SVG Grounds Background */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="soilPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 20 L40 20 M20 0 L20 40"
                    stroke="#1E3B27"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </pattern>
                <linearGradient id="pondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
                <linearGradient id="greenhouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Base terrain */}
              <rect width="1000" height="600" fill="#132619" />
              <rect width="1000" height="600" fill="url(#soilPattern)" />

              {/* Farm Perimeter Fence */}
              <rect
                x="40"
                y="40"
                width="920"
                height="520"
                rx="30"
                fill="none"
                stroke="#2B4D36"
                strokeWidth="2"
                strokeDasharray="8 6"
              />

              {/* Perimeter Roads / Internal Trails */}
              <path
                d="M 50 300 Q 300 280 500 320 T 950 300"
                stroke="#3D664A"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 500 50 Q 520 280 500 550"
                stroke="#3D664A"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* Zone 1: Greenhouses Block */}
              <rect
                x="280"
                y="120"
                width="200"
                height="150"
                rx="16"
                fill="url(#greenhouseGrad)"
                stroke="#10B981"
                strokeWidth="2"
              />
              {/* Internal Greenhouse Roof Lines */}
              <line x1="310" y1="120" x2="310" y2="270" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="350" y1="120" x2="350" y2="270" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="390" y1="120" x2="390" y2="270" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="430" y1="120" x2="430" y2="270" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="380" y="200" fill="#A7F3D0" fontSize="14" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? 'البيوت المحمية' : 'Greenhouses'}
              </text>

              {/* Zone 2: Fish Pond (Water Body) */}
              <path
                d="M 600 220 C 650 180, 780 200, 750 290 C 720 360, 620 340, 600 280 Z"
                fill="url(#pondGrad)"
                stroke="#38BDF8"
                strokeWidth="3"
                opacity="0.9"
              />
              <text x="670" y="270" fill="#E0F2FE" fontSize="13" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? 'بحيرة الأسماك' : 'Fish Pond'}
              </text>

              {/* Zone 3: Visitor Lodge Area */}
              <rect
                x="410"
                y="360"
                width="180"
                height="120"
                rx="20"
                fill="#D97706"
                fillOpacity="0.2"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <text x="500" y="425" fill="#FDE68A" fontSize="13" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? 'نُزل الضيافة' : 'Visitor Lodge'}
              </text>

              {/* Zone 4: Campsites & Trails */}
              <circle cx="800" cy="150" r="60" fill="#8B5CF6" fillOpacity="0.2" stroke="#A78BFA" strokeWidth="2" />
              <text x="800" y="155" fill="#DDD6FE" fontSize="12" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? 'المخيمات' : 'Campsite'}
              </text>

              {/* Zone 5: Apiaries & Palm Groves */}
              <circle cx="220" cy="370" r="55" fill="#D97706" fillOpacity="0.2" stroke="#FBBF24" strokeWidth="2" />
              <text x="220" y="375" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? 'مناحل العسل' : 'Apiaries'}
              </text>

              {/* Main Entrance Gate Indicator */}
              <path d="M 460 550 L 540 550" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
              <text x="500" y="580" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle">
                {language === 'ar' ? '▼ المدخل الرئيسي (طريق الملك عبدالله)' : '▼ Main Gate (King Abdullah Rd)'}
              </text>
            </svg>

            {/* Interactive Zone Markers Overlay */}
            {FARM_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    left: `${zone.coords.x}%`,
                    top: `${zone.coords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none transition-transform duration-200 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  aria-label={language === 'ar' ? zone.nameAr : zone.nameEn}
                >
                  {/* Outer Pulsing Ring */}
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                      isSelected ? 'block' : 'hidden group-hover:block'
                    }`}
                    style={{ backgroundColor: zone.color }}
                  />

                  {/* Marker Circle */}
                  <div
                    className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white shadow-xl flex items-center justify-center border-2 border-white transition-shadow"
                    style={{ backgroundColor: zone.color }}
                  >
                    {zone.iconType === 'greenhouse' && <Trees className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {zone.iconType === 'pond' && <Fish className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {zone.iconType === 'visitor' && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {zone.iconType === 'camping' && <Compass className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {zone.iconType === 'apiary' && <Layers className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>

                  {/* Hover Pill Label */}
                  <span className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-sm text-white text-[10px] font-bold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {language === 'ar' ? zone.nameAr : zone.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Zone Detail Card (When in 'zones' tab) */}
      {activeTab === 'zones' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DECD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: selectedZone.color }}
            >
              {selectedZone.iconType === 'greenhouse' && <Trees className="w-5 h-5" />}
              {selectedZone.iconType === 'pond' && <Fish className="w-5 h-5" />}
              {selectedZone.iconType === 'visitor' && <Sparkles className="w-5 h-5" />}
              {selectedZone.iconType === 'camping' && <Compass className="w-5 h-5" />}
              {selectedZone.iconType === 'apiary' && <Layers className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {language === 'ar' ? selectedZone.categoryAr : selectedZone.categoryEn}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {language === 'ar' ? 'انقر على أي نقطة لاكتشافها' : 'Click markers to explore'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-[#1C3322]">
                {language === 'ar' ? selectedZone.nameAr : selectedZone.nameEn}
              </h4>
              <p className="text-xs text-[#6B5E43] mt-1 leading-relaxed max-w-xl">
                {language === 'ar' ? selectedZone.descAr : selectedZone.descEn}
              </p>
            </div>
          </div>

          {/* Quick Buttons for Zone Selection */}
          <div className="flex flex-wrap gap-1.5 sm:self-center">
            {FARM_ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedZone.id === z.id
                    ? 'bg-[#1C3322] text-white'
                    : 'bg-white border border-[#E7DECD] text-[#50452d] hover:bg-[#F4EFE6]'
                }`}
              >
                {language === 'ar' ? z.nameAr.split(' ')[0] : z.nameEn.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5E43]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {language === 'ar'
              ? OFFICIAL_INFO.locationAr
              : OFFICIAL_INFO.locationEn}
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C3322] hover:bg-[#274730] text-white font-bold text-xs transition-all shadow-xs shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {language === 'ar' ? 'فتح في تطبيق خرائط Google' : 'Open in Google Maps App'}
          </span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </div>
  );
};
