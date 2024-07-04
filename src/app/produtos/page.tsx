'use client'

import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";

import ProductCollecion from "../../../core/Product";
import Loading from "@/components/loading/Loading";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

export default function Products() {
    const repo = useMemo(() => new ProductCollecion(), []);

    const [modalProductAdd, setModalProductAdd] = useState<boolean>(false);

    const [productName, setProductName] = useState<string | null>(null);
    const [creditValue, setCreditValue] = useState<number | null>(null);
    const [validity, setValidity] = useState<string | null>(null);
    const [typeProduct, setTypeProduct] = useState<number | null>(null);
    const [localeName, setLocaleName] = useState<number | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [status, setStatus] = useState<boolean>(true);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    const [listProduct, setListProduct] = useState<string[]>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const convertValue = (cell: any, row: any) => {
        return cell.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativo" : "Inativo"
    }

    const actionButtonProduct = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'} styleHeader={'bg-white'} className="nav-link">
                <>...</>

                <Link href={"#"} onClick={() => detailsProduct(cell)}>
                    Editar
                </Link>
                <Link href={'#'} onClick={() => deleteProduct(cell)}>
                    Excluir
                </Link>

            </DropDown>
        )
    }

    const columns = [
        {
            dataField: 'name',
            text: `Produto`,
        },
        {
            dataField: 'credit',
            text: `Créditos`,
        },
        {
            dataField: 'productTypeId',
            text: `Tipo`,
        },
        {
            dataField: 'placeId',
            text: `Local`,
        },
        {
            dataField: 'value',
            text: `Valor`,
            formatter: convertValue
        },
        {
            dataField: 'active',
            text: `Status`,
            formatter: convertStatus
        },
        {
            dataField: 'id',
            formatter: actionButtonProduct
        }
    ];

    function onSubmitProductAdd() {
        setLoading(true);
        setErrorMessage(null);

        repo?.create(productName, Number(creditValue), validity, Number(value), typeProduct, localeName, true).then((result: any) => {
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
                setModalProductAdd(false);
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

    const handleClosed = () => {
        setModalSuccess(false);
    }

    const LoadingStatus = () => {
        return (
            <div className="flex flex-col items-center  ">
                <Loading />
                <h5>Carregando...</h5>
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
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{log === 0 ? "Cadastrado realizado com sucesso!" : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>

            </div>
        )
    };

    const listGeneralProduct = () => {
        repo.list().then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setListProduct(result);
            }
        }).catch((error: any) => {

        });
    }

    useEffect(() => {
        listGeneralProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const detailsProduct = (id: number) => {
        setEdit(true);
        setModalProductAdd(true);
        setErrorMessage(null);

        repo.details(id).then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setProductName(result.name);
                setCreditValue(result.credit);
                setValidity(result.validateDate);
                setTypeProduct(result.productTypeId);
                setLocaleName(result.placeId);
                setValue(result.value);
                setStatus(result.active);
            }
        }).catch((error: any) => {

        });
    };

    const deleteProduct = (id: number) => {
        setModalSuccess(true);
        setLoading(true);

        repo.delete(id).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setLog(0);
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!modalProductAdd) {
            setEdit(false);
            setProductName(null);
            setCreditValue(null);
            setValidity(null);
            setTypeProduct(null);
            setLocaleName(null);
            setValue(null);
            setStatus(true);
        }
    }, [modalProductAdd]);

    return (
        <PageDefault title={"Produtos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        title="Meus Produtos"
                        hasButton={true}
                        setShowModal={setModalProductAdd}
                    >
                        <Table
                            data={listProduct}
                            columns={columns}
                            class={styles.table_locale_adm}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={edit ? "Editar Produto" : "Adicionar Produto"}
                btnClose={true}
                setShowModal={setModalProductAdd}
                showModal={modalProductAdd}
                hasFooter={true}
                onSubmit={onSubmitProductAdd}
                loading={loading}
                edit={edit}
            >
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-6">
                        <AuthInput
                            label="Nome do Produto"
                            value={productName}
                            type='text'
                            changeValue={setProductName}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Créditos"
                            value={creditValue}
                            type='text'
                            changeValue={setCreditValue}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Validade"
                            value={validity}
                            type='text'
                            changeValue={setValidity}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Tipo de Produto"
                            value={typeProduct}
                            type='text'
                            changeValue={setTypeProduct}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Local"
                            value={localeName}
                            type='text'
                            changeValue={setLocaleName}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Valor"
                            value={value}
                            type='text'
                            changeValue={setValue}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Status"
                            options={[
                                {
                                    value: true,
                                    label: "Ativo"
                                },
                                {
                                    value: false,
                                    label: "Inativo"
                                }
                            ]}
                            value={status}
                            changeValue={setStatus}
                            required
                        />
                    </div>
                    {errorMessage === null ? false :
                        <div className={` 
                                        bg-red-400 text-white py-1 px-2
                                        border border-red-500 rounded-md
                                        flex flex-row items-center col-span-12
                                        `}>
                            {/* {IconWarning} */}
                            <span className='ml-2 text-sm'>{errorMessage}</span>
                        </div>
                    }
                </div>
            </Modal>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/proprietarios'}
                isModalStatus={true}
            >
                <div
                    className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}
                >

                    {loading ? <LoadingStatus /> : <SuccessStatus />}

                    <div className="">

                    </div>
                </div>

            </Modal>
        </PageDefault>
    )
}