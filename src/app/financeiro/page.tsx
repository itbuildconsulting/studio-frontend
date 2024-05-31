'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useState } from "react";

import styles from '../../styles/financial.module.css';

export default function Financial() {
    const [product, setProduct] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [student, setStudent] = useState<string>("");

    const convertValue = (cell: number) => {
        return cell.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    const convertDate = (cell: string) => {
        return cell.split("-").reverse().join("/");
    }

    const convertStatus = (cell: number) => {

        return cell === 1 ? "Pago" : cell === 2 ? "Pendente" : cell === 3 ? "Cancelado" : "Não Registrado";
    }

    let info: any = {
        rows: [
            {
                product: "Aula Coletiva",
                date: "2024-06-12",
                student: "Isabela Eliane Lorena Almeida",
                value: 650,
                status: 1
            },
            {
                product: "Aula Coletiva",
                date: "2024-06-12",
                student: "Isabela Eliane Lorena Almeida",
                value: 650,
                status: 2
            },
            {
                product: "Aula Coletiva",
                date: "2024-06-12",
                student: "Isabela Eliane Lorena Almeida",
                value: 650,
                status: 3
            },
            {
                product: "Aula Coletiva",
                date: "2024-06-12",
                student: "Isabela Eliane Lorena Almeida",
                value: 650,
                status: 1
            }
        ]
    }

    const columns = [
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
            text: `Aluno`,
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

    const clear = () => {
        console.log("Limpei")
    }

    const onSubmit = () => {
        console.log("Cadastrei")
    }


    const eventButton = [
        {
            name: "Limpar",
            function: clear,
            class: "btn-outline-primary"
        },
        {
            name: "Pesquisar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    return (
        <PageDefault title={"Financeiro"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Produto"
                                    value={product}
                                    type='text'
                                    changeValue={setProduct}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Data"
                                    value={date}
                                    type='text'
                                    changeValue={setDate}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Aluno"
                                    value={student}
                                    type='text'
                                    changeValue={setStudent}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Últimas Transações"
                        url={"/aulas/cadastrar"}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_students}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault >
    )
}