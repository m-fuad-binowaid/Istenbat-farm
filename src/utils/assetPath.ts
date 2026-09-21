/**
 * Helper to resolve static assets seamlessly across root domain,
 * GitHub Pages subpaths (e.g. /Istenbat-farm/), or any hosting sub-directory.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  // Remote URLs or data URIs should remain unchanged
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.replace(/^\.?\//, ''); // strip leading "/" or "./"

  // In browser, dynamically match the GitHub Pages repository path and exact casing
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.hostname.endsWith('github.io')) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const repoSegment = pathParts[0];
        return `/${repoSegment}/${cleanPath}`;
      }
    }
  }

  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}
