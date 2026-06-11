"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ClassRepository from "../../../../../core/Class";

type Tab = "hoje" | "amanha" | "semana";

interface ClassItem {
  id: number;
  time: string;
  name: string;
  enrolled: number;
  capacity: number;
  waitlist?: number;
}

// TODO: remover mock quando endpoint retornar enrolled/capacity na listagem
const MOCK_CLASSES: ClassItem[] = [
  { id: 1, time: "07:00", name: "SPIN'GO", enrolled: 6, capacity: 8 },
  { id: 2, time: "08:00", name: "SPIN'GO", enrolled: 1, capacity: 8 },
  { id: 3, time: "12:00", name: "Tênis Adulto", enrolled: 4, capacity: 4, waitlist: 2 },
  { id: 4, time: "18:00", name: "SPIN'GO", enrolled: 8, capacity: 8, waitlist: 1 },
];

function formatDisplayDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(d);
}

export default function TodayClasses() {
  const classRepo = useMemo(() => new ClassRepository(), []);
  const [tab, setTab] = useState<Tab>("hoje");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const offset = tab === "hoje" ? 0 : tab === "amanha" ? 1 : 0;
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = d.toISOString().split("T")[0].split("-").reverse().join("/"); // DD/MM/YYYY

    setLoading(true);
    classRepo.listClass(dateStr, "", "", "", 1).then((result: any) => {
      if (!(result instanceof Error) && Array.isArray(result?.data) && result.data.length > 0) {
        const mapped: ClassItem[] = result.data.map((c: any) => ({
          id: c.id,
          time: c.time?.slice(0, 5) ?? "--",
          name: c.productType ?? "Aula",
          enrolled: c.studentCount ?? c.enrolled ?? 0,
          capacity: 12,
          waitlist: c.waitlist,
        }));
        setClasses(mapped);
      } else {
        // Usa mock para hoje quando a API não retorna dados de ocupação
        setClasses(tab === "hoje" ? MOCK_CLASSES : []);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "amanha", label: "Amanhã" },
    { key: "semana", label: "Semana" },
  ];

  const displayDate =
    tab === "hoje"
      ? formatDisplayDate(0)
      : tab === "amanha"
      ? formatDisplayDate(1)
      : "Esta semana";

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Aulas de hoje</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{displayDate}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  tab === t.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pb-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))
        ) : classes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhuma aula agendada.
          </p>
        ) : (
          classes.map((cls) => (
            <ClassRow key={cls.id} cls={cls} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ─── Linha de aula ──────────────────────────────────────────────────────────

function ClassRow({ cls }: { cls: ClassItem }) {
  const pct = cls.capacity > 0 ? (cls.enrolled / cls.capacity) * 100 : 0;
  const isFull = cls.enrolled >= cls.capacity;
  const barOpacity = 0.35 + (Math.min(pct, 100) / 100) * 0.65;

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
      {/* Horário */}
      <span className="text-sm font-semibold text-foreground w-12 shrink-0">{cls.time}</span>

      {/* Info + barra */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{cls.name}</span>
          {cls.waitlist && cls.waitlist > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              +{cls.waitlist} espera
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-primary"
              style={{ width: `${Math.min(pct, 100)}%`, opacity: barOpacity }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {cls.enrolled}/{cls.capacity}
          </span>
        </div>
      </div>
    </div>
  );
}
