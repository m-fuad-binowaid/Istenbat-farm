import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  isLogo?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  className = '',
  fallbackText = 'استنبات',
  isLogo = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4EFE6] border border-[#E7DECD] text-[#50452d] ${className}`}
        style={{ minHeight: '120px' }}
      >
        <Sprout className="w-8 h-8 text-[#1C3322] mb-1 opacity-80 animate-pulse" />
        <span className="text-xs font-medium text-[#2B2821] opacity-75">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${isLogo ? 'mix-blend-multiply object-contain' : ''} ${className}`}
      {...props}
    />
  );
};
