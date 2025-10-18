export const WelcomeWidget = () => {
  return (
    <div 
      className="fixed left-8 top-1/2 -translate-y-1/2 backdrop-blur-macos-heavy rounded-2xl p-5 shadow-macos-glass z-30 max-w-xs animate-slide-in-left"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <div className="mb-4 flex justify-center">
        <div className="text-4xl font-mono text-cyan-400">
          {'</>'}
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-3 text-center">
        Hello, I'm Thanas R
      </h1>
      
      <p className="text-center text-sm text-muted-foreground leading-relaxed">
        Welcome to my portfolio website.<br />
        Click on any app below to explore more about me
      </p>
    </div>
  );
};
