"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ClassRepository from "../../../../../core/Class";
import ResultsRepository from "../../../../../core/Results";

interface KpiData {
  classesCount: number;
  occupancyPct: number;
  cancellations: number;
  receivedToday: number;
  loading: boolean;
  loadingFinancial: boolean;
  loadingCancellations: boolean;
}

export default function KpiCards() {
  const classRepo = useMemo(() => new ClassRepository(), []);
  const resultsRepo = useMemo(() => new ResultsRepository(), []);
  const [kpi, setKpi] = useState<KpiData>({
    classesCount: 0,
    occupancyPct: 0,
    cancellations: 0,
    receivedToday: 0,
    loading: true,
    loadingFinancial: true,
    loadingCancellations: true,
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Aulas hoje
    classRepo.listClass(today, "", "", "", 1).then((result: any) => {
      if (!(result instanceof Error) && result?.data) {
        const classes = result.data as any[];
        const total = classes.length;
        const avgOccupancy = total > 0 ? Math.round(
          classes.reduce((sum: number, c: any) => {
            if (c.enrolled != null && c.limit) return sum + (c.enrolled / c.limit) * 100;
            return sum + 75;
          }, 0) / total
        ) : 0;
        setKpi((prev) => ({ ...prev, classesCount: total, occupancyPct: avgOccupancy, loading: false }));
      } else {
        setKpi((prev) => ({ ...prev, loading: false }));
      }
    });

    // Cancelamentos de alunos nas aulas de hoje
    classRepo.getTodayCancellations().then((result: any) => {
      if (!(result instanceof Error) && result?.data?.count != null) {
        setKpi((prev) => ({ ...prev, cancellations: result.data.count, loadingCancellations: false }));
      } else {
        setKpi((prev) => ({ ...prev, loadingCancellations: false }));
      }
    });

    // Recebido hoje
    resultsRepo.getLatestTransactions(null, today, null, 1).then((result: any) => {
      if (!(result instanceof Error) && Array.isArray(result?.data)) {
        const total = result.data
          .filter((t: any) => t.status === "paid")
          .reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0);
        setKpi((prev) => ({ ...prev, receivedToday: total / 100, loadingFinancial: false }));
      } else {
        setKpi((prev) => ({ ...prev, loadingFinancial: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Aulas hoje */}
      <KpiCard
        title="AULAS HOJE"
        loading={kpi.loading}
        value={kpi.classesCount}
        sub={
          kpi.classesCount > 0 ? (
            <span className="text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-success mr-1" />
              {kpi.occupancyPct}% ocup.
            </span>
          ) : undefined
        }
        icon={<CalendarKpiIcon />}
      />

      {/* Recebido hoje */}
      <KpiCard
        title="RECEBIDO HOJE"
        loading={kpi.loadingFinancial}
        value={fmtCurrency(kpi.receivedToday)}
        icon={<DollarKpiIcon />}
      />

      {/* Cancelamentos hoje */}
      <KpiCard
        title="CANCELAMENTOS"
        loading={kpi.loadingCancellations}
        value={kpi.cancellations}
        icon={<ClockKpiIcon />}
      />
    </div>
  );
}

// ─── Card base ─────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: React.ReactNode;
  icon: React.ReactNode;
  loading?: boolean;
}

function KpiCard({ title, value, sub, icon, loading }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {loading ? (
              <div className="h-9 w-20 mt-2 rounded-md bg-muted animate-pulse" />
            ) : (
              <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
            )}
            {sub && <div className="mt-1.5">{sub}</div>}
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Ícones ─────────────────────────────────────────────────────────────────

function CalendarKpiIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function DollarKpiIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockKpiIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
