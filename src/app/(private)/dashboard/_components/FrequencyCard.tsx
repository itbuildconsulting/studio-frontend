"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import FrequencyStudentsRepository from "../../../../../core/FrequencyStudents";
import { getDatesOfWeek } from "@/utils/getDatesOfWeek";

interface DayFrequency {
  dayOfWeek: number; // 1 = Mon ... 7 = Sun
  attendanceCount: number;
}

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function FrequencyCard() {
  const repo = useMemo(() => new FrequencyStudentsRepository(), []);
  const [data, setData] = useState<DayFrequency[]>([]);
  const [loading, setLoading] = useState(true);

  // JS getDay(): 0=Sun,1=Mon...6=Sat → convert to 1=Mon...7=Sun
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1; // 0-based index into DAY_LABELS

  useEffect(() => {
    const dates = getDatesOfWeek();
    const start = dates[0];
    const end = dates[dates.length - 1];

    repo.consult(start, end).then((result: any) => {
      if (!(result instanceof Error) && Array.isArray(result?.data)) {
        setData(result.data);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = DAY_LABELS.map((_, i) => {
    const entry = data.find((d) => d.dayOfWeek === i + 1);
    return entry?.attendanceCount ?? 0;
  });

  const maxCount = Math.max(...counts, 1);
  const totalWeek = counts.reduce((a, b) => a + b, 0);
  const todayCount = counts[todayIndex] ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Frequência semanal</CardTitle>
          {!loading && (
            <span className="text-xs text-muted-foreground">{totalWeek} alunos</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-7 text-xs text-muted-foreground shrink-0" />
              <div className="flex-1 h-5 rounded bg-muted animate-pulse" />
            </div>
          ))
        ) : (
          <>
            {DAY_LABELS.map((label, i) => {
              const pct = maxCount > 0 ? (counts[i] / maxCount) * 100 : 0;
              const isToday = i === todayIndex;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-7 text-xs shrink-0 font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                  <div className="flex-1 h-5 rounded bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded transition-all duration-700 flex items-center justify-end pr-1.5",
                        isToday ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                      style={{ width: `${Math.max(pct, counts[i] > 0 ? 8 : 0)}%` }}
                    >
                      {counts[i] > 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold leading-none",
                            isToday ? "text-primary-foreground" : "text-foreground/70"
                          )}
                        >
                          {counts[i]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
              <span className="text-xs text-muted-foreground">Hoje</span>
              <span className="text-xs font-bold text-primary">{todayCount} alunos</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
