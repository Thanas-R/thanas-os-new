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
      className="block backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass hover:scale-[1.02] transition-transform cursor-pointer"
      style={{
        width: 352,
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase mb-1">
        {greeting}
      </p>
      <h1 className="text-lg font-bold text-foreground leading-tight">
        Thanas R
      </h1>
      <div className="flex items-center gap-1.5 mt-1.5">
        <ExternalLink className="w-3 h-3 text-primary" />
        <p className="text-[11px] text-primary font-medium">
          Visit my main portfolio at thanas.vercel.app
        </p>
      </div>
    </a>
  );
};
