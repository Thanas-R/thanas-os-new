import { ExternalLink } from 'lucide-react';

export const WelcomeWidget = () => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const istNow = new Date(utc + istOffset);
  const hour = istNow.getHours();

  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <a
      href="https://thanas.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl p-4 hover:scale-[1.02] transition-transform cursor-pointer liquid-glass-card"
      style={{ width: 300 }}
    >
      <p className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1">
        {greeting}
      </p>
      <h1 className="text-lg font-bold text-white leading-tight">Thanas R</h1>
      <p className="text-[11px] text-white/70 mt-1 leading-snug line-clamp-2">
        Developer & creative problem-solver. Building thoughtful digital experiences.
      </p>
      <div className="flex items-center gap-1 mt-2">
        <ExternalLink className="w-3 h-3 text-blue-400" />
        <p className="text-[10px] text-blue-400 font-medium truncate">thanas.vercel.app</p>
      </div>
    </a>
  );
};
