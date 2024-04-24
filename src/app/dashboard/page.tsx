'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from "../../styles/dashboard.module.css";

export default function Home() {

    const customCol = (cell: any, row:any) => {
        return (
            <>
                <small>{row.type}</small>
                <p>{cell}</p>
            </>
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
            text: ``
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
            <div className="grid grid-rows-2 grid-cols-12 gap-8">
                <div className="col-span-4">
                    <Card title="Frequência de alunos">
                        Hello World
                    </Card>
                </div>
                <div className="col-span-4">
                    <Card title="Total de Vendas">
                        Hello World
                    </Card>
                </div>
                <div className="row-span-2 col-span-4">
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
                <div className="col-span-8">
                    <Card title="Notícias Recentes">
                        Hello World
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}