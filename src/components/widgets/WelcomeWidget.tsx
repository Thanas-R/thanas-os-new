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
      className="block rounded-3xl p-5 hover:scale-[1.02] transition-transform cursor-pointer liquid-glass-card"
      style={{ width: 460 }}
    >
      <p className="text-[13px] text-white/60 font-medium tracking-wide uppercase mb-1">
        {greeting}
      </p>
      <h1 className="text-2xl font-bold text-white leading-tight">Thanas R</h1>
      <p className="text-[13px] text-white/70 mt-1.5 leading-snug">
        Developer & creative problem-solver. Building thoughtful digital experiences with code.
      </p>
      <div className="flex items-center gap-1.5 mt-3">
        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
        <p className="text-[12px] text-blue-400 font-medium">
          Visit my portfolio at thanas.vercel.app
        </p>
      </div>
    </a>
  );
};
