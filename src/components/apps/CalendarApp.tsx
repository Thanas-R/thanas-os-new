import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const CalendarApp = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(today.getDate());

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= days; d++) arr.push(d);
    return arr;
  }, [month, year]);

  const change = (dir: 1 | -1) => {
    let m = month + dir, y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m); setYear(y);
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="h-full w-full bg-white text-neutral-900 flex flex-col select-none" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>
      <div className="flex items-center justify-between px-10 pt-6">
        <div>
          <span className="text-[#ff3b30] text-[30px] font-medium">{MONTHS[month]}</span>
          <span className="text-[#ff3b30] text-[20px] ml-2">{year}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => change(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"><ChevronLeft /></button>
          <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }} className="px-3 py-1 text-sm rounded border border-black/15 hover:bg-black/5">Today</button>
          <button onClick={() => change(1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 px-10 mt-4">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[15px] text-neutral-600 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-10 flex-1">
        {cells.map((d, i) => (
          <div key={i} className="border-t border-black/10 py-3 text-center">
            {d !== null && (
              <button
                onClick={() => setSelected(d)}
                className={`w-10 h-10 rounded-full text-[20px] inline-flex items-center justify-center transition
                  ${isToday(d) ? 'bg-[#ff3b30] text-white' : selected === d ? 'bg-black/10' : 'hover:bg-black/5'}`}
              >{d}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
