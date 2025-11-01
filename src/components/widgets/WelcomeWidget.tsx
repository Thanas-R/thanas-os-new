export const WelcomeWidget = () => {
  return (
    <div 
      className="fixed left-8 top-20 backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass z-[1] max-w-[280px]"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <div className="mb-3 flex justify-center">
        <div className="text-3xl font-mono text-cyan-400">
          {'</>'}
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-center">
        Hello, I'm Thanas R
      </h1>
      
      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Welcome to my portfolio website.<br />
        Click on any app below to explore more about me
      </p>
    </div>
  );
};
