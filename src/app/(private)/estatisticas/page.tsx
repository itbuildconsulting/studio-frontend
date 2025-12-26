'use client'

import { useEffect, useMemo, useState } from "react";
import PageDefault from "@/components/template/default";
import Card from "@/components/Card/Card";
import StatCard from "@/components/Card/StatCard";
import AlertCard from "@/components/Card/AlertCard";
import Table from "@/components/Table/Table";
import StatisticsRepository from "../../../../core/Statistics";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Statistics() {
    const repo = useMemo(() => new StatisticsRepository(), []);

    // Estados para métricas
    const [overview, setOverview] = useState<any>(null);
    const [topStudents, setTopStudents] = useState<any[]>([]);
    const [inactiveStudents, setInactiveStudents] = useState<any[]>([]);
    const [studentsAtRisk, setStudentsAtRisk] = useState<any[]>([]);
    const [expiringCredits, setExpiringCredits] = useState<any[]>([]);
    const [occupancyByTime, setOccupancyByTime] = useState<any>(null);
    const [topTeachers, setTopTeachers] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [occupancyByDay, setOccupancyByDay] = useState<any>(null);
    
    const [loading, setLoading] = useState<boolean>(true);

    // Carregar todas as estatísticas
    const loadStatistics = async () => {
        setLoading(true);
        try {
            const [
                overviewRes,
                topStudentsRes,
                inactiveRes,
                atRiskRes,
                expiringRes,
                occupancyTimeRes,
                teachersRes,
                insightsRes,
                occupancyDayRes
            ] = await Promise.all([
                repo.getOverviewMetrics(),
                repo.getTopStudents(10),
                repo.getInactiveStudents(14),
                repo.getStudentsAtRisk(),
                repo.getCreditsExpiringSoon(7),
                repo.getOccupancyByTime(),
                repo.getTopTeachers(5),
                repo.getAutomatedInsights(),
                repo.getOccupancyByDayOfWeek()
            ]);

            // Processar respostas
            if (!(overviewRes instanceof Error)) {
                const data: any = overviewRes;
                setOverview(data.data || data);
            }

            if (!(topStudentsRes instanceof Error)) {
                const data: any = topStudentsRes;
                setTopStudents(data.data || data || []);
            }

            if (!(inactiveRes instanceof Error)) {
                const data: any = inactiveRes;
                setInactiveStudents(data.data || data || []);
            }

            if (!(atRiskRes instanceof Error)) {
                const data: any = atRiskRes;
                setStudentsAtRisk(data.data || data || []);
            }

            if (!(expiringRes instanceof Error)) {
                const data: any = expiringRes;
                setExpiringCredits(data.data || data || []);
            }

            if (!(occupancyTimeRes instanceof Error)) {
                const data: any = occupancyTimeRes;
                setOccupancyByTime(data.data || data);
            }

            if (!(teachersRes instanceof Error)) {
                const data: any = teachersRes;
                setTopTeachers(data.data || data || []);
            }

            if (!(insightsRes instanceof Error)) {
                const data: any = insightsRes;
                setInsights(data.data || data || []);
            }

            if (!(occupancyDayRes instanceof Error)) {
                const data: any = occupancyDayRes;
                setOccupancyByDay(data.data || data);
            }

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, []);

    // Configuração do gráfico de ocupação por horário
    const occupancyTimeChartData = occupancyByTime ? {
        labels: occupancyByTime.labels || [],
        datasets: [{
            label: 'Taxa de Ocupação (%)',
            data: occupancyByTime.data || [],
            backgroundColor: 'rgba(0, 61, 88, 0.8)',
            borderColor: '#003d58',
            borderWidth: 1,
        }]
    } : null;

    const occupancyTimeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y}% ocupado`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value: any) => `${value}%`
                }
            }
        }
    };

    // Configuração do gráfico de ocupação por dia da semana
    const occupancyDayChartData = occupancyByDay ? {
        labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [{
            label: 'Check-ins',
            data: occupancyByDay.data || [],
            borderColor: '#003d58',
            backgroundColor: 'rgba(0, 61, 88, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    } : null;

    // Colunas da tabela de top alunos
    const topStudentsColumns = [
        {
            dataField: 'position',
            text: '#',
            formatter: (cell: any, row: any, rowIndex: number) => (
                <span className="font-bold text-lg">
                    {rowIndex + 1 <= 3 ? '🏆' : ''} {rowIndex + 1}
                </span>
            )
        },
        { dataField: 'name', text: 'Aluno' },
        { dataField: 'classCount', text: 'Aulas', formatter: (cell: number) => <strong>{cell}</strong> },
        { dataField: 'streak', text: 'Sequência', formatter: (cell: number) => `${cell} dias` },
        { 
            dataField: 'attendanceRate', 
            text: 'Taxa Presença',
            formatter: (cell: number) => (
                <span className={cell >= 90 ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                    {cell}%
                </span>
            )
        }
    ];

    // Colunas da tabela de alunos inativos
    const inactiveStudentsColumns = [
        { dataField: 'name', text: 'Aluno' },
        { dataField: 'lastClassDate', text: 'Última Aula', formatter: (cell: string) => new Date(cell).toLocaleDateString('pt-BR') },
        { dataField: 'daysInactive', text: 'Dias Inativo', formatter: (cell: number) => <strong className="text-red-600">{cell}</strong> },
        { dataField: 'credits', text: 'Créditos', formatter: (cell: number) => cell > 0 ? <span className="text-green-600">{cell}</span> : cell },
    ];

    // Colunas da tabela de top professores
    const topTeachersColumns = [
        { dataField: 'name', text: 'Professor' },
        { dataField: 'classCount', text: 'Aulas Ministradas' },
        { dataField: 'averageOccupancy', text: 'Ocupação Média', formatter: (cell: number) => `${cell}%` },
        { dataField: 'totalStudents', text: 'Total Alunos' }
    ];

    return (
        <PageDefault title="📊 Estatísticas & Insights">
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
                
                {/* ==================== VISÃO GERAL ==================== */}
                <div className="col-span-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Visão Geral</h2>
                </div>

                <div className="col-span-12 lg:col-span-2">
                    <StatCard
                        title="Alunos Ativos"
                        value={overview?.activeStudents || 0}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        trend={overview?.activeStudentsGrowth ? {
                            value: overview.activeStudentsGrowth,
                            isPositive: overview.activeStudentsGrowth > 0,
                            label: 'vs mês anterior'
                        } : undefined}
                        loading={loading}
                        color="#10b981"
                    />
                </div>

                <div className="col-span-12 lg:col-span-2">
                    <StatCard
                        title="Check-ins (mês)"
                        value={overview?.totalCheckins || 0}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        loading={loading}
                        color="#3b82f6"
                    />
                </div>

                <div className="col-span-12 lg:col-span-2">
                    <StatCard
                        title="Taxa Ocupação"
                        value={overview?.occupancyRate ? `${overview.occupancyRate}%` : '0%'}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                        loading={loading}
                        color="#8b5cf6"
                    />
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <StatCard
                        title="Créditos Ativos"
                        value={overview?.totalActiveCredits || 0}
                        subtitle={`${overview?.creditsExpiringNext7Days || 0} vencem em 7 dias`}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        loading={loading}
                        color="#f59e0b"
                    />
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <StatCard
                        title="NPS Score"
                        value={overview?.npsScore || 'N/A'}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                        loading={loading}
                        color="#ec4899"
                    />
                </div>

                {/* ==================== INSIGHTS & ALERTAS ==================== */}
                <div className="col-span-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6">💡 Insights & Ações Recomendadas</h2>
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <AlertCard
                        type="warning"
                        title="Alunos Inativos"
                        message="Não comparecem há mais de 14 dias"
                        count={inactiveStudents.length}
                        actionLabel="Ver detalhes"
                    />
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <AlertCard
                        type="danger"
                        title="Queda de Frequência"
                        message="Alunos com redução significativa de aulas"
                        count={studentsAtRisk.length}
                        actionLabel="Ver quem são"
                    />
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <AlertCard
                        type="info"
                        title="Créditos Vencendo"
                        message="Créditos que expiram nos próximos 7 dias"
                        count={expiringCredits.length}
                        actionLabel="Alertar alunos"
                    />
                </div>

                {/* ==================== TOP ALUNOS ==================== */}
                <div className="col-span-12 lg:col-span-6">
                    <Card title="🏆 Top 10 Alunos do Mês">
                        <Table
                            data={topStudents}
                            columns={topStudentsColumns}
                            loading={loading}
                        />
                    </Card>
                </div>

                {/* ==================== ALUNOS INATIVOS ==================== */}
                <div className="col-span-12 lg:col-span-6">
                    <Card title="⚠️ Alunos Inativos (14+ dias)">
                        <Table
                            data={inactiveStudents.slice(0, 10)}
                            columns={inactiveStudentsColumns}
                            loading={loading}
                        />
                    </Card>
                </div>

                {/* ==================== OCUPAÇÃO POR HORÁRIO ==================== */}
                <div className="col-span-12 lg:col-span-8">
                    <Card title="🕐 Taxa de Ocupação por Horário">
                        <div style={{ height: '300px', position: 'relative' }}>
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse text-gray-400">Carregando...</div>
                                </div>
                            ) : occupancyTimeChartData ? (
                                <Bar data={occupancyTimeChartData} options={occupancyTimeOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Sem dados disponíveis
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ==================== TOP PROFESSORES ==================== */}
                <div className="col-span-12 lg:col-span-4">
                    <Card title="👨‍🏫 Top 5 Professores">
                        <Table
                            data={topTeachers}
                            columns={topTeachersColumns}
                            loading={loading}
                        />
                    </Card>
                </div>

                {/* ==================== FREQUÊNCIA POR DIA DA SEMANA ==================== */}
                <div className="col-span-12">
                    <Card title="📅 Frequência por Dia da Semana">
                        <div style={{ height: '250px', position: 'relative' }}>
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse text-gray-400">Carregando...</div>
                                </div>
                            ) : occupancyDayChartData ? (
                                <Line data={occupancyDayChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Sem dados disponíveis
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </PageDefault>
    );
}