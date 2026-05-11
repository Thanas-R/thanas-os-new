import { useEffect, useMemo, useState } from 'react';
import {
  Search, Sidebar as SidebarIcon, ChevronLeft, ChevronRight, Phone, MessageSquare, Video, Mail, Share, Plus,
  Sparkles, Clock, Star, Calendar, ChevronDown, Users, Briefcase, Building2, Archive, Trash2, Wifi, MapPin, Home as HomeIcon,
} from 'lucide-react';
import profilePhoto from '@/assets/profile-photo-new.jpg';

interface Contact {
  id: string;
  first: string;
  last: string;
  group: 'friends' | 'family' | 'business';
  email?: string;
  phone?: string;
  home?: string;
  work?: string;
  age?: number;
  born?: string;
  starred?: boolean;
  upcoming?: { title: string; when: string; where: string };
  avatarColor: string;
}

const CONTACTS: Contact[] = [
  { id: 'thanas', first: 'Thanas', last: 'R', group: 'friends', email: 'thanas5.rd@gmail.com', phone: '+91 00000 00000', home: 'Bangalore, India', work: 'PES University', age: 21, born: 'June 2003', starred: true, avatarColor: '#fb923c', upcoming: { title: 'Coffee Chat', when: 'This Friday - 18:00', where: 'Third Wave Coffee, Indiranagar' } },
  { id: 'tim', first: 'Tim', last: 'Apple', group: 'business', email: 'tim@apple.com', phone: '+1 (408) 996-1010', work: 'One Apple Park Way, Cupertino', avatarColor: '#a3a3a3' },
  { id: 'john', first: 'John', last: 'Appleseed', group: 'friends', email: 'j.appleseed@icloud.com', phone: '+1 (408) 555-0941', home: '1 Infinite Loop, Cupertino, CA', work: 'One Apple Park Way, Cupertino, CA', age: 46, born: 'April 1, 1976', avatarColor: '#60a5fa', upcoming: { title: 'Lunch w. John', when: 'Saturday, August 6 - 18:00-20:30', where: 'Dumpling Time, 11 Division St, San Francisco, CA' } },
  { id: 'jane', first: 'Jane', last: 'Appleseed', group: 'family', email: 'jane@icloud.com', avatarColor: '#f472b6' },
  { id: 'craig', first: 'Craig', last: 'Federighi', group: 'business', email: 'craig@apple.com', work: 'Apple Park, Cupertino', avatarColor: '#a78bfa' },
  { id: 'jony', first: 'Jony', last: 'Ive', group: 'business', email: 'jony@lovefrom.com', avatarColor: '#fbbf24' },
  { id: 'johnny', first: 'Johnny', last: 'Srouji', group: 'business', email: 'js@apple.com', avatarColor: '#f59e0b' },
  { id: 'ternus', first: 'John', last: 'Ternus', group: 'business', email: 'jt@apple.com', avatarColor: '#34d399' },
];

type GroupId = 'all' | 'friends' | 'family' | 'business' | 'starred' | 'recents';

export const ContactApp = () => {
  const [activeId, setActiveId] = useState<string>('thanas');
  const [activeGroup, setActiveGroup] = useState<GroupId>('all');
  const [query, setQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [iCloudOpen, setICloudOpen] = useState(true);

  useEffect(() => {
    const fn = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.appId === 'contact' && d?.payload?.contactId) setActiveId(d.payload.contactId);
    };
    window.addEventListener('spotlight:open', fn);
    return () => window.removeEventListener('spotlight:open', fn);
  }, []);

  const filtered = useMemo(() => {
    let list = CONTACTS.slice();
    if (activeGroup === 'friends' || activeGroup === 'family' || activeGroup === 'business') {
      list = list.filter(c => c.group === activeGroup);
    } else if (activeGroup === 'starred') {
      list = list.filter(c => c.starred);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(c => `${c.first} ${c.last}`.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.last.localeCompare(b.last));
  }, [activeGroup, query]);

  // Group by first letter of last name
  const grouped = useMemo(() => {
    const m = new Map<string, Contact[]>();
    filtered.forEach(c => {
      const k = c.last[0]?.toUpperCase() || '#';
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(c);
    });
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const active = CONTACTS.find(c => c.id === activeId) || CONTACTS[0];

  const SidebarBtn = ({ icon: I, label, count, color, id }: { icon: any; label: string; count?: number; color: string; id: GroupId }) => {
    const on = activeGroup === id;
    return (
      <button
        onClick={() => setActiveGroup(id)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-1 rounded-md text-[13px] ${
          on ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <I className="w-3.5 h-3.5" style={{ color }} />
        <span className="flex-1 text-left truncate">{label}</span>
        {typeof count === 'number' && <span className="text-[11px] text-neutral-400">{count}</span>}
      </button>
    );
  };

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-amber-50 to-orange-100 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100 text-[13px]">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-[230px] shrink-0 bg-white/40 dark:bg-neutral-900/60 backdrop-blur-xl border-r border-black/5 dark:border-white/10 flex flex-col">
          <div className="px-3 pt-4 pb-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 shadow-inner ring-1 ring-black/5 dark:ring-white/5">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent outline-none text-[12.5px]"
              />
            </div>
          </div>

          <div className="px-3 space-y-0.5 pb-2 border-b border-black/5 dark:border-white/10">
            <SidebarBtn id="all" icon={Sparkles} label="Siri Suggestions" count={4} color="#3b82f6" />
            <SidebarBtn id="recents" icon={Clock} label="Recents" count={5} color="#f97316" />
            <SidebarBtn id="starred" icon={Star} label="Favorites" count={CONTACTS.filter(c => c.starred).length} color="#fbbf24" />
            <SidebarBtn id="all" icon={Calendar} label="Upcoming Events" count={1} color="#ef4444" />
          </div>

          <div className="px-3 pt-2">
            <button
              onClick={() => setICloudOpen(s => !s)}
              className="w-full flex items-center justify-between text-[10.5px] uppercase font-semibold tracking-wider text-neutral-500 px-1 py-1"
            >
              iCloud
              <ChevronDown className={`w-3 h-3 transition-transform ${iCloudOpen ? '' : '-rotate-90'}`} />
            </button>
            {iCloudOpen && (
              <div className="space-y-0.5">
                <SidebarBtn id="friends" icon={Users} label="Friends" count={CONTACTS.filter(c => c.group === 'friends').length} color="#fb923c" />
                <SidebarBtn id="family" icon={HomeIcon} label="Family" count={CONTACTS.filter(c => c.group === 'family').length} color="#fbbf24" />
                <SidebarBtn id="business" icon={Building2} label="Business" count={CONTACTS.filter(c => c.group === 'business').length} color="#3b82f6" />
              </div>
            )}
          </div>

          <div className="px-3 pt-3 mt-2 border-t border-black/5 dark:border-white/10">
            <div className="text-[10.5px] uppercase font-semibold tracking-wider text-neutral-500 px-1 py-1">Shared</div>
            <SidebarBtn id="all" icon={Briefcase} label="Work" count={5} color="#fb923c" />
            <SidebarBtn id="all" icon={Users} label="Shared Family" count={36} color="#3b82f6" />
          </div>

          <div className="mt-auto px-3 pt-3 pb-3 border-t border-black/5 dark:border-white/10 space-y-0.5">
            <SidebarBtn id="all" icon={Archive} label="Archive" color="#a3a3a3" />
            <SidebarBtn id="all" icon={Trash2} label="Trash" color="#a3a3a3" />
            <button className="mt-2 w-7 h-7 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Middle list */}
      <div className="w-[260px] shrink-0 bg-white/55 dark:bg-neutral-900/50 backdrop-blur-xl border-r border-black/5 dark:border-white/10 flex flex-col">
        <div className="h-12 shrink-0" />
        <div className="flex-1 overflow-auto pb-4">
          {grouped.map(([letter, list]) => (
            <div key={letter}>
              <div className="px-4 pt-1 pb-1 text-[11px] font-semibold text-neutral-500 sticky top-0 bg-inherit">{letter}</div>
              {list.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-left text-[13px] ${
                    c.id === active.id ? 'bg-orange-200/70 dark:bg-orange-500/30' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Avatar c={c} size={20} />
                  <span className="flex-1 truncate">{c.last}, {c.first}</span>
                  {c.starred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-neutral-400">No contacts</div>}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-auto bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl">
        {/* Top bar */}
        <div className="h-12 px-3 flex items-center gap-2 border-b border-black/5 dark:border-white/10">
          <button onClick={() => setShowSidebar(s => !s)} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><SidebarIcon className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
          <div className="flex-1 text-center">
            <div className="font-semibold text-[14px]">{active.first} {active.last}</div>
            {active.home && <div className="text-[11px] text-neutral-500">{active.home}</div>}
          </div>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><Phone className="w-4 h-4" /></button>
          <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><MessageSquare className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><Video className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><Share className="w-4 h-4" /></button>
          <button className="px-2 py-1 rounded text-[12px] hover:bg-black/5 dark:hover:bg-white/10">Edit</button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-5">
            <Avatar c={active} size={92} />
            <div className="min-w-0">
              <div className="text-[26px] font-semibold leading-tight">{active.first} {active.last}</div>
              {active.age && <div className="text-[13px] text-neutral-500 mt-1">{active.age} years old (Born: {active.born})</div>}
              <div className="flex items-center gap-3 mt-3">
                <ActionPill color="#3478f6" icon={MessageSquare} />
                <ActionPill color="#34c759" icon={Phone} />
                <ActionPill color="#34c759" icon={Video} />
                <ActionPill color="#3478f6" icon={Mail} />
                <button className="w-9 h-9 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
                  <span className="text-neutral-600 dark:text-neutral-200 text-lg leading-none">...</span>
                </button>
              </div>
            </div>
          </div>

          {active.upcoming && (
            <div className="mt-5 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/50 ring-1 ring-black/5 dark:ring-white/5 p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white"><Calendar className="w-4 h-4" /></div>
              <div className="flex-1">
                <div className="font-semibold text-[13px]">Upcoming Event:</div>
                <div className="text-[13px]">{active.upcoming.title} - {active.upcoming.when}</div>
                <div className="text-[12px] text-neutral-500">{active.upcoming.where}</div>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/50 ring-1 ring-black/5 dark:ring-white/5 divide-y divide-black/5 dark:divide-white/5">
            {active.phone && <Field icon={Phone} label="Phone" value={active.phone} accent="#9ca3af" />}
            {active.email && <Field icon={Mail} label="Email" value={active.email} accent="#9ca3af" />}
            {active.home && <Field icon={HomeIcon} label="Home" value={active.home} accent="#9ca3af" map />}
            {active.work && <Field icon={Briefcase} label="Work" value={active.work} accent="#9ca3af" map />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionPill = ({ color, icon: I }: { color: string; icon: any }) => (
  <button className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: color }}>
    <I className="w-4 h-4" />
  </button>
);

const Avatar = ({ c, size }: { c: Contact; size: number }) => {
  if (c.id === 'thanas') {
    return <img src={profilePhoto} alt={c.first} className="rounded-full object-cover ring-1 ring-black/10" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold ring-1 ring-black/10"
      style={{ width: size, height: size, background: c.avatarColor, fontSize: size * 0.4 }}
    >
      {c.first[0]}{c.last[0]}
    </div>
  );
};

const Field = ({ icon: I, label, value, accent, map }: { icon: any; label: string; value: string; accent: string; map?: boolean }) => (
  <div className="flex items-start gap-3 px-4 py-3">
    <I className="w-4 h-4 mt-1" style={{ color: accent }} />
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-[12px] text-neutral-500">{label}:</div>
      <div className="text-[13.5px] whitespace-pre-line">{value}</div>
    </div>
    {map && (
      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-200 to-amber-200 ring-1 ring-black/10 flex items-center justify-center">
        <MapPin className="w-4 h-4 text-emerald-700" />
      </div>
    )}
  </div>
);
