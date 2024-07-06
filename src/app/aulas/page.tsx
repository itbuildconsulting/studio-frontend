'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../styles/class.module.css';
import Table from "@/components/Table/Table";
import { useState } from "react";
import AuthInput from "@/components/auth/AuthInput";

export default function Class() {
    const [date, setDate] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [teacher, setTeacher] = useState<string>("");

    const convertDate = (cell: any, row: any) => {
        return cell.split("T")[0].split("-").reverse().join("/") + " - " + cell.split("T")[1];
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativo" : "Inativo";
    }

    let info: any = {
        rows: [
            {
                date: "2024-06-12T08:00:00",
                tipoAula: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                professor: "Raphael",
                qtdAlunos: 6,
                status: true,
            },
            {
                date: "2024-06-12T09:00:00",
                tipoAula: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                professor: "Raphael",
                qtdAlunos: 6,
                status: true,
            },
            {
                date: "2024-06-12T10:00:00",
                tipoAula: "Aula Individual",
                local: "Studio Raphael Oliveira",
                professor: "Raphael",
                qtdAlunos: 6,
                status: true,
            },
            {
                date: "2024-06-12T11:00:00",
                tipoAula: "Bike Coletiva",
                local: "Studio Raphael Oliveira",
                professor: "Raphael",
                qtdAlunos: 6,
                status: true,
            },
        ]
    }

    const columns = [
        {
            dataField: 'date',
            text: `Data`,
            formatter: convertDate
        },
        {
            dataField: 'tipoAula',
            text: `Tipo de Aula`,
        },
        {
            dataField: 'local',
            text: `Local`,
        },
        {
            dataField: 'professor',
            text: `Professor`
        },
        {
            dataField: 'qtdAlunos',
            text: `Quantidade de Alunos`
        },
        {
            dataField: 'status',
            text: `Status`,
            formatter: convertStatus
        }
    ];

    const clear = () => {
        console.log("Limpei");
    }

    const onSubmit = () => {
        console.log("Cadastrei");
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

    const rowClasses = (row: any) => {
        if (row.tipoAula === "Aula Coletiva") {
            return "border_secondary_class";
        } else if (row.tipoAula === "Bike Coletiva") {
            return "border_purple_class";
        } else {
            return "border_primary_class";
        }
    }

    return (
        <PageDefault title={"Aulas"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
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
                                    label="Tipo"
                                    value={type}
                                    type='text'
                                    changeValue={setType}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Professor"
                                    value={teacher}
                                    type='text'
                                    changeValue={setTeacher}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Lista de Aulas"
                        hasButton={true}
                        url={"/aulas/cadastrar"}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_students}
                            rowClasses={rowClasses}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}