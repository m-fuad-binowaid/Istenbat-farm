import React, { useState, useRef } from 'react';
import { ActivityCard, Language } from '../types';
import { getAssetUrl } from '../utils/assetPath';
import { CheckCircle2, MessageSquare, Play, Pause, Film } from 'lucide-react';

interface ActivityCardItemProps {
  activity: ActivityCard;
  language: Language;
  inquireButtonText?: string;
  onInquire?: () => void;
}

export const ActivityCardItem: React.FC<ActivityCardItemProps> = ({
  activity,
  language,
  inquireButtonText = 'استفسر عن الأنشطة المتاحة',
  onInquire,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const title = language === 'ar' ? activity.titleAr : activity.titleEn;
  const tag = language === 'ar' ? activity.tagAr : activity.tagEn;
  const description = language === 'ar' ? activity.descriptionAr : activity.descriptionEn;
  const details = language === 'ar' ? activity.detailsAr : activity.detailsEn;

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const isVideo =
    activity.mediaType === 'video' ||
    activity.mediaUrl.endsWith('.mp4') ||
    activity.mediaUrl.endsWith('.webm') ||
    activity.mediaUrl.startsWith('data:video');

  const resolvedMediaUrl = getAssetUrl(activity.mediaUrl);

  const handleInquireClick = () => {
    if (onInquire) {
      onInquire();
    } else {
      const bookingEl = document.getElementById('booking-section');
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-[#E7DECD] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Media Container with Floating Badge Overlay */}
        <div className="relative w-full h-56 sm:h-64 bg-[#122216] overflow-hidden rounded-t-3xl">
          {isVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={resolvedMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play / Pause Toggle Button on Hover/Touch */}
              <button
                type="button"
                onClick={toggleVideoPlayback}
                aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
                className={`absolute bottom-3 start-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer ${
                  isHovered || !isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 sm:group-hover:opacity-100'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ms-0.5" />}
              </button>

              {/* Small Video Indicator Badge */}
              <div className="absolute bottom-3 end-3 z-20 px-2 py-0.5 rounded-md bg-black/50 text-white/80 text-[10px] font-mono flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>فيديو</span>
              </div>
            </div>
          ) : (
            <img
              src={resolvedMediaUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {/* Floating Green Badge (Pinned on top with z-10) */}
          <div className="absolute top-3 end-3 z-10 px-3.5 py-1.5 rounded-full bg-[#1C3322]/95 backdrop-blur-md text-[#F9F6F0] text-xs font-bold shadow-md border border-white/10">
            {tag}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 text-start space-y-3">
          <h3 className="text-xl font-black text-[#1C3322] leading-snug">{title}</h3>
          <p className="text-xs sm:text-sm text-[#50452d] leading-relaxed">
            {description}
          </p>

          {/* Points List */}
          {details && details.length > 0 && (
            <ul className="space-y-2 pt-3 border-t border-[#F4EFE6]">
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#50452d]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Card Action */}
      <div className="p-6 pt-0">
        <button
          type="button"
          onClick={handleInquireClick}
          className="w-full py-3 bg-[#F4EFE6] hover:bg-[#1C3322] hover:text-white text-[#1C3322] text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{inquireButtonText}</span>
        </button>
      </div>
    </div>
  );
};
