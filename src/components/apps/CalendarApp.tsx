import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, Grid3x3, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMacOS } from '@/contexts/MacOSContext';

interface CalEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color: 'red' | 'gray' | 'green' | 'blue' | 'orange';
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const INDIAN_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day", '2025-01-14': 'Makar Sankranti', '2025-01-26': 'Republic Day',
  '2025-03-14': 'Holi', '2025-03-31': 'Eid al-Fitr', '2025-04-10': 'Mahavir Jayanti',
  '2025-04-14': 'Ambedkar Jayanti', '2025-04-18': 'Good Friday', '2025-05-01': 'Labour Day',
  '2025-08-15': 'Independence Day (IN)', '2025-08-27': 'Ganesh Chaturthi', '2025-10-02': 'Gandhi Jayanti',
  '2025-10-20': 'Diwali', '2025-11-05': 'Guru Nanak Jayanti', '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day", '2026-01-14': 'Makar Sankranti', '2026-01-26': 'Republic Day',
  '2026-03-04': 'Holi', '2026-03-21': 'Eid al-Fitr', '2026-04-03': 'Good Friday',
  '2026-04-14': 'Ambedkar Jayanti', '2026-05-01': 'Labour Day', '2026-08-15': 'Independence Day (IN)',
  '2026-08-26': 'Janmashtami', '2026-09-14': 'Ganesh Chaturthi', '2026-10-02': 'Gandhi Jayanti',
  '2026-11-08': 'Diwali', '2026-11-24': 'Guru Nanak Jayanti', '2026-12-25': 'Christmas',
};

const US_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day", '2025-01-20': 'MLK Day', '2025-02-17': "Presidents' Day",
  '2025-05-26': 'Memorial Day', '2025-06-19': 'Juneteenth', '2025-07-04': 'Independence Day (US)',
  '2025-09-01': 'Labor Day', '2025-10-13': 'Columbus Day', '2025-11-11': 'Veterans Day',
  '2025-11-27': 'Thanksgiving', '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day", '2026-01-19': 'MLK Day', '2026-02-16': "Presidents' Day",
  '2026-05-25': 'Memorial Day', '2026-06-19': 'Juneteenth', '2026-07-04': 'Independence Day (US)',
  '2026-09-07': 'Labor Day', '2026-10-12': 'Columbus Day', '2026-11-11': 'Veterans Day',
  '2026-11-26': 'Thanksgiving', '2026-12-25': 'Christmas',
};

const dkey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const sameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

type Tone = ReturnType<typeof getTone>;

const getTone = (dark: boolean) => dark ? {
  page: '#1c1c1e', text: '#f5f5f7', sub: '#a8a8ad', border: 'rgba(255,255,255,0.10)',
  cell: '#1c1c1e', cellAlt: '#16161a', hover: 'rgba(250,45,72,0.12)',
  modal: '#2a2a2e', input: '#1c1c1e', inputBorder: 'rgba(255,255,255,0.18)',
  segActive: '#f5f5f7', segActiveText: '#1c1c1e', segText: '#a8a8ad', segHover: 'rgba(255,255,255,0.06)',
  headerBg: 'linear-gradient(180deg, rgba(250,45,72,0.18), rgba(40,40,44,0.6))',
} : {
  page: '#ffffff', text: '#1c1c1e', sub: '#737378', border: 'rgba(0,0,0,0.10)',
  cell: '#ffffff', cellAlt: '#fafafa', hover: 'rgba(250,45,72,0.06)',
  modal: '#ffffff', input: '#ffffff', inputBorder: 'rgba(0,0,0,0.15)',
  segActive: '#1c1c1e', segActiveText: '#ffffff', segText: '#404048', segHover: 'rgba(0,0,0,0.05)',
  headerBg: 'linear-gradient(180deg, rgba(250,45,72,0.08), rgba(255,255,255,0.6))',
};

const COLORS_HEX: Record<CalEvent['color'], string> = {
  red: '#fa2d48', gray: '#6b7280', green: '#16a34a', blue: '#2563eb', orange: '#ea580c',
};

const evChip = (c: CalEvent['color']) => {
  const hex = COLORS_HEX[c];
  return { background: hex + '26', color: hex, border: `1px solid ${hex}55` };
};

const seedEvents = (): CalEvent[] => {
  const t = new Date();
  return [
    {
      id: 'today-1', title: 'Design review', color: 'red',
      startTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 10, 0),
      endTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 11, 0),
    },
    {
      id: 'today-2', title: 'Gym', color: 'gray',
      startTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 18, 0),
      endTime: new Date(t.getFullYear(), t.getMonth(), t.getDate(), 19, 0),
    },
  ];
};

type View = 'month' | 'week' | 'day' | 'list';

export const CalendarApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';
  const tone = getTone(dark);

  const [events, setEvents] = useState<CalEvent[]>(() => seedEvents());
  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<{ title: string; color: CalEvent['color']; date: string; startH: number; startM: number; endH: number; endM: number }>(
    { title: '', color: 'red', date: dkey(new Date()), startH: 9, startM: 0, endH: 10, endM: 0 }
  );

  const today = new Date();

  const navigate = (dir: -1 | 1) => {
    setCurrent((p) => {
      const n = new Date(p);
      if (view === 'month' || view === 'list') n.setMonth(p.getMonth() + dir);
      else if (view === 'week') n.setDate(p.getDate() + 7 * dir);
      else n.setDate(p.getDate() + dir);
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

  const openCreate = (date: Date, hour?: number) => {
    const h = hour ?? 9;
    setDraft({ title: '', color: 'red', date: dkey(date), startH: h, startM: 0, endH: (h + 1) % 24, endM: 0 });
    setCreating(true);
  };

  const submitCreate = () => {
    if (!draft.title.trim()) return;
    const [y, m, d] = draft.date.split('-').map(Number);
    const start = new Date(y, m - 1, d, draft.startH, draft.startM);
    const end = new Date(y, m - 1, d, draft.endH, draft.endM);
    setEvents((p) => [...p, { id: Math.random().toString(36).slice(2), title: draft.title.trim(), color: draft.color, startTime: start, endTime: end }]);
    setCreating(false);
  };

  return (
    <div className="h-full w-full flex flex-col select-none overflow-hidden"
      style={{ background: tone.page, color: tone.text, fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: tone.border, background: tone.headerBg, backdropFilter: 'blur(20px) saturate(180%)' }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-semibold tracking-tight min-w-[210px]">{headerLabel}</h2>
          <div className="flex items-center gap-1">
            <IconBtn tone={tone} onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4" /></IconBtn>
            <button
              onClick={() => setCurrent(new Date())}
              className="h-7 px-2.5 text-[12px] rounded-md border"
              style={{ borderColor: tone.border, color: tone.text, background: 'transparent' }}
            >Today</button>
            <IconBtn tone={tone} onClick={() => navigate(1)}><ChevronRight className="w-4 h-4" /></IconBtn>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Segmented tone={tone} value={view} onChange={setView} />
          <button
            onClick={() => openCreate(current)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-medium text-white shadow-sm"
            style={{ background: 'linear-gradient(180deg,#ff5366,#fa2d48)' }}
          >
            <Plus className="w-3.5 h-3.5" /> New Event
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 text-[11px] border-b" style={{ borderColor: tone.border, color: tone.sub }}>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS_HEX.green }} />India holidays</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS_HEX.blue }} />US holidays</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS_HEX.red }} />Personal</span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {view === 'month' && <MonthView tone={tone} current={current} today={today} events={events} onCellClick={openCreate} onEventClick={setSelected} />}
        {view === 'week' && <WeekView tone={tone} current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
        {view === 'day' && <DayView tone={tone} current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
        {view === 'list' && <ListView tone={tone} current={current} events={events} onEventClick={setSelected} />}
      </div>

      {selected && (
        <Modal tone={tone} onClose={() => setSelected(null)} title={selected.title} accent={COLORS_HEX[selected.color]}>
          <div className="text-[13px]" style={{ color: tone.text }}>
            {selected.startTime.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-[13px] mt-0.5" style={{ color: tone.sub }}>
            {selected.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – {selected.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => { setEvents((p) => p.filter((e) => e.id !== selected.id)); setSelected(null); }}
              className="h-8 px-3 rounded-md text-[12.5px] border"
              style={{ borderColor: tone.border, color: tone.text }}
            >Delete</button>
            <button onClick={() => setSelected(null)} className="h-8 px-3 rounded-md text-[12.5px] text-white" style={{ background: '#fa2d48' }}>Close</button>
          </div>
        </Modal>
      )}

      {creating && (
        <Modal tone={tone} onClose={() => setCreating(false)} title="New Event" accent="#fa2d48">
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Event title"
            className="w-full h-9 px-3 rounded-md border text-[13px] outline-none"
            style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text }}
          />

          <div className="text-[11px] uppercase tracking-wider mt-4 mb-1" style={{ color: tone.sub }}>Date</div>
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            className="w-full h-9 px-3 rounded-md border text-[13px] outline-none"
            style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text }}
          />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: tone.sub }}>Start</div>
              <input
                type="time"
                value={`${String(draft.startH).padStart(2,'0')}:${String(draft.startM).padStart(2,'0')}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':').map(Number);
                  setDraft((d) => ({ ...d, startH: h, startM: m }));
                }}
                className="w-full h-9 px-3 rounded-md border text-[13px] outline-none"
                style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text }}
              />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: tone.sub }}>End</div>
              <input
                type="time"
                value={`${String(draft.endH).padStart(2,'0')}:${String(draft.endM).padStart(2,'0')}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':').map(Number);
                  setDraft((d) => ({ ...d, endH: h, endM: m }));
                }}
                className="w-full h-9 px-3 rounded-md border text-[13px] outline-none"
                style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text }}
              />
            </div>
          </div>

          <div className="text-[11px] uppercase tracking-wider mt-4 mb-1" style={{ color: tone.sub }}>Color</div>
          <div className="flex items-center gap-2">
            {(['red','gray','green','blue','orange'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setDraft((d) => ({ ...d, color: c }))}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{
                  background: COLORS_HEX[c],
                  outline: draft.color === c ? `2px solid ${tone.text}` : 'none',
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button onClick={() => setCreating(false)} className="h-8 px-3 rounded-md text-[12.5px] border" style={{ borderColor: tone.border, color: tone.text }}>Cancel</button>
            <button onClick={submitCreate} className="h-8 px-3 rounded-md text-[12.5px] text-white" style={{ background: '#fa2d48' }}>Add</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const startOfWeek = (d: Date) => {
  const r = new Date(d);
  const wd = (r.getDay() + 6) % 7;
  r.setDate(r.getDate() - wd);
  r.setHours(0, 0, 0, 0);
  return r;
};

const IconBtn = ({ children, onClick, tone }: { children: React.ReactNode; onClick: () => void; tone: Tone }) => (
  <button onClick={onClick} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ color: tone.text }}
    onMouseEnter={(e) => (e.currentTarget.style.background = tone.segHover)}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>{children}</button>
);

const Segmented = ({ value, onChange, tone }: { value: View; onChange: (v: View) => void; tone: Tone }) => {
  const items: { v: View; icon: React.ReactNode; label: string }[] = [
    { v: 'month', icon: <CalIcon className="w-3.5 h-3.5" />, label: 'Month' },
    { v: 'week', icon: <Grid3x3 className="w-3.5 h-3.5" />, label: 'Week' },
    { v: 'day', icon: <Clock className="w-3.5 h-3.5" />, label: 'Day' },
    { v: 'list', icon: <List className="w-3.5 h-3.5" />, label: 'List' },
  ];
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg border" style={{ borderColor: tone.border }}>
      {items.map((it) => (
        <button
          key={it.v}
          onClick={() => onChange(it.v)}
          className="h-7 px-2.5 rounded-md text-[12px] flex items-center gap-1 transition-colors"
          style={{
            background: value === it.v ? tone.segActive : 'transparent',
            color: value === it.v ? tone.segActiveText : tone.segText,
          }}
        >
          {it.icon}{it.label}
        </button>
      ))}
    </div>
  );
};

const Modal = ({ children, title, accent, onClose, tone }: { children: React.ReactNode; title: string; accent: string; onClose: () => void; tone: Tone }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
    <div
      className="w-[440px] max-w-[92%] rounded-2xl p-5 shadow-2xl border"
      style={{ background: tone.modal, borderColor: tone.border, color: tone.text }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
          <h3 className="text-[15px] font-semibold">{title}</h3>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded"
          onMouseEnter={(e) => (e.currentTarget.style.background = tone.segHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ───── views ─────
const MonthView = ({ current, today, events, onCellClick, onEventClick, tone }: {
  current: Date; today: Date; events: CalEvent[];
  onCellClick: (d: Date) => void; onEventClick: (e: CalEvent) => void; tone: Tone;
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
          <div key={w} className="px-3 py-1.5 text-[10.5px] uppercase tracking-wider text-right border-b" style={{ color: tone.sub, borderColor: tone.border }}>{w}</div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0">
        {cells.map((c, i) => {
          const evs = events.filter((e) => sameDay(e.startTime, c.d)).slice(0, 3);
          const isToday = sameDay(c.d, today);
          const inH = INDIAN_HOLIDAYS[dkey(c.d)];
          const usH = US_HOLIDAYS[dkey(c.d)];
          return (
            <button
              key={i}
              onClick={() => onCellClick(c.d)}
              className="relative text-left px-2 pt-1.5 pb-1 border-r border-b overflow-hidden min-h-0"
              style={{
                borderColor: tone.border,
                background: !c.current ? tone.cellAlt : isToday ? 'rgba(250,45,72,0.10)' : tone.cell,
                ...(isToday ? { borderTop: '3px solid #fa2d48' } : {}),
              }}
              onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.background = tone.hover; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = !c.current ? tone.cellAlt : isToday ? 'rgba(250,45,72,0.10)' : tone.cell;
              }}
            >
              <div className="text-right text-[12.5px]" style={{
                color: isToday ? '#fa2d48' : c.current ? tone.text : tone.sub,
                fontWeight: isToday ? 700 : 400,
              }}>
                {c.d.getDate()}
              </div>
              {inH && (
                <div className="text-[10.5px] truncate mt-0.5" style={{ color: COLORS_HEX.green }} title={inH}>• {inH}</div>
              )}
              {usH && (
                <div className="text-[10.5px] truncate" style={{ color: COLORS_HEX.blue }} title={usH}>• {usH}</div>
              )}
              <div className="mt-0.5 space-y-0.5">
                {evs.map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className="text-[10.5px] truncate px-1.5 py-px rounded cursor-pointer"
                    style={evChip(e.color)}
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

const WeekView = ({ current, today, events, onSlotClick, onEventClick, tone }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void; tone: Tone;
}) => {
  const start = startOfWeek(current);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  return (
    <div className="h-full flex flex-col">
      <div className="grid border-b" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', borderColor: tone.border }}>
        <div />
        {days.map((d, i) => {
          const isToday = sameDay(d, today);
          return (
            <div key={i} className="text-center py-2">
              <div className="text-[10.5px] uppercase tracking-wider" style={{ color: tone.sub }}>{WEEKDAYS[i]}</div>
              <div className="text-[18px] font-semibold mt-0.5" style={{ color: isToday ? '#fa2d48' : tone.text }}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto thin-scrollbar">
        <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
          {HOURS.map((h) => (
            <div key={h} className="contents">
              <div className="text-[10.5px] text-right pr-2 pt-1 border-t h-12" style={{ color: tone.sub, borderColor: tone.border }}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</div>
              {days.map((d, di) => {
                const evs = events.filter((e) => sameDay(e.startTime, d) && e.startTime.getHours() === h);
                return (
                  <button key={di} onClick={() => onSlotClick(d, h)} className="border-t border-l h-12 relative" style={{ borderColor: tone.border }}>
                    {evs.map((e) => (
                      <div
                        key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                        className="absolute inset-x-1 top-0.5 text-[10.5px] px-1.5 py-0.5 rounded truncate"
                        style={evChip(e.color)}
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

const DayView = ({ current, today, events, onSlotClick, onEventClick, tone }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void; tone: Tone;
}) => {
  const isToday = sameDay(current, today);
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b text-[12px] flex items-center gap-2" style={{ borderColor: tone.border }}>
        <CalIcon className="w-4 h-4" style={isToday ? { color: '#fa2d48' } : undefined} />
        <span style={isToday ? { color: '#fa2d48', fontWeight: 600 } : undefined}>
          {current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div className="flex-1 overflow-auto thin-scrollbar">
        {HOURS.map((h) => {
          const evs = events.filter((e) => sameDay(e.startTime, current) && e.startTime.getHours() === h);
          return (
            <button key={h} onClick={() => onSlotClick(current, h)} className="w-full grid border-b text-left" style={{ gridTemplateColumns: '80px 1fr', borderColor: tone.border }}>
              <div className="text-[11px] text-right pr-3 pt-2" style={{ color: tone.sub }}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</div>
              <div className="min-h-[56px] py-1 pr-3 space-y-1">
                {evs.map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className="text-[12px] px-2 py-1 rounded cursor-pointer"
                    style={evChip(e.color)}
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

const ListView = ({ current, events, onEventClick, tone }: { current: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void; tone: Tone }) => {
  const list = events
    .filter((e) => e.startTime.getMonth() === current.getMonth() && e.startTime.getFullYear() === current.getFullYear())
    .sort((a, b) => +a.startTime - +b.startTime);
  return (
    <div className="h-full overflow-auto thin-scrollbar p-4">
      {list.length === 0 ? (
        <div className="text-center mt-10 text-[13px]" style={{ color: tone.sub }}>No events this month.</div>
      ) : (
        <div className="space-y-1.5">
          {list.map((e) => (
            <button
              key={e.id}
              onClick={() => onEventClick(e)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border text-left"
              style={{ borderColor: tone.border }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS_HEX[e.color] }} />
              <div className="w-24 text-[12px]" style={{ color: tone.sub }}>
                {e.startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 text-[13px] font-medium truncate">{e.title}</div>
              <div className="text-[11.5px]" style={{ color: tone.sub }}>
                {e.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
