'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../styles/class.module.css';
import Table from "@/components/Table/Table";
import { useEffect, useMemo, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";
import ClassCollecion from "../../../core/Class";
import { actionButton } from "@/utils/actionTable";
import SingleCalendar from "@/components/date/SingleCalendar";
import TimePickerCalendar from "@/components/date/TimePickerCalendar";
import DropDownsCollection from "../../../core/DropDowns";
import AuthSelect from "@/components/auth/AuthSelect";
import Time from "@/components/time/time";

export default function Class() {
    const repo = useMemo(() => new ClassCollecion(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [classses, setClasses] = useState<string[]>([]);
    const [loading, setLoading] = useState<any>(false);

    const [dropdownType, setDropdownType] = useState<string[]>([]);
    const [dropdownTeacher, setDropdownTeacher] = useState<string[]>([]);

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
            changeStatus: () => { }
        })
    }

    const listClass = (dateF: string, timeF: string, teacherF: string, typeF: string) => {
        setDate(dateF);
        setTime(timeF);
        setTeacherId(teacherF);
        setType(typeF);
        setLoading(true);
        repo.listClass(dateF, timeF, teacherF, typeF).then((result: any) => {
            setLoading(false);

            if (result instanceof Error) {
                setClasses([]);
            } else {
                setClasses(result.data);
            }
        }).catch(() => {
            setLoading(false);
            setClasses([]);
        });
    }

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
        listClass("", "", "", "");
    }

    const onSubmit = () => {
        listClass(date, time, teacherId, type);
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

    function convertArrayType(array: any) {
        return array.map((item: any) => {
            const { name, id, place, ...rest } = item;
            return { label: `${name} - ${place?.name}`, value: id, ...rest };
        });
    }

    function convertArrayType2(array: any) {
        return array?.map((item: any) => {
            const { name, id, place, ...rest } = item;
            return { label: `${name}`, value: id, ...rest };
        });
    }

    useEffect(() => {
        listClass(date, time, teacherId, type);

        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownTeacher);
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
    }, []);

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
                                <SingleCalendar
                                    label="Data"
                                    date={date}
                                    setValue={setDate}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Time
                                    label="Hora"
                                    value={time}
                                    setValue={setTime}
                                />

                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Tipo de Produto'
                                    value={type}
                                    options={convertArrayType(dropdownType)}
                                    changeValue={setType}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Professor'
                                    value={teacherId}
                                    options={convertArrayType2(dropdownTeacher)}
                                    changeValue={setTeacherId}
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