import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface WeatherIconProps {
  size?: number;
  className?: string;
}

/* ─── SUN ─── */
export function SunIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ originX: "24px", originY: "24px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <motion.line key={deg} x1="24" y1="4" x2="24" y2="10" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${deg} 24 24)`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }} />
        ))}
      </motion.g>
      <motion.circle cx="24" cy="24" r="8" fill="#FBBF24" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      <circle cx="24" cy="24" r="8" fill="url(#sunGlow)" opacity="0.4" />
    </svg>
  );
}

/* ─── MOON ─── */
export function MoonIcon({ size = 48, className }: WeatherIconProps) {
  const stars = [
    { cx: 34, cy: 10, d: 0 }, { cx: 38, cy: 18, d: 0.5 },
    { cx: 30, cy: 6, d: 1 }, { cx: 40, cy: 12, d: 1.5 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <motion.path d="M28 8a14 14 0 1 0 0 28A14 14 0 0 1 28 8z" fill="#CBD5E1" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 4, repeat: Infinity }} />
      <path d="M28 8a14 14 0 1 0 0 28A14 14 0 0 1 28 8z" fill="url(#moonShade)" opacity="0.3" />
      {stars.map((s) => (
        <motion.circle key={`${s.cx}-${s.cy}`} cx={s.cx} cy={s.cy} r="1" fill="white" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: s.d }} />
      ))}
    </svg>
  );
}

/* ─── CLOUD ─── */
export function CloudIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <motion.g animate={{ x: [0, 2, 0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="24" cy="26" rx="14" ry="8" fill="#94A3B8" />
        <circle cx="18" cy="22" r="7" fill="#CBD5E1" />
        <circle cx="28" cy="20" r="9" fill="#CBD5E1" />
      </motion.g>
    </svg>
  );
}

/* ─── RAIN ─── */
export function RainIcon({ size = 48, className }: WeatherIconProps) {
  const drops = [
    { x: 16, d: 0 }, { x: 22, d: 0.3 }, { x: 28, d: 0.6 }, { x: 34, d: 0.15 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <ellipse cx="24" cy="18" rx="14" ry="8" fill="#94A3B8" />
      <circle cx="18" cy="14" r="7" fill="#CBD5E1" />
      {drops.map((drop) => (
        <motion.line key={drop.x} x1={drop.x} y1="28" x2={drop.x - 2} y2="36" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: drop.d }} />
      ))}
    </svg>
  );
}

/* ─── HEAVY RAIN ─── */
export function HeavyRainIcon({ size = 48, className }: WeatherIconProps) {
  const drops = [
    { x: 14, d: 0 }, { x: 19, d: 0.15 }, { x: 24, d: 0.3 },
    { x: 29, d: 0.1 }, { x: 34, d: 0.4 }, { x: 37, d: 0.25 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <ellipse cx="24" cy="16" rx="14" ry="8" fill="#64748B" />
      <circle cx="18" cy="12" r="7" fill="#94A3B8" />
      {drops.map((drop) => (
        <motion.line key={drop.x} x1={drop.x} y1="26" x2={drop.x - 3} y2="38" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: drop.d }} />
      ))}
    </svg>
  );
}

/* ─── SNOW ─── */
export function SnowIcon({ size = 48, className }: WeatherIconProps) {
  const flakes = [
    { x: 16, d: 0 }, { x: 22, d: 0.5 }, { x: 28, d: 0.2 },
    { x: 34, d: 0.7 }, { x: 19, d: 1.0 }, { x: 31, d: 0.4 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <ellipse cx="24" cy="16" rx="14" ry="8" fill="#94A3B8" />
      <circle cx="18" cy="12" r="7" fill="#CBD5E1" />
      {flakes.map((f, i) => (
        <motion.circle key={i} cx={f.x} cy="30" r="2" fill="white" animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: f.d }} />
      ))}
    </svg>
  );
}

/* ─── THUNDER ─── */
export function ThunderIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <ellipse cx="24" cy="16" rx="14" ry="8" fill="#64748B" />
      <circle cx="18" cy="12" r="7" fill="#94A3B8" />
      <motion.polygon points="24,20 20,30 24,30 22,40 30,28 26,28 28,20" fill="#FBBF24" animate={{ opacity: [1, 0, 1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.polygon points="24,20 20,30 24,30 22,40 30,28 26,28 28,20" fill="white" opacity="0.5" animate={{ opacity: [0.5, 0, 0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

/* ─── FOG ─── */
export function FogIcon({ size = 48, className }: WeatherIconProps) {
  const lines = [
    { y: 16, w: 28, d: 0 }, { y: 22, w: 32, d: 0.5 },
    { y: 28, w: 24, d: 1.0 }, { y: 34, w: 30, d: 1.5 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      {lines.map((l) => (
        <motion.line key={l.y} x1={(48 - l.w) / 2} y1={l.y} x2={(48 + l.w) / 2} y2={l.y} stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" animate={{ x: [-3, 3, -3], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: l.d }} />
      ))}
    </svg>
  );
}

/* ─── PARTLY CLOUDY ─── */
export function PartlyCloudyIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ originX: "16px", originY: "16px" }}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line key={deg} x1="16" y1="6" x2="16" y2="10" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" transform={`rotate(${deg} 16 16)`} />
        ))}
      </motion.g>
      <circle cx="16" cy="16" r="6" fill="#FBBF24" />
      <motion.g animate={{ x: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <ellipse cx="28" cy="28" rx="12" ry="7" fill="#94A3B8" />
        <circle cx="23" cy="24" r="6" fill="#CBD5E1" />
        <circle cx="31" cy="22" r="7" fill="#CBD5E1" />
      </motion.g>
    </svg>
  );
}

/* ─── DRIZZLE ─── */
export function DrizzleIcon({ size = 48, className }: WeatherIconProps) {
  const drops = [
    { x: 18, d: 0 }, { x: 26, d: 0.4 }, { x: 34, d: 0.8 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("", className)}>
      <ellipse cx="24" cy="18" rx="14" ry="8" fill="#94A3B8" />
      <circle cx="18" cy="14" r="7" fill="#CBD5E1" />
      {drops.map((drop) => (
        <motion.circle key={drop.x} cx={drop.x} cy="30" r="1.5" fill="#93C5FD" animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: drop.d }} />
      ))}
    </svg>
  );
}

/* ─── Weather code to icon mapper ─── */
export const getAnimatedWeatherIcon = (code: number, size = 24) => {
  if (code <= 0) return <SunIcon size={size} />;
  if (code <= 1) return <SunIcon size={size} />;
  if (code <= 2) return <PartlyCloudyIcon size={size} />;
  if (code <= 3) return <CloudIcon size={size} />;
  if (code <= 48) return <FogIcon size={size} />;
  if (code <= 55) return <DrizzleIcon size={size} />;
  if (code <= 62) return <RainIcon size={size} />;
  if (code <= 65) return <HeavyRainIcon size={size} />;
  if (code <= 75) return <SnowIcon size={size} />;
  if (code <= 82) return <RainIcon size={size} />;
  return <ThunderIcon size={size} />;
};
