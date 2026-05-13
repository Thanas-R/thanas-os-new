import { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSun, Sun, Moon, CloudMoon, CloudDrizzle, CloudLightning, CloudSnow, Wind } from 'lucide-react';

interface CurrentWeather {
  temp: number;
  feels_like: number;
  weather_code: number;
  is_day: number;
  high: number;
  low: number;
}

interface HourSlot {
  hour: string;
  temp: number;
  code: number;
  is_day: number;
  isSunset?: boolean;
}

const codeToCondition = (code: number, isDay: number) => {
  // Open-Meteo WMO weather codes
  if (code === 0) return { label: isDay ? 'Sunny' : 'Clear', kind: 'sun' };
  if (code <= 2) return { label: 'Partly Cloudy', kind: 'partly' };
  if (code === 3) return { label: 'Cloudy', kind: 'cloud' };
  if (code <= 49) return { label: 'Foggy', kind: 'cloud' };
  if (code <= 57) return { label: 'Drizzle', kind: 'drizzle' };
  if (code <= 67) return { label: 'Rain', kind: 'rain' };
  if (code <= 77) return { label: 'Snow', kind: 'snow' };
  if (code <= 82) return { label: 'Showers', kind: 'rain' };
  if (code <= 86) return { label: 'Snow Showers', kind: 'snow' };
  if (code <= 99) return { label: 'Thunderstorm', kind: 'storm' };
  return { label: '—', kind: 'cloud' };
};

const HourIcon = ({ kind, isDay, sunset }: { kind: string; isDay: number; sunset?: boolean }) => {
  const cls = 'w-5 h-5';
  if (sunset) {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none">
        <circle cx="12" cy="14" r="4" fill="#FFC53D" />
        <path d="M2 19h20" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 8V5M5 11l-2-2M19 11l2-2" stroke="#FFC53D" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 18l3-3 3 3" stroke="#FFC53D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (kind === 'sun') return isDay ? <Sun className={cls} fill="#FFC53D" stroke="#FFC53D" /> : <Moon className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'partly') return isDay ? <CloudSun className={cls} fill="#fff" stroke="#fff" /> : <CloudMoon className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'cloud') return <Cloud className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'drizzle') return <CloudDrizzle className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'rain') return <CloudRain className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'snow') return <CloudSnow className={cls} fill="#fff" stroke="#fff" />;
  if (kind === 'storm') return <CloudLightning className={cls} fill="#fff" stroke="#fff" />;
  return <Wind className={cls} stroke="#fff" />;
};

const pickGradient = (isDay: number, kind: string) => {
  if (!isDay) return 'linear-gradient(140deg, #0b1d3a 0%, #1a3a6b 60%, #2c5a96 100%)';
  if (kind === 'storm') return 'linear-gradient(140deg, #2a3140 0%, #3d4456 100%)';
  if (kind === 'rain' || kind === 'drizzle') return 'linear-gradient(140deg, #4a6178 0%, #6b87a3 100%)';
  if (kind === 'cloud') return 'linear-gradient(140deg, #6e7e90 0%, #8a9bae 100%)';
  if (kind === 'partly') return 'linear-gradient(140deg, #3a7bc4 0%, #6ba8e2 100%)';
  return 'linear-gradient(140deg, #1f6fc7 0%, #4ea0e6 60%, #7fc1f0 100%)';
};

export const BengaluruWeatherWidget = () => {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hours, setHours] = useState<HourSlot[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,apparent_temperature,is_day,weather_code&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,sunset&timezone=Asia%2FKolkata&forecast_days=2';
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        const cur = j.current;
        const daily = j.daily;
        setCurrent({
          temp: Math.round(cur.temperature_2m),
          feels_like: Math.round(cur.apparent_temperature),
          weather_code: cur.weather_code,
          is_day: cur.is_day,
          high: Math.round(daily.temperature_2m_max[0]),
          low: Math.round(daily.temperature_2m_min[0]),
        });

        const now = new Date();
        const idxNow = j.hourly.time.findIndex((t: string) => new Date(t) >= now);
        const start = idxNow > 0 ? idxNow : 0;
        const sunsetISO = daily.sunset?.[0] as string;
        const sunsetDate = sunsetISO ? new Date(sunsetISO) : null;

        const slots: HourSlot[] = [];
        for (let i = 0; i < 5; i++) {
          const k = start + i;
          const t = new Date(j.hourly.time[k]);
          slots.push({
            hour: `${t.getHours()}${t.getHours() >= 12 ? 'PM' : 'AM'}`.replace(/^0/, '12').replace(/^(\d+)PM/, (_, h) => `${((+h) % 12) || 12}PM`).replace(/^(\d+)AM/, (_, h) => `${((+h) % 12) || 12}AM`),
            temp: Math.round(j.hourly.temperature_2m[k]),
            code: j.hourly.weather_code[k],
            is_day: j.hourly.is_day[k],
          });
        }
        if (sunsetDate) {
          const ssLabel = `${sunsetDate.getHours() % 12 || 12}:${String(sunsetDate.getMinutes()).padStart(2, '0')}`;
          slots.splice(2, 0, { hour: ssLabel, temp: 0, code: 0, is_day: 1, isSunset: true });
          slots.length = 6;
        }
        setHours(slots);
      })
      .catch(() => setError(true));
  }, []);

  const cond = current ? codeToCondition(current.weather_code, current.is_day) : { label: 'Loading…', kind: 'cloud' };
  const bg = current ? pickGradient(current.is_day, cond.kind) : 'linear-gradient(140deg, #1f6fc7, #4ea0e6)';

  return (
    <div
      className="rounded-2xl p-4 text-white relative overflow-hidden"
      style={{
        width: 356,
        background: bg,
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.28)',
        fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-[15px] font-semibold leading-none"
            style={{ fontFamily: '"SF Pro Display", -apple-system, sans-serif', letterSpacing: '0.01em' }}
          >
            Bengaluru
          </div>
          <div
            className="mt-1 leading-none"
            style={{
              fontFamily: '"SF Pro Display", "Helvetica Neue", sans-serif',
              fontSize: 44,
              fontWeight: 200,
              letterSpacing: '-0.02em',
            }}
          >
            {current ? `${current.temp}°` : '—'}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <HourIcon kind={cond.kind} isDay={current?.is_day ?? 1} />
          </div>
          <div
            className="mt-2 text-[12px] font-semibold"
            style={{ fontFamily: '"SF Pro Text", -apple-system, sans-serif' }}
          >
            {cond.label}
          </div>
          {current && (
            <div
              className="text-[10.5px] opacity-90"
              style={{ fontFamily: '"SF Mono", ui-monospace, monospace', letterSpacing: '0.02em' }}
            >
              H:{current.high}° L:{current.low}°
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-1 pt-3 border-t border-white/20">
        {hours.slice(0, 6).map((h, i) => {
          const c = codeToCondition(h.code, h.is_day);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="text-[10px] opacity-90"
                style={{ fontFamily: '"SF Pro Text", -apple-system, sans-serif', fontWeight: 500 }}
              >
                {h.hour}
              </div>
              <HourIcon kind={c.kind} isDay={h.is_day} sunset={h.isSunset} />
              {!h.isSunset && (
                <div
                  className="text-[11px]"
                  style={{ fontFamily: '"SF Pro Display", -apple-system, sans-serif', fontWeight: 600 }}
                >
                  {h.temp}°
                </div>
              )}
              {h.isSunset && (
                <div className="text-[10px] opacity-90" style={{ fontFamily: '"SF Pro Text", sans-serif' }}>
                  Sunset
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[12px]">
          Weather unavailable
        </div>
      )}
    </div>
  );
};
