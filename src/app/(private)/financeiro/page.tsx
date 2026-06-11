'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useRef, useState } from "react";
import ResultsCollection from "../../../../core/Results";
import TotalSalesRepository from "../../../../core/TotalSales";
import StatisticsRepository from "../../../../core/Statistics";
import DropDownsCollection from "../../../../core/DropDowns";
import Link from "next/link";
import KPICard from "@/components/KPICard";
import Modal from "@/components/Modal/Modal";
import CheckoutCollecion from "../../../../core/Checkout";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Results() {
    const repo = useMemo(() => new ResultsCollection(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const repoCheckout = useMemo(() => new CheckoutCollecion(), []);
    const salesRepo = useMemo(() => new TotalSalesRepository(), []);

    const [page, setPage] = useState<number>(1);
    const [transaction, setTransaction] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [students, setStudents] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultsList, setResultsList] = useState<any[]>([]);
    const [dropdownStudent, setDropdownStudent] = useState<any[]>([]);

    // Estados para verificação de PIX
    const [pixModal, setPixModal] = useState<boolean>(false);
    const [pixStatus, setPixStatus] = useState<any>(null);
    const [pixLoading, setPixLoading] = useState<boolean>(false);

    // Estados para cancelamento
    const [cancelModal, setCancelModal] = useState<boolean>(false);
    const [cancelChargeId, setCancelChargeId] = useState<string>('');
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [cancelResult, setCancelResult] = useState<{ success: boolean; message: string } | null>(null);

    const openCancelModal = (chargeId: string) => {
        setCancelChargeId(chargeId);
        setAdminPassword('');
        setCancelResult(null);
        setCancelModal(true);
    };

    const confirmCancel = () => {
        setCancelLoading(true);
        repoCheckout.cancelPaymentAndRefund(cancelChargeId, adminPassword).then((result: any) => {
            if (result instanceof Error) {
                const msg = JSON.parse(result.message);
                setCancelResult({ success: false, message: msg.error || 'Erro ao cancelar.' });
            } else {
                setCancelResult({ success: true, message: 'Pagamento cancelado com sucesso.' });
                listResults();
            }
            setCancelLoading(false);
        });
    };

    const checkPixStatus = (chargeId: string) => {
        setPixStatus(null);
        setPixLoading(true);
        setPixModal(true);
        repoCheckout.getPixStatus(chargeId).then((result: any) => {
            if (!(result instanceof Error)) {
                setPixStatus(result);
            }
            setPixLoading(false);
        });
    };

    // Estados para métricas
    const [metrics, setMetrics] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [paymentDistribution, setPaymentDistribution] = useState<any>(null);
    const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);

    // Estados para relatório financeiro
    type ReportPeriod = 'month' | 'quarter' | 'year' | 'custom';
    const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('month');
    const [reportStartDate, setReportStartDate] = useState<string>('');
    const [reportEndDate, setReportEndDate] = useState<string>('');
    const [reportData, setReportData] = useState<any>(null);
    const [reportTotal, setReportTotal] = useState<number>(0);
    const [loadingReport, setLoadingReport] = useState<boolean>(false);

    const statsRepo = useMemo(() => new StatisticsRepository(), []);
    const [activeTab, setActiveTab] = useState<'relatorio' | 'transacoes'>('relatorio');

    // Análise financeira
    const [ticketPerClass, setTicketPerClass] = useState<any>(null);
    const [purchasesByWeekday, setPurchasesByWeekday] = useState<any[]>([]);
    const [repurchaseInterval, setRepurchaseInterval] = useState<any>(null);
    const [boughtVsUsed, setBoughtVsUsed] = useState<any>(null);
    const [cumulativeRevenue, setCumulativeRevenue] = useState<any>(null);
    const [mostPurchased, setMostPurchased] = useState<any[]>([]);
    const [mostPurchasedMonths, setMostPurchasedMonths] = useState<3 | 6 | 12>(6);
    const [showInactiveProducts, setShowInactiveProducts] = useState(false);
    const [loadingMostPurchased, setLoadingMostPurchased] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    // Estados para compradores por produto
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [productBuyers, setProductBuyers] = useState<any>(null);
    const [loadingProductBuyers, setLoadingProductBuyers] = useState(false);

    const loadProductBuyers = (productId: number) => {
        setSelectedProductId(productId);
        setLoadingProductBuyers(true);
        statsRepo.getProductBuyers(productId).then((res: any) => {
            if (!(res instanceof Error)) setProductBuyers(res?.data ?? null);
        }).finally(() => setLoadingProductBuyers(false));
    };

    // Estados para histórico de pagamento
    type HistoryRange = 3 | 6 | 12;
    const [historyRange, setHistoryRange] = useState<HistoryRange>(6);
    const [historyLabels, setHistoryLabels] = useState<string[]>([]);
    const [historyData, setHistoryData] = useState<number[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const loadAnalytics = async () => {
        setLoadingAnalytics(true);
        const [t, w, r, b, c, m] = await Promise.all([
            statsRepo.getTicketPerClass(),
            statsRepo.getPurchasesByWeekday(),
            statsRepo.getRepurchaseInterval(),
            statsRepo.getBoughtVsUsed(),
            statsRepo.getCumulativeRevenue(),
            statsRepo.getMostPurchasedProducts(),
        ]);
        if (!(t instanceof Error)) setTicketPerClass(t?.data);
        if (!(w instanceof Error)) setPurchasesByWeekday(w?.data ?? []);
        if (!(r instanceof Error)) setRepurchaseInterval(r?.data);
        if (!(b instanceof Error)) setBoughtVsUsed(b?.data);
        if (!(c instanceof Error)) setCumulativeRevenue(c?.data);
        if (!(m instanceof Error)) { setMostPurchased(m?.data ?? []); }
        setLoadingMostPurchased(false);
        setLoadingAnalytics(false);
    };

    const MONTH_LABELS = ['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.'];

    const loadHistory = async (months: HistoryRange = historyRange) => {
        setLoadingHistory(true);
        const now = new Date();
        const currentYear = now.getFullYear();
        const needsPrevYear = (now.getMonth() + 1) - months <= 0;

        try {
            const [currRes, prevRes] = await Promise.all([
                salesRepo.consult(String(currentYear)),
                needsPrevYear ? salesRepo.consult(String(currentYear - 1)) : Promise.resolve(null),
            ]);

            const byYearMonth: Record<string, number> = {};
            const addEntries = (res: any, year: number) => {
                if (res instanceof Error || !res?.data) return;
                for (const entry of res.data) {
                    byYearMonth[`${year}-${entry.month}`] = entry.totalSales / 100;
                }
            };
            addEntries(currRes, currentYear);
            if (prevRes) addEntries(prevRes, currentYear - 1);

            const labels: string[] = [];
            const values: number[] = [];
            for (let i = months - 1; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                labels.push(MONTH_LABELS[d.getMonth()]);
                values.push(byYearMonth[key] ?? 0);
            }

            setHistoryLabels(labels);
            setHistoryData(values);
        } finally {
            setLoadingHistory(false);
        }
    };

    const statusColors: any = {
        processing: '#FFA500',
        authorized: '#87CEEB',
        paid: '#4CAF50',
        refunded: '#FF0000',
        waiting_payment: '#FFC107',
        pending_refund: '#FF4500',
        refused: '#8B0000',
        chargeback: '#8A2BE2',
        analyzing: '#FFD700',
        pending_review: '#F08080',
    };

    // Carregar relatório financeiro
    const loadReport = async (period: ReportPeriod = reportPeriod, start = reportStartDate, end = reportEndDate) => {
        setLoadingReport(true);
        try {
            const result = await repo.getRevenueOverTime(period, start || undefined, end || undefined);
            if (!(result instanceof Error)) {
                setReportData(result);
                const total = (result.data || []).reduce((acc: number, v: number) => acc + v, 0);
                setReportTotal(total);
            }
        } catch (e) {
            console.error('Erro ao carregar relatório:', e);
        } finally {
            setLoadingReport(false);
        }
    };

    // Carregar métricas
    const loadMetrics = async () => {
        setLoadingMetrics(true);
        try {
            const [metricsResult, revenueResult, paymentResult] = await Promise.all([
                repo.getFinancialMetrics(),
                repo.getRevenueOverTime('month'),
                repo.getPaymentMethodDistribution()
            ]);

            if (!(metricsResult instanceof Error)) {
                setMetrics(metricsResult);
            }

            if (!(revenueResult instanceof Error)) {
                // A API pode retornar com ou sem .data
                const revenueData: any = revenueResult;
                setRevenueData(revenueResult);
            }

            if (!(paymentResult instanceof Error)) {
                // A API retorna { success: true, data: [...] }
                const paymentData: any = paymentResult;
                setPaymentDistribution(paymentData.data || paymentData || []);
            }
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
        } finally {
            setLoadingMetrics(false);
        }
    };

    const convertValue = (cell: number) => {
        const newValue = cell / 100;
        return newValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    };

    const formatDateToBrazilIntl = (utcDateString: string) => {
        const date = new Date(utcDateString);
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const convertStatus = (cell: string) => {
        return (
            <div
                style={{
                    backgroundColor: statusColors[cell] || '#D3D3D3',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    display: 'inline-block',
                    maxWidth: '150px',
                    fontSize: '14px'
                }}
            >
                {cell}
            </div>
        );
    };

    const convertPaymentMethod = (cell: string) => {
        const labels: Record<string, string> = {
            pix: 'PIX',
            credit_card: 'Cartão de Crédito',
            debit_card: 'Cartão de Débito',
            cash: 'Dinheiro',
            boleto: 'Boleto',
        };
        const colors: Record<string, string> = {
            pix: '#10b981',
            credit_card: '#6366f1',
            debit_card: '#3b82f6',
            cash: '#f59e0b',
            boleto: '#8b5cf6',
        };
        const label = labels[cell] ?? cell;
        const color = colors[cell] ?? '#9ca3af';
        return (
            <div style={{
                backgroundColor: `${color}20`,
                color,
                padding: '3px 8px',
                borderRadius: '5px',
                textAlign: 'center',
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: 600,
                border: `1px solid ${color}40`,
            }}>
                {label}
            </div>
        );
    };

    const listResults = (clear: boolean = false) => {
        setLoading(true);
        let obj = {
            students: !clear ? students : null,
            date: !clear ? date : '',
            transaction: !clear ? transaction : '',
        };

        repo.getLatestTransactions(obj.students, obj.date, obj.transaction, page)
            .then((result: any) => {
                if (!(result instanceof Error)) {
                    setResultsList(result.data || []);
                }
                setLoading(false);
            })
            .catch((error: any) => {
                console.error('Erro ao carregar transações:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        listResults();
        loadMetrics();
        loadReport('month');
        loadHistory(6);
        loadAnalytics();
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        setTransaction('');
        setDate('');
        setStudents(null);
        listResults(true);
    };

    const onSubmit = () => {
        listResults();
    };

    // Configuração do gráfico de receita
    const revenueChartData = revenueData ? {
        labels: revenueData.labels || [],
        datasets: [
            {
                label: 'Receita (R$)',
                data: revenueData.data || [],
                borderColor: '#f23238',
                backgroundColor: 'rgba(0, 61, 88, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    } : null;

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `R$ ${value.toLocaleString('pt-BR')}`
                }
            }
        }
    };

    // Configuração do gráfico de distribuição de pagamento
    const paymentChartData = paymentDistribution && Array.isArray(paymentDistribution) && paymentDistribution.length > 0 ? {
        labels: paymentDistribution.map((item: any) => item.method) || [],
        datasets: [
            {
                data: paymentDistribution.map((item: any) => item.count) || [],
                backgroundColor: [
                    '#f23238',
                    '#0066a1',
                    '#4a9fd8',
                    '#87ceeb',
                    '#b0d8f0'
                ],
                borderWidth: 0,
            }
        ]
    } : null;

    const paymentChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <PageDefault title="Financeiro">
            {/* KPI Cards — sempre visíveis */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8 mb-6">
                <div className="col-span-12 lg:col-span-3">
                    <KPICard
                        title="Receita Total"
                        value={metrics ? `R$ ${(metrics.totalRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        trend={metrics?.revenueGrowth ? {
                            value: metrics.revenueGrowth,
                            isPositive: metrics.revenueGrowth > 0,
                            label: 'vs mês anterior'
                        } : undefined}
                        loading={loadingMetrics}
                        iconColor="#10b981"
                    />
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <KPICard
                        title="Total de Transações"
                        value={metrics?.totalTransactions || 0}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                        trend={metrics?.transactionsGrowth ? {
                            value: metrics.transactionsGrowth,
                            isPositive: metrics.transactionsGrowth > 0,
                            label: 'vs mês anterior'
                        } : undefined}
                        loading={loadingMetrics}
                        iconColor="#3b82f6"
                    />
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <KPICard
                        title="Taxa de Sucesso"
                        value={metrics ? `${metrics.successRate.toFixed(1)}%` : '0%'}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        loading={loadingMetrics}
                        iconColor="#10b981"
                    />
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <KPICard
                        title="Ticket Médio"
                        value={metrics ? `R$ ${(metrics.averageTicket / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        }
                        loading={loadingMetrics}
                        iconColor="#f59e0b"
                    />
                </div>

            </div>

            {/* Abas */}
            <div className="flex gap-1 border-b border-border mb-6">
                {([
                    { key: 'relatorio', label: 'Relatório' },
                    { key: 'transacoes', label: 'Transações' },
                ] as { key: typeof activeTab; label: string }[]).map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8">
                {/* ── ABA RELATÓRIO ─────────────────────────────── */}
                {activeTab === 'relatorio' && <>

                {/* ── Análise financeira ───────────────────────── */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Ticket médio por aula */}
                    <AnalyticCard
                        title="Ticket médio por aula"
                        loading={loadingAnalytics}
                        tooltip="Valor real de um crédito no sistema: receita total dos últimos 12 meses dividida pelos créditos vendidos no mesmo período, multiplicado pela média de alunos por aula."
                        value={ticketPerClass?.ticketPerClass != null
                            ? ticketPerClass.ticketPerClass.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : '—'}
                        sub={ticketPerClass
                            ? `R$${ticketPerClass.pricePerCredit?.toFixed(2).replace('.', ',')}/crédito · ${ticketPerClass.totalCreditsSold?.toLocaleString('pt-BR') ?? '—'} créditos vendidos (12 meses)`
                            : undefined}
                    />

                    {/* Intervalo médio entre compras */}
                    <AnalyticCard
                        title="Intervalo médio entre compras"
                        loading={loadingAnalytics}
                        tooltip="Média de dias entre compras consecutivas de um mesmo aluno. Ajuda a prever quando os alunos precisarão renovar os créditos."
                        value={repurchaseInterval?.avgDays != null ? `${repurchaseInterval.avgDays} dias` : '—'}
                        sub={repurchaseInterval?.sampleSize ? `Baseado em ${repurchaseInterval.sampleSize} recompras` : undefined}
                    />

                    {/* Compraram vs. usaram */}
                    <AnalyticCard
                        title="Compraram vs. usaram"
                        loading={loadingAnalytics}
                        tooltip="Alunos que compraram créditos mas ainda não marcaram nenhuma aula. Alto número pode indicar risco de não renovação."
                        value={boughtVsUsed ? `${boughtVsUsed.used} / ${boughtVsUsed.bought}` : '—'}
                        sub={boughtVsUsed?.notUsed ? `${boughtVsUsed.notUsed} sem aula marcada` : undefined}
                        subAlert={boughtVsUsed?.notUsed > 0}
                    />

                    {/* Dia com mais compras */}
                    <AnalyticCard
                        title="Dia com mais compras"
                        loading={loadingAnalytics}
                        tooltip="Dia da semana com maior volume de compras de créditos no mês atual. Útil para planejar promoções e comunicações."
                        value={purchasesByWeekday.length
                            ? purchasesByWeekday.reduce((a, b) => a.count >= b.count ? a : b).label
                            : '—'}
                        sub={purchasesByWeekday.length
                            ? `${purchasesByWeekday.reduce((a, b) => a.count >= b.count ? a : b).count} compras`
                            : undefined}
                    />
                </div>

                {/* Produtos mais comprados */}
                <div className="col-span-12">
                    <Card>
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-semibold text-gray-800">Produtos mais comprados</h3>
                                    <InfoTooltip text="Ranking de produtos por número de vezes que foram comprados. Mostra qual pacote de créditos os alunos preferem." />
                                </div>
                                <div className="relative">
                                    <select
                                        value={mostPurchasedMonths}
                                        onChange={(e) => {
                                            const v = Number(e.target.value) as 3 | 6 | 12;
                                            setMostPurchasedMonths(v);
                                            setLoadingMostPurchased(true);
                                            statsRepo.getMostPurchasedProducts(v, showInactiveProducts).then((res: any) => {
                                                if (!(res instanceof Error)) setMostPurchased(res?.data ?? []);
                                                setLoadingMostPurchased(false);
                                            });
                                        }}
                                        className="appearance-none pl-4 pr-8 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-full cursor-pointer focus:outline-none"
                                    >
                                        <option value={3}>Últimos 3 meses</option>
                                        <option value={6}>Últimos 6 meses</option>
                                        <option value={12}>Último ano</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">▾</span>
                                </div>
                                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={showInactiveProducts}
                                        onChange={(e) => {
                                            const v = e.target.checked;
                                            setShowInactiveProducts(v);
                                            setLoadingMostPurchased(true);
                                            statsRepo.getMostPurchasedProducts(mostPurchasedMonths, v).then((res: any) => {
                                                if (!(res instanceof Error)) setMostPurchased(res?.data ?? []);
                                                setLoadingMostPurchased(false);
                                            });
                                        }}
                                        className="rounded"
                                    />
                                    Mostrar inativos
                                </label>
                            </div>
                            {loadingMostPurchased ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : mostPurchased.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">Sem dados</p>
                            ) : (
                                <div style={{ height: `${Math.max(mostPurchased.length * 42, 200)}px`, position: 'relative', overflow: 'hidden' }}>
                                    <Bar
                                        data={{
                                            labels: mostPurchased.map((p) => p.name),
                                            datasets: [{
                                                data: mostPurchased.map((p) => p.purchaseCount),
                                                backgroundColor: '#f23238',
                                                borderRadius: 6,
                                                borderSkipped: false,
                                            }]
                                        }}
                                        options={{
                                            indexAxis: 'y' as const,
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (ctx: any) => `${ctx.raw} compras`
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                    grid: { color: '#f3f4f6' },
                                                    ticks: { stepSize: 1, font: { size: 11 } }
                                                },
                                                y: {
                                                    grid: { display: false },
                                                    ticks: { font: { size: 12 } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Receita acumulada mês atual vs. anterior */}
                {!loadingAnalytics && cumulativeRevenue && (
                <div className="col-span-12">
                    <Card>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-base font-semibold text-gray-800">Receita acumulada — mês atual vs. anterior</h3>
                                <InfoTooltip text="Receita acumulada dia a dia. Permite comparar o ritmo de vendas do mês atual com o mês passado na mesma data." />
                            </div>
                            <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                <Line
                                    data={{
                                        labels: cumulativeRevenue.days,
                                        datasets: [
                                            {
                                                label: 'Mês atual',
                                                data: cumulativeRevenue.current,
                                                borderColor: '#f23238',
                                                backgroundColor: 'rgba(242,50,56,0.08)',
                                                fill: true,
                                                tension: 0.4,
                                                pointRadius: 2,
                                            },
                                            {
                                                label: 'Mês anterior',
                                                data: cumulativeRevenue.previous,
                                                borderColor: '#94a3b8',
                                                backgroundColor: 'transparent',
                                                borderDash: [5, 5],
                                                tension: 0.4,
                                                pointRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' as const, labels: { boxWidth: 12, font: { size: 12 } } },
                                            tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` } }
                                        },
                                        scales: {
                                            y: { beginAtZero: true, ticks: { callback: (v: any) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) } },
                                            x: { grid: { display: false }, title: { display: true, text: 'Dia do mês' } }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                )}

                {/* Histórico de pagamento */}
                <div className="col-span-12">
                    <Card>
                        <div className="flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Histórico de pagamento</h3>
                                    {historyData.length > 0 && (() => {
                                        const lastNonZeroIdx = [...historyData].map((v, i) => ({ v, i })).filter(x => x.v > 0).at(-1);
                                        const lastLabel = lastNonZeroIdx ? historyLabels[lastNonZeroIdx.i] : null;
                                        const lastValue = lastNonZeroIdx ? lastNonZeroIdx.v : 0;
                                        const total = historyData.reduce((s, v) => s + v, 0);
                                        return (
                                            <div className="flex gap-8 mt-2">
                                                {lastLabel && (
                                                    <div>
                                                        <p className="text-xs text-gray-400">Último pagamento em: {lastLabel}</p>
                                                        <p className="text-xl font-bold text-gray-900">
                                                            {lastValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs text-gray-400">Últimos {historyRange} meses</p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Seletor de período */}
                                <div className="relative">
                                    <select
                                        value={historyRange}
                                        onChange={(e) => {
                                            const v = Number(e.target.value) as HistoryRange;
                                            setHistoryRange(v);
                                            loadHistory(v);
                                        }}
                                        className="appearance-none pl-4 pr-8 py-2 text-sm font-medium bg-gray-900 text-white rounded-full cursor-pointer focus:outline-none"
                                    >
                                        <option value={3}>Últimos 3 meses</option>
                                        <option value={6}>Últimos 6 meses</option>
                                        <option value={12}>Último ano</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">▾</span>
                                </div>
                            </div>

                            {/* Gráfico de barras */}
                            <div style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
                                {loadingHistory ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-pulse text-gray-400">Carregando...</div>
                                    </div>
                                ) : (
                                    <Bar
                                        data={{
                                            labels: historyLabels,
                                            datasets: [{
                                                data: historyData,
                                                backgroundColor: '#f23238',
                                                borderRadius: 6,
                                                borderSkipped: false,
                                            }]
                                        }}
                                        plugins={[{
                                            id: 'barValueLabels',
                                            afterDatasetsDraw(chart: any) {
                                                const { ctx } = chart;
                                                chart.data.datasets.forEach((_: any, i: number) => {
                                                    chart.getDatasetMeta(i).data.forEach((bar: any, idx: number) => {
                                                        const value = chart.data.datasets[i].data[idx] as number;
                                                        if (!value) return;
                                                        ctx.save();
                                                        ctx.fillStyle = '#374151';
                                                        ctx.font = 'bold 11px Inter, sans-serif';
                                                        ctx.textAlign = 'center';
                                                        ctx.textBaseline = 'bottom';
                                                        ctx.fillText(
                                                            value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                                                            bar.x, bar.y - 4
                                                        );
                                                        ctx.restore();
                                                    });
                                                });
                                            }
                                        }]}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            layout: { padding: { top: 24 } },
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (ctx: any) =>
                                                            ctx.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: { color: '#f3f4f6' },
                                                    ticks: {
                                                        callback: (v: any) =>
                                                            v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
                                                    }
                                                },
                                                x: { grid: { display: false } }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Compradores por produto */}
                <div className="col-span-12">
                    <Card>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-base font-semibold text-gray-800">Compradores por produto</h3>
                                <InfoTooltip text="Selecione um produto para ver quem o comprou e quantas vezes." />
                            </div>

                            {/* Seletor de produto */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <select
                                    value={selectedProductId ?? ''}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        if (id) loadProductBuyers(id);
                                        else { setSelectedProductId(null); setProductBuyers(null); }
                                    }}
                                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring min-w-[220px]"
                                >
                                    <option value="">Selecione um produto...</option>
                                    {mostPurchased.map((p: any) => (
                                        <option key={p.productId} value={p.productId}>{p.name}</option>
                                    ))}
                                </select>
                                {productBuyers && (
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span><strong className="text-gray-800">{productBuyers.totalBuyers}</strong> compradores únicos</span>
                                        <span><strong className="text-gray-800">{productBuyers.totalPurchases}</strong> compras totais</span>
                                    </div>
                                )}
                            </div>

                            {/* Tabela */}
                            {loadingProductBuyers ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : !selectedProductId ? (
                                <p className="text-sm text-gray-400 text-center py-6">Selecione um produto acima para ver os compradores.</p>
                            ) : !productBuyers?.buyers?.length ? (
                                <p className="text-sm text-gray-400 text-center py-6">Nenhum comprador encontrado para este produto.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                {['ALUNO', 'EMAIL', 'COMPRAS', 'ÚLTIMA COMPRA'].map(col => (
                                                    <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productBuyers.buyers.map((buyer: any, i: number) => (
                                                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-foreground">{buyer.studentName}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{buyer.studentEmail}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-primary/10 text-primary text-xs font-bold px-2">
                                                            {buyer.purchases}x
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                        {buyer.lastPurchase
                                                            ? new Date(buyer.lastPurchase).toLocaleDateString('pt-BR')
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                </> /* fim aba relatório */}

                {/* ── ABA TRANSAÇÕES ────────────────────────────── */}
                {activeTab === 'transacoes' && <>

                {/* Filtros */}
                <div className="col-span-12">
                    <UICard className="mb-0">
                        <CardContent className="p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Filtro</p>
                            <div className="flex flex-wrap items-end gap-4">
                                <div className="flex flex-col gap-1 min-w-[180px]">
                                    <Label>ID da Transação</Label>
                                    <Input
                                        value={transaction}
                                        onChange={(e) => setTransaction(e.target.value)}
                                        placeholder="Buscar por ID"
                                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-[160px]">
                                    <Label>Data</Label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-[200px]">
                                    <Label>Aluno</Label>
                                    <select
                                        value={students ?? ''}
                                        onChange={(e) => setStudents(e.target.value || null)}
                                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="">Todos os alunos</option>
                                        {dropdownStudent.map((s: any) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 pb-0.5">
                                    <Button variant="outline" size="sm" onClick={clear}>Limpar</Button>
                                    <Button size="sm" onClick={onSubmit}>Pesquisar</Button>
                                </div>
                            </div>
                        </CardContent>
                    </UICard>
                </div>

                {/* Tabela de Últimas Transações */}
                <div className="col-span-12">
                    <UICard>
                        <CardContent className="p-0">
                            <div className="px-5 py-4 border-b border-border">
                                <h3 className="text-sm font-semibold text-foreground">Últimas Transações</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            {['CLIENTE', 'DATA', 'VALOR', 'STATUS', 'PAGAMENTO', 'OPÇÕES'].map(col => (
                                                <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="border-b border-border last:border-0">
                                                    <td colSpan={6} className="px-4 py-3">
                                                        <div className="h-10 rounded-full bg-muted animate-pulse" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : resultsList.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                                    Nenhuma transação encontrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            resultsList.map((row: any) => (
                                                <tr key={row.transactionId} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-foreground">{row.customerName}</p>
                                                        <p className="text-xs text-muted-foreground font-mono">{row.transactionId}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                        {formatDateToBrazilIntl(row.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                                                        {convertValue(row.amount)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <TxStatusBadge status={row.status} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <TxPaymentBadge method={row.payment_method} />
                                                    </td>
                                                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                        <TransactionOptionsMenu
                                                            transactionId={row.transactionId}
                                                            row={row}
                                                            onCheckPix={checkPixStatus}
                                                            onCancel={openCancelModal}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </UICard>
                </div>
                </> /* fim aba transações */}

            </div>
            <Modal
                btnClose
                showModal={pixModal}
                setShowModal={setPixModal}
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    {pixLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                            <p className="text-gray-500">Verificando pagamento...</p>
                        </div>
                    ) : pixStatus && (
                        <div className="flex flex-col items-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${pixStatus.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                {pixStatus.status === 'paid' ? (
                                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#ca8a04" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                )}
                            </div>
                            <h5 className="text-gray-700 font-semibold">
                                {pixStatus.status === 'paid' ? 'PIX confirmado!' : 'Aguardando pagamento'}
                            </h5>
                            {pixStatus.status !== 'paid' && (
                                <p className="text-sm text-gray-500 text-center">
                                    O pagamento via PIX ainda não foi identificado.
                                </p>
                            )}
                            <button className="btn-outline-primary px-5 mt-2" onClick={() => setPixModal(false)}>
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal de Cancelamento */}
            <Modal
                btnClose
                showModal={cancelModal}
                setShowModal={setCancelModal}
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    {cancelLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                            <p className="text-gray-500">Cancelando pagamento...</p>
                        </div>
                    ) : cancelResult ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cancelResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                {cancelResult.success ? (
                                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                )}
                            </div>
                            <h5 className="text-gray-700 font-semibold text-center">{cancelResult.message}</h5>
                            <button className="btn-outline-primary px-5 mt-2" onClick={() => setCancelModal(false)}>
                                Fechar
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <h5 className="text-gray-800 font-semibold">Cancelar pagamento</h5>
                                <p className="text-sm text-gray-500">
                                    Essa ação é irreversível. Informe sua senha de administrador para confirmar.
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Senha do administrador</label>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    placeholder="Digite sua senha"
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button className="btn-outline-primary px-5" onClick={() => setCancelModal(false)}>
                                    Voltar
                                </button>
                                <button
                                    className="btn-primary px-5 !bg-red-600 !border-red-600 hover:!bg-red-700"
                                    disabled={!adminPassword}
                                    onClick={confirmCancel}
                                >
                                    Confirmar cancelamento
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </PageDefault>
    );
}
function TxStatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
        paid:           { label: 'Pago',         variant: 'success' },
        processing:     { label: 'Processando',  variant: 'warning' },
        authorized:     { label: 'Autorizado',   variant: 'secondary' },
        refunded:       { label: 'Estornado',    variant: 'destructive' },
        waiting_payment:{ label: 'Aguardando',   variant: 'warning' },
        pending_refund: { label: 'Est. Pendente',variant: 'warning' },
        refused:        { label: 'Recusado',     variant: 'destructive' },
        chargeback:     { label: 'Chargeback',   variant: 'destructive' },
        analyzing:      { label: 'Analisando',   variant: 'secondary' },
        pending_review: { label: 'Em Revisão',   variant: 'secondary' },
    };
    const { label, variant } = map[status] ?? { label: status, variant: 'secondary' as const };
    return <Badge variant={variant as any}>{label}</Badge>;
}

function TxPaymentBadge({ method }: { method: string }) {
    const map: Record<string, { label: string; color: string }> = {
        pix:         { label: 'PIX',     color: '#10b981' },
        credit_card: { label: 'Crédito', color: '#6366f1' },
        debit_card:  { label: 'Débito',  color: '#3b82f6' },
        cash:        { label: 'Dinheiro',color: '#f59e0b' },
        boleto:      { label: 'Boleto',  color: '#8b5cf6' },
    };
    const { label, color } = map[method] ?? { label: method, color: '#9ca3af' };
    return (
        <span style={{
            backgroundColor: `${color}20`,
            color,
            border: `1px solid ${color}40`,
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-block',
        }}>
            {label}
        </span>
    );
}

function TransactionOptionsMenu({ transactionId, row, onCheckPix, onCancel }: {
    transactionId: string;
    row: any;
    onCheckPix: (id: string) => void;
    onCancel: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
            >
                ···
            </button>
            {open && (
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-popover shadow-md py-1">
                    <Link
                        href={`/financeiro/${transactionId}`}
                        className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                        onClick={() => setOpen(false)}
                    >
                        Ver detalhes
                    </Link>
                    {row.payment_method === 'pix' && row.status === 'pending' && (
                        <button
                            onClick={() => { onCheckPix(row.chargeId || transactionId); setOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                        >
                            Verificar PIX
                        </button>
                    )}
                    <button
                        onClick={() => { onCancel(row.chargeId || transactionId); setOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md mx-1"
                    >
                        Cancelar pagamento
                    </button>
                </div>
            )}
        </div>
    );
}

function InfoTooltip({ text }: { text: string }) {
    return (
        <div className="group relative inline-flex shrink-0">
            <button className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                i
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed shadow-lg">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
        </div>
    );
}

function AnalyticCard({ title, value, sub, subAlert, tooltip, loading }: {
    title: string;
    value: string;
    sub?: string;
    subAlert?: boolean;
    tooltip: string;
    loading: boolean;
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-1.5 mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">{title}</p>
                <InfoTooltip text={tooltip} />
            </div>
            {loading ? (
                <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
            ) : (
                <>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {sub && (
                        <p className={`text-xs mt-1 ${subAlert ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {sub}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
