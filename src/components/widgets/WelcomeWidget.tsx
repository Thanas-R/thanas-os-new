export const WelcomeWidget = () => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const istNow = new Date(utc + istOffset);
  const hour = istNow.getHours();

  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div
      className="backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass"
      style={{
        width: 210,
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
      <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
        Click any app in the dock to explore my portfolio.
      </p>
    </div>
  );
};
