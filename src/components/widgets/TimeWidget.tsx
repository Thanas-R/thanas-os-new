import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass w-32 h-32 flex flex-col items-center justify-center"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <Clock className="w-5 h-5 text-primary mb-2" />
      <div className="text-3xl font-bold font-mono tabular-nums leading-tight">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
    </div>
  );
};
