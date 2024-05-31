'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../styles/teachers.module.css';
import Table from "@/components/Table/Table";
import { useState } from "react";
import AuthInput from "@/components/auth/AuthInput";

export default function Teachers() {
    const [modalStudentsAdd, setModalStudentsAdd] = useState<boolean>(false);

    const [name, setName] = useState<string>("");
    const [document, setDocument] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const convertPhone = (cell: any, row: any) => {
        let phoneNumber = cell.replace(/\D/g, '');
        let formattedNumber = '(' + phoneNumber.substring(0, 2) + ') ' + phoneNumber.substring(2, 7) + '-' + phoneNumber.substring(7);

        return formattedNumber;
    }

    const convertDate = (cell: any, row: any) => {
        return cell.split("-").reverse().join("/");
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativo" : "Inativo";
    }

    let info: any = {
        rows: [
            {
                nome: "Pedro Henrique Kevin Assunção",
                email: "pedro-assuncao86@grupoannaprado.com.br",
                telefone: "62987591829",
                checkin: "2023-12-12",
                status: true,
            },
            {
                nome: "Pedro Henrique Kevin Assunção",
                email: "pedro-assuncao86@grupoannaprado.com.br",
                telefone: "62987591829",
                checkin: "2023-12-12",
                status: false,
            },
            {
                nome: "Pedro Henrique Kevin Assunção",
                email: "pedro-assuncao86@grupoannaprado.com.br",
                telefone: "62987591829",
                checkin: "2023-12-12",
                status: false,
            },
            {
                nome: "Pedro Henrique Kevin Assunção",
                email: "pedro-assuncao86@grupoannaprado.com.br",
                telefone: "62987591829",
                checkin: "2023-12-12",
                status: true,
            }
        ]
    }

    const columns = [
        {
            dataField: 'nome',
            text: `Nome`,
        },
        {
            dataField: 'email',
            text: `Email`,
        },
        {
            dataField: 'telefone',
            text: `Telefone`,
            formatter: convertPhone
        },
        {
            dataField: 'checkin',
            text: `Último Check-in`,
            formatter: convertDate
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
        <PageDefault title={"Professor"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Nome"
                                    value={name}
                                    type='text'
                                    changeValue={setName}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="CPF"
                                    value={document}
                                    type='text'
                                    changeValue={setDocument}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    type='text'
                                    changeValue={setEmail}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Lista de Professores"
                        hasButton={true}
                        url={"/funcionarios/cadastrar"}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_students}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}