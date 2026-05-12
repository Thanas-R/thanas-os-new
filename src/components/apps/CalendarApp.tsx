import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, Grid3x3, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color: 'red' | 'gray' | 'green';
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const INDIAN_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day", '2025-01-14': 'Makar Sankranti', '2025-01-26': 'Republic Day',
  '2025-03-14': 'Holi', '2025-03-31': 'Eid al-Fitr', '2025-04-10': 'Mahavir Jayanti',
  '2025-04-14': 'Ambedkar Jayanti', '2025-04-18': 'Good Friday', '2025-05-01': 'Labour Day',
  '2025-08-15': 'Independence Day', '2025-08-27': 'Ganesh Chaturthi', '2025-10-02': 'Gandhi Jayanti',
  '2025-10-20': 'Diwali', '2025-11-05': 'Guru Nanak Jayanti', '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day", '2026-01-14': 'Makar Sankranti', '2026-01-26': 'Republic Day',
  '2026-03-04': 'Holi', '2026-03-21': 'Eid al-Fitr', '2026-04-03': 'Good Friday',
  '2026-04-14': 'Ambedkar Jayanti', '2026-05-01': 'Labour Day', '2026-08-15': 'Independence Day',
  '2026-08-26': 'Janmashtami', '2026-09-14': 'Ganesh Chaturthi', '2026-10-02': 'Gandhi Jayanti',
  '2026-11-08': 'Diwali', '2026-11-24': 'Guru Nanak Jayanti', '2026-12-25': 'Christmas',
};

const dkey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const sameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

const COLORS: Record<CalEvent['color'], { dot: string; bg: string; text: string; border: string }> = {
  red:   { dot: 'bg-[#fa2d48]', bg: 'bg-[#fa2d48]/15', text: 'text-[#fa2d48]', border: 'border-[#fa2d48]/40' },
  gray:  { dot: 'bg-neutral-700', bg: 'bg-neutral-700/15', text: 'text-neutral-700', border: 'border-neutral-400/40' },
  green: { dot: 'bg-emerald-600', bg: 'bg-emerald-600/15', text: 'text-emerald-700', border: 'border-emerald-500/40' },
};

// Build a synthetic event list from holidays so the views have real content.
const seedEvents = (): CalEvent[] => {
  const ev: CalEvent[] = Object.entries(INDIAN_HOLIDAYS).map(([k, name]) => {
    const [y, m, d] = k.split('-').map(Number);
    return {
      id: 'h-' + k,
      title: name,
      color: 'green',
      startTime: new Date(y, m - 1, d, 0, 0),
      endTime: new Date(y, m - 1, d, 23, 59),
    };
  });
  // a couple of personal sample events on today
  const t = new Date();
  ev.push({
    id: 'today-1', title: 'Design review', color: 'red',
    startTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 10, 0),
    endTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 11, 0),
  });
  ev.push({
    id: 'today-2', title: 'Gym', color: 'gray',
    startTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 18, 0),
    endTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 19, 0),
  });
  return ev;
};

type View = 'month' | 'week' | 'day' | 'list';

export const CalendarApp = () => {
  const [events, setEvents] = useState<CalEvent[]>(() => seedEvents());
  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [creating, setCreating] = useState<{ start: Date } | null>(null);
  const [draft, setDraft] = useState<{ title: string; color: CalEvent['color'] }>({ title: '', color: 'red' });

  const today = new Date();

  const navigate = (dir: -1 | 1) => {
    setCurrent((p) => {
      const n = new Date(p);
      if (view === 'month') n.setMonth(p.getMonth() + dir);
      else if (view === 'week') n.setDate(p.getDate() + 7 * dir);
      else if (view === 'day') n.setDate(p.getDate() + dir);
      else n.setMonth(p.getMonth() + dir);
      return n;
    });
  };

  const headerLabel = useMemo(() => {
    if (view === 'month') return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
    if (view === 'day') return current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (view === 'week') {
      const ws = startOfWeek(current);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return `${ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${we.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return 'All Events';
  }, [view, current]);

  const eventsForDay = (d: Date) => events.filter((e) => sameDay(e.startTime, d)).sort((a, b) => +a.startTime - +b.startTime);

  const openCreate = (date: Date, hour?: number) => {
    const start = new Date(date);
    if (hour !== undefined) start.setHours(hour, 0, 0, 0);
    else start.setHours(9, 0, 0, 0);
    setCreating({ start });
    setDraft({ title: '', color: 'red' });
  };

  const submitCreate = () => {
    if (!creating || !draft.title.trim()) return;
    const end = new Date(creating.start); end.setHours(end.getHours() + 1);
    setEvents((p) => [...p, { id: Math.random().toString(36).slice(2), title: draft.title.trim(), color: draft.color, startTime: creating.start, endTime: end }]);
    setCreating(null);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white text-neutral-900 select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}>

      {/* Liquid-glass header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/70"
        style={{
          background: 'linear-gradient(180deg, rgba(250,45,72,0.08), rgba(255,255,255,0.6))',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-semibold tracking-tight text-neutral-900 min-w-[210px]">{headerLabel}</h2>
          <div className="flex items-center gap-1">
            <IconBtn onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4" /></IconBtn>
            <button
              onClick={() => setCurrent(new Date())}
              className="h-7 px-2.5 text-[12px] rounded-md border border-neutral-300 hover:bg-neutral-100"
            >Today</button>
            <IconBtn onClick={() => navigate(1)}><ChevronRight className="w-4 h-4" /></IconBtn>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Segmented value={view} onChange={setView} />
          <button
            onClick={() => openCreate(current)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-medium text-white shadow-sm"
            style={{ background: 'linear-gradient(180deg,#ff5366,#fa2d48)' }}
          >
            <Plus className="w-3.5 h-3.5" /> New Event
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {view === 'month' && <MonthView current={current} today={today} events={events} onCellClick={openCreate} onEventClick={setSelected} />}
        {view === 'week' && <WeekView current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
        {view === 'day' && <DayView current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
        {view === 'list' && <ListView current={current} events={events} onEventClick={setSelected} />}
      </div>

      {/* Event details */}
      {selected && (
        <Modal onClose={() => setSelected(null)} title={selected.title} accent={COLORS[selected.color].dot}>
          <div className="text-[13px] text-neutral-700">
            {selected.startTime.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-[13px] text-neutral-500 mt-0.5">
            {selected.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – {selected.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => { setEvents((p) => p.filter((e) => e.id !== selected.id)); setSelected(null); }}
              className="h-8 px-3 rounded-md text-[12.5px] border border-neutral-300 hover:bg-neutral-100"
            >Delete</button>
            <button onClick={() => setSelected(null)} className="h-8 px-3 rounded-md text-[12.5px] text-white" style={{ background: '#fa2d48' }}>Close</button>
          </div>
        </Modal>
      )}

      {/* Create event */}
      {creating && (
        <Modal onClose={() => setCreating(null)} title="New Event" accent="bg-[#fa2d48]">
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Event title"
            className="w-full h-9 px-3 rounded-md border border-neutral-300 text-[13px] outline-none focus:border-[#fa2d48]"
          />
          <div className="text-[12px] text-neutral-500 mt-3">
            {creating.start.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            {(['red','gray','green'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setDraft((d) => ({ ...d, color: c }))}
                className={cn('w-5 h-5 rounded-full border-2', COLORS[c].dot, draft.color === c ? 'border-neutral-900' : 'border-transparent')}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button onClick={() => setCreating(null)} className="h-8 px-3 rounded-md text-[12.5px] border border-neutral-300 hover:bg-neutral-100">Cancel</button>
            <button onClick={submitCreate} className="h-8 px-3 rounded-md text-[12.5px] text-white" style={{ background: '#fa2d48' }}>Add</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ───── helpers ─────
const startOfWeek = (d: Date) => {
  const r = new Date(d);
  const wd = (r.getDay() + 6) % 7; // Mon=0
  r.setDate(r.getDate() - wd);
  r.setHours(0, 0, 0, 0);
  return r;
};

const IconBtn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100">{children}</button>
);

const Segmented = ({ value, onChange }: { value: View; onChange: (v: View) => void }) => {
  const items: { v: View; icon: React.ReactNode; label: string }[] = [
    { v: 'month', icon: <CalIcon className="w-3.5 h-3.5" />, label: 'Month' },
    { v: 'week', icon: <Grid3x3 className="w-3.5 h-3.5" />, label: 'Week' },
    { v: 'day', icon: <Clock className="w-3.5 h-3.5" />, label: 'Day' },
    { v: 'list', icon: <List className="w-3.5 h-3.5" />, label: 'List' },
  ];
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-neutral-300 bg-white/70">
      {items.map((it) => (
        <button
          key={it.v}
          onClick={() => onChange(it.v)}
          className={cn(
            'h-7 px-2.5 rounded-md text-[12px] flex items-center gap-1 transition-colors',
            value === it.v ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100',
          )}
        >
          {it.icon}{it.label}
        </button>
      ))}
    </div>
  );
};

const Modal = ({ children, title, accent, onClose }: { children: React.ReactNode; title: string; accent: string; onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
    <div
      className="w-[420px] max-w-[92%] rounded-2xl bg-white p-5 shadow-2xl border border-neutral-200"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', accent)} />
          <h3 className="text-[15px] font-semibold">{title}</h3>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>
);

// ───── views ─────
const MonthView = ({ current, today, events, onCellClick, onEventClick }: {
  current: Date; today: Date; events: CalEvent[];
  onCellClick: (d: Date) => void; onEventClick: (e: CalEvent) => void;
}) => {
  const cells = useMemo(() => {
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const out: { d: Date; current: boolean }[] = [];
    const prevDays = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
    for (let i = offset - 1; i >= 0; i--) {
      out.push({ d: new Date(current.getFullYear(), current.getMonth() - 1, prevDays - i), current: false });
    }
    const days = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= days; d++) out.push({ d: new Date(current.getFullYear(), current.getMonth(), d), current: true });
    let nd = 1;
    while (out.length < 42) out.push({ d: new Date(current.getFullYear(), current.getMonth() + 1, nd++), current: false });
    return out;
  }, [current]);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-3 py-1.5 text-[10.5px] uppercase tracking-wider text-neutral-500 text-right border-b border-neutral-200">{w}</div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0">
        {cells.map((c, i) => {
          const evs = events.filter((e) => sameDay(e.startTime, c.d)).slice(0, 3);
          const isToday = sameDay(c.d, today);
          const holiday = INDIAN_HOLIDAYS[dkey(c.d)];
          return (
            <button
              key={i}
              onClick={() => onCellClick(c.d)}
              className={cn(
                'relative text-left px-2 pt-1.5 pb-1 border-r border-b border-neutral-200 overflow-hidden min-h-0 hover:bg-[#fa2d48]/5',
                !c.current && 'bg-neutral-50',
              )}
              style={isToday ? { borderTop: '3px solid #fa2d48', background: 'rgba(250,45,72,0.06)' } : undefined}
            >
              <div className={cn('text-right text-[12.5px]', isToday ? 'font-bold text-[#fa2d48]' : c.current ? 'text-neutral-800' : 'text-neutral-400')}>
                {c.d.getDate()}
              </div>
              {holiday && (
                <div className="text-[10.5px] truncate text-emerald-700 mt-0.5" title={holiday}>• {holiday}</div>
              )}
              <div className="mt-0.5 space-y-0.5">
                {evs.filter((e) => !e.id.startsWith('h-')).map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className={cn('text-[10.5px] truncate px-1.5 py-px rounded cursor-pointer', COLORS[e.color].bg, COLORS[e.color].text)}
                  >
                    {e.startTime.toLocaleTimeString('en-US', { hour: 'numeric' })} {e.title}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const WeekView = ({ current, today, events, onSlotClick, onEventClick }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void;
}) => {
  const start = startOfWeek(current);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  return (
    <div className="h-full flex flex-col">
      <div className="grid border-b border-neutral-200" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        <div />
        {days.map((d, i) => {
          const isToday = sameDay(d, today);
          return (
            <div key={i} className="text-center py-2">
              <div className="text-[10.5px] uppercase tracking-wider text-neutral-500">{WEEKDAYS[i]}</div>
              <div className={cn('text-[18px] font-semibold mt-0.5', isToday && 'text-[#fa2d48]')}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto thin-scrollbar">
        <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
          {HOURS.map((h) => (
            <div key={h} className="contents">
              <div className="text-[10.5px] text-neutral-500 text-right pr-2 pt-1 border-t border-neutral-200 h-12">{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</div>
              {days.map((d, di) => {
                const cellDate = new Date(d); cellDate.setHours(h, 0, 0, 0);
                const evs = events.filter((e) => sameDay(e.startTime, d) && e.startTime.getHours() === h && !e.id.startsWith('h-'));
                return (
                  <button key={di} onClick={() => onSlotClick(d, h)} className="border-t border-l border-neutral-200 h-12 relative hover:bg-[#fa2d48]/5">
                    {evs.map((e) => (
                      <div
                        key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                        className={cn('absolute inset-x-1 top-0.5 text-[10.5px] px-1.5 py-0.5 rounded truncate', COLORS[e.color].bg, COLORS[e.color].text, 'border', COLORS[e.color].border)}
                      >
                        {e.title}
                      </div>
                    ))}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DayView = ({ current, today, events, onSlotClick, onEventClick }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void;
}) => {
  const isToday = sameDay(current, today);
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-neutral-200 text-[12px] flex items-center gap-2">
        <CalIcon className={cn('w-4 h-4', isToday && 'text-[#fa2d48]')} />
        <span className={cn(isToday && 'text-[#fa2d48] font-semibold')}>
          {current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div className="flex-1 overflow-auto thin-scrollbar">
        {HOURS.map((h) => {
          const evs = events.filter((e) => sameDay(e.startTime, current) && e.startTime.getHours() === h && !e.id.startsWith('h-'));
          return (
            <button key={h} onClick={() => onSlotClick(current, h)} className="w-full grid border-b border-neutral-200 hover:bg-[#fa2d48]/5 text-left" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="text-[11px] text-neutral-500 text-right pr-3 pt-2">{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</div>
              <div className="min-h-[56px] py-1 pr-3 space-y-1">
                {evs.map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className={cn('text-[12px] px-2 py-1 rounded cursor-pointer border', COLORS[e.color].bg, COLORS[e.color].text, COLORS[e.color].border)}
                  >
                    <div className="font-medium">{e.title}</div>
                    <div className="text-[10.5px] opacity-75">
                      {e.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – {e.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ListView = ({ current, events, onEventClick }: { current: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) => {
  const list = events
    .filter((e) => e.startTime.getMonth() === current.getMonth() && e.startTime.getFullYear() === current.getFullYear())
    .sort((a, b) => +a.startTime - +b.startTime);
  return (
    <div className="h-full overflow-auto thin-scrollbar p-4">
      {list.length === 0 ? (
        <div className="text-center text-neutral-500 mt-10 text-[13px]">No events this month.</div>
      ) : (
        <div className="space-y-1.5">
          {list.map((e) => (
            <button
              key={e.id}
              onClick={() => onEventClick(e)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-[#fa2d48]/5 text-left"
            >
              <div className={cn('w-2.5 h-2.5 rounded-full', COLORS[e.color].dot)} />
              <div className="w-24 text-[12px] text-neutral-500">
                {e.startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 text-[13px] font-medium truncate">{e.title}</div>
              <div className="text-[11.5px] text-neutral-500">
                {e.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
