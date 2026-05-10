import { useEffect, useRef } from 'react';
import './utility-clock.css';

/**
 * macOS-style Utility Clock — direct port of the CodePen JS.
 * Outer chassis #000, inner dial white, black numbers/lines/hands, orange second hand.
 * Configured per user spec:
 *   hour-style-text · hour-text-style-small · hour-display-style-all
 *   minute-style-line · minute-display-style-coarse · minute-text-style-none
 *   hand-style-normal
 */
export const UtilityClockWidget = ({ size = 200 }: { size?: number }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const dynamic = root.querySelector('.dynamic') as HTMLDivElement;
    if (!dynamic) return;
    dynamic.innerHTML = '';

    const div = (className: string, html = '') => {
      const el = document.createElement('div');
      el.className = className;
      el.innerHTML = html;
      return el;
    };
    const rotate = (el: HTMLElement, second: number) => {
      el.style.transform = `rotate(${second * 6}deg)`;
    };
    const anchor = (el: HTMLElement, rotation: number) => {
      const a = div('anchor');
      rotate(a, rotation);
      a.appendChild(el);
      dynamic.appendChild(a);
    };

    // Minute lines + (hidden) minute text — quarter-step granularity
    for (let i = 0.25; i <= 60; i += 0.25) {
      const klass = i % 5 === 0 ? 'major' : i % 1 === 0 ? 'whole' : 'part';
      anchor(div('element minute-line ' + klass), i);
      if (i % 5 === 0) {
        const text = div('anchor minute-text ' + klass);
        text.appendChild(div('expand content', (i < 10 ? '0' : '') + i));
        rotate(text, -i);
        anchor(text, i);
      }
    }
    // Hour pills (hidden by hour-style-text) + hour numerals
    for (let i = 1; i <= 12; i++) {
      const klass = 'hour-item hour-' + i;
      anchor(div('element hour-pill ' + klass), i * 5);
      const text = div('anchor hour-text ' + klass);
      text.appendChild(div('expand content', String(i)));
      rotate(text, -i * 5);
      anchor(text, i * 5);
    }

    let raf = 0;
    const animate = () => {
      const now = new Date();
      const t =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds() +
        now.getMilliseconds() / 1000;
      if (secRef.current) rotate(secRef.current, t);
      if (minRef.current) rotate(minRef.current, t / 60);
      if (hourRef.current) rotate(hourRef.current, t / 60 / 12);
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Native dial radius is ~150px (longest hand 137px). The inner white circle of the
  // chassis sits at inset 4% (radius ~ size*0.46). Scale the clock so the second hand
  // (137 native px) lands inside that radius with a small margin.
  // 137 * scale <= size*0.46 - 6  → scale <= (size*0.46 - 6) / 137
  const innerRadius = size * 0.46 - 6;
  const NATIVE = 150; // notional radius for hand length
  const scale = Math.min(1.05, innerRadius / 137);
  void NATIVE;

  return (
    <div className="utility-clock-shell" style={{ width: size, height: size }}>
      <div className="dial" />
      <div
        ref={rootRef}
        className="utility-clock hour-style-text hour-text-style-large hour-display-style-all minute-style-line minute-display-style-coarse minute-text-style-none hand-style-normal"
      >
        <div className="clock" style={{ transform: `translate(-50%,-50%) scale(${scale.toFixed(3)})` }}>
          <div className="centre">
            <div className="dynamic" />
            <div className="anchor hour" ref={hourRef}>
              <div className="element thin-hand" />
              <div className="element fat-hand" />
            </div>
            <div className="anchor minute" ref={minRef}>
              <div className="element thin-hand" />
              <div className="element fat-hand minute-hand" />
            </div>
            <div className="anchor second" ref={secRef}>
              <div className="element second-hand-front" />
              <div className="element second-hand-back" />
            </div>
            <div className="element circle-1 round" style={{ transform: 'translate(-50%,-50%)' }} />
            <div className="element circle-2 round" style={{ transform: 'translate(-50%,-50%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
