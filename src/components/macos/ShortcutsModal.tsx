import { FrostedModal } from './FrostedModal';

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: '⌘ K', action: 'Open Spotlight Search' },
  { keys: '⌘ N', action: 'New Window (in supported apps)' },
  { keys: '⌘ T', action: 'New Tab (Safari)' },
  { keys: '⌘ W', action: 'Close Window / Tab' },
  { keys: '⌘ M', action: 'Minimize Active Window' },
  { keys: '⌃ ⌘ F', action: 'Enter Full Screen' },
  { keys: '⌘ Q', action: 'Quit Focused App' },
  { keys: 'F11', action: 'Show Desktop' },
  { keys: 'Esc', action: 'Close Spotlight / Modal' },
  { keys: '⌘ ,', action: 'Open Settings' },
];

export const ShortcutsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <FrostedModal open={open} onClose={onClose} title="Keyboard Shortcuts" width={520}>
    <div className="grid grid-cols-1 gap-2">
      {SHORTCUTS.map(s => (
        <div key={s.keys} className="flex items-center justify-between rounded-xl px-3 py-2 bg-white/5">
          <span className="text-sm text-white/85">{s.action}</span>
          <kbd className="font-mono text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15">{s.keys}</kbd>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-white/50">Tip: Cmd on macOS · Ctrl on Windows.</p>
  </FrostedModal>
);
