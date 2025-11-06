import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import turtleLogo from '@/assets/turtle-logo.png';


interface MenuBarProps {
  onSpotlightClick?: () => void;
}

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const { focusedWindowId, apps, windows, minimizeAllWindows } = useMacOS();

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
        <button
          onClick={minimizeAllWindows}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Show Desktop"
        >
          <img 
            src={turtleLogo} 
            alt="Logo" 
            className="h-5 w-auto object-contain"
            decoding="async"
          />
        </button>
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
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Battery className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Battery</span>
                <span className="text-sm">87%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
              </div>
              <p className="text-xs text-muted-foreground">Power Source: Battery</p>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Wifi className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wi-Fi</span>
                <span className="text-xs text-primary">Connected</span>
              </div>
              <p className="text-xs text-muted-foreground">Network: Portfolio Network</p>
              <p className="text-xs text-muted-foreground">Signal: Excellent</p>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Volume2 className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-3">
              <span className="text-sm font-medium">Volume</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="65" 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">Output: Internal Speakers</p>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <span className="font-medium">{formatTime(time)}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-sm text-muted-foreground">
                {time.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
