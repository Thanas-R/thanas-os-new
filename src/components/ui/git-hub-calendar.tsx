"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval, getMonth } from "date-fns";

export interface ContributionDay {
  date: string;
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
}

interface GitHubCalendarProps {
  data?: ContributionDay[];
  username?: string;
  dark?: boolean;
  colors?: string[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(12);
  const gap = 3;
  const labelColWidth = 28;

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const w = containerRef.current?.clientWidth ?? 0;
      const available = w - labelColWidth - gap;
      const size = Math.max(8, Math.floor((available - (weeks - 1) * gap) / weeks));
      setCellSize(size);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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

  // Build week columns + month label info in one pass
  const weekCols = useMemo(() => {
    const cols: { weekStart: Date; days: Date[] }[] = [];
    let cw = startOfWeek(startDate, { weekStartsOn: 0 });
    for (let i = 0; i < weeks; i++) {
      cols.push({
        weekStart: cw,
        days: eachDayOfInterval({ start: cw, end: endOfWeek(cw, { weekStartsOn: 0 }) }),
      });
      cw = addDays(cw, 7);
    }
    return cols;
  }, [startDate]);

  // Month labels: place at first week of each month (where day 1 falls within first 7 days of week)
  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weekCols.forEach((col, i) => {
      const m = getMonth(col.weekStart);
      if (m !== lastMonth) {
        // Only show if there's enough room before next month label (avoid first week if it's only a few days of prev month)
        if (i === 0 || labels.length === 0 || i - labels[labels.length - 1].weekIndex >= 3) {
          labels.push({ label: MONTH_NAMES[m], weekIndex: i });
          lastMonth = m;
        } else {
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weekCols]);

  const total = source.reduce((s, d) => s + d.count, 0);
  const gridWidth = weeks * cellSize + (weeks - 1) * gap;

  return (
    <div
      ref={containerRef}
      className={`w-full ${dark ? "text-neutral-300" : "text-neutral-700"} text-[11px]`}
    >
      <div className="mb-2 text-[12px] opacity-80">{total} contributions in the last year</div>

      <div className="flex" style={{ gap }}>
        {/* Day labels column */}
        <div
          className="flex flex-col shrink-0"
          style={{ width: labelColWidth, paddingTop: 18, gap }}
        >
          {DAY_LABELS.map((d, i) => (
            <div
              key={i}
              className="text-[10px] opacity-70 leading-none flex items-center"
              style={{ height: cellSize }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid: month labels + cells */}
        <div className="min-w-0">
          {/* Month labels row positioned absolutely */}
          <div className="relative" style={{ width: gridWidth, height: 14, marginBottom: 4 }}>
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute text-[10px] opacity-70 leading-none whitespace-nowrap"
                style={{ left: m.weekIndex * (cellSize + gap), top: 0 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Cells */}
          <div className="flex" style={{ gap }}>
            {weekCols.map((col, i) => (
              <div key={i} className="flex flex-col" style={{ gap }}>
                {col.days.map((day, idx) => {
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
                      className="rounded-[2px] transition-transform hover:scale-150"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background: color,
                        opacity: future ? 0 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
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
