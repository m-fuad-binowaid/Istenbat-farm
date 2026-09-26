export type Language = 'ar' | 'en';

export type PageRoute = 'home' | 'about' | 'products' | 'locations' | 'experience' | 'contact' | 'admin';

export interface StoreLocation {
  id: string;
  storeName: string;
  storeNameEn?: string;
  branchName: string;
  branchNameEn?: string;
  city: string;
  cityEn?: string;
  mapsUrl: string;
  logoUrl: string;
  isActive: boolean;
  notesAr?: string;
  notesEn?: string;
}

export interface ContactSettings {
  whatsapp: string;
  whatsappRaw: string;
  phone: string;
  mobile: string;
  emailInfo: string;
  locationAr: string;
  locationEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  visitHoursAr: string;
  visitHoursEn: string;
}

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  icon?: string;
  badgeAr?: string;
  badgeEn?: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  categoryLabelAr: string;
  categoryLabelEn: string;
  weightAr: string;
  weightEn: string;
  descriptionAr: string;
  descriptionEn: string;
  benefitsAr: string[];
  benefitsEn: string[];
  image: string;
  isCertifiedOrganic: boolean;
  isAvailable?: boolean;
  priceAr?: string;
  priceEn?: string;
  badgeAr?: string;
  badgeEn?: string;
}

export interface ActivityCard {
  id: string;
  titleAr: string;
  titleEn: string;
  tagAr: string;
  tagEn: string;
  descriptionAr: string;
  descriptionEn: string;
  detailsAr: string[];
  detailsEn: string[];
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

export interface BenefitVideo {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  youtubeId: string;
  durationAr: string;
  durationEn: string;
  thumbnail: string;
  categoryAr: string;
  categoryEn: string;
}

export interface TourPackage {
  id: string;
  titleAr: string;
  titleEn: string;
  durationAr: string;
  durationEn: string;
  targetAr: string;
  targetEn: string;
  descriptionAr: string;
  descriptionEn: string;
  includesAr: string[];
  includesEn: string[];
  image: string;
}

export interface GoogleReview {
  id: string;
  author: string;
  badgeAr: string;
  badgeEn: string;
  rating: number;
  textAr: string;
  textEn: string;
}

