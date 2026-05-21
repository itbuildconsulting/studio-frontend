'use client'

import PageDefault from "@/components/template/default";
import Modal from "@/components/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    CreditCard,
    Store,
    Hash,
    BadgeDollarSign,
    MapPin,
    Calendar,
    Clock,
    ShoppingCart,
    ArrowLeft
} from "lucide-react";

import FinancialCollecion from "../../../../../core/Financial";
import { PaymentStatus, PaymentMethod } from "@/shared/enum";

interface InfoFieldProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
    mono?: boolean;
    badge?: boolean;
}

function InfoField({ icon, label, value, highlight, mono, badge }: InfoFieldProps) {
    if (badge) {
        return (
            <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 w-fit">
                    {value}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3">
            {icon && (
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gray-500">{icon}</span>
                </div>
            )}
            <div>
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
                <p className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono text-xs break-all' : ''} ${highlight ? 'text-[var(--primary)]' : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function SingleFinancial() {
    const searchParams = useParams();
    const router = useRouter();
    const repo = useMemo(() => new FinancialCollecion(), []);

    const [transactionInfo, setTransactionInfo] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    useEffect(() => {
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
    }, []);

    const formatCurrency = (value: number) =>
        (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const cartItems: any[] = transactionInfo?.items || [];

    return (
        <PageDefault title="Financeiro">
            <div className="flex flex-col gap-6">

                {transactionInfo && (
                    <>
                        {/* Detalhes do Pagamento */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                {transactionInfo.title || 'Aulas Studio Mensal - Aula Coletiva'}
                            </h2>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                                <InfoField
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Nome"
                                    value={transactionInfo.customerName}
                                />
                                <InfoField
                                    icon={<Store className="w-4 h-4" />}
                                    label="Canal de Venda"
                                    value="App Studio"
                                />

                                <div className="grid grid-cols-3 gap-5 col-span-2">
                                    <InfoField
                                        icon={<Hash className="w-4 h-4" />}
                                        label="Créditos"
                                        value={String(transactionInfo.balance)}
                                        highlight
                                    />
                                    <InfoField
                                        icon={<BadgeDollarSign className="w-4 h-4" />}
                                        label="Valor"
                                        value={formatCurrency(transactionInfo.amount)}
                                    />
                                    <InfoField
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Local"
                                        value={transactionInfo.location}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-5 col-span-2">
                                    <InfoField
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Data do pagamento"
                                        value={transactionInfo.closedAt}
                                    />
                                    <InfoField
                                        icon={<Clock className="w-4 h-4" />}
                                        label="Horário do pagamento"
                                        value={transactionInfo.hour}
                                    />
                                    <InfoField
                                        icon={<Hash className="w-4 h-4" />}
                                        label="ID do pagamento"
                                        value={transactionInfo.transactionId}
                                        mono
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-5 col-span-2">
                                    <InfoField
                                        icon={<CreditCard className="w-4 h-4" />}
                                        label="Método de pagamento"
                                        value={PaymentMethod[transactionInfo.payment_method?.toUpperCase() as keyof typeof PaymentMethod] || transactionInfo.payment_method}
                                        highlight
                                    />
                                    <InfoField
                                        label="Bandeira"
                                        value={transactionInfo.bandeira || '—'}
                                    />
                                    <InfoField
                                        label="Status"
                                        value={PaymentStatus[transactionInfo.status?.toUpperCase() as keyof typeof PaymentStatus] || transactionInfo.status}
                                        badge
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Itens do Carrinho */}
                        {cartItems.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Itens do Carrinho</h3>
                                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {cartItems.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-4 py-2 text-[11px] text-gray-400 uppercase tracking-wider">
                                    <span>Item</span>
                                    <span className="text-center">Qtd</span>
                                    <span className="text-right">Valor Unit.</span>
                                    <span className="text-right">Total</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {cartItems.map((item: any, i: number) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-[1fr_80px_120px_120px] gap-4 items-center bg-gray-50 rounded-lg px-4 py-3"
                                        >
                                            <span className="text-sm font-medium text-gray-900">{item.description}</span>
                                            <span className="text-sm text-gray-500 text-center">{item.quantity}</span>
                                            <span className="text-sm text-gray-500 text-right">{formatCurrency(item.amount / item.quantity)}</span>
                                            <span className="text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatCurrency(transactionInfo.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Botão Voltar */}
                <div className="flex justify-end">
                    <button
                        onClick={() => router.push('/financeiro')}
                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </button>
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={showModal}
                setShowModal={setShowModal}
                hrefClose="/financeiro"
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h5 className="text-gray-700">{modalMessage}</h5>
                        <button className="btn-outline-primary px-5 mt-5" onClick={() => router.push('/financeiro')}>
                            Fechar
                        </button>
                    </div>
                </div>
            </Modal>
        </PageDefault>
    );
}
