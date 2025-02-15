'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/credit.module.css';

import ProductCollecion from "../../../core/Product";
import PersonsCollecion from "../../../core/Persons";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArrayType } from "@/utils/convertArray";
import { IconMinus, IconPlus } from "@/components/icons";

type Person = {
    label: string;
    value: number;
    identity: string;
    email: string;
    phone: string;
    birthday: string;
    active: number;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    height: number;
    weight: number;
    other: string;
    password: string;
    rule: string | null;
    frequency: string | null;
    employee: number;
    employee_level: string;
    createdAt: string;
    updatedAt: string;
};

type PersonArray = Person[];


export default function Checkout() {

    const repo = useMemo(() => new ProductCollecion(), []);
    const repoPerson = useMemo(() => new PersonsCollecion(), []);

    const [student, setStudent] = useState<string>("");
    const [discount, setDiscount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [productTemp, setProductTemp] = useState<any>([]);

    const [dropdownStudent, setDropdownStudent] = useState<PersonArray>([]);

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
    const onSubmit = () => {

    }

    const eventButton = [
        {
            name: "Cancelar",
            function: () => { },
            class: "btn-outline-primary"
        },
        {
            name: "Pesquisar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    useEffect(() => {
        repoPerson.listStudent(null, null, null, 1).then((resp: any) => { setDropdownStudent(resp.data) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setProductTemp([
            {
                name: 'teste1',
                id: 0,
                qtd: 0,
                value: 100
            },
            {
                name: 'teste 2',
                id: 1,
                qtd: 0,
                value: 50
            }
        ])
    }, [])

    return (
        <PageDefault title={"Vender Créditos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-7">
                    <Card
                        title="Checkout"
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-6">
                                <AuthSelect
                                    label='Aluno'
                                    value={student}
                                    options={convertArrayType(dropdownStudent)}
                                    changeValue={setStudent}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <AuthInput
                                    label="Desconto (%)"
                                    value={discount}
                                    type='number'
                                    changeValue={setDiscount}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <AuthSelect
                                    label='Tipo de Pagamento'
                                    value={1}
                                    options={[{ label: `Pagamento Externo`, value: 1 }]}
                                    changeValue={() => { }}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-5">
                    <Card
                        title="Resumo"
                        customClass="flex flex-col"
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex flex-col">
                                {productTemp?.map((item: any) => {
                                    return (
                                        <div key={item.id}>
                                            <div className="flex justify-between mb-3 mt-3">
                                                <span className={`${styles.summary_text} text-left`}>{item.name}</span>
                                                <div className="flex items-center">
                                                    <span className={`${styles.summary_value} text-left`} onClick={() => {
                                                        setProductTemp((prev: any) => {
                                                            return (prev.map((e: any) =>
                                                                e.id === item.id ? { ...e, qtd: Math.max(e.qtd - 1, 0) } : e
                                                            ))
                                                        })
                                                    }}>{IconMinus}</span>

                                                    <span className={`${styles.summary_value} text-left mx-5`}>{item.qtd}</span>

                                                    <span className={`${styles.summary_value} text-left`} onClick={() => {
                                                        setProductTemp((prev: any) => {
                                                            return (prev.map((e: any) =>
                                                                e.id === item.id ? { ...e, qtd: e.qtd + 1 } : e
                                                            ))
                                                        })
                                                    }}>{IconPlus}</span>

                                                </div>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className={`text-left`}>Valor</span>
                                                <span className={`${styles.summary_text} text-left`}>{Number(item.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                            </div>
                                            <hr className="opacity-30"/>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex justify-between mb-2">
                                    <span className={`text-left`}>Total</span>
                                    <span className={`${styles.summary_text} text-left`}>{Number(productTemp.reduce((sum: number, item: any) => sum + (item.value * item.qtd), 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageDefault >
    )
}