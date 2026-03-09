import { useEffect, useState } from "react";

export const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = time.getTime() + time.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + istOffset);

  const hours = istTime.getHours() % 12;
  const minutes = istTime.getMinutes();
  const seconds = istTime.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 42;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { num, x, y };
  });

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const outerR = 35;
    const innerR = isHour ? 32 : 33.5;
    return {
      x1: 50 + innerR * Math.cos(angle),
      y1: 50 + innerR * Math.sin(angle),
      x2: 50 + outerR * Math.cos(angle),
      y2: 50 + outerR * Math.sin(angle),
      isHour,
    };
  });

  return (
    <div
      className="rounded-2xl shadow-macos-glass backdrop-blur-macos flex items-center justify-center overflow-hidden"
      style={{
        width: 172,
        height: 172,
        background: 'hsl(var(--macos-window-bg))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-[140px] h-[140px]">
        <circle cx="50" cy="50" r="48" fill="hsl(0 0% 96%)" stroke="hsl(0 0% 80%)" strokeWidth="0.5" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="hsl(0 0% 20%)" strokeWidth={t.isHour ? 1 : 0.3} strokeLinecap="round" />
        ))}
        {numbers.map((n) => (
          <text key={n.num} x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fill="hsl(0 0% 10%)" fontSize={[12, 3, 6, 9].includes(n.num) ? "9" : "7"} fontWeight="600" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif">
            {n.num}
          </text>
        ))}
        <text x="50" y="65" textAnchor="middle" fill="hsl(0 0% 50%)" fontSize="5" fontWeight="500" letterSpacing="0.1em" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif">BLR</text>
        <line x1="50" y1="50" x2={50 + 20 * Math.cos((hourDeg - 90) * Math.PI / 180)} y2={50 + 20 * Math.sin((hourDeg - 90) * Math.PI / 180)} stroke="hsl(0 0% 10%)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2={50 + 28 * Math.cos((minuteDeg - 90) * Math.PI / 180)} y2={50 + 28 * Math.sin((minuteDeg - 90) * Math.PI / 180)} stroke="hsl(0 0% 10%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={50 - 8 * Math.cos((secondDeg - 90) * Math.PI / 180)} y1={50 - 8 * Math.sin((secondDeg - 90) * Math.PI / 180)} x2={50 + 32 * Math.cos((secondDeg - 90) * Math.PI / 180)} y2={50 + 32 * Math.sin((secondDeg - 90) * Math.PI / 180)} stroke="hsl(25 100% 55%)" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="50" cy="50" r="2" fill="hsl(25 100% 55%)" />
        <circle cx="50" cy="50" r="0.8" fill="hsl(0 0% 96%)" />
      </svg>
    </div>
  );
};

