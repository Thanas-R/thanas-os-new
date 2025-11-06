import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen = ({ onEnter }: WelcomeScreenProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in the welcome screen
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleEnter = async () => {
    setIsExiting(true);
    
    // Request fullscreen
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
    
    setTimeout(onEnter, 600); // Match animation duration
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isLoaded && !isExiting ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backdropFilter: 'blur(40px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Time and Date - macOS Lock Screen Style */}
      <div
        className={`text-center mb-8 transition-all duration-500 ${
          isLoaded && !isExiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-[120px] font-bold text-white leading-none mb-2">
          {formatTime(new Date())}
        </div>
        <div className="text-3xl font-medium text-white/90">
          {formatDate(new Date())}
        </div>
        <div className="text-xl font-medium text-white/80 mt-6">
          Welcome to Thanas R's Portfolio Website
        </div>
      </div>
      
      {/* Disclaimer */}
      <div
        className={`text-center mb-12 transition-all duration-500 max-w-md ${
          isLoaded && !isExiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="text-white/70 text-sm backdrop-blur-md bg-white/10 px-4 py-2 rounded-lg border border-white/20">
          ⚠️ Best viewed on laptop or desktop<br />Mobile experience not optimized
        </p>
      </div>

      {/* Enter Button */}
      <div
        className={`transition-all duration-500 ${
          isLoaded && !isExiting
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <Button
          onClick={handleEnter}
          className="h-14 px-12 text-lg font-medium bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-md"
        >
          Enter
        </Button>
      </div>

      {/* Subtle hint text */}
      <div
        className={`absolute bottom-8 text-center transition-all duration-500 ${
          isLoaded && !isExiting
            ? 'opacity-60'
            : 'opacity-0'
        }`}
      >
        <p className="text-white/80 text-sm">
          Click Enter to explore my portfolio
        </p>
      </div>
    </div>
  );
};
