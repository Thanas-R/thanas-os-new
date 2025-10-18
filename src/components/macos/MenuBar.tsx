import { useState, useEffect } from 'react';
import { Apple, Wifi, Battery, Volume2 } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';

export const MenuBar = () => {
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
      className="fixed top-0 left-0 right-0 h-7 backdrop-blur-macos flex items-center justify-between px-4 z-50 text-sm"
      style={{
        background: 'hsl(var(--macos-menubar-bg))',
        borderBottom: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Apple className="w-4 h-4" />
        <span className="font-semibold">{focusedApp?.name || 'Thanas R'}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Battery className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <span className="font-medium">{formatTime(time)}</span>
      </div>
    </div>
  );
};
