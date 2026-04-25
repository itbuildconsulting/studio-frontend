'use client'

import { useEffect, useMemo, useState, useCallback } from "react";
import MenuSideBar from "@/components/MenuSideBar/MenuSideBar";
import useWindowSize from "@/data/hooks/useWindowSize";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  Activity,
  Coins,
  Star,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Trophy,
  Medal,
  MessageSquare,
  Send,
  Download,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import StatisticsRepository from "../../../../core/Statistics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Periodo = "hoje" | "semana" | "mes" | "trimestre";
type InsightTone = "warning" | "danger" | "info" | "success";

const KPI_ICONS = [Users, CheckCircle2, Activity, Coins, Star];

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
  { value: "trimestre", label: "Trimestre" },
];


const INSIGHT_STYLES: Record<
  InsightTone,
  { wrap: string; iconWrap: string; icon: React.ElementType; badge: string }
> = {
  warning: {
    wrap: "border-amber-200 bg-amber-50",
    iconWrap: "bg-amber-100 text-amber-600",
    icon: AlertTriangle,
    badge: "bg-amber-100 text-amber-700",
  },
  danger: {
    wrap: "border-rose-200 bg-rose-50",
    iconWrap: "bg-rose-100 text-rose-600",
    icon: XCircle,
    badge: "bg-rose-100 text-rose-700",
  },
  info: {
    wrap: "border-sky-200 bg-sky-50",
    iconWrap: "bg-sky-100 text-sky-600",
    icon: Info,
    badge: "bg-sky-100 text-sky-700",
  },
  success: {
    wrap: "border-emerald-200 bg-emerald-50",
    iconWrap: "bg-emerald-100 text-emerald-600",
    icon: Sparkles,
    badge: "bg-emerald-100 text-emerald-700",
  },
};

function getPeriodDates(periodo: Periodo) {
  const end = new Date();
  const start = new Date();
  switch (periodo) {
    case "semana":
      start.setDate(start.getDate() - 7);
      break;
    case "mes":
      start.setMonth(start.getMonth() - 1);
      break;
    case "trimestre":
      start.setMonth(start.getMonth() - 3);
      break;
  }
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}

function toArray(res: any): any[] {
  if (!res || res instanceof Error) return [];
  return res?.data ?? (Array.isArray(res) ? res : []);
}

function toObject(res: any): any {
  if (!res || res instanceof Error) return null;
  return res?.data ?? res;
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/40 bg-white/90 px-4 py-3 shadow-xl text-xs min-w-[100px]">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        <span className="text-sm font-bold text-foreground tabular-nums">
          {payload[0].value}
        </span>
        <span className="text-muted-foreground">{payload[0].name}</span>
      </div>
    </div>
  );
}

export default function Estatisticas() {
  const repo = useMemo(() => new StatisticsRepository(), []);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [loading, setLoading] = useState(true);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const size = useWindowSize() as { width?: number };

  useEffect(() => {
    if (size.width && size.width < 1200) setMenuMobileOpen(false);
  }, [size.width]);

  const [overview, setOverview] = useState<any>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [inactiveStudents, setInactiveStudents] = useState<any[]>([]);
  const [studentsAtRisk, setStudentsAtRisk] = useState<any[]>([]);
  const [expiringCredits, setExpiringCredits] = useState<any[]>([]);
  const [occupancyByTime, setOccupancyByTime] = useState<any>(null);
  const [topTeachers, setTopTeachers] = useState<any[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { startDate, endDate } = getPeriodDates(periodo);
    try {
      const [
        overviewRes,
        topStudentsRes,
        inactiveRes,
        atRiskRes,
        expiringRes,
        occupancyTimeRes,
        teachersRes,
        trendsRes,
      ] = await Promise.all([
        repo.getOverviewMetrics(startDate, endDate),
        repo.getTopStudents(10, periodo),
        repo.getInactiveStudents(14),
        repo.getStudentsAtRisk(),
        repo.getCreditsExpiringSoon(7),
        repo.getOccupancyByTime(startDate, endDate),
        repo.getTopTeachers(5),
        repo.getWeeklyTrends(startDate, endDate, periodo),
      ]);

      setOverview(toObject(overviewRes));
      setTopStudents(toArray(topStudentsRes));
      setInactiveStudents(toArray(inactiveRes));
      setStudentsAtRisk(toArray(atRiskRes));
      setExpiringCredits(toArray(expiringRes));
      setOccupancyByTime(toObject(occupancyTimeRes));
      setTopTeachers(toArray(teachersRes));
      setWeeklyTrends(toObject(trendsRes));
    } catch (e) {
      console.error("Erro ao carregar estatísticas:", e);
    } finally {
      setLoading(false);
    }
  }, [periodo, repo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Mapeamento para UI ──────────────────────────────────────────

  const kpis = [
    {
      label: "Alunos Ativos",
      value: overview?.activeStudents ?? 0,
      delta:
        overview?.activeStudentsGrowth != null
          ? {
              positive: overview.activeStudentsGrowth > 0,
              value: `${Math.abs(overview.activeStudentsGrowth)}%`,
            }
          : undefined,
      hint: "vs período anterior",
    },
    {
      label: "Média / Aula",
      value: overview?.avgStudentsPerClass ?? 0,
      hint: "alunos por aula",
    },
    {
      label: "Taxa Ocupação",
      value: `${overview?.occupancyRate ?? 0}%`,
      hint: "média das aulas",
    },
    {
      label: "Créditos Ativos",
      value: overview?.totalActiveCredits ?? 0,
      hint: `${overview?.creditsExpiringNext7Days ?? 0} vencem em 7d`,
    },
    {
      label: "NPS Score",
      value: overview?.npsScore ?? "N/A",
      hint: "satisfação",
    },
  ];

  const insights: {
    id: string;
    tone: InsightTone;
    title: string;
    description: string;
    count: number;
    cta: string;
    anchor?: string;
  }[] = [
    {
      id: "inativos",
      tone: "warning",
      title: "Alunos Inativos",
      description: "Não comparecem há mais de 14 dias",
      count: inactiveStudents.length,
      cta: "Ver detalhes",
      anchor: "#section-inativos",
    },
    {
      id: "risco",
      tone: "danger",
      title: "Queda de Frequência",
      description: "Alunos com redução significativa de aulas",
      count: studentsAtRisk.length,
      cta: "Ver quem são",
      anchor: "#section-top-alunos",
    },
    {
      id: "creditos",
      tone: "info",
      title: "Créditos Vencendo",
      description: "Créditos que expiram nos próximos 7 dias",
      count: expiringCredits.length,
      cta: "Alertar alunos",
    },
    {
      id: "engajamento",
      tone: "success",
      title: "Engajamento Alto",
      description: "Alunos com sequência de 7+ dias consecutivos",
      count: topStudents.filter((s: any) => (s.streak ?? 0) >= 7).length,
      cta: "Reconhecer alunos",
      anchor: "#section-top-alunos",
    },
  ];

  const alunosPorHorario = useMemo(() => {
    if (!occupancyByTime?.labels || !occupancyByTime?.counts) return [];
    return (occupancyByTime.labels as string[]).map((label: string, i: number) => ({
      horario: label,
      alunos: occupancyByTime.counts[i] ?? 0,
    }));
  }, [occupancyByTime]);

  const alunosPorDia = useMemo(() => {
    if (!weeklyTrends?.labels || !weeklyTrends?.data) return [];
    return (weeklyTrends.labels as string[]).map((label: string, i: number) => ({
      dia: label,
      alunos: weeklyTrends.data[i] ?? 0,
    }));
  }, [weeklyTrends]);

  const ocupacaoHorario = useMemo(() => {
    if (!occupancyByTime?.labels || !occupancyByTime?.data) return [];
    return (occupancyByTime.labels as string[]).map((label: string, i: number) => ({
      horario: String(label).slice(0, 5),
      ocupacao: occupancyByTime.data[i] ?? 0,
      alunos: occupancyByTime.counts?.[i] ?? 0,
      vagas: occupancyByTime.spots?.[i] ?? null,
    }));
  }, [occupancyByTime]);

  const topAlunos = topStudents.map((s: any, i: number) => ({
    rank: i + 1,
    nome: s.name ?? s.nome ?? "",
    aulas: s.classCount ?? s.aulas ?? 0,
    presenca: s.attendanceRate ?? s.presenca ?? 0,
    last7: s.last7 ?? [],
  }));

  const topProfessores = topTeachers.map((t: any) => ({
    nome: t.name ?? t.nome ?? "",
    aulas: t.classCount ?? t.aulas ?? 0,
    alunos: t.totalStudents ?? t.alunos ?? 0,
    ocupacao: t.averageOccupancy ?? t.ocupacao ?? 0,
  }));

  const alunosInativos = inactiveStudents.map((a: any) => ({
    nome: a.name ?? a.nome ?? "",
    ultimaAula: a.lastClassDate
      ? new Date(a.lastClassDate).toLocaleDateString("pt-BR")
      : (a.ultimaAula ?? ""),
    diasInativo: a.daysInactive ?? a.diasInativo ?? 0,
    creditos: a.credits ?? a.creditos ?? 0,
  }));

  // ── Render ──────────────────────────────────────────────────────

  return (
    <main className="flex">
      <MenuSideBar
        menuMobileOpen={menuMobileOpen}
        handleMenuOpen={() => setMenuMobileOpen((v) => !v)}
      />
    <div className="flex-1 min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Estatísticas & Insights
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acompanhe a performance do seu estúdio em tempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              {PERIODOS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriodo(p.value)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all",
                    periodo === p.value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-3.5 h-3.5" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, i) => {
              const Icon = KPI_ICONS[i % KPI_ICONS.length];
              const Trend = kpi.delta?.positive ? TrendingUp : TrendingDown;
              return (
                <div
                  key={kpi.label}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      {kpi.label}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-2xl font-bold tabular-nums",
                      loading
                        ? "text-muted-foreground animate-pulse"
                        : "text-foreground"
                    )}
                  >
                    {loading ? "—" : kpi.value}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                    {kpi.delta && !loading && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-semibold",
                          kpi.delta.positive
                            ? "text-emerald-600"
                            : "text-rose-600"
                        )}
                      >
                        <Trend className="w-3 h-3" />
                        {kpi.delta.value}
                      </span>
                    )}
                    {kpi.hint && (
                      <span className="text-muted-foreground">{kpi.hint}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Insights */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">
              Insights & Ações Recomendadas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {insights.map((insight) => {
              const style = INSIGHT_STYLES[insight.tone];
              const Icon = style.icon;
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "rounded-xl border p-4 flex flex-col",
                    style.wrap
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        style.iconWrap
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2 py-0.5 rounded-full",
                        style.badge
                      )}
                    >
                      {loading ? "—" : insight.count}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-foreground">
                    {insight.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 mb-3 leading-snug">
                    {insight.description}
                  </p>
                  {insight.anchor ? (
                    <a
                      href={insight.anchor}
                      className="mt-auto text-[11px] font-semibold text-foreground/80 hover:text-foreground self-start inline-flex items-center gap-1"
                    >
                      {insight.cta} →
                    </a>
                  ) : (
                    <button className="mt-auto text-[11px] font-semibold text-foreground/80 hover:text-foreground self-start inline-flex items-center gap-1">
                      {insight.cta} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alunos por Horário */}
          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Alunos por Horário
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Número de alunos por faixa de horário
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {PERIODOS.find((p) => p.value === periodo)?.label}
              </Badge>
            </div>
            <div className="h-56">
              {loading ? (
                <div className="h-full bg-muted animate-pulse rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={alunosPorHorario}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="horario"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RTooltip
                      cursor={{ fill: "rgba(0,0,0,0.06)" }}
                      content={<BarTooltip />}
                    />
                    <Bar
                      dataKey="alunos"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      activeBar={{ fill: "hsl(var(--primary))", opacity: 0.8 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Alunos por Dia */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">
                Alunos por Dia
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {periodo === "hoje" || periodo === "semana"
                  ? "Distribuição Dom–Sáb"
                  : "Evolução no período"}
              </p>
            </div>
            <div className="h-56">
              {loading ? (
                <div className="h-full bg-muted animate-pulse rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={alunosPorDia}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="dia"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RTooltip
                      cursor={{ fill: "rgba(0,0,0,0.06)" }}
                      content={<BarTooltip />}
                    />
                    <Bar
                      dataKey="alunos"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      activeBar={{ fill: "hsl(var(--primary))", opacity: 0.8 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Ocupação por horário */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Taxa de Ocupação por Horário
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Identifique seus horários de pico
              </p>
            </div>
          </div>
          {loading ? (
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
          ) : ocupacaoHorario.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sem dados de ocupação disponíveis
            </p>
          ) : (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${ocupacaoHorario.length}, minmax(0, 1fr))`,
              }}
            >
              {ocupacaoHorario.map((slot: any) => {
                const intensity: number = slot.ocupacao;
                let bg = "bg-primary/10";
                if (intensity >= 60) bg = "bg-primary";
                else if (intensity >= 40) bg = "bg-primary/70";
                else if (intensity >= 25) bg = "bg-primary/40";
                else if (intensity >= 15) bg = "bg-primary/20";
                const isLight = intensity < 40;
                return (
                  <div
                    key={slot.horario}
                    className={cn(
                      "w-full rounded-xl flex flex-col items-center justify-between py-3 px-2 transition-all hover:scale-105 cursor-default border",
                      bg,
                      isLight ? "border-border" : "border-primary-foreground/20"
                    )}
                  >
                    <Clock
                      className={cn(
                        "w-3.5 h-3.5",
                        isLight ? "text-foreground/40" : "text-primary-foreground/70"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-bold tabular-nums mt-2",
                        isLight ? "text-foreground/80" : "text-primary-foreground"
                      )}
                    >
                      {slot.vagas > 0
                        ? `${slot.alunos}/${slot.vagas}`
                        : `${slot.alunos}`}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold mt-0.5",
                        isLight ? "text-foreground/50" : "text-primary-foreground/70"
                      )}
                    >
                      {slot.ocupacao}%
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold mt-2 tabular-nums",
                        isLight ? "text-foreground/60" : "text-primary-foreground/80"
                      )}
                    >
                      {slot.horario}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Rankings */}
        <section id="section-top-alunos" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top alunos */}
          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">
                  Top {topAlunos.length || 10} Alunos
                </h3>
              </div>
              <button className="text-[11px] font-semibold text-primary hover:underline">
                Ver todos
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                  <th className="text-left py-2 px-2 font-medium w-10">#</th>
                  <th className="text-left py-2 px-2 font-medium">Aluno</th>
                  <th className="text-right py-2 px-2 font-medium">Aulas</th>
                  <th className="text-right py-2 px-2 font-medium">Últimos 7 dias</th>
                  <th className="text-right py-2 px-2 font-medium">Presença</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td colSpan={5} className="py-3 px-2">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                        </td>
                      </tr>
                    ))
                  : topAlunos.map((aluno) => (
                      <tr
                        key={aluno.rank}
                        className="border-b border-border/50 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2.5 px-2">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                              aluno.rank === 1 && "bg-amber-100 text-amber-700",
                              aluno.rank === 2 && "bg-slate-200 text-slate-700",
                              aluno.rank === 3 &&
                                "bg-orange-100 text-orange-700",
                              aluno.rank > 3 && "bg-muted text-muted-foreground"
                            )}
                          >
                            {aluno.rank}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-foreground text-[13px]">
                          {aluno.nome}
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums font-semibold">
                          {aluno.aulas}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center justify-end gap-0.5">
                            {aluno.last7.length > 0
                              ? aluno.last7.map((status: string, i: number) => (
                                  <div
                                    key={i}
                                    title={status === 'attended' ? 'Presente' : status === 'missed' ? 'Faltou' : 'Sem aula'}
                                    className={cn(
                                      "w-3.5 h-3.5 rounded-sm",
                                      status === 'attended' && "bg-emerald-400",
                                      status === 'missed' && "bg-rose-400",
                                      status === 'no_class' && "bg-muted"
                                    )}
                                  />
                                ))
                              : <span className="text-[11px] text-muted-foreground">—</span>
                            }
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-emerald-600">
                          {aluno.presenca}%
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Top professores */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Medal className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Top Professores
              </h3>
            </div>
            <div className="space-y-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted animate-pulse rounded-lg"
                    />
                  ))
                : topProfessores.map((prof) => (
                    <div
                      key={prof.nome}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {prof.nome
                          .split(" ")
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-foreground truncate">
                          {prof.nome}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {prof.aulas} aulas · {prof.alunos} alunos
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground tabular-nums">
                          {prof.ocupacao}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          ocupação
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Alunos inativos */}
        <section id="section-inativos" className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">
                Alunos Inativos
                <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                  ({alunosInativos.length} alunos sem aula há 14+ dias)
                </span>
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                  <th className="text-left py-2 px-2 font-medium">Aluno</th>
                  <th className="text-left py-2 px-2 font-medium">
                    Última Aula
                  </th>
                  <th className="text-right py-2 px-2 font-medium">
                    Dias Inativo
                  </th>
                  <th className="text-right py-2 px-2 font-medium">
                    Créditos
                  </th>
                  <th className="text-right py-2 px-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td colSpan={5} className="py-3 px-2">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                        </td>
                      </tr>
                    ))
                  : alunosInativos.map((aluno) => (
                      <tr
                        key={aluno.nome}
                        className="border-b border-border/50 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-3 px-2 font-semibold text-foreground text-[13px]">
                          {aluno.nome}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-[13px]">
                          {aluno.ultimaAula}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold tabular-nums">
                            {aluno.diasInativo} dias
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right tabular-nums font-semibold text-emerald-600">
                          {aluno.creditos}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 text-[11px]"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 gap-1 text-[11px]"
                            >
                              <Send className="w-3 h-3" />
                              Reativar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
    </main>
  );
}
