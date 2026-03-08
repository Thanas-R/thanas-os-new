import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CalendarWidget = () => {
  const [monthOffset, setMonthOffset] = useState(0);

  // Get IST now
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const istNow = new Date(utc + istOffset);

  const todayDate = istNow.getDate();
  const todayMonth = istNow.getMonth();
  const todayYear = istNow.getFullYear();

  const displayDate = new Date(todayYear, todayMonth + monthOffset, 1);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const monthName = displayDate.toLocaleString("en-US", { month: "long" }).toUpperCase();

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { day: number; current: boolean; muted: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, current: false, muted: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, current: true, muted: false });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false, muted: true });
    }

    return days;
  }, [year, month]);

  const isCurrentMonth = month === todayMonth && year === todayYear;

  return (
    <div
      className="backdrop-blur-macos-heavy rounded-2xl p-3 shadow-macos-glass select-none"
      style={{
        width: 210,
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      {/* Header with month + nav */}
      <div className="flex items-center justify-between mb-2">
        <div
          className="text-[11px] font-bold tracking-wider"
          style={{ color: 'hsl(0 84% 60%)' }}
        >
          {monthName}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonthOffset((o) => o - 1)}
            className="p-0.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setMonthOffset((o) => o + 1)}
            className="p-0.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekdays.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-semibold text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((d, i) => {
          const isToday = isCurrentMonth && d.current && d.day === todayDate;
          return (
            <div
              key={i}
              className="flex items-center justify-center aspect-square text-[11px] font-medium"
            >
              {isToday ? (
                <span
                  className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-white"
                  style={{ background: 'hsl(0 84% 60%)' }}
                >
                  {d.day}
                </span>
              ) : (
                <span
                  className={d.muted ? 'text-muted-foreground/35' : 'text-foreground/80'}
                >
                  {d.day}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
