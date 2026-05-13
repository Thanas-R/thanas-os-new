import { useEffect } from 'react';

// Eagerly import every asset so they're cached at boot.
const allAssets = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

let preloaded = false;

export const preloadAllAssets = () => {
  if (preloaded) return;
  preloaded = true;
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
