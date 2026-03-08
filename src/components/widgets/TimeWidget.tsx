import { useState, useEffect } from 'react';

export const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const hourMarkers = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="rounded-2xl shadow-macos-glass w-40 h-40 flex items-center justify-center overflow-hidden"
      style={{
        background: 'hsl(0 0% 8%)',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <div className="relative w-32 h-32">
        {/* Clock face */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(0 0% 98%) 0%, hsl(0 0% 92%) 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* City label */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-[7px] tracking-widest font-medium"
            style={{ top: '30%', color: 'hsl(0 0% 45%)' }}
          >
            BLR
          </div>

          {/* Minute tick marks */}
          {minuteMarkers.map((i) => {
            const isHour = i % 5 === 0;
            if (isHour) return null;
            return (
              <div
                key={`tick-${i}`}
                className="absolute left-1/2 top-0 -translate-x-1/2 origin-[center_64px]"
                style={{ transform: `translateX(-50%) rotate(${i * 6}deg)` }}
              >
                <div
                  className="w-[0.5px] h-[2px] bg-foreground/20 mx-auto"
                />
              </div>
            );
          })}

          {/* Hour numbers */}
          {hourMarkers.map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const radius = 48;
            const x = 50 + (radius * Math.cos(angle) / 64) * 50;
            const y = 50 + (radius * Math.sin(angle) / 64) * 50;
            return (
              <div
                key={num}
                className="absolute font-semibold"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: num === 12 || num === 6 || num === 3 || num === 9 ? '13px' : '10px',
                  color: 'hsl(0 0% 10%)',
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Hour hand */}
          <div
            className="absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${hourDeg}deg)`,
              width: '3px',
              height: '28px',
              background: 'hsl(0 0% 10%)',
              borderRadius: '2px',
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
              width: '2px',
              height: '38px',
              background: 'hsl(0 0% 10%)',
              borderRadius: '2px',
            }}
          />

          {/* Second hand */}
          <div
            className="absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              width: '1px',
              height: '42px',
              background: 'hsl(25 100% 55%)',
              borderRadius: '1px',
              transition: 'none',
            }}
          />
          {/* Second hand tail */}
          <div
            className="absolute left-1/2 top-1/2 origin-top"
            style={{
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              width: '1px',
              height: '10px',
              background: 'hsl(25 100% 55%)',
              borderRadius: '1px',
              transition: 'none',
            }}
          />

          {/* Center dot */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: 'hsl(25 100% 55%)' }}
          />
        </div>
      </div>
    </div>
  );
};
