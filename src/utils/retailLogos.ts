/**
 * Retail logos and presets for Saudi store locator (Tamimi, Spinneys, Danube, Manuel, etc.)
 * Provides crisp SVG-based brand icons and helper functions to render logos.
 */

export interface RetailPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  bgGradient: string;
  accentColor: string;
  shortLabel: string;
  badgeText: string;
}

export const RETAIL_PRESETS: RetailPreset[] = [
  {
    id: 'tamimi',
    nameAr: 'أسواق التميمي',
    nameEn: 'Tamimi Markets',
    bgGradient: 'from-[#005B38] to-[#003822]',
    accentColor: '#10B981',
    shortLabel: 'التميمي',
    badgeText: 'TAMIMI',
  },
  {
    id: 'spinneys',
    nameAr: 'سبينس',
    nameEn: 'Spinneys',
    bgGradient: 'from-[#1A472A] to-[#0F2B19]',
    accentColor: '#34D399',
    shortLabel: 'سبينس',
    badgeText: 'SPINNEYS',
  },
  {
    id: 'danube',
    nameAr: 'أسواق الدانوب',
    nameEn: 'Danube Markets',
    bgGradient: 'from-[#8B1D24] to-[#5C1318]',
    accentColor: '#F87171',
    shortLabel: 'الدانوب',
    badgeText: 'DANUBE',
  },
  {
    id: 'manuel',
    nameAr: 'مانويل ماركت',
    nameEn: 'Manuel Market',
    bgGradient: 'from-[#1E3A8A] to-[#172554]',
    accentColor: '#60A5FA',
    shortLabel: 'مانويل',
    badgeText: 'MANUEL',
  },
  {
    id: 'carrefour',
    nameAr: 'كارفور',
    nameEn: 'Carrefour',
    bgGradient: 'from-[#0284C7] to-[#0369A1]',
    accentColor: '#38BDF8',
    shortLabel: 'كارفور',
    badgeText: 'CARREFOUR',
  },
  {
    id: 'lulu',
    nameAr: 'لولو هايبر ماركت',
    nameEn: 'LuLu Hypermarket',
    bgGradient: 'from-[#D97706] to-[#92400E]',
    accentColor: '#FBBF24',
    shortLabel: 'لولو',
    badgeText: 'LULU',
  },
  {
    id: 'organic',
    nameAr: 'متجر أغذية عضوية معتمد',
    nameEn: 'Organic Food Market',
    bgGradient: 'from-[#1C3322] to-[#122216]',
    accentColor: '#4ADE80',
    shortLabel: 'عضوي',
    badgeText: 'ORGANIC',
  },
];

export function getRetailPreset(idOrKey?: string): RetailPreset | undefined {
  if (!idOrKey) return undefined;
  const cleanId = idOrKey.replace(/^preset:/, '').toLowerCase();
  return RETAIL_PRESETS.find((p) => p.id === cleanId);
}
