import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';


interface MenuBarProps {
  onSpotlightClick?: () => void;
}

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const { focusedWindowId, apps, windows } = useMacOS();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const focusedWindow = windows.find(w => w.id === focusedWindowId);
  const focusedApp = focusedWindow ? apps.find(a => a.id === focusedWindow.appId) : null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 backdrop-blur-macos-heavy flex items-center justify-between px-4 z-50 text-sm"
      style={{
        background: 'hsl(var(--macos-menubar-bg))',
        borderBottom: '1px solid hsl(var(--macos-glass-border))',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <span className="text-sm leading-none" aria-label="Shrug">¯\_(ツ)_/¯</span>
        <span className="font-semibold">{focusedApp?.name || 'Thanas R'}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onSpotlightClick}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Search (⌘K)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <Battery className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <span className="font-medium">{formatTime(time)}</span>
      </div>
    </div>
  );
};
