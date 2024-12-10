'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../styles/class.module.css';
import Table from "@/components/Table/Table";
import { useEffect, useMemo, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";
import ClassCollecion from "../../../core/Class";
import { actionButton } from "@/utils/actionTable";

export default function Class() {
    const repo = useMemo(() => new ClassCollecion(), []);

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [productId, setProductId] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [classses, setClasses] = useState<string[]>([]);
    const [loading, setLoading] = useState<any>(false);

    const convertDate = (cell: any, row: any) => {
        return cell.split("T")[0].split("-").reverse().join("/");
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativo" : "Inativo";
    }

    const handleActionButton = (cell: number, row: any) => {
        return actionButton({ 
            id: cell, 
            info: row, 
            editURL: "/aulas/editar/", 
            changeStatus: () => {}
        })
    }

    const listClass = () => {
        setLoading(true);
        repo.listClass(date, time, teacherId, productId,).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
            } else {
                setClasses(result.data);
                setLoading(false);
            }
        }).catch((error: any) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        listClass();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            dataField: 'date',
            text: `Data`,
            formatter: convertDate
        },
        {
            dataField: 'time',
            text: `Hora`,
        },
        {
            dataField: 'teacherId',
            text: `Professor`
        },
        {
            dataField: 'productId',
            text: `Tipo de Produto`
        },
        {
            dataField: 'active',
            text: `Status`,
            formatter: convertStatus
        },
        {
            dataField: 'id',
            formatter: handleActionButton
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
                                {/*<AuthInput
                                    label="Professor"
                                    value={teacher}
                                    type='text'
                                    changeValue={setTeacher}
                                    required
                                />*/}
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
                            data={classses}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}