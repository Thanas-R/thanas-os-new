import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NOTIFS = [
  { app: 'Mail', title: 'Parts Express', body: 'Happy Memorial Day! Tiered Offer — Free shipping on US orders over $50.', when: '38m ago' },
  { app: 'AppleInsider', title: 'New Story', body: 'Elgato intros Stream Deck Mobile app, turning iPhones into live broadcast controllers.', when: '53m ago' },
  { app: 'Updates', title: 'App update available', body: 'There is 1 App update available.', when: '9:19 AM' },
  { app: 'Calendar', title: 'Lunch with team', body: 'Today at 1:00 PM — Cubbon Park', when: 'Today' },
];

export const NotificationCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'today' | 'notif'>('notif');
  const time = new Date();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onDown), 0);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className="fixed top-9 right-3 z-[300] rounded-2xl p-4 text-white"
          style={{
            width: 340,
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'rgba(28,28,32,0.6)',
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Big clock */}
          <div className="text-center mb-3">
            <div className="text-[12px] text-white/70">{time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div className="text-[44px] font-light leading-none mt-1">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-full p-0.5 text-[12px] mb-3">
            {(['today','notif'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1 rounded-full transition ${tab === t ? 'bg-white/20 font-semibold' : 'hover:bg-white/5'}`}
              >{t === 'today' ? 'Today' : 'Notifications'}</button>
            ))}
          </div>

          <div className="space-y-2">
            {NOTIFS.map((n, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between text-[10.5px] uppercase tracking-wide text-white/60">
                  <span>{n.app}</span><span>{n.when}</span>
                </div>
                <div className="text-[13px] font-semibold mt-0.5">{n.title}</div>
                <div className="text-[12px] text-white/75 mt-0.5 leading-snug">{n.body}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
