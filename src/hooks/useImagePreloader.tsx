import { useEffect } from 'react';

// Eagerly import every asset so they're cached at boot.
const allAssets = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

let preloaded = false;

export const useImagePreloader = () => {
  useEffect(() => {
    if (preloaded) return;
    preloaded = true;
    Object.values(allAssets).forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = 'async';
      // Try to decode immediately for faster paint later
      img.decode?.().catch(() => {});
    });
  }, []);
};
