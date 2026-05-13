"use client";

import { useEffect, useMemo, useState } from "react";
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export interface ContributionDay {
  date: string;
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
}

interface GitHubCalendarProps {
  /** Optional fallback data; if username given we fetch live data. */
  data?: ContributionDay[];
  username?: string;
  dark?: boolean;
  colors?: string[];
}

export const GitHubCalendar = ({
  data,
  username,
  dark = true,
  colors,
}: GitHubCalendarProps) => {
  const palette = colors ?? (dark
    ? ["#2A313C", "#0e4429", "#006d32", "#26a641", "#39d353"]
    : ["#EFF2F5", "#9be9a8", "#40c463", "#30a14e", "#216e39"]);

  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subDays(today, 364), [today]);
  const weeks = 53;

  const [live, setLive] = useState<ContributionDay[] | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && Array.isArray(json?.contributions)) {
          setLive(json.contributions.map((c: any) => ({ date: c.date, count: c.count, level: c.level })));
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [username]);

  const source = live ?? data ?? [];

  const contributionMap = useMemo(() => {
    const m = new Map<string, { count: number; level: number }>();
    source.forEach((d) => m.set(d.date.slice(0, 10), { count: d.count, level: d.level ?? 0 }));
    return m;
  }, [source]);

  const getColorByLevel = (level: number) => palette[Math.max(0, Math.min(4, level))];
  const getColorByCount = (count: number) => {
    if (count <= 0) return palette[0];
    if (count < 3) return palette[1];
    if (count < 6) return palette[2];
    if (count < 10) return palette[3];
    return palette[4];
  };

  const renderWeeks = () => {
    const weeksArray: React.ReactNode[] = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    for (let i = 0; i < weeks; i++) {
      const weekDays = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
      });

      weeksArray.push(
        <div key={i} className="flex flex-col gap-[3px] flex-1 min-w-0">
          {weekDays.map((day, idx) => {
            const key = format(day, "yyyy-MM-dd");
            const entry = contributionMap.get(key);
            const future = day > today;
            const color = future
              ? "transparent"
              : entry
                ? (entry.level !== undefined ? getColorByLevel(entry.level) : getColorByCount(entry.count))
                : palette[0];
            return (
              <div
                key={idx}
                title={`${entry?.count ?? 0} contributions on ${format(day, "MMM d, yyyy")}`}
                className="aspect-square w-full rounded-[2px] transition-transform hover:scale-150"
                style={{ background: color, opacity: future ? 0 : 1 }}
              />
            );
          })}
        </div>
      );
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    return weeksArray;
  };

  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    const labels: { label: string; weekIndex: number }[] = [];
    let cw = startOfWeek(startDate, { weekStartsOn: 0 });
    for (let i = 0; i < weeks; i++) {
      const m = format(cw, "MMM");
      const yr = format(cw, "yyyy-MM");
      if (!seen.has(yr) && cw.getDate() <= 7) {
        seen.add(yr);
        labels.push({ label: m, weekIndex: i });
      }
      cw = addDays(cw, 7);
    }
    return labels;
  }, [startDate]);

  const total = source.reduce((s, d) => s + d.count, 0);

  return (
    <div className={`w-full ${dark ? "text-neutral-300" : "text-neutral-700"} text-[11px]`}>
      <div className="mb-2 text-[12px] opacity-80">{total} contributions in the last year</div>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-[3px] pt-[18px] shrink-0">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} className="aspect-square w-[11px] leading-[11px] text-[9px] opacity-70">{d}</div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="grid mb-1 text-[9px] opacity-70 pl-[2px]"
            style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
          >
            {Array.from({ length: weeks }).map((_, i) => {
              const lbl = monthLabels.find((m) => m.weekIndex === i);
              return <span key={i} className="truncate">{lbl?.label ?? ''}</span>;
            })}
          </div>
          <div className="flex gap-[3px] w-full">{renderWeeks()}</div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] opacity-80">
        <span>Less</span>
        {palette.map((c, i) => (
          <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
