'use client'

import { useEffect, useMemo, useState } from 'react';
import PageDefault from '@/components/template/default';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import NpsRepository from '../../../../core/Nps';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── Helpers ───────────────────────────────────────────────────────────────────

function npsColor(score: number | null): string {
    if (score === null) return '#6b7280';
    if (score >= 50) return '#10b981';
    if (score >= 0)  return '#f59e0b';
    return '#ef4444';
}

function npsLabel(score: number | null): string {
    if (score === null) return '—';
    if (score >= 75) return 'Excelente';
    if (score >= 50) return 'Muito bom';
    if (score >= 0)  return 'Bom';
    return 'Crítico';
}

function fmtDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
}

function ScoreBadge({ score }: { score: number }) {
    const stars = Math.round(score / 2);
    return (
        <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill={s <= stars ? '#f59e0b' : '#e5e7eb'} className="w-4 h-4">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </span>
    );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color }: {
    label: string; value: string | number; sub?: string; color?: string;
}) {
    return (
        <Card>
            <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                <p className="text-3xl font-extrabold" style={{ color: color ?? 'inherit' }}>{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NpsPage() {
    const repo = useMemo(() => new NpsRepository(), []);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState(3);

    const load = (m: number) => {
        setLoading(true);
        repo.getReport(m).then((res: any) => {
            if (!(res instanceof Error)) setData(res.data);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { load(months); }, []);

    const barData = data?.distribution ? {
        labels: data.distribution.map((d: any) => String(d.score)),
        datasets: [{
            data: data.distribution.map((d: any) => d.count),
            backgroundColor: data.distribution.map((d: any) =>
                d.score >= 9 ? '#10b981' :
                d.score >= 7 ? '#f59e0b' : '#ef4444'
            ),
            borderRadius: 6,
            borderSkipped: false,
        }],
    } : null;

    return (
        <PageDefault>
            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-foreground">NPS — Satisfação das Aulas</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Avaliações dos alunos por aula
                    </p>
                </div>
                <div className="flex gap-1 bg-muted rounded-full p-1">
                    {([3, 6, 12] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => { setMonths(m); load(m); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                months === m
                                    ? 'bg-background shadow text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {m === 12 ? '1 ano' : `${m} meses`}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}><CardContent className="p-5">
                            <div className="h-4 bg-muted rounded w-1/2 mb-3 animate-pulse" />
                            <div className="h-8 bg-muted rounded w-2/3 animate-pulse" />
                        </CardContent></Card>
                    ))}
                </div>
            ) : (
                <>
                    {/* ── KPIs ────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <KpiCard
                            label="NPS Score"
                            value={data?.npsScore ?? '—'}
                            sub={npsLabel(data?.npsScore)}
                            color={npsColor(data?.npsScore)}
                        />
                        <KpiCard
                            label="Promotores (9–10)"
                            value={`${data?.promoters?.pct ?? 0}%`}
                            sub={`${data?.promoters?.count ?? 0} avaliações`}
                            color="#10b981"
                        />
                        <KpiCard
                            label="Neutros (7–8)"
                            value={`${data?.passives?.pct ?? 0}%`}
                            sub={`${data?.passives?.count ?? 0} avaliações`}
                            color="#f59e0b"
                        />
                        <KpiCard
                            label="Detratores (0–6)"
                            value={`${data?.detractors?.pct ?? 0}%`}
                            sub={`${data?.detractors?.count ?? 0} avaliações`}
                            color="#ef4444"
                        />
                    </div>

                    {/* ── Score geral + Distribuição ──────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                        {/* Score geral */}
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Nota média
                                </p>
                                <p className="text-6xl font-extrabold" style={{ color: npsColor(data?.npsScore) }}>
                                    {data?.averageScore ?? '—'}
                                </p>
                                <p className="text-sm text-muted-foreground">de 10 · {data?.total ?? 0} respostas</p>

                                {/* Barra de progresso NPS */}
                                <div className="w-full mt-2">
                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                        <span>Detratores</span>
                                        <span>Neutros</span>
                                        <span>Promotores</span>
                                    </div>
                                    <div className="flex h-3 rounded-full overflow-hidden">
                                        <div className="bg-red-400 transition-all" style={{ width: `${data?.detractors?.pct ?? 0}%` }} />
                                        <div className="bg-yellow-400 transition-all" style={{ width: `${data?.passives?.pct ?? 0}%` }} />
                                        <div className="bg-emerald-400 transition-all" style={{ width: `${data?.promoters?.pct ?? 0}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-semibold mt-1">
                                        <span className="text-red-500">{data?.detractors?.pct ?? 0}%</span>
                                        <span className="text-yellow-500">{data?.passives?.pct ?? 0}%</span>
                                        <span className="text-emerald-500">{data?.promoters?.pct ?? 0}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Distribuição por nota */}
                        <Card className="lg:col-span-2">
                            <CardContent className="p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                    Distribuição por nota
                                </p>
                                {barData ? (
                                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                        <Bar
                                            data={barData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false }, tooltip: {
                                                    callbacks: { label: (ctx: any) => `${ctx.raw} resposta(s)` }
                                                }},
                                                scales: {
                                                    y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f3f4f6' } },
                                                    x: { grid: { display: false } },
                                                },
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Feedbacks recentes ──────────────────────────── */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="px-5 py-4 border-b border-border">
                                <p className="text-sm font-semibold text-foreground">Feedbacks recentes</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            {['NOTA', 'ALUNO', 'AULA', 'DATA', 'COMENTÁRIO'].map(col => (
                                                <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!data?.recentFeedback?.length ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                                    Nenhum feedback no período.
                                                </td>
                                            </tr>
                                        ) : data.recentFeedback.map((fb: any) => (
                                            <tr key={fb.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                                <td className="px-4 py-3">
                                                    <ScoreBadge score={fb.score} />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-foreground">{fb.studentName}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{fb.className}</td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(fb.classDate)}</td>
                                                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                                    {fb.comment ?? <span className="italic opacity-50">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </PageDefault>
    );
}
