import { useEffect } from 'react';

// Eagerly import every asset so they're cached at boot.
const allAssets = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const useImagePreloader = () => {
  useEffect(() => {
    Object.values(allAssets).forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = 'async';
    });
  }, []);
};
