import { Github, Linkedin, Mail, Coffee } from 'lucide-react';
import { FrostedModal } from './FrostedModal';

export const HelpModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <FrostedModal open={open} onClose={onClose} title="ThanasOS Help" width={520}>
    <p className="text-sm text-white/80 leading-relaxed">
      Welcome to <span className="font-semibold">ThanasOS</span> — a macOS-themed interactive
      portfolio. Click any app in the Dock or open Launchpad to explore. Hit <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">⌘K</kbd> to
      summon Spotlight.
    </p>

    <div className="mt-5">
      <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Get in touch</p>
      <div className="grid grid-cols-1 gap-2">
        <a href="https://github.com/Thanas-R" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10">
          <Github className="w-4 h-4" /><span className="text-sm">github.com/Thanas-R</span>
        </a>
        <a href="https://www.linkedin.com/in/thanasr/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10">
          <Linkedin className="w-4 h-4" /><span className="text-sm">linkedin.com/in/thanasr</span>
        </a>
        <a href="mailto:thanasr.work@gmail.com" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10">
          <Mail className="w-4 h-4" /><span className="text-sm">thanasr.work@gmail.com</span>
        </a>
      </div>
    </div>

    <div className="mt-5 p-3 rounded-xl bg-white/5 text-xs text-white/70">
      <div className="flex items-center gap-2 mb-1"><Coffee className="w-3.5 h-3.5" /><b>Easter eggs</b></div>
      <div className="space-y-1.5 mt-1.5">
        <div>· The <b>Trash</b> doesn't just delete things. Click it.</div>
        <div>· The Terminal has opinions about <i>sandwiches</i>. And cheat codes. And chai.</div>
        <div>· Try <code className="px-1 bg-white/10 rounded">matrix</code>, <code className="px-1 bg-white/10 rounded">do a barrel roll</code>, or <code className="px-1 bg-white/10 rounded">42</code> in Terminal.</div>
        <div>· Some Finder folders have <i>more</i> files than they look. Peek inside hidden ones.</div>
        <div>· The <b>Calendar</b> widget is clickable. So is everything else, basically.</div>
        <div>· Type <code className="px-1 bg-white/10 rounded">rickroll</code> if you trust me. (You shouldn't.)</div>
        <div>· There's a <code className="px-1 bg-white/10 rounded">.secrets</code> folder. Find it.</div>
        <div>· Run <code className="px-1 bg-white/10 rounded">hack &lt;target&gt;</code> in Terminal for instant l33t status.</div>
        div>· Type 67 in the Calculator.</div>
      </div>
    </div>
  </FrostedModal>
);
