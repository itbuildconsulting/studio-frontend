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
import Modal from "@/components/Modal/Modal";
import CheckoutCollecion from "../../../../core/Checkout";
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
    const repoCheckout = useMemo(() => new CheckoutCollecion(), []);

    const [page, setPage] = useState<number>(1);
    const [transaction, setTransaction] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [students, setStudents] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultsList, setResultsList] = useState<any[]>([]);
    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);

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

    const actionButtonResults = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
                <>...</>
                <Link href={`/financeiro/${cell}`}>Ver</Link>
                {row.payment_method === 'pix' && row.status === 'pending' && (
                    <span onClick={() => checkPixStatus(row.chargeId || cell)}>
                        Verificar PIX
                    </span>
                )}
                <span onClick={() => openCancelModal(row.chargeId || cell)}>
                    Cancelar pagamento
                </span>
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
        { dataField: 'payment_method', text: 'Pagamento', formatter: convertPaymentMethod },
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