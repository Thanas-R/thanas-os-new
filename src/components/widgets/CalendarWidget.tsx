import { useState, useEffect } from 'react';

export const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div
      className="backdrop-blur-macos-heavy rounded-2xl p-3 shadow-macos-glass w-[210px]"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      {/* Month header */}
      <div className="text-[11px] font-bold tracking-wide mb-2" style={{ color: 'hsl(0 84% 60%)' }}>
        {monthName}
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="text-[9px] font-semibold text-center text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-[22px] w-full"
          >
            {day !== null && (
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-medium ${
                  day === today
                    ? 'text-white'
                    : 'text-foreground/80'
                }`}
                style={
                  day === today
                    ? { background: 'hsl(0 84% 60%)' }
                    : undefined
                }
              >
                {day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
