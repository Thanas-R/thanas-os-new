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
        background: '#18181A',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="text-[12px] font-bold tracking-wider mb-2" style={{ color: '#FF453A' }}>
        {monthName}
      </div>

      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekdays.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-white/55">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {calendarDays.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-[16px]">
            {day !== null && (
              <span
                className="w-[16px] h-[16px] flex items-center justify-center rounded-full text-[10px] font-semibold"
                style={
                  day === todayDate
                    ? { background: '#FF453A', color: 'white' }
                    : { color: 'rgba(255,255,255,0.92)' }
                }
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
