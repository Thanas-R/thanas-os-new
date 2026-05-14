import desktopShot from '@/assets/desktop-screenshot.png';
import { Mac } from '@/components/Mac';

export const MobileFallback = () => {
  return (
    <div className="mobile-fallback">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; cursor: auto !important; }
        .mobile-fallback {
          position: fixed; inset: 0; overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          background: #0a0a0a; color: #fafafa;
          -webkit-font-smoothing: antialiased;
        }
        .mobile-fallback .dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #2a2a2a 1.2px, transparent 1.4px);
          background-size: 22px 22px; z-index: 0; pointer-events: none;
        }
        .mobile-fallback .fade {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(ellipse 55% 55% at 50% 45%, rgba(10,10,10,1) 0%, rgba(10,10,10,0.92) 35%, rgba(10,10,10,0.5) 65%, rgba(10,10,10,0) 90%);
        }
        .mobile-fallback main {
          position: relative; z-index: 2; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 5vh 18px 24px; text-align: center; gap: 16px;transform: translateY(20px);
        }
        .mobile-fallback h1 {
          font-family: 'Fraunces', serif; font-weight: 900;
          font-size: clamp(24px, 6.8vw, 38px); line-height: 1.05;
          letter-spacing: -0.025em; margin: 0; padding: 0 8px; color: #fafafa;
        }
        .mobile-fallback h1 .ital { font-style: italic; font-weight: 400; color: #d8d8d8; }
        .mobile-fallback .lead {
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 3.2vw, 15px);
          font-weight: 500; color: #b8b8b8; max-width: 460px;
          margin: 0; line-height: 1.55;
        }
        .mobile-fallback .desktop-cta {
          font-family: 'Inter', sans-serif; font-size: clamp(12px, 3vw, 14px);
          color: #888; margin-top: 2px;
        }
        .mobile-fallback .desktop-cta .mono {
          font-family: 'JetBrains Mono', monospace; font-size: 0.92em;
          background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 6px; color: #fafafa;
        }
        .mobile-fallback .mac-wrap { width: 100%; max-width: 320px; color: #1a1a1a; display: flex; justify-content: center; }
        .mobile-fallback .mac-wrap svg { width: 100%; height: auto; display: block; }
      `}</style>
      <div className="dots" />
      <div className="fade" />
      <main>
        <h1>
          <span className="ital">the best web iteration of</span>{' '}
          <span>macOS online.</span>
        </h1>

        <p className="lead">
          ThanasOS is a faithful, interactive recreation of macOS, rebuilt from the ground up for the browser.
        </p>

        <div className="mac-wrap">
          <Mac src={desktopShot} width={600} height={500} />
        </div>

        <p className="desktop-cta">
          Open this site on a <span className="mono">desktop</span> for the full experience.
        </p>
      </main>
    </div>
  );
};
