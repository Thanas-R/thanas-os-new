import { useMemo } from "react";

export const CalendarWidget = () => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const istNow = new Date(utc + istOffset);

  const todayDate = istNow.getDate();
  const todayMonth = istNow.getMonth();
  const todayYear = istNow.getFullYear();

  const monthName = istNow.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(todayYear, todayMonth, 1).getDay();
    const daysInMonth = new Date(todayYear, todayMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [todayYear, todayMonth]);

  return (
    <div
      className="rounded-3xl p-3 select-none shadow-xl"
      style={{
        width: 172,
        height: 172,
        background: 'rgba(28, 28, 32, 0.75)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="text-[11.75px] font-semibold tracking-wider mb-1 pl-1.5" style={{ color: '#FF453A' }}>
        {monthName}
      </div>

      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekdays.map((d, i) => (
          <div key={i} className="text-center text-[10.25px] font-medium text-white/55">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {calendarDays.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-4">
  {day !== null && (
    <div
      className="w-4 h-4 shrink-0 flex items-center justify-center rounded-full text-[10.25px] font-medium leading-none"
      style={
        day === todayDate
          ? { background: '#F14237', color: 'white' }
          : { color: 'rgba(255,255,255,0.92)' }
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
