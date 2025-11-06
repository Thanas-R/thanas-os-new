import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000); // Update every minute
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
      <Calendar className="w-5 h-5 text-primary mb-2" />
      <div className="text-center">
        <div className="text-sm font-semibold opacity-75">
          {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
        </div>
        <div className="text-4xl font-bold leading-none">
          {date.getDate()}
        </div>
        <div className="text-xs opacity-75 mt-1">
          {date.toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
      </div>
    </div>
  );
};
