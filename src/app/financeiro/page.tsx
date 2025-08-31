'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/financial.module.css';

import FinancialCollecion from "../../../core/Financial";
import SingleCalendar from "@/components/date/SingleCalendar";
import DropdownType from "../../model/Dropdown";
import DropDownsCollection from "../../../core/DropDowns";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArray } from "@/utils/convertArray";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

export default function Financial() {
    const edit: boolean = false;
    const repo = useMemo(() => new FinancialCollecion(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const [page, setPage] = useState<number>(1);

    const [transaction, setTransaction] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [students, setStudents] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [financialList, setFinancialList] = useState<string[]>([]);

    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);

    const statusColors: any = {
        processing: '#FFA500', // Laranja
        authorized: '#87CEEB', // Azul claro
        paid: '#4CAF50', // Verde
        refunded: '#FF0000', // Vermelho
        waiting_payment: '#FFC107', // Amarelo
        pending_refund: '#FF4500', // Vermelho alaranjado
        refused: '#8B0000', // Vermelho escuro
        chargeback: '#8A2BE2', // Roxo
        analyzing: '#FFD700', // Dourado
        pending_review: '#F08080', // Vermelho claro
    };

    const convertValue = (cell: number) => {
        const newValue = cell / 100;
        return newValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        //return cell;
    }

    const convertDate = (cell: string) => {
        return cell.split("-").reverse().join("/");
    }

    const convertData = (cell: string) => {
        formatDateToBrazilIntl(cell)
    }

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

    const convertStatus = (cell: number) => {
        return (
            <div
                style={{
                    backgroundColor: statusColors[cell] || '#D3D3D3', // Cor padrão cinza, se o cell não for reconhecido
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
    }

    const actionButtonFinancial = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
                <>...</>
                <Link href={`/financeiro/${cell}`}>
                    Ver
                </Link>
            </DropDown>
        )
    }

    const listFinancial = (clear: boolean = false) => {
        setLoading(true);

        let obj = {
            students: !clear ? students : null,
            date: !clear ? date : '',
            transaction: !clear ? transaction : '',
        }
        
        repo.getLatestTransactions(obj.students, obj.date, obj.transaction, page).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
            } else {
                setFinancialList(result.data);
                setLoading(false);
            }
        }).catch((error: any) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        listFinancial();
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            dataField: 'customerName',
            text: `Nome`
        },
        {
            dataField: 'transactionId',
            text: `Id da Transação`
        },
        {
            dataField: 'createdAt',
            text: `Data`,
            formatter: convertData
        },
        {
            dataField: 'amount',
            text: `Valor`,
            formatter: convertValue
        },
        {
            dataField: 'status',
            text: `Status`,
            formatter: convertStatus
        },
        {
            dataField: 'transactionId',
            formatter: actionButtonFinancial
        }
    ];

    const clear = () => {
        setTransaction(() => '');
        setDate(() => '');
        setStudents(() => null);

        listFinancial(true);
    }

    const onSubmit = () => {
        listFinancial()
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
                <div className="col-span-12">
                    <Card
                        title="Últimas Transações"
                        url={"/aulas/cadastrar"}
                    >
                        <Table
                            data={financialList}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault >
    )
}