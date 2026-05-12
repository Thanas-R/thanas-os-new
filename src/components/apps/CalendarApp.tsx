import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Indian holidays (subset, 2025 + 2026). Could be replaced with a live API later.
const INDIAN_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day",
  '2025-01-14': 'Makar Sankranti',
  '2025-01-26': 'Republic Day',
  '2025-03-14': 'Holi',
  '2025-03-31': 'Eid al-Fitr',
  '2025-04-10': 'Mahavir Jayanti',
  '2025-04-14': 'Ambedkar Jayanti',
  '2025-04-18': 'Good Friday',
  '2025-05-01': 'Labour Day',
  '2025-08-15': 'Independence Day',
  '2025-08-27': 'Ganesh Chaturthi',
  '2025-10-02': 'Gandhi Jayanti',
  '2025-10-20': 'Diwali',
  '2025-10-22': 'Govardhan Puja',
  '2025-11-05': 'Guru Nanak Jayanti',
  '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day",
  '2026-01-14': 'Makar Sankranti',
  '2026-01-26': 'Republic Day',
  '2026-03-04': 'Holi',
  '2026-03-21': 'Eid al-Fitr',
  '2026-04-03': 'Good Friday',
  '2026-04-14': 'Ambedkar Jayanti',
  '2026-05-01': 'Labour Day',
  '2026-05-26': 'Eid al-Adha',
  '2026-08-15': 'Independence Day',
  '2026-08-26': 'Janmashtami',
  '2026-09-14': 'Ganesh Chaturthi',
  '2026-10-02': 'Gandhi Jayanti',
  '2026-11-08': 'Diwali',
  '2026-11-24': 'Guru Nanak Jayanti',
  '2026-12-25': 'Christmas',
};

const key = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const CalendarApp = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // Re-render daily so "today" stays accurate
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      if (n.getDate() !== today.getDate()) location.reload();
    }, 60000);
    return () => clearInterval(t);
  }, []);

  // Build a 6-week grid (Mon-first), including spillover from prev/next months.
  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // Mon=0..Sun=6
    const cells: { y: number; m: number; d: number; current: boolean }[] = [];
    // previous month tail
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = offset - 1; i >= 0; i--) {
      const d = prevDays - i;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      cells.push({ y: py, m: pm, d, current: false });
    }
    // current month
    const days = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= days; d++) cells.push({ y: year, m: month, d, current: true });
    // next month head to fill 6x7=42
    let nd = 1;
    while (cells.length < 42) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      cells.push({ y: ny, m: nm, d: nd++, current: false });
    }
    // chunk into weeks
    const weeks: typeof cells[] = [];
    for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));
    return weeks;
  }, [month, year]);

  const change = (dir: 1 | -1) => {
    let m = month + dir, y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m); setYear(y);
  };

  const isToday = (c: { y: number; m: number; d: number }) =>
    c.d === today.getDate() && c.m === today.getMonth() && c.y === today.getFullYear();

  // Find which week contains today (for the red top border)
  const currentWeekIdx = grid.findIndex(w => w.some(isToday));

  return (
    <div
      className="h-full w-full bg-white text-neutral-900 flex flex-col select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-5 pb-3">
        <div>
          <span className="text-[#cb6c6b] text-[34px] font-light tracking-tight">{MONTHS[month]}</span>
          <span className="text-[#cb6c6b] text-[34px] font-light ml-2">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => change(-1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5"><ChevronLeft className="w-5 h-5" /></button>
          <button
            onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
            className="px-3 h-8 text-[12.5px] rounded-md border border-black/15 hover:bg-black/5"
          >Today</button>
          <button onClick={() => change(1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 px-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-right text-[11px] uppercase tracking-wider text-neutral-500 px-3 pb-1">{d}</div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="flex-1 grid grid-rows-6 px-2 pb-3 min-h-0">
        {grid.map((week, wi) => {
          const isCurrentWeek = wi === currentWeekIdx;
          return (
            <div
              key={wi}
              className="grid grid-cols-7 min-h-0"
              style={isCurrentWeek ? { borderTop: '4px solid #fed6d7' } : undefined}
            >
              {week.map((c, ci) => {
                const k = key(c.y, c.m, c.d);
                const holiday = INDIAN_HOLIDAYS[k];
                const isWeekend = ci >= 5;
                const today_ = isToday(c);
                return (
                  <div
                    key={ci}
                    className="relative px-2 pt-1.5 pb-1 border-b border-r border-black/10 first:border-l overflow-hidden min-h-0"
                    style={{
                      background: today_
                        ? '#fed6d7'
                        : isWeekend
                          ? '#f5f5f5'
                          : 'white',
                      borderTop: today_ ? '4px solid #cb6c6b' : undefined,
                    }}
                  >
                    <div className={`text-right text-[12.5px] ${today_ ? 'font-bold text-[#cb6c6b]' : c.current ? 'text-neutral-800' : 'text-neutral-400'}`}>
                      {c.d === 1 ? `${MONTHS[c.m].slice(0,3)} 1` : c.d}
                    </div>
                    {holiday && (
                      <div className="mt-1 text-[11px] truncate" style={{ color: 'rgb(0,160,0)' }} title={holiday}>
                        • {holiday}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
