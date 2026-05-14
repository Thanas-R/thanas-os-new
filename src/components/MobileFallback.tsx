import desktopShot from '@/assets/desktop-screenshot.png';

export const MobileFallback = () => {
  return (
    <div className="mobile-fallback">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; cursor: auto !important; }
        .mobile-fallback {
          position: fixed; inset: 0; overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          background: #fafafa; color: #0a0a0a;
          -webkit-font-smoothing: antialiased;
        }
        @media (prefers-color-scheme: dark) {
          .mobile-fallback { background: #0a0a0a; color: #fafafa; }
          .mobile-fallback .dots { background-image: radial-gradient(circle, #2a2a2a 1.2px, transparent 1.4px) !important; }
          .mobile-fallback .fade { background: radial-gradient(ellipse 55% 50% at 50% 50%, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 35%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0) 85%) !important; }
          .mobile-fallback .lead { color: #b8b8b8 !important; }
          .mobile-fallback .kicker, .mobile-fallback .sub { color: #888 !important; }
          .mobile-fallback h1 .ital { color: #d8d8d8 !important; }
          .mobile-fallback .imac-frame { background: #1a1a1a !important; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1) !important; }
          .mobile-fallback .imac-stand { background: linear-gradient(180deg,#2a2a2a,#1a1a1a) !important; }
          .mobile-fallback .imac-base { background: #2a2a2a !important; }
        }
        .mobile-fallback .dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #c8c8c8 1.2px, transparent 1.4px);
          background-size: 22px 22px; z-index: 0; pointer-events: none;
        }
        .mobile-fallback .fade {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(ellipse 60% 55% at 50% 50%, rgba(250,250,250,1) 0%, rgba(250,250,250,0.92) 35%, rgba(250,250,250,0.5) 65%, rgba(250,250,250,0) 90%);
        }
        .mobile-fallback main {
          position: relative; z-index: 2; height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 24px 20px; text-align: center; gap: 22px;
        }
        .mobile-fallback .kicker {
          font-family: 'Caveat', cursive; font-size: clamp(22px, 5vw, 30px);
          color: #6b6b6b; transform: rotate(-3deg); display: inline-block;
        }
        .mobile-fallback h1 {
          font-family: 'Fraunces', serif; font-weight: 900;
          font-size: clamp(30px, 8vw, 46px); line-height: 1.02;
          letter-spacing: -0.025em; margin: 0; padding: 0 8px;
        }
        .mobile-fallback h1 .ital { font-style: italic; font-weight: 400; color: #2a2a2a; }
        .mobile-fallback h1 .accent {
          background: linear-gradient(180deg, transparent 62%, #fff177 62%, #fff177 92%, transparent 92%);
          padding: 0 4px;
        }
        .mobile-fallback .lead {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 3.6vw, 17px);
          font-weight: 500; color: #4a4a4a; max-width: 460px;
          margin: 0; line-height: 1.55;
        }
        .mobile-fallback .lead .mono {
          font-family: 'JetBrains Mono', monospace; font-size: 0.88em;
          background: rgba(127,127,127,0.18); padding: 2px 7px; border-radius: 6px;
        }

        /* iMac mockup */
        .imac { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 360px; }
        .imac-frame {
          width: 100%; aspect-ratio: 16/10; background: #e5e5e5;
          border-radius: 14px; padding: 10px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6);
          position: relative;
        }
        .imac-screen {
          width: 100%; height: 100%; border-radius: 6px; overflow: hidden;
          background: #000; position: relative;
        }
        .imac-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .imac-stand {
          width: 28%; height: 16px; background: linear-gradient(180deg,#dcdcdc,#c4c4c4);
          margin-top: -2px; clip-path: polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%);
        }
        .imac-base {
          width: 38%; height: 6px; background: #c4c4c4; border-radius: 0 0 8px 8px;
        }
      `}</style>
      <div className="dots" />
      <div className="fade" />
      <main>
        <span className="kicker">hey there...</span>
        <h1>
          <span className="ital">wanna experience</span>{' '}
          <span className="accent">thanasOS?</span>
        </h1>

        <div className="imac">
          <div className="imac-frame">
            <div className="imac-screen">
              <img src={desktopShot} alt="ThanasOS desktop" />
            </div>
          </div>
          <div className="imac-stand" />
          <div className="imac-base" />
        </div>

        <p className="lead">
          The <strong>best web iteration of macOS online</strong> — open this link on a{' '}
          <span className="mono">desktop</span> to step inside the full experience.
        </p>
      </main>
    </div>
  );
};
