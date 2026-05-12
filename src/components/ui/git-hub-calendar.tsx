"use client";

import { useMemo } from "react";
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

export interface ContributionDay {
  date: string;
  count: number;
}

interface GitHubCalendarProps {
  data: ContributionDay[];
  colors?: string[];
  dark?: boolean;
}

export const GitHubCalendar = ({
  data,
  dark = true,
  colors,
}: GitHubCalendarProps) => {
  const palette = colors ?? (dark
    ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
    : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]);

  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subDays(today, 364), [today]);
  const weeks = 53;

  const contributionMap = useMemo(() => {
    const m = new Map<string, number>();
    data.forEach((d) => m.set(d.date.slice(0, 10), d.count));
    return m;
  }, [data]);

  const getColor = (count: number) => {
    if (count <= 0) return palette[0];
    if (count === 1) return palette[1];
    if (count === 2) return palette[2];
    if (count === 3) return palette[3];
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
        <div key={i} className="flex flex-col gap-[3px]">
          {weekDays.map((day, idx) => {
            const key = format(day, "yyyy-MM-dd");
            const count = contributionMap.get(key) ?? 0;
            const color = getColor(count);
            const future = day > today;
            return (
              <div
                key={idx}
                title={`${count} contributions on ${format(day, "MMM d, yyyy")}`}
                className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-150"
                style={{ background: future ? "transparent" : color, opacity: future ? 0.2 : 1 }}
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

  const dayLabels = ["Mon", "Wed", "Fri"];

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className={`w-full ${dark ? "text-neutral-300" : "text-neutral-700"} text-[11px]`}>
      <div className="mb-2 text-[12px] opacity-80">{total} contributions in the last year</div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-[3px] pt-[18px]">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} className="h-[11px] leading-[11px] text-[9px] opacity-70">{d}</div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-[14px] pl-[2px] mb-1 text-[9px] opacity-70">
            {monthLabels.map((m, i) => (
              <span key={i}>{m.label}</span>
            ))}
          </div>
          <div className="flex gap-[3px]">{renderWeeks()}</div>
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
