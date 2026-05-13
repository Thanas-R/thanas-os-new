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

// Holidays (India = royal green, US = whitish gray)
const INDIAN_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day", '2025-01-14': 'Makar Sankranti', '2025-01-26': 'Republic Day',
  '2025-03-14': 'Holi', '2025-03-31': 'Eid al-Fitr', '2025-04-10': 'Mahavir Jayanti',
  '2025-04-14': 'Ambedkar Jayanti', '2025-04-18': 'Good Friday', '2025-05-01': 'Labour Day',
  '2025-08-15': 'Independence Day', '2025-08-27': 'Ganesh Chaturthi', '2025-10-02': 'Gandhi Jayanti',
  '2025-10-20': 'Diwali', '2025-10-21': 'Govardhan Puja', '2025-10-22': 'Bhai Dooj',
  '2025-11-05': 'Guru Nanak Jayanti', '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day", '2026-01-14': 'Makar Sankranti', '2026-01-26': 'Republic Day',
  '2026-03-04': 'Holi', '2026-03-21': 'Eid al-Fitr', '2026-04-03': 'Good Friday',
  '2026-04-14': 'Ambedkar Jayanti', '2026-05-01': 'Labour Day', '2026-08-15': 'Independence Day',
  '2026-08-26': 'Janmashtami', '2026-09-14': 'Ganesh Chaturthi', '2026-10-02': 'Gandhi Jayanti',
  '2026-11-08': 'Diwali', '2026-11-24': 'Guru Nanak Jayanti', '2026-12-25': 'Christmas',
};

const US_HOLIDAYS: Record<string, string> = {
  '2025-01-01': "New Year's Day", '2025-01-20': 'MLK Day', '2025-02-17': "Presidents' Day",
  '2025-05-26': 'Memorial Day', '2025-06-19': 'Juneteenth', '2025-07-04': 'Independence Day',
  '2025-09-01': 'Labor Day', '2025-10-13': 'Columbus Day', '2025-11-11': 'Veterans Day',
  '2025-11-27': 'Thanksgiving', '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day", '2026-01-19': 'MLK Day', '2026-02-16': "Presidents' Day",
  '2026-05-25': 'Memorial Day', '2026-06-19': 'Juneteenth', '2026-07-04': 'Independence Day',
  '2026-09-07': 'Labor Day', '2026-10-12': 'Columbus Day', '2026-11-11': 'Veterans Day',
  '2026-11-26': 'Thanksgiving', '2026-12-25': 'Christmas',
};

// RCB (Royal Challengers Bengaluru) — IPL fixtures (red)
const RCB_MATCHES: Record<string, string> = {
  '2025-03-22': 'RCB vs KKR (Kolkata)', '2025-03-28': 'RCB vs CSK (Chennai)',
  '2025-04-02': 'RCB vs GT (Bengaluru)', '2025-04-07': 'RCB vs MI (Mumbai)',
  '2025-04-13': 'RCB vs DC (Bengaluru)', '2025-04-18': 'RCB vs PBKS (Bengaluru)',
  '2025-04-24': 'RCB vs RR (Jaipur)', '2025-05-03': 'RCB vs CSK (Bengaluru)',
  '2025-05-09': 'RCB vs LSG (Lucknow)', '2025-05-13': 'RCB vs SRH (Hyderabad)',
  '2025-05-17': 'RCB vs KKR (Bengaluru)', '2025-05-23': 'RCB vs SRH (Bengaluru)',
  '2025-05-27': 'RCB Qualifier 1', '2025-06-03': 'IPL 2025 Final',
  // IPL 2026 fixtures (tentative)
  '2026-03-21': 'RCB vs MI (Mumbai)', '2026-03-27': 'RCB vs CSK (Bengaluru)',
  '2026-04-01': 'RCB vs DC (Delhi)', '2026-04-05': 'RCB vs PBKS (Bengaluru)',
  '2026-04-11': 'RCB vs RR (Bengaluru)', '2026-04-16': 'RCB vs SRH (Hyderabad)',
  '2026-04-22': 'RCB vs GT (Ahmedabad)', '2026-04-28': 'RCB vs KKR (Bengaluru)',
  '2026-05-02': 'RCB vs LSG (Bengaluru)', '2026-05-08': 'RCB vs MI (Bengaluru)',
  '2026-05-13': 'RCB vs CSK (Chennai)', '2026-05-17': 'RCB vs GT (Bengaluru)',
  '2026-05-21': 'RCB Qualifier 1', '2026-05-29': 'IPL 2026 Final',
};

// Real Madrid (white) — La Liga & UCL highlights
const REAL_MADRID_MATCHES: Record<string, string> = {
  '2025-08-19': 'RM vs Osasuna (La Liga)', '2025-08-24': 'RM vs Real Oviedo',
  '2025-08-31': 'RM vs Mallorca', '2025-09-13': 'RM vs Real Sociedad',
  '2025-09-16': 'RM vs Marseille (UCL)', '2025-09-20': 'RM vs Espanyol',
  '2025-09-23': 'RM vs Levante', '2025-09-27': 'RM vs Atlético (derby)',
  '2025-10-01': 'RM vs Kairat (UCL)', '2025-10-05': 'RM vs Villarreal',
  '2025-10-19': 'RM vs Getafe', '2025-10-21': 'RM vs Juventus (UCL)',
  '2025-10-26': 'El Clásico — RM vs Barcelona', '2025-11-04': 'RM vs Liverpool (UCL)',
  '2025-11-09': 'RM vs Rayo Vallecano', '2025-11-23': 'RM vs Elche',
  '2025-11-26': 'RM vs Olympiacos (UCL)', '2025-12-07': 'RM vs Girona',
  '2025-12-10': 'RM vs Man City (UCL)', '2025-12-14': 'RM vs Alavés',
  '2025-12-21': 'RM vs Sevilla',
  // 2026
  '2026-01-04': 'RM vs Valencia', '2026-01-11': 'RM vs Barcelona (Supercopa)',
  '2026-01-18': 'RM vs Las Palmas', '2026-01-25': 'RM vs Real Sociedad',
  '2026-02-01': 'RM vs Atlético (derby)', '2026-02-08': 'RM vs Mallorca',
  '2026-02-15': 'RM vs Girona', '2026-02-21': 'RM vs Bayern (UCL R16)',
  '2026-03-01': 'RM vs Sevilla', '2026-03-08': 'RM vs Betis',
  '2026-03-11': 'RM vs Bayern (UCL R16 leg 2)', '2026-03-15': 'RM vs Villarreal',
  '2026-04-05': 'RM vs Espanyol', '2026-04-12': 'RM vs Athletic Club',
  '2026-04-19': 'RM vs Osasuna', '2026-04-26': 'RM vs Celta Vigo',
  '2026-05-03': 'RM vs Getafe', '2026-05-10': 'El Clásico — RM vs Barcelona',
  '2026-05-17': 'RM vs Levante', '2026-05-24': 'RM vs Valencia',
  '2026-05-30': 'UCL Final',
};

// India national cricket team — major fixtures (blue)
const INDIA_CRICKET: Record<string, string> = {
  '2025-08-02': 'IND vs ENG — 5th Test', '2025-10-19': 'IND vs AUS — 1st ODI',
  '2025-10-23': 'IND vs AUS — 2nd ODI', '2025-10-25': 'IND vs AUS — 3rd ODI',
  '2025-10-29': 'IND vs AUS — 1st T20I', '2025-10-31': 'IND vs AUS — 2nd T20I',
  '2025-11-02': 'IND vs AUS — 3rd T20I', '2025-11-06': 'IND vs AUS — 4th T20I',
  '2025-11-08': 'IND vs AUS — 5th T20I', '2025-11-14': 'IND vs SA — 1st Test',
  '2025-11-22': 'IND vs SA — 2nd Test', '2025-11-30': 'IND vs SA — 1st ODI',
  '2025-12-03': 'IND vs SA — 2nd ODI', '2025-12-06': 'IND vs SA — 3rd ODI',
  '2025-12-09': 'IND vs SA — 1st T20I', '2025-12-11': 'IND vs SA — 2nd T20I',
  '2025-12-14': 'IND vs SA — 3rd T20I', '2025-12-17': 'IND vs SA — 4th T20I',
  '2025-12-19': 'IND vs SA — 5th T20I',
  // 2026 (T20 World Cup in India + bilaterals)
  '2026-01-11': 'IND vs WI — 1st T20I', '2026-01-13': 'IND vs WI — 2nd T20I',
  '2026-01-16': 'IND vs WI — 3rd T20I', '2026-01-23': 'IND vs NZ — 1st ODI',
  '2026-01-26': 'IND vs NZ — 2nd ODI', '2026-01-29': 'IND vs NZ — 3rd ODI',
  '2026-02-05': 'IND vs SL — 1st Test', '2026-02-15': 'IND vs SL — 2nd Test',
  '2026-02-25': 'IND vs PAK (Asia Cup)', '2026-03-09': 'IND vs ENG — 1st Test',
  '2026-03-16': 'IND vs ENG — 2nd Test', '2026-03-24': 'IND vs ENG — 3rd ODI',
  '2026-04-04': 'IND vs BAN (warm-up)',
  // ICC Men's T20 World Cup 2026 — India fixtures (group stage projections)
  '2026-02-08': 'T20 WC: IND vs USA', '2026-02-12': 'T20 WC: IND vs Namibia',
  '2026-02-18': 'T20 WC: IND vs Pakistan', '2026-02-21': 'T20 WC: IND vs Netherlands',
  '2026-02-26': 'T20 WC: IND vs Super 8', '2026-03-04': 'T20 WC Semi-final',
  '2026-03-12': 'T20 WC Final',
  '2026-05-15': 'IND vs SL — 1st T20I (away)', '2026-05-17': 'IND vs SL — 2nd T20I',
  '2026-05-20': 'IND vs SL — 3rd T20I',
};

type HolidayKind = 'india' | 'usa' | 'rcb' | 'realmadrid' | 'cricket';
interface OverlayItem { kind: HolidayKind; label: string; }

const HOLIDAY_COLORS: Record<HolidayKind, string> = {
  india: '#0b6b3a',        // royal green
  usa: '#eab308',          // yellow
  rcb: '#e11d2a',          // red
  realmadrid: '#ffffff',   // white
  cricket: '#2563eb',      // blue
};

const getOverlays = (d: Date): OverlayItem[] => {
  const k = dkey(d);
  const out: OverlayItem[] = [];
  if (INDIAN_HOLIDAYS[k]) out.push({ kind: 'india', label: INDIAN_HOLIDAYS[k] });
  if (US_HOLIDAYS[k]) out.push({ kind: 'usa', label: US_HOLIDAYS[k] });
  if (RCB_MATCHES[k]) out.push({ kind: 'rcb', label: RCB_MATCHES[k] });
  if (REAL_MADRID_MATCHES[k]) out.push({ kind: 'realmadrid', label: REAL_MADRID_MATCHES[k] });
  if (INDIA_CRICKET[k]) out.push({ kind: 'cricket', label: INDIA_CRICKET[k] });
  return out;
};

const dkey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const sameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

type Tone = ReturnType<typeof getTone>;

const getTone = (dark: boolean) => dark ? {
  page: '#1c1c1e', text: '#f5f5f7', sub: '#a8a8ad', border: 'rgba(255,255,255,0.10)',
  cell: '#1c1c1e', cellAlt: '#16161a', hover: 'rgba(250,45,72,0.12)',
  modal: '#2a2a2e', input: '#1c1c1e', inputBorder: 'rgba(255,255,255,0.18)',
  segActive: '#f5f5f7', segActiveText: '#1c1c1e', segText: '#a8a8ad', segHover: 'rgba(255,255,255,0.06)',
  headerBg: '#2a2a2e',
} : {
  page: '#ffffff', text: '#1c1c1e', sub: '#737378', border: 'rgba(0,0,0,0.10)',
  cell: '#ffffff', cellAlt: '#fafafa', hover: 'rgba(250,45,72,0.06)',
  modal: '#ffffff', input: '#ffffff', inputBorder: 'rgba(0,0,0,0.15)',
  segActive: '#1c1c1e', segActiveText: '#ffffff', segText: '#404048', segHover: 'rgba(0,0,0,0.05)',
  headerBg: '#3a3a3e',
};

const COLORS_HEX: Record<CalEvent['color'], string> = {
  red: '#fa2d48', gray: '#6b7280', green: '#16a34a', blue: '#2563eb', orange: '#ea580c',
};

// Frosted-glass event chip (Apple-style transparent tint)
const evChip = (hex: string, dark: boolean) => ({
  background: dark
    ? `linear-gradient(180deg, ${hex}40, ${hex}26)`
    : `linear-gradient(180deg, ${hex}33, ${hex}1f)`,
  color: dark ? '#fff' : hex,
  border: `1px solid ${hex}55`,
  backdropFilter: 'blur(10px) saturate(160%)',
  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
  boxShadow: `inset 0 1px 0 ${hex}33`,
  borderLeft: `3px solid ${hex}`,
});


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

      {/* Header — leave 78px on the left for traffic lights */}
      <div
        className="flex items-center justify-between pl-[88px] pr-4 py-3 border-b text-white"
        style={{ borderColor: tone.border, background: tone.headerBg, backdropFilter: 'blur(20px) saturate(180%)' }}
      >
        <div className="flex items-center gap-5 ml-auto">
          <h2 className="text-[19px] font-semibold tracking-tight">{headerLabel}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="w-7 h-7 flex items-center justify-center rounded-md text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => navigate(1)} className="w-7 h-7 flex items-center justify-center rounded-md text-white hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-6 ml-4">
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

      <div className="flex-1 min-h-0 overflow-hidden">
        {view === 'month' && (
          <MonthView
            tone={tone}
            dark={dark}
            current={current}
            today={today}
            events={events}
            onCellClick={(d) => { setCurrent(d); setView('day'); }}
            onEventClick={setSelected}
          />
        )}
        {view === 'week' && <WeekView tone={tone} dark={dark} current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
        {view === 'day' && <DayView tone={tone} dark={dark} current={current} today={today} events={events} onSlotClick={openCreate} onEventClick={setSelected} />}
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
            style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text, colorScheme: dark ? 'dark' : 'light' }}
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
                style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text , colorScheme: dark ? "dark" : "light" }}
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
                style={{ background: tone.input, borderColor: tone.inputBorder, color: tone.text , colorScheme: dark ? "dark" : "light" }}
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
const MonthView = ({ current, today, events, onCellClick, onEventClick, tone, dark }: {
  current: Date; today: Date; events: CalEvent[];
  onCellClick: (d: Date) => void; onEventClick: (e: CalEvent) => void; tone: Tone; dark: boolean;
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
          const evs = events.filter((e) => sameDay(e.startTime, c.d)).slice(0, 2);
          const isToday = sameDay(c.d, today);
          const overlays = getOverlays(c.d).slice(0, 2);
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
              {/* Date number — pinned top-right */}
              <div
                className="absolute top-1 right-2 text-[12.5px] leading-none"
                style={{
                  color: isToday ? '#fa2d48' : c.current ? tone.text : tone.sub,
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {c.d.getDate()}
              </div>
              {/* Spacer so content doesn't collide with date */}
              <div className="h-4" />
              <div className="space-y-0.5">
                {overlays.map((o, oi) => (
                  <div
                    key={oi}
                    title={o.label}
                    className="text-[10px] truncate px-1.5 py-px rounded"
                    style={evChip(HOLIDAY_COLORS[o.kind], dark)}
                  >
                    {o.label}
                  </div>
                ))}
                {evs.map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className="text-[10.5px] truncate px-1.5 py-px rounded cursor-pointer"
                    style={evChip(COLORS_HEX[e.color], dark)}
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

const WeekView = ({ current, today, events, onSlotClick, onEventClick, tone, dark }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void; tone: Tone; dark: boolean;
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
                        style={evChip(COLORS_HEX[e.color], dark)}
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

const DayView = ({ current, today, events, onSlotClick, onEventClick, tone, dark }: {
  current: Date; today: Date; events: CalEvent[];
  onSlotClick: (d: Date, h: number) => void; onEventClick: (e: CalEvent) => void; tone: Tone; dark: boolean;
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
                    style={evChip(COLORS_HEX[e.color], dark)}
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
