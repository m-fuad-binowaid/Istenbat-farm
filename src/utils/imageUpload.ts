/**
 * Image processing utility for local device uploads (Camera & Gallery & Desktop)
 * Reads selected image files into high-quality Base64 Data URLs,
 * with automatic client-side canvas optimization to preserve clarity
 * while ensuring reliable persistence in localStorage.
 */

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export async function processImageUpload(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<string> {
  const rawDataUrl = await readFileAsBase64(file);

  // If file is SVG, GIF, or already tiny (< 250KB), keep as-is
  if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.size < 250 * 1024) {
    return rawDataUrl;
  }

  // Optimize large camera/gallery photos via canvas
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use image/jpeg for photos or webp if supported
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressed = canvas.toDataURL(outputType, quality);
        resolve(compressed);
      } catch (err) {
        console.warn('Canvas image compression failed, using raw data url', err);
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => {
      resolve(rawDataUrl);
    };
    img.src = rawDataUrl;
  });
}

export interface MediaUploadResult {
  dataUrl: string;
  mediaType: 'image' | 'video';
  sizeMb: number;
  warning?: string;
}

export async function processMediaUpload(file: File): Promise<MediaUploadResult> {
  const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
  const isVideo = file.type.startsWith('video/');

  let warning: string | undefined;
  if (isVideo && sizeMb > 20) {
    warning = `حجم الفيديو (${sizeMb} MB) يتجاوز الحجم الموصى به (أقل من 20 MB). يُفضل استخدام مقاطع قصيرة ومضغوطة لضمان سرعة التحميل وسلاسة التصفح لزوار الموقع.`;
  }

  if (isVideo) {
    const dataUrl = await readFileAsBase64(file);
    return {
      dataUrl,
      mediaType: 'video',
      sizeMb,
      warning,
    };
  } else {
    const dataUrl = await processImageUpload(file);
    return {
      dataUrl,
      mediaType: 'image',
      sizeMb,
      warning,
    };
  }
}

