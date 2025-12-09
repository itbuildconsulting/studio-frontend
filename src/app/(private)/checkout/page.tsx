'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../../styles/credit.module.css';

import CheckoutCollecion from "../../../../core/Checkout";
import PersonsCollecion from "../../../../core/Persons";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArray } from "@/utils/convertArray";
import { IconMinus, IconPlus } from "@/components/icons";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/Loading";
import AuthSelectSearch from "@/components/auth/AuthSelectSearch";
import DropDownsCollection from "../../../../core/DropDowns";

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
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const router = useRouter();

    const [student, setStudent] = useState<string | number | null>(null);
    
    // ✅ NOVOS ESTADOS PARA DESCONTO
    const [discountType, setDiscountType] = useState<number>(1); // 1 = %, 2 = R$
    const [discountValue, setDiscountValue] = useState<string>("0");
    
    const [productTemp, setProductTemp] = useState<any>([]);
    const [dropdownStudent, setDropdownStudent] = useState<PersonArray>([]);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ✅ OPÇÕES DE TIPO DE DESCONTO
    const discountTypeOptions = [
        { value: 1, label: 'Porcentagem (%)' },
        { value: 2, label: 'Valor Fixo (R$)' },
    ];

    const onSubmit = () => {
        setLoading(true);

        const cash = {
            "description": "Pagamento em dinheiro",
            "confirm": true,
            "metadata": {
                "additional_info": ""
            }
        };

        // ✅ ENVIA O TIPO E VALOR DO DESCONTO
        repo?.checkout(
            String(student), 
            productTemp, 
            cash, 
            discountType,           // Tipo: 1 = % | 2 = R$
            Number(discountValue)   // Valor do desconto
        ).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                console.log(message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setModalSuccess(true);
            } else {
                setLoading(false);
                setSuccessMessage("Cadastro realizado com sucesso!");
                setLog(0);
                setModalSuccess(true);
            }
        }).catch((error) => {
            console.log(error.message);
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    };

    const eventButton = [
        {
            name: "Cancelar",
            function: () => { router.push("/creditos"); },
            class: "btn-outline-primary"
        },
        {
            name: "Finalizar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    useEffect(() => {
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
    }, []);

    useEffect(() => {
        const savedProducts = localStorage.getItem('selectedProduct');
        setProductTemp(JSON.parse(savedProducts || '[]'));
    }, []);

    const LoadingStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loading />
                <h5>Carregando...</h5>
                <div style={{ height: "56px" }}></div>
            </div>
        );
    };

    const SuccessStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                {log === 0 ? (
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                )}

                <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>
            </div>
        );
    };

    // ✅ FUNÇÃO AUXILIAR CORRIGIDA
    const parseFormattedValue = (value: string | number): number => {
        if (typeof value === 'number') return value;
        
        // Se já for um número válido em string, converte direto
        if (!isNaN(Number(value))) return Number(value);
        
        // Remove "R$", "R", "$", espaços, pontos de milhar e substitui vírgula por ponto
        const cleanValue = String(value)
            .replace(/R\$?/g, '')
            .replace(/\s/g, '')
            .replace(/\./g, '')  // Remove pontos (separador de milhar)
            .replace(',', '.');   // Troca vírgula por ponto (decimal)
        
        const number = parseFloat(cleanValue);
        return isNaN(number) ? 0 : number;
    };

    // ✅ FUNÇÃO PARA CALCULAR O TOTAL COM DESCONTO
    const calculateTotal = () => {
        const subtotal = productTemp.reduce((sum: number, item: any) => {
            const itemValue = parseFormattedValue(item.value);
            return sum + (itemValue * item.quantity);
        }, 0);
        
        const discountAmount = parseFormattedValue(discountValue);
        
        if (discountAmount <= 0) return subtotal;

        if (discountType === 1) {
            // Desconto percentual
            const discount = (subtotal * discountAmount) / 100;
            return subtotal - discount;
        } else {
            // Desconto fixo
            return Math.max(0, subtotal - discountAmount);
        }
    };

    // ✅ FUNÇÃO PARA CALCULAR O VALOR DO DESCONTO
    const getDiscountAmount = () => {
        const subtotal = productTemp.reduce((sum: number, item: any) => {
            const itemValue = parseFormattedValue(item.value);
            return sum + (itemValue * item.quantity);
        }, 0);
        
        const discountAmount = parseFormattedValue(discountValue);
        
        if (discountAmount <= 0) return 0;

        if (discountType === 1) {
            // Percentual
            return (subtotal * discountAmount) / 100;
        } else {
            // Fixo (não pode ser maior que o subtotal)
            return Math.min(discountAmount, subtotal);
        }
    };

    // ✅ CALCULA O SUBTOTAL
    const getSubtotal = () => {
        return productTemp.reduce((sum: number, item: any) => {
            const itemValue = parseFormattedValue(item.value);
            return sum + (itemValue * item.quantity);
        }, 0);
    };

    const handleClosed = () => {
        setModalSuccess(false);
    };

    return (
        <PageDefault title={"Vender Créditos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-7">
                    <Card
                        title="Checkout"
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8 gap-y-4">
                            <div className="col-span-12">
                                <AuthSelectSearch
                                    label='Aluno'
                                    value={student}
                                    options={convertArray(dropdownStudent)}
                                    changeValue={setStudent}
                                    placeholder="Pesquise o aluno..."
                                    required
                                />
                            </div>

                            {/* ✅ TIPO DE DESCONTO */}
                            <div className="col-span-12 md:col-span-4">
                                <AuthSelect
                                    label="Tipo de Desconto"
                                    value={discountType}
                                    options={discountTypeOptions}
                                    changeValue={setDiscountType}
                                    required
                                />
                            </div>

                            {/* ✅ VALOR DO DESCONTO */}
                            <div className="col-span-12 md:col-span-4">
                                {discountType === 1 ? (
                                    <AuthInput
                                        label="Desconto (%)"
                                        value={discountValue}
                                        type="text"
                                        maskType="percent"
                                        changeValue={setDiscountValue}
                                        required
                                    />
                                ) : (
                                    <AuthInput
                                        label="Desconto (R$)"
                                        value={discountValue}
                                        type="text"
                                        maskType="currency"
                                        changeValue={setDiscountValue}
                                        required
                                    />
                                )}
                            </div>

                            <div className="col-span-12 md:col-span-4">
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
                                                    <span 
                                                        className={`${styles.summary_value} text-left cursor-pointer`} 
                                                        onClick={() => {
                                                            setProductTemp((prev: any) => {
                                                                return (prev.map((e: any) =>
                                                                    e.id === item.id ? { ...e, quantity: Math.max(e.quantity - 1, 0) } : e
                                                                ));
                                                            });
                                                        }}
                                                    >
                                                        {IconMinus}
                                                    </span>

                                                    <span className={`${styles.summary_value} text-left mx-5`}>{item.quantity}</span>

                                                    <span 
                                                        className={`${styles.summary_value} text-left cursor-pointer`} 
                                                        onClick={() => {
                                                            setProductTemp((prev: any) => {
                                                                return (prev.map((e: any) =>
                                                                    e.id === item.id ? { ...e, quantity: e.quantity + 1 } : e
                                                                ));
                                                            });
                                                        }}
                                                    >
                                                        {IconPlus}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className={`text-left`}>Valor</span>
                                                <span className={`${styles.summary_text} text-left`}>
                                                    {Number(item.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>
                                            </div>
                                            <hr className="opacity-30" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col">
                                {/* SUBTOTAL */}
                                <div className="flex justify-between mb-2">
                                    <span className={`text-left`}>Subtotal</span>
                                    <span className={`text-left`}>
                                        {getSubtotal().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </span>
                                </div>

                                {/* ✅ DESCONTO (apenas se houver) */}
                                {Number(parseFormattedValue(discountValue)) > 0 && (
                                    <div className="flex justify-between mb-2 text-red-600">
                                        <span className={`text-left`}>
                                            Desconto {discountType === 1 ? `(${parseFormattedValue(discountValue)}%)` : ''}
                                        </span>
                                        <span className={`text-left`}>
                                            - {getDiscountAmount().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                    </div>
                                )}

                                {/* TOTAL */}
                                <div className="flex justify-between mb-2">
                                    <span className={`${styles.summary_text} text-left`}>Total</span>
                                    <span className={`${styles.summary_text} text-left`}>
                                        {calculateTotal().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/alunos'}
                isModalStatus={true}
            >
                <div className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}>
                    {loading ? <LoadingStatus /> : <SuccessStatus />}
                </div>
            </Modal>
        </PageDefault>
    );
}