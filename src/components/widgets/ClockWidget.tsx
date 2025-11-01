import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass w-64"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold opacity-90">Time</h3>
      </div>
      <div className="text-3xl font-bold font-mono tabular-nums">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm opacity-75 mt-1">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};
