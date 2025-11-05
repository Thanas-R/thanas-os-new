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

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 600); // Match animation duration
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isLoaded && !isExiting ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backdropFilter: 'blur(40px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        className={`relative max-w-md w-full mx-4 transition-all duration-500 ${
          isLoaded && !isExiting
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <div
          className="backdrop-blur-md rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="mb-6 flex justify-center">
            <div className="text-5xl font-mono text-cyan-400 animate-pulse">
              {'</>'}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-center text-white">
            Hello, I'm Thanas R
          </h1>

          <p className="text-center text-white/80 mb-8 leading-relaxed">
            Welcome to my portfolio website. Navigate around to learn more about me, my projects, and my journey.
          </p>

          <Button
            onClick={handleEnter}
            className="w-full h-12 text-base font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 hover:scale-105"
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
};
