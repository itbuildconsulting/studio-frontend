'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from "../../styles/dashboard.module.css";
import { IconPeople } from "@/components/icons";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

export default function Home() {

    ChartJS.register(CategoryScale, LineElement, BarElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

    const LineChart = () => {
        // X - axis lable
        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

        // Data want to show on chart
        const datasets = [20, 40, 30, 30, 45, 60, 67, 43];

        const data = {
            labels: labels,
            datasets: [
                {
                    // Title of Graph
                    label: "Total de Vendas",
                    data: datasets,
                    fill: true,
                    borderColor: "#003D58",
                    backgroundColor: 'rgba(0, 61, 88, 0.30)',
                    tension: 0.05,
                },
                // insert similar in dataset object for making multi line chart
            ],
        };

        // To make configuration
        const options = {
            plugins: {
                legend: {
                    display: false, // Remover o título do gráfico
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                    },
                    display: true,
                    min: 0,
                    max: 50,
                    ticks: {
                        stepSize: 10 // Define o intervalo de 10 em 10 no eixo y
                    }
                },
                x: {
                    title: {
                        display: true,
                    },
                    display: true,
                    grid: {
                        display: false, // Oculta a grade vertical
                    },

                },
            },
        };

        return <Line data={data} options={options} />;
    }

    const BarChart = () => {
        const today = new Date().getDay() - 1; // Obtém o dia atual (0 para Domingo, 1 para Segunda, ..., 6 para Sábado)

        const labels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

        const backgroundColors = labels.map((day, index) => {
            return index === today ? '#003D58' : '#F0F3F7'; // Vermelho para o dia atual, Azul para os outros dias
        });

        const datasets = [10, 8, 10, 4, 10, 10, 2];

        const data = {
            labels: labels,
            datasets: [
                {
                    // Title of Graph
                    label: "My Bar Chart",
                    data: datasets,
                    backgroundColor:
                        backgroundColors
                    ,
                    borderColor:
                        backgroundColors
                    ,
                    borderWidth: 0,
                    barPercentage: 0.875,
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                    },
                },
                // insert similar in dataset object for making multi bar chart
            ],
        };

        const options = {
            plugins: {
                legend: {
                    display: false, // Remover o título do gráfico
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            return `Nª de Alunos: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: false,
                        text: "Y-axis Lable",
                    },
                    display: false,
                    beginAtZero: true,
                    max: 14,
                },
                x: {
                    title: {
                        display: false,
                        text: "x-axis Lable",
                    },
                    ticks: {
                        color: '#003D58' // Define a cor dos nomes das barras
                    },
                    display: true,
                    grid: {
                        color: "transparent", // Define a cor da linha do eixo X como transparente
                        drawBorder: false, // Não desenhar borda do eixo X
                        display: false, // Remover linhas verticais
                    },
                },
            },
        };

        return <Bar data={data} options={options} />;
    };

    const customCol = (cell: any, row: any) => {
        return (
            <>
                <small>{row.type}</small>
                <p>{cell}</p>
            </>
        )
    }

    const convertDate = (cell: any, row: any) => {
        return <p>{cell.split("T")[0].split("-").reverse().join("/")}</p>;
    }

    const convertValue = (cell: number) => {
        return <p>{cell.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>;
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? <p>Ativo</p> : <p>Inativo</p>;
    }

    const convertPeople = (cell: any, row: any) => {
        return (
            <div className="flex items-center">
                {IconPeople('12px', '12px', "var(--primary)")}
                <small style={{ marginBottom: "0", marginLeft: ".175rem" }}>{cell}</small>
            </div>
        )
    }

    let info: any = {
        rows: [
            {
                time: "08:00",
                type: "Studio",
                tipoAula: "Aula Coletiva",
                qtdAlunos: 6,
            },
            {
                time: "08:00",
                type: "Bike",
                tipoAula: "Aula Coletiva",
                qtdAlunos: 6,
            },
            {
                time: "08:00",
                type: "Studio",
                tipoAula: "Aula Individual",
                qtdAlunos: 6,
            },
            {
                time: "08:00",
                type: "Studio",
                tipoAula: "Aula Coletiva",
                qtdAlunos: 6,
            },
        ]
    }

    let info2: any = {
        rows: [
            {
                date: "2024-06-12T09:00:00",
                product: "Aula Coletiva",
                student: "Raphael",
                value: 650,
                status: true,
            },
            {
                date: "2024-06-12T09:00:00",
                product: "Aula Coletiva",
                student: "Raphael",
                value: 650,
                status: true,
            },
            {
                date: "2024-06-12T09:00:00",
                product: "Aula Coletiva",
                student: "Raphael",
                value: 650,
                status: true,
            },
            {
                date: "2024-06-12T09:00:00",
                product: "Aula Coletiva",
                student: "Raphael",
                value: 650,
                status: true,
            },
        ]
    }

    const columns = [
        {
            dataField: 'time',
            text: ``
        },
        {
            dataField: 'tipoAula',
            text: ``,
            formatter: customCol
        },
        {
            dataField: 'qtdAlunos',
            text: ``,
            formatter: convertPeople
        }
    ];

    const columns2 = [
        {
            dataField: 'product',
            text: `Produto`
        },
        {
            dataField: 'date',
            text: `Data`,
            formatter: convertDate
        },
        {
            dataField: 'student',
            text: `Aluno`
        },
        {
            dataField: 'value',
            text: `Valor`,
            formatter: convertValue
        },
        {
            dataField: 'status',
            text: `Status`,
            formatter: convertStatus
        }
    ];

    const rowClasses = (row: any) => {
        if (row.tipoAula === "Aula Coletiva") {
            return "borderInternal_secondary_class";
        } else if (row.tipoAula === "Bike Coletiva") {
            return "borderInternal_purple_class";
        } else {
            return "borderInternal_primary_class";
        }
    }

    return (
        <PageDefault title={"Bem-vindo, Fulano"}>
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
                    <Card title="Calendário de Aulas">
                        <h5>01 de Janeiro de 2025</h5>
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_dashboard}
                            rowClasses={rowClasses}
                        />
                    </Card>
                </div>
                <div className="col-span-12 lg:col-span-8 mb-8 lg:mb-0">
                    <Card title="Notícias Recentes">
                        <Table
                            data={info2.rows}
                            columns={columns2}
                            class={styles.table_dashboard_recent}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}