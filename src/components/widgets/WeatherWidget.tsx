import { useEffect, useState } from "react";
import { getAnimatedWeatherIcon } from "./WeatherIcons";

interface WeatherData {
  temperature: number;
  high: number;
  low: number;
  condition: string;
  weatherCode: number;
  hourly: { time: string; temp: number; code: number }[];
}

const WMO_CODES: Record<number, string> = {
  0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Fog", 51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow",
  80: "Light Showers", 81: "Showers", 82: "Heavy Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe Storm",
};

const getGradient = (code: number) => {
  if (code <= 1) return "linear-gradient(180deg, hsl(210 70% 50%), hsl(210 50% 65%))";
  if (code <= 3) return "linear-gradient(180deg, hsl(215 50% 45%), hsl(210 40% 60%))";
  if (code <= 48) return "linear-gradient(180deg, hsl(220 30% 40%), hsl(215 25% 55%))";
  if (code <= 65) return "linear-gradient(180deg, hsl(220 35% 35%), hsl(215 30% 50%))";
  if (code <= 75) return "linear-gradient(180deg, hsl(210 20% 50%), hsl(210 15% 65%))";
  return "linear-gradient(180deg, hsl(230 40% 30%), hsl(225 35% 45%))";
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=Asia/Kolkata&forecast_days=1"
        );
        const data = await res.json();

        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const istHour = new Date(utc + istOffset).getHours();

        const hourlySlice = data.hourly.time
          .map((t: string, i: number) => ({
            time: t,
            temp: Math.round(data.hourly.temperature_2m[i]),
            code: data.hourly.weather_code[i],
            hour: new Date(t).getHours(),
          }))
          .filter((h: { hour: number }) => h.hour >= istHour)
          .slice(0, 6);

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          condition: WMO_CODES[data.current.weather_code] || "Unknown",
          weatherCode: data.current.weather_code,
          hourly: hourlySlice,
        });
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatHour = (time: string) => {
    const hour = new Date(time).getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h} ${ampm}`;
  };

  if (loading) {
    return (
      <div
        className="rounded-2xl shadow-sm flex items-center justify-center"
        style={{
          width: 352,
          height: 100,
          background: 'linear-gradient(180deg, hsl(210 70% 50%), hsl(210 50% 65%))',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <p className="text-white/70 text-xs">Loading weather...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div
        className="rounded-2xl shadow-sm flex items-center justify-center"
        style={{
          width: 352,
          height: 100,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-white/50 text-xs">Unable to load weather</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden text-white"
      style={{
        width: 352,
        background: getGradient(weather.weatherCode),
        border: '1px solid hsla(0, 0%, 100%, 0.15)',
      }}
    >
      {/* Top section */}
      <div className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-medium tracking-wide opacity-90">
              Bengaluru
            </div>
            <div className="text-3xl font-light leading-none mt-0.5">
              {weather.temperature}°
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end opacity-90">
              {getAnimatedWeatherIcon(weather.weatherCode, 20)}
              <span className="text-[10px] font-medium">
                {weather.condition}
              </span>
            </div>
            <div className="text-[10px] opacity-70 mt-1">
              H:{weather.high}° L:{weather.low}°
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 mx-3" />

      {/* Hourly forecast */}
      <div className="flex items-center justify-between px-3 py-2">
        {weather.hourly.map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-medium opacity-70">
              {formatHour(h.time)}
            </span>
            {getAnimatedWeatherIcon(h.code, 18)}
            <span className="text-[10px] font-medium">{h.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
