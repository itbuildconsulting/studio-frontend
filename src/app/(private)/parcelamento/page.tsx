'use client'

import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";
import { ValidationForm } from "@/components/formValidation/validation";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import ValidationFields from "@/validators/fields";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL_API || 'https://backend.studiostaging.xyz';

export default function InstallmentRules() {
    const [modalRuleAdd, setModalRuleAdd] = useState<boolean>(false);
    
    const [id, setId] = useState<number | null>(null);
    const [minAmount, setMinAmount] = useState<number | null>(null);
    const [maxAmount, setMaxAmount] = useState<number | null>(null);
    const [maxInstallments, setMaxInstallments] = useState<number | null>(null);
    const [interestFreeInstallments, setInterestFreeInstallments] = useState<number | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean>(true);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [listRules, setListRules] = useState<any[]>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

    const convertValue = (cell: any) => {
        return Number(cell).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    const formatRange = (cell: any, row: any) => {
        return `${convertValue(row.min_amount / 100)} - ${convertValue(row.max_amount / 100)}`
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativa" : "Inativa"
    }

    const actionButtonRule = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
                <>...</>
                <Link href={"#"} onClick={() => detailsRule(cell)}>
                    Editar
                </Link>
                {row.is_active ? (
                    <Link href={'#'} onClick={() => toggleStatus(cell, false)}>
                        Inativar
                    </Link>
                ) : (
                    <Link href={'#'} onClick={() => toggleStatus(cell, true)}>
                        Ativar
                    </Link>
                )}
            </DropDown>
        )
    }

    const columns = [
        {
            dataField: 'min_amount',
            text: `Faixa de Valores`,
            formatter: formatRange
        },
        {
            dataField: 'description',
            text: `Descrição`,
        },
        {
            dataField: 'max_installments',
            text: `Máx. Parcelas`,
        },
        {
            dataField: 'is_active',
            text: `Status`,
            formatter: convertStatus
        },
        {
            dataField: 'id',
            formatter: actionButtonRule
        }
    ];

    function onSubmitRuleAdd() {
        setErrorMessage(null);
        setLoading(true);

        const validationError = ValidationFields({ 
            "Valor Mínimo": `${minAmount}`, 
            "Valor Máximo": `${maxAmount}`, 
            "Máximo de Parcelas": `${maxInstallments}`,
        });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            return;
        }

        if (minAmount! >= maxAmount!) {
            setErrorMessage('Valor mínimo deve ser menor que o valor máximo');
            setLoading(false);
            return;
        }

        if (interestFreeInstallments! > maxInstallments!) {
            setErrorMessage('Parcelas sem juros não pode ser maior que máximo de parcelas');
            setLoading(false);
            return;
        }

        const token = Cookies.get('admin-user-sci-auth');
        
        const body = {
            min_amount: Number(minAmount) * 100, // Converter para centavos
            max_amount: Number(maxAmount) * 100,
            max_installments: Number(maxInstallments),
            interest_free_installments: Number(interestFreeInstallments) || 0,
            description: description || '',
            is_active: isActive,
        };

        let url = `${API_BASE_URL}/installment-rules/create`;
        
        if (edit) {
            url = `${API_BASE_URL}/installment-rules/update`;
            Object.assign(body, { id });
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then((result: any) => {
            if (!result.success) {
                setErrorMessage(result.message || 'Erro ao salvar regra');
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setModalRuleAdd(false);
                setSuccessMessage(edit ? "Edição realizada com sucesso!" : "Cadastro realizado com sucesso!");
                setLog(0);
                listGeneralRules(1);
            }
        })
        .catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
            setLog(1);
            setLoading(false);
        });
    }

    const handleClosed = () => {
        setModalSuccess(false);
    }

    const LoadingStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <h5>Carregando...</h5>
                <div style={{ height: "56px" }}></div>
            </div>
        )
    }

    const SuccessStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                {log === 0 ?
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    :
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>
            </div>
        )
    };

    const listGeneralRules = (page: number) => {
        setPage(page);
        setLoading(true);

        const token = Cookies.get('admin-user-sci-auth');

        fetch(`${API_BASE_URL}/installment-rules/list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then((result: any) => {
            setLoading(false);

            if (!result.success) {
                setListRules([]);
                setInfoPage(pageDefault);
            } else {
                setListRules(result.data);
                // Como não tem paginação no backend ainda, simular:
                setInfoPage({
                    totalRecords: result.data.length,
                    totalPages: 1,
                    currentPage: 1,
                    pageSize: result.data.length,
                });
            }
        })
        .catch(() => {
            setListRules([]);
            setInfoPage(pageDefault);
            setLoading(false);
        });
    }

    useEffect(() => {
        listGeneralRules(page);
    }, [page]);

    const detailsRule = (id: number) => {
        setEdit(true);
        setModalRuleAdd(true);
        setErrorMessage(null);

        const token = Cookies.get('admin-user-sci-auth');

        fetch(`${API_BASE_URL}/installment-rules/details/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then((result: any) => {
            if (!result.success) {
                console.log("erro");
            } else {
                const rule = result.data;
                setId(rule.id);
                setMinAmount(rule.min_amount / 100); // Converter de centavos
                setMaxAmount(rule.max_amount / 100);
                setMaxInstallments(rule.max_installments);
                setInterestFreeInstallments(rule.interest_free_installments);
                setDescription(rule.description);
                setIsActive(rule.is_active);
            }
        })
        .catch(() => { });
    };

    const toggleStatus = (id: number, newStatus: boolean) => {
        const action = newStatus ? 'ativar' : 'inativar';
        
        if (!confirm(`Deseja realmente ${action} esta regra?`)) {
            return;
        }

        setLoading(true);

        const token = Cookies.get('admin-user-sci-auth');

        const body = {
            id,
            is_active: newStatus,
        };

        fetch(`${API_BASE_URL}/installment-rules/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then((result: any) => {
            setLoading(false);
            
            if (!result.success) {
                alert(result.message || `Erro ao ${action}`);
            } else {
                alert(`Regra ${newStatus ? 'ativada' : 'inativada'} com sucesso!`);
                listGeneralRules(1); // Recarregar lista
            }
        })
        .catch((error: any) => {
            setLoading(false);
            alert(`Erro ao ${action} regra`);
        });
    };

    useEffect(() => {
        if (!modalRuleAdd) {
            setEdit(false);
            setId(null);
            setMinAmount(null);
            setMaxAmount(null);
            setMaxInstallments(null);
            setInterestFreeInstallments(null);
            setDescription(null);
            setIsActive(true);
        }
    }, [modalRuleAdd]);

    return (
        <PageDefault title={"Parcelamento"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        title="Regras de Parcelamento"
                        hasButton={true}
                        setShowModal={setModalRuleAdd}
                    >
                        <Table
                            data={listRules}
                            columns={columns}
                            loading={loading}
                            setPage={setPage}
                            infoPage={infoPage}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={edit ? "Editar Regra" : "Adicionar Regra"}
                btnClose={true}
                setShowModal={setModalRuleAdd}
                showModal={modalRuleAdd}
                hasFooter={true}
                onSubmit={onSubmitRuleAdd}
                loading={loading}
                edit={edit}
            >
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-6">
                        <AuthInput
                            label="Valor Mínimo (R$)*"
                            value={minAmount}
                            type='number'
                            changeValue={setMinAmount}
                            edit={edit}
                            maskType="positivo"
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Valor Máximo (R$)*"
                            value={maxAmount}
                            type='number'
                            changeValue={setMaxAmount}
                            edit={edit}
                            maskType="positivo"
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Máximo de Parcelas*"
                            value={maxInstallments}
                            type='number'
                            changeValue={setMaxInstallments}
                            edit={edit}
                            maskType="positivo"
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Parcelas Sem Juros"
                            value={interestFreeInstallments}
                            type='number'
                            changeValue={setInterestFreeInstallments}
                            edit={edit}
                            maskType="positivo"
                        />
                    </div>
                    <div className="col-span-12">
                        <AuthInput
                            label="Descrição"
                            value={description}
                            type='text'
                            changeValue={setDescription}
                            edit={edit}
                        />
                    </div>

                    <ValidationForm errorMessage={errorMessage} />
                </div>
            </Modal>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                isModalStatus={true}
                edit={edit}
            >
                <div className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}>
                    {loading ? <LoadingStatus /> : <SuccessStatus />}
                </div>
            </Modal>
        </PageDefault>
    )
}