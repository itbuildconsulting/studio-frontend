'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/credit.module.css';

import CheckoutCollecion from "../../../core/Checkout";
import PersonsCollecion from "../../../core/Persons";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArray, convertArrayType } from "@/utils/convertArray";
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

    const repo = useMemo(() => new CheckoutCollecion(), []);
    const repoPerson = useMemo(() => new PersonsCollecion(), []);

    const [student, setStudent] = useState<string>("");
    const [discount, setDiscount] = useState<string>("0");
    const [productTemp, setProductTemp] = useState<any>([]);

    const [dropdownStudent, setDropdownStudent] = useState<PersonArray>([]);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const onSubmit = () => {

        const cash = {   // Informações do pagamento em dinheiro
            "description": "Pagamento em dinheiro",
            "confirm": true,   // Se confirmado ou não
            "metadata": {
                "additional_info": ""
            }
        }

        repo?.checkout(student, productTemp, cash, 1, Number(discount)).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setSuccessMessage("Cadastro realizado com sucesso!");
                setLog(0);
            }
        }).catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
            setLog(1);
            setLoading(false);
        });

    }

    const eventButton = [
        {
            name: "Cancelar",
            function: () => { },
            class: "btn-outline-primary"
        },
        {
            name: "Finalizar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    useEffect(() => {
        repoPerson.listStudent(null, null, null, 1).then((resp: any) => { setDropdownStudent(resp.data) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const savedProducts = localStorage.getItem('selectedProduct');
        setProductTemp(JSON.parse(savedProducts || '[]'));
    }, []);

    function calcularDesconto(numero: number, porcentagem: number) {
        const desconto = (numero * porcentagem) / 100;
        const resultado = numero - desconto;

        return resultado;
    }

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
                                    options={convertArray(dropdownStudent)}
                                    changeValue={setStudent}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <AuthInput
                                    label="Desconto (%)"
                                    value={discount}  // O valor armazenado no estado é o número sem o '%'
                                    type="text"  // Tipo 'text' para poder manipular a máscara
                                    maskType="percent"  // Usando a nova máscara de porcentagem
                                    changeValue={setDiscount}  // Atualiza o estado com o valor sem o '%'
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
                                    disabled
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
                                                    <span className={`${styles.summary_value} text-left cursor-pointer`} onClick={() => {
                                                        setProductTemp((prev: any) => {
                                                            return (prev.map((e: any) =>
                                                                e.id === item.id ? { ...e, quantity: Math.max(e.quantity - 1, 0) } : e
                                                            ))
                                                        })
                                                    }}>{IconMinus}</span>

                                                    <span className={`${styles.summary_value} text-left mx-5`}>{item.quantity}</span>

                                                    <span className={`${styles.summary_value} text-left cursor-pointer`} onClick={() => {
                                                        setProductTemp((prev: any) => {
                                                            return (prev.map((e: any) =>
                                                                e.id === item.id ? { ...e, quantity: e.quantity + 1 } : e
                                                            ))
                                                        })
                                                    }}>{IconPlus}</span>

                                                </div>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className={`text-left`}>Valor</span>
                                                <span className={`${styles.summary_text} text-left`}>{Number(item.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                            </div>
                                            <hr className="opacity-30" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex justify-between mb-2">
                                    <span className={`text-left`}>Subtotal</span>
                                    <span className={`text-left`}>{Number(productTemp.reduce((sum: number, item: any) => sum + (item.value * item.quantity), 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                {Number(discount) > 0 &&
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-left`}>Desconto</span>
                                        <span className={`text-left`}>{Number(discount)}%</span>
                                    </div>
                                }
                                <div className="flex justify-between mb-2">
                                    <span className={`${styles.summary_text} text-left`}>Total</span>
                                    <span className={`${styles.summary_text} text-left`}>{calcularDesconto(Number(productTemp.reduce((sum: number, item: any) => sum + (item.value * item.quantity), 0)), Number(discount)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageDefault >
    )
}