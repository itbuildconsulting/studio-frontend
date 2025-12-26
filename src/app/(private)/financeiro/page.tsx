'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";
import styles from '../../../styles/financial.module.css';
import ResultsCollection from "../../../../core/Results";
import SingleCalendar from "@/components/date/SingleCalendar";
import DropdownType from "../../../model/Dropdown";
import DropDownsCollection from "../../../../core/DropDowns";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArray } from "@/utils/convertArray";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import KPICard from "@/components/KPICard";
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Results() {
    const edit: boolean = false;
    const repo = useMemo(() => new ResultsCollection(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const [page, setPage] = useState<number>(1);
    const [transaction, setTransaction] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [students, setStudents] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultsList, setResultsList] = useState<any[]>([]);
    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);

    // Estados para métricas
    const [metrics, setMetrics] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [paymentDistribution, setPaymentDistribution] = useState<any>(null);
    const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);

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

    const actionButtonResults = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
                <>...</>
                <Link href={`/financeiro/${cell}`}>Ver</Link>
            </DropDown>
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
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { dataField: 'customerName', text: 'Nome' },
        { dataField: 'transactionId', text: 'Id da Transação' },
        { dataField: 'createdAt', text: 'Data', formatter: (cell: string) => formatDateToBrazilIntl(cell) },
        { dataField: 'amount', text: 'Valor', formatter: convertValue },
        { dataField: 'status', text: 'Status', formatter: convertStatus },
        { dataField: 'transactionId', formatter: actionButtonResults }
    ];

    const clear = () => {
        setTransaction('');
        setDate('');
        setStudents(null);
        listResults(true);
    };

    const onSubmit = () => {
        listResults();
    };

    const eventButton = [
        { name: "Limpar", function: clear, class: "btn-outline-primary" },
        { name: "Pesquisar", function: onSubmit, class: "btn-primary" }
    ];

    // Configuração do gráfico de receita
    const revenueChartData = revenueData ? {
        labels: revenueData.labels || [],
        datasets: [
            {
                label: 'Receita (R$)',
                data: revenueData.data || [],
                borderColor: '#003d58',
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
                    '#003d58',
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
        <PageDefault title="Resultados Financeiros">
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
                {/* KPI Cards */}
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

                {/* Gráfico de Receita ao Longo do Tempo */}
                <div className="col-span-12 lg:col-span-8">
                    <Card title="Receita ao Longo do Tempo">
                        <div style={{ height: '300px', position: 'relative' }}>
                            {loadingMetrics ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse text-gray-400">Carregando...</div>
                                </div>
                            ) : revenueChartData ? (
                                <Line data={revenueChartData} options={revenueChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Sem dados disponíveis
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Gráfico de Distribuição por Forma de Pagamento */}
                <div className="col-span-12 lg:col-span-4">
                    <Card title="Formas de Pagamento">
                        <div style={{ height: '300px', position: 'relative' }}>
                            {loadingMetrics ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse text-gray-400">Carregando...</div>
                                </div>
                            ) : paymentChartData ? (
                                <Doughnut data={paymentChartData} options={paymentChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Sem dados disponíveis
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Card de Filtros */}
                <div className="col-span-12">
                    <Card hasFooter={true} eventsButton={eventButton}>
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="ID da Transação"
                                    value={transaction}
                                    type='text'
                                    changeValue={setTransaction}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <SingleCalendar
                                    label="Data"
                                    date={date}
                                    setValue={setDate}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Alunos'
                                    value={students}
                                    options={convertArray(dropdownStudent)}
                                    changeValue={setStudents}
                                    edit={edit}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabela de Últimas Transações */}
                <div className="col-span-12">
                    <Card title="Últimas Transações">
                        <Table
                            data={resultsList}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    );
}