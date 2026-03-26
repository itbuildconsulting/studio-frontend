'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from "../../../styles/dashboard.module.css";
import { IconPeople } from "@/components/icons";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";

import TotalSalesRepository from "../../../../core/TotalSales";
import FrequencyStudentsRepository from "../../../../core/FrequencyStudents";
import FinancialRepository from "../../../../core/Financial";
import { getDatesOfWeek } from "@/utils/getDatesOfWeek";

import Cookies from 'js-cookie';
import { CookiesAuth } from "@/shared/enum";
import CalendarClassRepository from "../../../../core/CalendarClass";

export default function Home() {
    const repo = useMemo(() => new TotalSalesRepository(), []);
    const repoFreq = useMemo(() => new FrequencyStudentsRepository(), []);
    const repoFinancial = useMemo(() => new FinancialRepository(), []);
    const repoCalendar = useMemo(() => new CalendarClassRepository(), []);

    const [totalSales, setTotalSales] = useState<any[]>([]);
    const [frequency, setFrequency] = useState<any[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [calendarClasses, setCalendarClasses] = useState<any[]>([]);
    const [userNameAuth, setUserNameAuth] = useState<string | null>(null);

    ChartJS.register(CategoryScale, LineElement, BarElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

    // ─── LineChart: Total de Vendas ───────────────────────────────────────────
    const LineChart = () => {
        const dateMonth: number = new Date().getMonth();
        const months: string[] = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const startIndex: number = (dateMonth - 5 + 12) % 12;

        const labels: string[] = [
            ...months.slice(startIndex, 12),
            ...months.slice(0, dateMonth + 1),
        ].slice(-6);

        const datasets = labels.map((_, index) => {
            const monthIndex = (startIndex + index) % 12 + 1;
            const salesData = totalSales.find((data: any) => data.month === monthIndex);
            return salesData ? salesData.totalSales / 100 : 0;
        });

        // ✅ FIX: guard contra array vazio (evita -Infinity)
        const maxSales = totalSales.length > 0
            ? Math.max(...totalSales.map((elem: any) => elem.totalSales / 100))  // ✅ divide por 100
            : 1000;

        const data = {
            labels,
            datasets: [{
                label: "Total de Vendas",
                data: datasets,
                fill: true,
                borderColor: "#2f2f2f",
                backgroundColor: '#003d5880',
                tension: 0.25,
            }],
        };

        const options = {
            plugins: { 
                legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    }
                } 
            },
            scales: {
                y: {
                    display: true,
                    min: 0,
                    max: maxSales || 1000,
                    ticks: { stepSize: Math.ceil((maxSales || 1000) / 8) },
                },
                x: {
                    display: true,
                    grid: { display: false },
                },
            },
        };

        return <Line data={data} options={options} />;
    };

    // ─── BarChart: Frequência de Alunos ──────────────────────────────────────
    const BarChart = () => {
        // Labels fixas de Seg a Dom
        const labels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

        // ✅ FIX: MySQL DAYOFWEEK → 1=Dom, 2=Seg, 3=Ter, 4=Qua, 5=Qui, 6=Sex, 7=Sab
        // Mapeia cada índice do array (0=Seg..6=Dom) para o valor MySQL correspondente
        const mysqlDayOfWeekMap = [2, 3, 4, 5, 6, 7, 1];

        // ✅ FIX: JS getDay() → 0=Dom, 1=Seg..6=Sab → converte para índice 0=Seg..6=Dom
        const jsToday = new Date().getDay(); // 0=Dom ... 6=Sab
        const todayLabelIndex = jsToday === 0 ? 6 : jsToday - 1; // 0=Seg..6=Dom

        const backgroundColors = labels.map((_, index) =>
            index === todayLabelIndex ? '#2f2f2f' : '#003d5880'
        );

        const datasets = labels.map((_, index) => {
            const mysqlDay = mysqlDayOfWeekMap[index];
            const frequencyData = frequency.find((data: any) => data.dayOfWeek === mysqlDay);
            return frequencyData?.attendanceCount || 0;
        });

        const data = {
            labels,
            datasets: [{
                label: "Frequência",
                data: datasets,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 0,
                barPercentage: 0.875,
                borderRadius: { topLeft: 8, topRight: 8 },
            }],
        };

        const options = {
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context: any) => `Nª de Alunos: ${context.raw}`,
                    },
                },
            },
            scales: {
                y: { display: false, beginAtZero: true, max: 14 },
                x: {
                    display: true,
                    ticks: { color: '#003D58' },
                    grid: { color: 'transparent', display: false },
                },
            },
        };

        return <Bar data={data} options={options} />;
    };

    // ─── Formatters ──────────────────────────────────────────────────────────
    const customCol = (cell: any, row: any) => (
        <>
            <small>{row.type}</small>
            <p>{cell}</p>
        </>
    );

    const convertDate = (cell: any) => (
        <p>{cell.split("T")[0].split("-").reverse().join("/")}</p>
    );

    const convertValue = (cell: number) => (
        <p>{cell.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
    );

    const convertStatus = (cell: any) => cell ? <p>Ativo</p> : <p>Inativo</p>;

    const convertPeople = (cell: any) => (
        <div className="flex items-center">
            {IconPeople('12px', '12px', "var(--primary)")}
            <small style={{ marginBottom: "0", marginLeft: ".175rem" }}>{cell}</small>
        </div>
    );

    // ─── Columns ─────────────────────────────────────────────────────────────
    const columns = [
        { dataField: 'time', text: `` },
        { dataField: 'tipoAula', text: ``, formatter: customCol },
        { dataField: 'qtdAlunos', text: ``, formatter: convertPeople },
    ];

    const columns2 = [
        { dataField: 'product', text: `Produto` },
        { dataField: 'date', text: `Data`, formatter: convertDate },
        { dataField: 'student', text: `Aluno` },
        { dataField: 'value', text: `Valor`, formatter: convertValue },
        { dataField: 'status', text: `Status`, formatter: convertStatus },
    ];

    const rowClasses = (row: any) => {
        if (row.tipoAula === "Aula Coletiva") return "borderInternal_secondary_class";
        if (row.tipoAula === "Bike Coletiva") return "borderInternal_purple_class";
        return "borderInternal_primary_class";
    };

    // ─── useEffects ──────────────────────────────────────────────────────────
    useEffect(() => {
        const year = String(new Date().getFullYear());
        const datesWeek = getDatesOfWeek();

        // Total de Vendas (LineChart)
        repo.consult(year).then((result: any) => {
            if (!(result instanceof Error)) setTotalSales(result?.data ?? []);
        }).catch(() => {});

        // Frequência de Alunos (BarChart)
        repoFreq.consult(String(datesWeek?.shift()), String(datesWeek?.pop())).then((result: any) => {
            if (!(result instanceof Error)) setFrequency(result?.data ?? []);
        }).catch(() => {});

        // ✅ FIX: Notícias Recentes — busca transações reais da API
        repoFinancial.getLatestTransactions(null, null, null, 1).then((result: any) => {
            if (!(result instanceof Error) && result?.data) {
                const rows = result.data.map((t: any) => ({
                    date: t.createdAt,
                    product: t.transactionType || 'Venda',
                    student: t.customerName || '—',
                    value: t.amount,
                    status: t.status === 'paid',
                }));
                setRecentTransactions(rows);
            }
        }).catch(() => {});

        // ✅ FIX: Calendário de Aulas — busca aulas reais da API
        repoCalendar.consult().then((result: any) => {
            if (!(result instanceof Error) && result?.data) {
                // A API retorna um objeto agrupado por data; achatamos em array
                const allClasses: any[] = Object.values(result.data).flat();
                const rows = allClasses.map((cls: any) => ({
                    time: cls.time?.slice(0, 5) ?? '—',
                    type: cls.location ?? 'Studio',
                    tipoAula: cls.productType ?? 'Aula Coletiva',
                    qtdAlunos: cls.studentCount ?? 0,
                }));
                setCalendarClasses(rows);
            }
        }).catch(() => {});
    }, []);

    useEffect(() => {
        const username = Cookies.get(CookiesAuth.USERNAME) || '';
        setUserNameAuth(username);
    }, []);

    // ─── Data helpers ────────────────────────────────────────────────────────
    // ✅ FIX: data dinâmica no título do calendário
    const todayFormatted = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
    });

    return (
        <PageDefault title={`Bem-vindo, ${userNameAuth}`}>
            <div className="grid grid-rows-auto grid-cols-12 gap-6 lg:gap-8">
                <div className="col-span-12 lg:col-span-4">
                    <Card title="Frequência de alunos">
                        <BarChart />
                    </Card>
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <Card title="Total de Vendas">
                        <div style={{ position: "relative", left: "-10px", top: "20px", width: "100%" }}>
                            <LineChart />
                        </div>
                    </Card>
                </div>
                <div className="row-span-2 col-span-12 lg:col-span-4">
                    {/* ✅ FIX: data dinâmica + dados reais */}
                    <Card title="Calendário de Aulas">
                        <h5>{todayFormatted}</h5>
                        <Table
                            data={calendarClasses}
                            columns={columns}
                            class={styles.table_dashboard}
                            rowClasses={rowClasses}
                        />
                    </Card>
                </div>
                <div className="col-span-12 lg:col-span-8 mb-8 lg:mb-0">
                    {/* ✅ FIX: dados reais da API */}
                    <Card title="Notícias Recentes">
                        <Table
                            data={recentTransactions}
                            columns={columns2}
                            class={styles.table_dashboard_recent}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    );
}