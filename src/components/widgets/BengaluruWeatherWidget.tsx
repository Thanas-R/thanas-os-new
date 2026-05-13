import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { IoCloudySharp, IoPartlySunny, IoSunny, IoMoon, IoRainy, IoThunderstorm } from 'react-icons/io5';
import {
  BsFillMoonStarsFill,
  BsFillSunsetFill,
  BsFillSunriseFill,
  BsFillCloudMoonFill,
  BsCloudDrizzleFill,
  BsCloudLightningFill,
  BsCloudLightningRainFill,
} from 'react-icons/bs';
import { FaCloudSunRain, FaCloudMoonRain } from 'react-icons/fa6';

interface CurrentWeather {
  temp: number;
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
  isSunrise?: boolean;
}

const conditionLabel = (code: number, isDay: number) => {
  if (code === 0) return isDay ? 'Sunny' : 'Clear';
  if (code <= 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  return 'Thunderstorm';
};

const WeatherGlyph = ({
  code,
  isDay,
  size = 22,
  sunset,
  sunrise,
}: {
  code: number;
  isDay: number;
  size?: number;
  sunset?: boolean;
  sunrise?: boolean;
}) => {
  const style = { color: '#ffffff' };
  const props = { size, style };

  if (sunrise) return <BsFillSunriseFill {...props} />;
  if (sunset) return <BsFillSunsetFill {...props} />;
  if (code === 0) return isDay ? <IoSunny {...props} /> : <BsFillMoonStarsFill {...props} />;
  if (code <= 2) return isDay ? <IoPartlySunny {...props} /> : <BsFillCloudMoonFill {...props} />;
  if (code === 3 || code <= 49) return <IoCloudySharp {...props} />;
  if (code <= 57) return <BsCloudDrizzleFill {...props} />;
  if (code <= 67 || (code >= 80 && code <= 82)) return isDay ? <FaCloudSunRain {...props} /> : <FaCloudMoonRain {...props} />;
  if (code === 95) return <IoThunderstorm {...props} />;
  if (code === 96 || code === 99) return <BsCloudLightningRainFill {...props} />;
  if (code <= 99) return <BsCloudLightningFill {...props} />;
  return <IoRainy {...props} />;
};

export const BengaluruWeatherWidget = ({ className }: { className?: string }) => {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hours, setHours] = useState<HourSlot[]>([]);

  useEffect(() => {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,is_day,weather_code&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,sunset,sunrise&timezone=Asia%2FKolkata&forecast_days=2';

    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        const cur = j.current;
        const daily = j.daily;

        setCurrent({
          temp: Math.round(cur.temperature_2m),
          weather_code: cur.weather_code,
          is_day: cur.is_day,
          high: Math.round(daily.temperature_2m_max[0]),
          low: Math.round(daily.temperature_2m_min[0]),
        });

        const now = new Date();
        const idxNow = j.hourly.time.findIndex((t: string) => new Date(t) >= now);
        const start = idxNow > 0 ? idxNow : 0;
        const sunset = daily.sunset?.[0] ? new Date(daily.sunset[0]) : null;
        const sunrise = daily.sunrise?.[1] ? new Date(daily.sunrise[1]) : null;

        const slots: HourSlot[] = [];
        for (let i = 0; i < 6; i++) {
          const k = start + i;
          const t = new Date(j.hourly.time[k]);
          const h = t.getHours();
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hr = (h % 12) || 12;

          slots.push({
            hour: `${hr}${ampm}`,
            temp: Math.round(j.hourly.temperature_2m[k]),
            code: j.hourly.weather_code[k],
            is_day: j.hourly.is_day[k],
          });
        }

        const insertAt = (when: Date | null, marker: Partial<HourSlot>) => {
          if (!when) return;
          const slotStart = new Date(j.hourly.time[start]);
          const last = new Date(j.hourly.time[start + 5]);
          if (when < slotStart || when > last) return;

          const offsetH = Math.round((when.getTime() - slotStart.getTime()) / 3.6e6);
          const label = `${(when.getHours() % 12) || 12}:${String(when.getMinutes()).padStart(2, '0')}`;
          slots.splice(Math.min(offsetH, slots.length - 1), 0, { hour: label, temp: 0, code: 0, is_day: 1, ...marker });
        };

        insertAt(sunset, { isSunset: true });
        insertAt(sunrise, { isSunrise: true });
        setHours(slots.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className={cn('rounded-3xl overflow-hidden liquid-glass-card text-white', className)}
      style={{ width: 356, fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[14px]" style={{ fontWeight: 500, letterSpacing: '0.01em' }}>
              Bengaluru
            </div>

            <div
              className="leading-none mt-1"
              style={{ fontSize: 38, fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              {current ? `${current.temp}°` : '—'}
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-0.5">
            {current && <WeatherGlyph code={current.weather_code} isDay={current.is_day} size={22} />}

            {current && (
              <>
                <div className="text-[13px]" style={{ fontWeight: 400, letterSpacing: '0.01em' }}>
                  {conditionLabel(current.weather_code, current.is_day)}
                </div>

                <div className="text-[12px] text-white/75" style={{ fontWeight: 400 }}>
                  H:{current.high}° L:{current.low}°
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 mt-2">
          {hours.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-[11px] text-white/80" style={{ fontWeight: 400 }}>
                {h.hour}
              </div>

              <WeatherGlyph code={h.code} isDay={h.is_day} size={20} sunset={h.isSunset} sunrise={h.isSunrise} />

              {!h.isSunset && !h.isSunrise ? (
                <div className="text-[13px]" style={{ fontWeight: 500 }}>
                  {h.temp}°
                </div>
              ) : (
                <div className="text-[11px] text-white/75" style={{ fontWeight: 400 }}>
                  {h.isSunset ? 'Set' : 'Rise'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
