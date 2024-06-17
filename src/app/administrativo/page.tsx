'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from '../../styles/administrative.module.css';
import Modal from "@/components/Modal/Modal";
import { useEffect, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";

import PlaceCollecion from "../../../core/Place";
import PlaceRepository from "../../../core/PlaceRepository";
import ProductTypeCollecion from "../../../core/ProductType";
import ProductTypeRepository from "../../../core/ProductTypeRepository";
import Loading from "@/components/loading/Loading";

export default function Administrative() {
    const repo: PlaceRepository = new PlaceCollecion();
    const repoType: ProductTypeRepository = new ProductTypeCollecion();

    const [modalLocaleShow, setModalLocaleShow] = useState<boolean>(false);
    const [modalTypeProductShow, setModalTypeProductShow] = useState<boolean>(false);

    const [localeName, setLocaleName] = useState<string | null>(null);
    const [addressName, setAdressName] = useState<string | null>(null);

    const [typeName, setTypeName] = useState<string | null>(null);
    const [productLocaleName, setProductLocaleName] = useState<string | null>(null);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    /*     const changeStatus = (cell: any, row: any) => {
            return (
                <>
                    {cell ? "Ativo" : "Inativo"}
                </>
            )
        }
    
        const convertDate = (cell: any, row: any) => {
            return (
                <>
                    {cell.split("-").reverse().join("/")}
                </>
            )
        } */

    let info: any = {
        rows: [
            {
                local: "Studio Raphael Oliveira",
                endereço: "Estr. Caetano Monteiro, 1650, sl 104 - Pendotiba"
            },
            {
                local: "Bike Raphael Oliveira",
                endereço: "Estr. Caetano Monteiro, 1650, sl 104 - Pendotiba"
            },
            {
                local: "Studio Barra da Tijuca",
                endereço: "Av. das Américas, 7700 - Barra da Tijuca"
            }
        ]
    }

    let info2: any = {
        rows: [
            {
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
            },
            {
                tipo: "Aula Individual",
                local: "Studio Raphael Oliveira",
            },
            {
                tipo: "Bike Coletiva",
                local: "Bike Raphael Oliveira",
            }
        ]
    }

    const columns = [
        {
            dataField: 'local',
            text: `Local`,
        },
        {
            dataField: 'endereço',
            text: `Endereço`,
        }
    ];

    const columns2 = [
        {
            dataField: 'tipo',
            text: `Tipo`,
        },
        {
            dataField: 'local',
            text: `Local`,
        }
    ];

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

                <button className="btn-outline-primary px-5 mt-5" onClick={() => setModalSuccess(false)}>
                    Fechar
                </button>

            </div>
        )
    };

    function onSubmitLocale() {
        setLoading(true);

        repo?.create(localeName, true).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
                setLog(1);
                setErrorMessage(result.message);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setModalLocaleShow(false);
                setLocaleName(null);
                setAdressName(null);
                setLog(0);
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
            setLoading(false);
            setLog(1);
        });
    }

    useEffect(() => {
        if (!modalLocaleShow) {
            setLocaleName(null);
            setAdressName(null);
        }
    }, [modalLocaleShow]);

    function onSubmitTypeProduct() {
        setLoading(true);

        repoType?.create(typeName, true).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
                setLog(1);
                setErrorMessage(result.message);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setModalTypeProductShow(false);
                setTypeName(null);
                setProductLocaleName(null);
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

    useEffect(() => {
        if (!modalTypeProductShow) {
            setTypeName(null);
            setProductLocaleName(null);
        }
    }, [modalTypeProductShow]);

    return (
        <PageDefault title={"Administrativo"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-6">
                    <Card
                        title="Locais"
                        hasButton={true}
                        setShowModal={setModalLocaleShow}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_locale_adm}
                        />
                    </Card>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <Card
                        title="Tipos de Produtos"
                        hasButton={true}
                        setShowModal={setModalTypeProductShow}
                    >
                        <Table
                            data={info2.rows}
                            columns={columns2}
                            class={styles.product_type_adm}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={"Adicionar Local"}
                btnClose={true}
                setShowModal={setModalLocaleShow}
                showModal={modalLocaleShow}
                hasFooter={true}
                onSubmit={onSubmitLocale}
                loading={loading}
            >
                <div>
                    <div>
                        <AuthInput
                            label="Local"
                            value={localeName}
                            type='text'
                            changeValue={setLocaleName}
                            required
                        />
                    </div>
                    <div>
                        <AuthInput
                            label="Endereço"
                            value={addressName}
                            type='text'
                            changeValue={setAdressName}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-12">
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
                </div>
            </Modal>

            <Modal
                title={"Adicionar Tipo de Produto"}
                btnClose={true}
                setShowModal={setModalTypeProductShow}
                showModal={modalTypeProductShow}
                hasFooter={true}
                onSubmit={onSubmitTypeProduct}
                loading={loading}
            >
                <div>
                    <div>
                        <AuthInput
                            label="Nome do tipo"
                            value={typeName}
                            type='text'
                            changeValue={setTypeName}
                            required
                        />
                    </div>
                    <div>
                        <AuthInput
                            label="Local"
                            value={productLocaleName}
                            type='text'
                            changeValue={setProductLocaleName}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12">
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