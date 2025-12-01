import { useEffect } from 'react';

const imagesToPreload = [
  // Profile photos
  new URL('../assets/profile-photo-new.jpg', import.meta.url).href,
  new URL('../assets/linkedin-profile-new.jpg', import.meta.url).href,
  // App icons
  new URL('../assets/forge-icon.png', import.meta.url).href,
  new URL('../assets/pesu-mc-icon.png', import.meta.url).href,
  new URL('../assets/smart-chef-icon.png', import.meta.url).href,
  new URL('../assets/about-icon.png', import.meta.url).href,
  new URL('../assets/contact-icon.png', import.meta.url).href,
  new URL('../assets/projects-icon.png', import.meta.url).href,
  new URL('../assets/journey-icon.png', import.meta.url).href,
  new URL('../assets/tech-icon.png', import.meta.url).href,
  new URL('../assets/github-icon.png', import.meta.url).href,
  new URL('../assets/linkedin-icon.png', import.meta.url).href,
  new URL('../assets/finder-icon.png', import.meta.url).href,
  new URL('../assets/settings-icon.png', import.meta.url).href,
];

export const useImagePreloader = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = () => {
      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        // Set loading priority
        img.loading = 'eager';
        img.decoding = 'async';
      });
    };

    // Start preloading immediately
    preloadImages();
  }, []);
};
