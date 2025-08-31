'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/financial.module.css';

import FinancialCollecion from "../../../../core/Financial";
import SingleCalendar from "@/components/date/SingleCalendar";
import AuthSelect from "@/components/auth/AuthSelect";
import { convertArray } from "@/utils/convertArray";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EventBtn } from "@/types/btn";
import { PaymentStatus, PaymentMethod } from "@/shared/enum";
import Modal from "@/components/Modal/Modal";

export default function SingleFinancial() {
    const searchParams = useParams()
    const repo = useMemo(() => new FinancialCollecion(), []);
    const [transactionInfo, setTransactionInfo] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const listFinancial = () => {
        repo.getSingleTransactions(`${searchParams.slug}`).then((result: any) => {
            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            } else {
                setTransactionInfo(result.transaction);
            }
        }).catch((error: any) => {
            setShowModal(true);
            setModalMessage(JSON.parse(error.message).message || "Erro desconhecido");
        });
    }

    useEffect(() => {
        listFinancial();
    }, []);

    const eventButton: EventBtn[] = [
        {
            name: "Voltar",
            function: () => { window.location.href = "/financeiro" },
            class: "btn-outline-primary"
        }
    ];

    return (
        <PageDefault title={"Financeiro"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    {
                        transactionInfo &&
                        <>
                            <Card
                                title="Aulas Studio Mensal - Aula Coletiva"
                                hasFooter={true}
                                eventsButton={eventButton}
                            >
                                <div className="grid grid-cols-12 gap-x-8">
                                    <div className="col-span-4 mb-10">
                                        <small><strong>Nome</strong></small>
                                        <p>{transactionInfo.customerName}</p>
                                    </div>
                                    <div className="col-span-8 mb-10">
                                        <small><strong>Canal de Venda</strong></small>
                                        <p>App Studio</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Créditos</strong></small>
                                        <p>{transactionInfo.balance}</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Valor</strong></small>
                                        <p>{transactionInfo.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                                    </div>
                                    <div className="col-span-8 mb-10">
                                        <small><strong>Local</strong></small>
                                        <p>{transactionInfo.location}</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Data do pagamento</strong></small>
                                        <p>{transactionInfo.closedAt}</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Horário do pagamento</strong></small>
                                        <p>{transactionInfo.hour}</p>
                                    </div>
                                    <div className="col-span-8 mb-10">
                                        <small><strong>ID do pagamento</strong></small>
                                        <p>{transactionInfo.transactionId}</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Método de pagamento</strong></small>
                                        <p>{PaymentMethod[transactionInfo.payment_method.toUpperCase() as keyof typeof PaymentMethod] || transactionInfo.payment_method}</p>
                                    </div>
                                    <div className="col-span-2 mb-10">
                                        <small><strong>Bandeira</strong></small>
                                        <p>{transactionInfo.bandeira}</p>
                                    </div>
                                    <div className="col-span-8 mb-10">
                                        <small><strong>Status</strong></small>
                                        <p>{PaymentStatus[transactionInfo.status.toUpperCase() as keyof typeof PaymentStatus] || transactionInfo.status}</p>
                                    </div>
                                </div>
                            </Card>
                        </>
                    }
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={showModal}
                setShowModal={setShowModal}
                hrefClose={'/financeiro'}
                isModalStatus={true}
            >
                <div
                    className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}
                >
                    <div className="flex flex-col items-center gap-4">

                        <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                        <h5 className="text-gray-700">{modalMessage}</h5>

                        <button className="btn-outline-primary px-5 mt-5" onClick={() => { window.location.href = "/financeiro" }}>
                            Fechar
                        </button>

                    </div>
                </div>

            </Modal>
        </PageDefault >
    )
}