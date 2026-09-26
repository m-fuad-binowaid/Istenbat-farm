import React from 'react';
import { getRetailPreset } from '../utils/retailLogos';
import { getAssetUrl } from '../utils/assetPath';
import { Store, ShoppingBag } from 'lucide-react';

interface StoreLogoProps {
  logoUrl?: string;
  storeName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StoreLogo: React.FC<StoreLogoProps> = ({
  logoUrl,
  storeName,
  className = '',
  size = 'md',
}) => {
  const preset = getRetailPreset(logoUrl);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 text-sm rounded-2xl',
    lg: 'w-20 h-20 text-base rounded-3xl',
  }[size];

  // 1. If preset retail chain selected
  if (preset) {
    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br ${preset.bgGradient} text-white flex flex-col items-center justify-center font-black shadow-sm border border-white/10 shrink-0 select-none overflow-hidden relative group ${className}`}
        title={`${preset.nameAr} - ${preset.nameEn}`}
      >
        <span
          className="text-[9px] font-sans tracking-widest uppercase opacity-75 font-bold scale-90"
          style={{ color: preset.accentColor }}
        >
          {preset.badgeText}
        </span>
        <span className="font-tajawal text-[13px] font-black leading-tight text-white px-1 truncate max-w-full">
          {preset.shortLabel}
        </span>
      </div>
    );
  }

  // 2. If custom image URL / Base64 Data URL provided
  if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('data:') || logoUrl.startsWith('/'))) {
    return (
      <div
        className={`${sizeClasses} bg-white border border-[#E7DECD] overflow-hidden p-1.5 flex items-center justify-center shrink-0 shadow-xs ${className}`}
      >
        <img
          src={getAssetUrl(logoUrl)}
          alt={storeName}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to initial icon if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 3. Fallback generic store icon
  return (
    <div
      className={`${sizeClasses} bg-[#1C3322] text-[#F9F6F0] flex flex-col items-center justify-center font-black shadow-xs shrink-0 ${className}`}
    >
      <Store className="w-5 h-5 text-emerald-400 mb-0.5" />
      <span className="text-[10px] truncate max-w-[90%] px-0.5">
        {storeName ? storeName.slice(0, 6) : 'متجر'}
      </span>
    </div>
  );
};
