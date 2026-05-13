import { useState } from 'react';
import { Inbox, Send, Sun, File, Trash, Trash2, Archive, Folder, Filter, Mail, Edit, Bookmark, Search, ChevronsRight, Paperclip } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';

const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta enim ut aliquet lacinia. Integer lobortis varius odio, non pharetra enim pretium non. Integer porttitor, enim id imperdiet tincidunt, nisi sem facilisis arcu, eget lobortis odio ipsum vitae velit. Donec efficitur urna massa. Praesent dictum pulvinar interdum. Donec venenatis bibendum fringilla. Proin nec rhoncus ipsum. Maecenas iaculis purus molestie sapien tristique, tristique consectetur nisl dictum.";

interface MailItem { name: string; subject: string; description: string; time: string; }

const mails: MailItem[] = [
  { name: 'Eddy Bedock', subject: 'Riding in the Oakland Hills', description, time: '9:11 AM' },
  { name: 'Jeff Williams', subject: 'Quarantine haircut', description, time: '8:24 AM' },
  { name: 'Tim Cook', subject: 'Q4 results — internal memo', description, time: 'Yesterday' },
  { name: 'Craig Federighi', subject: 'macOS internal build notes', description, time: 'Yesterday' },
  { name: 'Phil Schiller', subject: 'App Store editorial picks', description, time: 'Mon' },
  { name: 'Susan Prescott', subject: 'WWDC keynote review', description, time: 'Mon' },
  { name: 'Greg Joswiak', subject: 'Marketing review for the week', description, time: 'Sun' },
  { name: 'Jony Ive', subject: 'Industrial design notes', description, time: 'Sat' },
  { name: 'Eddy Cue', subject: 'Apple Music editorial picks', description, time: 'Fri' },
  { name: 'Lisa Jackson', subject: 'Environment report 2025', description, time: 'Thu' },
  { name: 'Jeff Williams', subject: 'Operations sync', description, time: 'Wed' },
];

export const MailApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';
  const [activeIdx, setActiveIdx] = useState(0);
  const active = mails[activeIdx];

  // Mail-style tones (the screenshots show a light app even on dark wallpaper)
  const sidebarBg = dark ? '#1f2123' : 'rgba(245,245,247,0.85)';
  const listBg = dark ? '#2a2c2f' : '#ffffff';
  const mailBg = dark ? '#2a2c2f' : '#ffffff';
  const text = dark ? '#f5f5f7' : '#1c1c1e';
  const sub = dark ? '#a8a8ad' : '#6b7280';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const bar = dark ? '#222426' : '#ffffff';
  const hover = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const numStyle = { background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)', color: dark ? '#bdbdc2' : 'rgba(0,0,0,0.5)' };

  return (
    <div className="h-full w-full grid select-none" style={{ gridTemplateRows: '52px 1fr', color: text, background: bar, fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}>
      {/* Top bar — leave room for traffic lights */}
      <div className="grid border-b" style={{ gridTemplateColumns: '230px 350px 1fr', borderColor: border, background: bar }}>
        <div className="pl-[88px] flex items-center" style={{ background: sidebarBg }} />
        <div className="flex items-center justify-between px-3 border-l" style={{ borderColor: border }}>
          <div>
            <div className="text-[13px] font-semibold leading-tight">Inbox</div>
            <div className="text-[11px]" style={{ color: sub }}>{mails.length} messages, 11 unread</div>
          </div>
          <Filter className="w-4 h-4 opacity-50" />
        </div>
        <div className="flex items-center justify-between px-4 border-l" style={{ borderColor: border }}>
          <div className="flex items-center gap-2">
            {[Mail, Edit, Archive, Trash2, Bookmark].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                style={{ color: text }}
                onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <Icon className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ChevronsRight className="w-4 h-4 opacity-50" />
            <div className="flex items-center gap-1.5 px-3 h-8 rounded-lg border" style={{ borderColor: border, background: dark ? 'rgba(255,255,255,0.04)' : '#fff' }}>
              <Search className="w-3.5 h-3.5 opacity-50" />
              <input placeholder="Search" className="bg-transparent text-[12px] outline-none w-44" style={{ color: text }} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid min-h-0" style={{ gridTemplateColumns: '230px 350px 1fr' }}>
        {/* Sidebar */}
        <div className="overflow-auto thin-scrollbar py-3 px-2" style={{ background: sidebarBg, borderRight: `1px solid ${border}` }}>
          <Section title="Favorites" sub={sub}>
            <SideItem icon={<Inbox className="w-4 h-4" />} name="Inbox" badge="11" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Send className="w-4 h-4" />} name="Sent" hover={hover} numStyle={numStyle} />
          </Section>
          <Section title="Smart Mailboxes" sub={sub}>
            <SideItem icon={<Sun className="w-4 h-4" />} name="Today" badge="2" gray hover={hover} numStyle={numStyle} />
            <SideItem icon={<Sun className="w-4 h-4" />} name="Important" gray hover={hover} numStyle={numStyle} />
          </Section>
          <Section title="iCloud" sub={sub}>
            <SideItem icon={<Inbox className="w-4 h-4" />} name="Inbox" badge="11" hover={hover} numStyle={numStyle} />
            <SideItem icon={<File className="w-4 h-4" />} name="Drafts" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Send className="w-4 h-4" />} name="Sent" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Trash className="w-4 h-4" />} name="Junk" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Trash2 className="w-4 h-4" />} name="Trash" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Archive className="w-4 h-4" />} name="Archive" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Folder className="w-4 h-4" />} name="Keepers" badge="1" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Folder className="w-4 h-4" />} name="Receipts" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Folder className="w-4 h-4" />} name="School" hover={hover} numStyle={numStyle} />
            <SideItem icon={<Folder className="w-4 h-4" />} name="Travel" hover={hover} numStyle={numStyle} />
          </Section>
        </div>

        {/* Inbox list */}
        <div className="overflow-auto thin-scrollbar px-2 py-2" style={{ background: listBg, borderRight: `1px solid ${border}` }}>
          {mails.map((m, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="w-full text-left rounded-lg p-2.5 grid mb-1 transition-colors"
                style={{
                  gridTemplateColumns: '20px 1fr',
                  background: isActive ? (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : 'transparent',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = hover; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex justify-center pt-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#2f7df7' }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold truncate">{m.name}</div>
                      <div className="text-[12.5px] truncate" style={{ color: sub }}>{m.subject}</div>
                    </div>
                    <div className="text-[11px] flex flex-col items-end gap-1" style={{ color: sub }}>
                      <span>{m.time}</span>
                      <Paperclip className="w-3 h-3 opacity-70" />
                    </div>
                  </div>
                  <p className="text-[11.5px] mt-1 line-clamp-2" style={{ color: sub }}>{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mail content */}
        <div className="overflow-auto thin-scrollbar p-6" style={{ background: mailBg }}>
          <div className="grid items-start gap-4 pb-3 border-b" style={{ gridTemplateColumns: '48px 1fr auto', borderColor: border }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(active.name)}`} alt="" className="w-12 h-12 rounded-full" />
            <div className="min-w-0">
              <div className="text-[14px] font-semibold truncate">{active.name}</div>
              <div className="text-[12px] truncate" style={{ color: sub }}>{active.subject}</div>
              <div className="text-[12px] truncate" style={{ color: sub }}>To: thanas5.rd@gmail.com</div>
            </div>
            <div className="text-right">
              <div className="text-[11px]" style={{ color: sub }}>{active.time}</div>
              <Paperclip className="w-3.5 h-3.5 mt-1 opacity-70 inline-block" />
            </div>
          </div>
          <div className="pt-5 text-[14px] leading-7 whitespace-pre-line" style={{ color: text }}>
            {`Dear Thanas,\n\n${description}\n\nKindest Regards,\n${active.name}`}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <div className="pb-3">
    <div className="text-[11px] px-3 mb-1" style={{ color: sub }}>{title}</div>
    <div>{children}</div>
  </div>
);

const SideItem = ({ icon, name, badge, gray, hover, numStyle }: { icon: React.ReactNode; name: string; badge?: string; gray?: boolean; hover: string; numStyle: React.CSSProperties }) => (
  <button
    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors"
    onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    <span className="flex items-center gap-2">
      <span style={{ color: gray ? 'rgba(127,127,127,0.7)' : '#2f7df7' }}>{icon}</span>
      <span className="text-[13.5px] opacity-85">{name}</span>
    </span>
    {badge && (
      <span className="text-[10px] px-1.5 h-[18px] min-w-[20px] inline-flex items-center justify-center rounded-full" style={numStyle}>{badge}</span>
    )}
  </button>
);
