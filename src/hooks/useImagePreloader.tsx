import { useEffect } from 'react';

// Eagerly import every asset so they're cached at boot.
const allAssets = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Banner / hero assets that should be ready before the user opens those apps.
const PRIORITY_BANNERS = [
  'github-icon',
  'linkedin-banner',
  'vscode-icon',
  'calendar-icon-new',
];

let preloaded = false;

export const preloadAllAssets = () => {
  if (preloaded) return;
  preloaded = true;

  // Resolve priority banners to URLs and inject <link rel="preload"> for the highest-priority ones.
  Object.entries(allAssets).forEach(([path, url]) => {
    const name = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
    if (PRIORITY_BANNERS.includes(name)) {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      } catch { /* ignore */ }
    }
  });

  Object.values(allAssets).forEach((src) => {
    const img = new Image();
    img.src = src;
    img.decoding = 'async';
    img.decode?.().catch(() => {});
  });

  // Warm up the personal site iframe target so Journey opens instantly later
  try {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://thanas.vercel.app';
    document.head.appendChild(link);
  } catch { /* ignore */ }
};

export const useImagePreloader = () => {
  useEffect(() => { preloadAllAssets(); }, []);
};
