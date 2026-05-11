import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

let filterMounted = false;
const ensureFilter = () => {
  if (filterMounted || typeof document === 'undefined') return;
  filterMounted = true;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  wrap.innerHTML = `
    <svg width="0" height="0" aria-hidden="true">
      <filter id="apple-slider-lens" x="-50%" y="-50%" width="200%" height="200%">
        <feImage x="0" y="0" result="normalMap" xlink:href="data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><radialGradient id='m' cx='50%' cy='50%' r='75%'><stop offset='0%' stop-color='rgb(128,128,255)'/><stop offset='90%' stop-color='rgb(255,255,255)'/></radialGradient><rect width='100%' height='100%' fill='url(%23m)'/></svg>`
        )}"/>
        <feDisplacementMap in="SourceGraphic" in2="normalMap" scale="-180" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>`;
  document.body.appendChild(wrap);
};

interface AppleSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (v: number) => void;
  className?: string;
}

export const AppleSlider = ({
  value, min = 0, max = 100, step = 1, onChange, className,
}: AppleSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => { ensureFilter(); }, []);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleMove = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    let v = min + p * (max - min);
    if (step) v = Math.round(v / step) * step;
    onChange?.(Math.max(min, Math.min(max, v)));
  }, [min, max, step, onChange]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => handleMove(e.clientX);
    const tmove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX); };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', tmove, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', tmove);
      window.removeEventListener('touchend', up);
    };
  }, [dragging, handleMove]);

  // Sized 30% smaller than the reference: 7px track, 46x30 thumb
  return (
    <div
      ref={trackRef}
      onMouseDown={(e) => { setDragging(true); handleMove(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      className={cn('relative w-full select-none cursor-pointer', className)}
      style={{ height: 7 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(214,214,218,0.85)' }}
      />
      <div
        className="absolute top-0 bottom-0 left-0 rounded-full"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(117deg,#49a3fc,#3681ee)',
        }}
      />
      <div
        className="absolute top-1/2 rounded-full overflow-hidden"
        style={{
          left: `${pct}%`,
          transform: `translate(-50%, -50%) ${dragging ? 'scaleY(0.96) scaleX(1.08)' : ''}`,
          width: 30,
          height: 20,
          background: dragging ? 'transparent' : '#fff',
          boxShadow: dragging ? 'none' : '0 1px 6px rgba(0,30,63,0.1), 0 0 2px rgba(0,9,20,0.1)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        }}
      >
        {dragging && (
          <>
            <div
              className="absolute inset-0"
              style={{ backdropFilter: 'blur(0.6px)', WebkitBackdropFilter: 'blur(0.6px)', filter: 'url(#apple-slider-lens)' }}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  'inset 1px 1px 0 rgba(69,168,243,0.2), inset 1px 3px 0 rgba(28,63,90,0.05), inset 0 0 22px rgba(255,255,255,0.6), inset -1px -1px 0 rgba(69,168,243,0.12)',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
