'use client'

import { useEffect, useMemo, useState, useCallback } from "react";
import PageDefault from "@/components/template/default";
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
  Legend,
} from "recharts";
import StatisticsRepository from "../../../../core/Statistics";
import PersonsRepository from "../../../../core/Persons";
import ProductRepository from "../../../../core/Product";
import AuthSelectMulti from "@/components/auth/AuthSelectMulti";
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

function MultiBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/40 bg-white/90 px-4 py-3 shadow-xl text-xs min-w-[140px]">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex flex-col gap-1.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-sm font-bold text-foreground tabular-nums">{p.value}</span>
            <span className="text-muted-foreground">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Estatisticas() {
  const repo = useMemo(() => new StatisticsRepository(), []);
  const repoPersons = useMemo(() => new PersonsRepository(), []);
  const repoProducts = useMemo(() => new ProductRepository(), []);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'alunos' | 'alertas' | 'aulas'>('visao-geral');

  const [overview, setOverview] = useState<any>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [inactiveStudents, setInactiveStudents] = useState<any[]>([]);
  const [studentsAtRisk, setStudentsAtRisk] = useState<any[]>([]);
  const [expiringCredits, setExpiringCredits] = useState<any[]>([]);
  const [occupancyByTime, setOccupancyByTime] = useState<any>(null);
  const [topTeachers, setTopTeachers] = useState<any[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any>(null);
  const [dormantClients, setDormantClients] = useState<any[]>([]);
  const [dormantFilters, setDormantFilters] = useState<Set<string>>(new Set());
  const [birthdays, setBirthdays] = useState<any[]>([]);

  // ── Relatório dinâmico: clientes exclusivos de produto(s) ────────
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[] | null>(null);
  const [exclusiveBuyers, setExclusiveBuyers] = useState<any[]>([]);
  const [loadingExclusiveBuyers, setLoadingExclusiveBuyers] = useState(false);

  // ── Relatório: aulas e alunos por mês ────────────────────────────
  const [classesStudentsByMonth, setClassesStudentsByMonth] = useState<any[]>([]);
  const [loadingByMonth, setLoadingByMonth] = useState(false);

  useEffect(() => {
    setLoadingByMonth(true);
    repo.getClassesAndStudentsByMonth()
      .then((res: any) => setClassesStudentsByMonth(toArray(res)))
      .finally(() => setLoadingByMonth(false));
  }, [repo]);

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
        dormantRes,
        birthdaysRes,
      ] = await Promise.all([
        repo.getOverviewMetrics(startDate, endDate),
        repo.getTopStudents(10, periodo),
        repo.getInactiveStudents(14),
        repo.getStudentsAtRisk(),
        repo.getCreditsExpiringSoon(7),
        repo.getOccupancyByTime(startDate, endDate),
        repo.getTopTeachers(5),
        repo.getWeeklyTrends(startDate, endDate, periodo),
        repo.getDormantClients(),
        repoPersons.getBirthdaysThisWeek(),
      ]);

      setOverview(toObject(overviewRes));
      setTopStudents(toArray(topStudentsRes));
      setInactiveStudents(toArray(inactiveRes));
      setStudentsAtRisk(toArray(atRiskRes));
      setExpiringCredits(toArray(expiringRes));
      setOccupancyByTime(toObject(occupancyTimeRes));
      setTopTeachers(toArray(teachersRes));
      setWeeklyTrends(toObject(trendsRes));
      setDormantClients(toArray(dormantRes));
      setBirthdays(toArray(birthdaysRes));
    } catch (e) {
      console.error("Erro ao carregar estatísticas:", e);
    } finally {
      setLoading(false);
    }
  }, [periodo, repo, repoPersons]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Carrega a lista de produtos uma vez, e pré-seleciona o(s) que tiverem
  // "experimental" no nome (comportamento padrão atual do relatório).
  useEffect(() => {
    repoProducts.listAll().then((res: any) => {
      const products = toArray(res);
      setAllProducts(products);
      const defaultIds = products
        .filter((p: any) => String(p.name ?? "").toLowerCase().includes("experimental"))
        .map((p: any) => String(p.id));
      setSelectedProductIds(defaultIds);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refaz o relatório de "compradores exclusivos" sempre que o filtro de
  // produto(s) mudar — é o que torna o relatório dinâmico (hoje é a aula
  // experimental, amanhã pode ser outro produto qualquer).
  useEffect(() => {
    if (selectedProductIds === null) return;
    if (selectedProductIds.length === 0) {
      setExclusiveBuyers([]);
      return;
    }
    setLoadingExclusiveBuyers(true);
    repo.getTrialNoConversion(selectedProductIds)
      .then((res: any) => setExclusiveBuyers(toArray(res)))
      .finally(() => setLoadingExclusiveBuyers(false));
  }, [selectedProductIds, repo]);

  const productOptions = useMemo(
    () => allProducts.map((p: any) => ({ label: p.name, value: String(p.id) })),
    [allProducts]
  );

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
      cta: "",
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
    periodData: s.periodData ?? [],
  }));

  const topProfessores = topTeachers.map((t: any) => ({
    nome: t.name ?? t.nome ?? "",
    aulas: t.classCount ?? t.aulas ?? 0,
    alunos: t.totalStudents ?? t.alunos ?? 0,
    ocupacao: t.averageOccupancy ?? t.ocupacao ?? 0,
  }));

  const alunosInativos = inactiveStudents.map((a: any) => ({
    id: a.studentId ?? a.id ?? a.name ?? a.nome,
    nome: a.name ?? a.nome ?? "",
    phone: a.phone ?? null,
    ultimaAula: a.lastClassDate
      ? new Date(a.lastClassDate).toLocaleDateString("pt-BR")
      : (a.ultimaAula ?? ""),
    diasInativo: a.daysInactive ?? a.diasInativo ?? 0,
    creditos: a.credits ?? a.creditos ?? 0,
  }));

  // ── Helpers de render reutilizáveis ────────────────────────────

  const OccupancyHeatmap = () => (
    ocupacaoHorario.length === 0
      ? <p className="text-sm text-muted-foreground text-center py-8">Sem dados de ocupação disponíveis</p>
      : <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${ocupacaoHorario.length}, minmax(0, 1fr))` }}>
          {ocupacaoHorario.map((slot: any) => {
            const intensity: number = slot.ocupacao;
            let bg = "bg-primary/10";
            if (intensity >= 60) bg = "bg-primary";
            else if (intensity >= 40) bg = "bg-primary/70";
            else if (intensity >= 25) bg = "bg-primary/40";
            else if (intensity >= 15) bg = "bg-primary/20";
            const isLight = intensity < 40;
            return (
              <div key={slot.horario} className={cn("w-full rounded-xl flex flex-col items-center justify-between py-3 px-2 transition-all hover:scale-105 cursor-default border", bg, isLight ? "border-border" : "border-primary-foreground/20")}>
                <Clock className={cn("w-3.5 h-3.5", isLight ? "text-foreground/40" : "text-primary-foreground/70")} />
                <span className={cn("text-[11px] font-bold tabular-nums mt-2", isLight ? "text-foreground/80" : "text-primary-foreground")}>
                  {slot.vagas > 0 ? `${slot.alunos}/${slot.vagas}` : `${slot.alunos}`}
                </span>
                <span className={cn("text-[10px] font-semibold mt-0.5", isLight ? "text-foreground/50" : "text-primary-foreground/70")}>{slot.ocupacao}%</span>
                <span className={cn("text-[10px] font-semibold mt-2 tabular-nums", isLight ? "text-foreground/60" : "text-primary-foreground/80")}>{slot.horario}</span>
              </div>
            );
          })}
        </div>
  );

  // ── Render ──────────────────────────────────────────────────────

  const TABS = [
    { key: 'visao-geral', label: 'Visão Geral' },
    { key: 'alunos',      label: 'Alunos' },
    { key: 'alertas',     label: `Alertas ${!loading && (inactiveStudents.length + studentsAtRisk.length) > 0 ? `(${inactiveStudents.length + studentsAtRisk.length})` : ''}` },
    { key: 'aulas',       label: 'Aulas' },
  ] as const;

  return (
    <PageDefault>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Estatísticas & Insights
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acompanhe a performance do seu estúdio em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            {PERIODOS.map((p) => (
              <button key={p.value} onClick={() => setPeriodo(p.value)}
                className={cn("px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all",
                  periodo === p.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
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

      {/* ── KPIs — sempre visíveis ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, i) => {
          const Icon = KPI_ICONS[i % KPI_ICONS.length];
          const Trend = kpi.delta?.positive ? TrendingUp : TrendingDown;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className={cn("text-2xl font-bold tabular-nums", loading ? "text-muted-foreground animate-pulse" : "text-foreground")}>
                {loading ? "—" : kpi.value}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                {kpi.delta && !loading && (
                  <span className={cn("inline-flex items-center gap-0.5 font-semibold", kpi.delta.positive ? "text-emerald-600" : "text-rose-600")}>
                    <Trend className="w-3 h-3" />{kpi.delta.value}
                  </span>
                )}
                {kpi.hint && <span className="text-muted-foreground">{kpi.hint}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Abas ───────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn("px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground")}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ABA: VISÃO GERAL ───────────────────────────────────── */}
      {activeTab === 'visao-geral' && (
        <div className="space-y-6">
          {/* Charts + Insights lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Gráficos (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Alunos por Horário */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Alunos por Horário</h3>
                    <p className="text-[11px] text-muted-foreground">Número de alunos por faixa de horário</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{PERIODOS.find((p) => p.value === periodo)?.label}</Badge>
                </div>
                <div className="h-52">
                  {loading ? <div className="h-full bg-muted animate-pulse rounded-lg" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={alunosPorHorario} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="horario" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <RTooltip cursor={{ fill: "rgba(0,0,0,0.06)" }} content={<BarTooltip />} />
                        <Bar dataKey="alunos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} activeBar={{ fill: "hsl(var(--primary))", opacity: 0.8 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Alunos por Dia */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-foreground">Alunos por Dia</h3>
                  <p className="text-[11px] text-muted-foreground">{periodo === "hoje" || periodo === "semana" ? "Distribuição Dom–Sáb" : "Evolução no período"}</p>
                </div>
                <div className="h-52">
                  {loading ? <div className="h-full bg-muted animate-pulse rounded-lg" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={alunosPorDia} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <RTooltip cursor={{ fill: "rgba(0,0,0,0.06)" }} content={<BarTooltip />} />
                        <Bar dataKey="alunos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} activeBar={{ fill: "hsl(var(--primary))", opacity: 0.8 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Insights empilhados (1/3) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-foreground">Insights</h2>
              </div>
              {insights.map((insight) => {
                const style = INSIGHT_STYLES[insight.tone];
                return (
                  <div key={insight.id} className={cn("rounded-xl border p-4 flex flex-col", style.wrap)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-sm text-foreground">{insight.title}</div>
                      <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", style.badge)}>
                        {loading ? "—" : insight.count}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug mb-2">{insight.description}</p>
                    {insight.cta && (
                      <button onClick={() => { if (insight.id === 'inativos' || insight.id === 'risco') setActiveTab('alertas'); else if (insight.id === 'engajamento') setActiveTab('alunos'); }}
                        className="mt-auto text-[11px] font-semibold text-foreground/80 hover:text-foreground self-start">
                        {insight.cta} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heatmap de ocupação */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Taxa de Ocupação por Horário</h3>
              <p className="text-[11px] text-muted-foreground">Identifique seus horários de pico</p>
            </div>
            {loading ? <div className="h-24 bg-muted animate-pulse rounded-lg" /> : <OccupancyHeatmap />}
          </div>
        </div>
      )}

      {/* ── ABA: ALUNOS ────────────────────────────────────────── */}
      {activeTab === 'alunos' && (
        <div className="space-y-6">
          {/* Top Alunos */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">Top {topAlunos.length || 10} Alunos</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                  <th className="text-left py-2 px-2 font-medium w-10">#</th>
                  <th className="text-left py-2 px-2 font-medium">Aluno</th>
                  <th className="text-right py-2 px-2 font-medium">Aulas</th>
                  <th className="text-right py-2 px-2 font-medium">{periodo === "mes" ? "Semanas do Mês" : periodo === "trimestre" ? "Últimos 3 Meses" : "Últimos 7 dias"}</th>
                  <th className="text-right py-2 px-2 font-medium">Presença</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50"><td colSpan={5} className="py-3 px-2"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                )) : topAlunos.map((aluno) => (
                  <tr key={aluno.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 px-2">
                      <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                        aluno.rank === 1 && "bg-amber-100 text-amber-700",
                        aluno.rank === 2 && "bg-slate-200 text-slate-700",
                        aluno.rank === 3 && "bg-orange-100 text-orange-700",
                        aluno.rank > 3 && "bg-muted text-muted-foreground")}>
                        {aluno.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-foreground text-[13px]">{aluno.nome}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-semibold">{aluno.aulas}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center justify-end gap-1">
                        {(periodo === "mes" || periodo === "trimestre") && aluno.periodData.length > 0
                          ? aluno.periodData.map((p: { label: string; status: string }) => (
                              <div key={p.label} className="flex flex-col items-center gap-0.5">
                                <div title={p.status === "attended" ? "Presente" : p.status === "missed" ? "Faltou" : "Sem aula"}
                                  className={cn("w-5 h-5 rounded-sm", p.status === "attended" && "bg-emerald-400", p.status === "missed" && "bg-rose-400", p.status === "no_class" && "bg-muted")} />
                                <span className="text-[8px] text-muted-foreground">{p.label}</span>
                              </div>
                            ))
                          : aluno.last7.map((status: string, i: number) => (
                              <div key={`day-${i}`} title={status === "attended" ? "Presente" : status === "missed" ? "Faltou" : "Sem aula"}
                                className={cn("w-3.5 h-3.5 rounded-sm", status === "attended" && "bg-emerald-400", status === "missed" && "bg-rose-400", status === "no_class" && "bg-muted")} />
                            ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-emerald-600">{aluno.presenca}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Aniversariantes + Clientes Dormentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Aniversariantes */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🎂</span>
                <h3 className="text-sm font-bold text-foreground">Aniversariantes da Semana</h3>
                <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{loading ? "—" : birthdays.length}</span>
              </div>
              {loading ? (
                <div className="flex gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 w-32 bg-muted animate-pulse rounded-xl" />)}</div>
              ) : birthdays.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">Nenhum aniversariante esta semana.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {birthdays.map((b: any) => {
                    const parts = String(b.birthday).split('T')[0].split('-');
                    const formatted = `${parts[2]}/${parts[1]}`;
                    return (
                      <div key={b.id} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors", b.isToday ? "border-amber-300 bg-amber-50" : "border-border bg-muted/30")}>
                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", b.isToday ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground")}>
                          {b.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{b.name}</p>
                          <p className="text-[11px] text-muted-foreground">{b.isToday ? "🎉 Hoje!" : `Em ${b.daysUntil} dia${b.daysUntil !== 1 ? "s" : ""}`} · {formatted}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clientes Dormentes */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Clientes Sem Atividade</h3>
                  <p className="text-[11px] text-muted-foreground">Com pelo menos uma condição inativa</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{loading ? "—" : `${dormantClients.length}`}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  { key: "hasNoClass", label: "Sem aula", dot: "bg-rose-400", color: "text-rose-700 border-rose-200 hover:bg-rose-50", active: "bg-rose-500 text-white border-rose-500" },
                  { key: "hasNoPurchase", label: "Sem compra", dot: "bg-amber-400", color: "text-amber-700 border-amber-200 hover:bg-amber-50", active: "bg-amber-500 text-white border-amber-500" },
                  { key: "hasNoContract", label: "Sem contrato", dot: "bg-sky-400", color: "text-sky-700 border-sky-200 hover:bg-sky-50", active: "bg-sky-500 text-white border-sky-500" },
                ].map((f) => {
                  const isActive = dormantFilters.has(f.key);
                  return (
                    <button key={f.key}
                      onClick={() => setDormantFilters((prev) => { const next = new Set(prev); isActive ? next.delete(f.key) : next.add(f.key); return next; })}
                      className={cn("inline-flex items-center gap-1 px-2.5 h-7 rounded text-[11px] font-semibold border transition-all", isActive ? f.active : f.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isActive ? "bg-white/80" : f.dot)} />{f.label}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const filtered = dormantFilters.size === 0 ? dormantClients : dormantClients.filter((c: any) => [...dormantFilters].every((key) => c[key] === true));
                if (loading) return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}</div>;
                if (filtered.length === 0) return <p className="text-sm text-muted-foreground text-center py-6">Nenhum cliente para os filtros selecionados</p>;
                return (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {filtered.map((client: any) => (
                      <div key={client.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0">
                          {client.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-foreground truncate">{client.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{client.email}</p>
                          {client.phone && <p className="text-[10px] text-muted-foreground truncate">{client.phone}</p>}
                        </div>
                        <div className="flex flex-col gap-0.5 items-end shrink-0">
                          {client.hasNoClass && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">Sem aula</span>}
                          {client.hasNoPurchase && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">Sem compra</span>}
                          {client.hasNoContract && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600">Sem contrato</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── ABA: ALERTAS ───────────────────────────────────────── */}
      {activeTab === 'alertas' && (
        <div className="space-y-6">
          {/* Alunos Inativos */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">
                Alunos Inativos
                <span className="ml-2 text-[11px] font-normal text-muted-foreground">({alunosInativos.length} alunos sem aula há 14+ dias)</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                    <th className="text-left py-2 px-2 font-medium">Aluno</th>
                    <th className="text-left py-2 px-2 font-medium">Última Aula</th>
                    <th className="text-right py-2 px-2 font-medium">Dias Inativo</th>
                    <th className="text-right py-2 px-2 font-medium">Créditos</th>
                    <th className="text-right py-2 px-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50"><td colSpan={5} className="py-3 px-2"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                  )) : alunosInativos.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Nenhum aluno inativo</td></tr>
                  ) : alunosInativos.map((aluno) => (
                    <tr key={aluno.id} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-2">
                        <p className="font-semibold text-foreground text-[13px]">{aluno.nome}</p>
                        {aluno.phone && <p className="text-[11px] text-muted-foreground">{aluno.phone}</p>}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-[13px]">{aluno.ultimaAula}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold tabular-nums">{aluno.diasInativo} dias</span>
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums font-semibold text-emerald-600">{aluno.creditos}</td>
                      <td className="py-3 px-2 text-right">
                        <Button size="sm" variant="outline" disabled className="h-7 gap-1 text-[11px]">
                          <MessageSquare className="w-3 h-3" />WhatsApp
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alunos em Risco */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-foreground">
                Queda de Frequência
                <span className="ml-2 text-[11px] font-normal text-muted-foreground">({studentsAtRisk.length} alunos com redução significativa)</span>
              </h3>
            </div>
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>
            ) : studentsAtRisk.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum aluno em risco identificado</p>
            ) : (
              <div className="divide-y divide-border">
                {studentsAtRisk.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-3 hover:bg-muted/40 transition-colors px-2 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {(s.name ?? "").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-foreground truncate">{s.name ?? s.nome}</p>
                      <p className="text-[11px] text-muted-foreground">{s.reason ?? s.motivo ?? "Frequência abaixo do esperado"}</p>
                      {s.phone && <p className="text-[11px] text-muted-foreground">{s.phone}</p>}
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 shrink-0">
                      {s.attendanceRate ?? s.presenca ?? 0}% presença
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ABA: CLIENTES EXCLUSIVOS DE PRODUTO(S) ─────────────── */}
      {activeTab === 'alertas' && (
        <div className="bg-card border border-border rounded-xl p-5 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Clientes Exclusivos de Produto
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Compraram apenas o(s) produto(s) selecionado(s) e nada além disso
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {loadingExclusiveBuyers ? "—" : exclusiveBuyers.length}
              </span>
            </div>
            <div className="w-full sm:w-72">
              <AuthSelectMulti
                label="Produto(s)"
                options={productOptions}
                value={selectedProductIds ?? []}
                changeValue={setSelectedProductIds}
              />
            </div>
          </div>
          {loadingExclusiveBuyers ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}</div>
          ) : selectedProductIds !== null && selectedProductIds.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Selecione ao menos um produto para gerar o relatório</p>
          ) : exclusiveBuyers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum aluno encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                    <th className="text-left py-2 px-2 font-medium">Nome</th>
                    <th className="text-left py-2 px-2 font-medium">Telefone</th>
                    <th className="text-left py-2 px-2 font-medium">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {exclusiveBuyers.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-2 font-medium text-foreground">{p.name}</td>
                      <td className="py-2.5 px-2 text-muted-foreground">{p.phone ?? "—"}</td>
                      <td className="py-2.5 px-2 text-muted-foreground">{p.email ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ABA: AULAS ─────────────────────────────────────────── */}
      {activeTab === 'aulas' && (
        <div className="space-y-6">
          {/* Aulas e Alunos por Mês */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Aulas e Alunos por Mês</h3>
              <p className="text-[11px] text-muted-foreground">
                Aulas ativas, total de presenças e alunos únicos (sem canceladas) — desde março
              </p>
            </div>
            {loadingByMonth ? (
              <div className="h-72 bg-muted animate-pulse rounded-lg" />
            ) : classesStudentsByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sem dados disponíveis</p>
            ) : (
              <>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classesStudentsByMonth} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <RTooltip cursor={{ fill: "rgba(0,0,0,0.06)" }} content={<MultiBarTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="classCount" name="Aulas" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                      <Bar yAxisId="left" dataKey="uniqueStudentCount" name="Alunos Únicos" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      <Bar yAxisId="right" dataKey="studentCount" name="Total de Presenças" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                        <th className="text-left py-2 px-2 font-medium">Mês</th>
                        <th className="text-right py-2 px-2 font-medium">Nº de Aulas</th>
                        <th className="text-right py-2 px-2 font-medium">Alunos Únicos</th>
                        <th className="text-right py-2 px-2 font-medium">Total de Presenças</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classesStudentsByMonth.map((m: any) => (
                        <tr key={m.month} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-foreground">{m.label}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums">{m.classCount}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-violet-600">{m.uniqueStudentCount}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-emerald-600">{m.studentCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Top Professores */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Medal className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Top Professores</h3>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>
            ) : topProfessores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sem dados de professores</p>
            ) : (
              <div className="divide-y divide-border">
                {topProfessores.map((prof, i) => (
                  <div key={prof.nome} className="flex items-center gap-4 py-4">
                    <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold shrink-0",
                      i === 0 && "bg-amber-100 text-amber-700",
                      i === 1 && "bg-slate-200 text-slate-700",
                      i === 2 && "bg-orange-100 text-orange-700",
                      i > 2 && "bg-muted text-muted-foreground")}>{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {prof.nome.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-foreground">{prof.nome}</div>
                      <div className="text-[11px] text-muted-foreground">{prof.aulas} aulas · {prof.alunos} alunos únicos</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-foreground tabular-nums">{prof.ocupacao}%</div>
                      <div className="text-[10px] text-muted-foreground">ocupação média</div>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(prof.ocupacao, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heatmap de Ocupação */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Taxa de Ocupação por Horário</h3>
              <p className="text-[11px] text-muted-foreground">Intensidade de cor indica maior ocupação</p>
            </div>
            {loading ? <div className="h-28 bg-muted animate-pulse rounded-lg" /> : <OccupancyHeatmap />}
          </div>
        </div>
      )}
    </PageDefault>
  );
}
