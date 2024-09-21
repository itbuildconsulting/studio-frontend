'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from '../../styles/administrative.module.css';
import Modal from "@/components/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";

import PlaceCollecion from "../../../core/Place";
import PlaceRepository from "../../../core/PlaceRepository";
import ProductTypeCollecion from "../../../core/ProductType";
import ProductTypeRepository from "../../../core/ProductTypeRepository";
import DropDownsCollection from "../../../core/DropDowns";
import Loading from "@/components/loading/Loading";
import { text } from "stream/consumers";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import AuthSelect from "@/components/auth/AuthSelect";

export default function Administrative() {
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const repo = useMemo(() => new PlaceCollecion(), []);
    const repoType = useMemo(() => new ProductTypeCollecion(), []);

    const [modalLocaleShow, setModalLocaleShow] = useState<boolean>(false);
    const [modalTypeProductShow, setModalTypeProductShow] = useState<boolean>(false);

    const [localeName, setLocaleName] = useState<string | null>(null);
    const [addressName, setAdressName] = useState<string | null>(null);
    const [listLocales, setListLocales] = useState<string[]>([]);
    const [idLocales, setIdLocales] = useState<number>(0);
    const [dropdownPlace, setDropdownPlace] = useState<string[]>([]);

    const [typeName, setTypeName] = useState<string | null>(null);
    const [productLocaleName, setProductLocaleName] = useState<number | null>(null);
    const [listProductType, setListProductType] = useState<string[]>([]);
    const [idProductType, setIdProductType] = useState<number>(0);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [loading, setLoading] = useState<any>(false);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    const [edit, setEdit] = useState<boolean>(false);

    function convertArray(array: any) {
        return array.map((item: any) => {
            const { name, address, id, ...rest } = item;
            return { label: `${name} - ${address}`, value: id, ...rest };
        });
    }

    const actionLocaleName = (cell: any, row: any) => {
        return cell?.name || "Não definido";
    }

    const actionButtonLocale = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'} className="nav-link">
                <>...</>

                <Link href={"#"} onClick={() => detailsLocale(cell)}>
                    Editar
                </Link>
                <Link href={'#'} onClick={() => deleteLocale(cell)}>
                    Excluir
                </Link>

            </DropDown>
        )
    }

    const actionButtonProductType = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'} className="nav-link">
                <>...</>
                <Link href={"#"} onClick={() => detailsProductType(cell)}>
                    Editar
                </Link>
                <Link href={'#'} onClick={() => deleteProductType(cell)}>
                    Excluir
                </Link>
            </DropDown>
        )
    }

    const columns = [
        {
            dataField: 'name',
            text: `Local`,
        },
        {
            dataField: 'address',
            text: `Endereço`,
        },
        {
            dataField: 'id',
            formatter: actionButtonLocale
        }
    ];

    const columns2 = [
        {
            dataField: 'name',
            text: `Tipo`,
        },
        {
            dataField: 'place',
            text: `Local`,
            formatter: actionLocaleName
        },
        {
            dataField: 'id',
            formatter: actionButtonProductType
        }
    ];

    const handleClosed = () => {
        setModalSuccess(false);
    }

    const LoadingStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loading />
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
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>

            </div>
        )
    };

    function onSubmitLocale() {
        setLoading(true);
        setErrorMessage(null);

        (edit ? repo?.edit(localeName, addressName, true, idLocales) : repo?.create(localeName, addressName, true)).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setSuccessMessage(edit ? "Edição realizada com sucesso!" : "Cadastro realizado com sucesso!")
                setModalSuccess(true);
                setLoading(false);
                setModalLocaleShow(false);
                setLocaleName(null);
                setAdressName(null);
                setLog(0);
                listGeneral();
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

    function onSubmitTypeProduct() {
        setLoading(true);
        setErrorMessage(null);

        (edit ? repoType?.edit(typeName, Number(productLocaleName), true, idProductType) : repoType?.create(typeName, Number(productLocaleName), true)).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setSuccessMessage(edit ? "Edição realizada com sucesso!" : "Cadastro realizado com sucesso!")
                setModalSuccess(true);
                setLoading(false);
                setModalTypeProductShow(false);
                setTypeName(null);
                setProductLocaleName(null);
                setLog(0);
                listGeneralProductType();
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

    const listGeneral = () => {
        setLoading(true);
        repo.list().then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
            } else {
                setLoading(false);
                setListLocales(result);
            }
        }).catch((error: any) => {
            setLoading(false);
        });
    }

    const listGeneralProductType = () => {
        repoType.list().then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setListProductType(result);
            }
        }).catch((error: any) => {

        });
    }

    useEffect(() => {
        listGeneral();
        listGeneralProductType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const detailsLocale = (id: number) => {
        setEdit(true);
        setModalLocaleShow(true);
        setErrorMessage(null);

        repo.details(id).then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setLocaleName(result.name);
                setAdressName(result.address);
                setIdLocales(result.id);
            }
        }).catch((error: any) => {

        });
    }

    const detailsProductType = (id: number) => {
        setEdit(true);
        setModalTypeProductShow(true);
        setErrorMessage(null);

        repoType.details(id).then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setProductLocaleName(result.placeId);
                setTypeName(result.name);
                setIdProductType(result.id);
            }
        }).catch((error: any) => {

        });
    }

    const deleteLocale = (id: number) => {
        setModalSuccess(true);
        setLoading(true);

        repo.delete(id).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
            } else {
                setSuccessMessage("Item removido com sucesso!");
                setModalSuccess(true);
                setLoading(false);
                setModalLocaleShow(false);
                setLocaleName(null);
                setAdressName(null);
                setLog(0);
                listGeneral();
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    };

    const deleteProductType = (id: number) => {
        setModalSuccess(true);
        setLoading(true);

        repoType.delete(id).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
            } else {
                setSuccessMessage("Item removido com sucesso!");
                setModalSuccess(true);
                setLoading(false);
                setModalTypeProductShow(false);
                setTypeName(null);
                setProductLocaleName(null);
                setLog(0);
                listGeneralProductType();
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!modalLocaleShow) {
            setEdit(false);
            setLocaleName(null);
            setAdressName(null);
        }
    }, [modalLocaleShow]);

    useEffect(() => {
        if (!modalTypeProductShow) {
            setEdit(false);
            setProductLocaleName(null);
            setTypeName(null);
        } else {
            repoDrop.dropdown('places').then(setDropdownPlace);
        }
    }, [modalTypeProductShow, repoDrop]);

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
                            data={listLocales}
                            columns={columns}
                            class={styles.table_locale_adm}
                            loading={loading}
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
                            data={listProductType}
                            columns={columns2}
                            class={styles.product_type_adm}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={edit ? "Editar Local" : "Adicionar Local"}
                btnClose={true}
                setShowModal={setModalLocaleShow}
                showModal={modalLocaleShow}
                hasFooter={true}
                onSubmit={onSubmitLocale}
                loading={loading}
                edit={edit}
            >
                <div>
                    <div>
                        <AuthInput
                            label="Local"
                            value={localeName}
                            type='text'
                            changeValue={setLocaleName}
                            edit={edit}
                            required
                        />
                    </div>
                    <div>
                        <AuthInput
                            label="Endereço"
                            value={addressName}
                            type='text'
                            changeValue={setAdressName}
                            edit={edit}
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
                title={edit ? "Editar Tipo de Produto" : "Adicionar Tipo de Produto"}
                btnClose={true}
                setShowModal={setModalTypeProductShow}
                showModal={modalTypeProductShow}
                hasFooter={true}
                onSubmit={onSubmitTypeProduct}
                loading={loading}
                edit={edit}
            >
                <div>
                    <div>
                        <AuthInput
                            label="Nome do tipo"
                            value={typeName}
                            type='text'
                            changeValue={setTypeName}
                            edit={edit}
                            required
                        />
                    </div>
                    <div>
                        <AuthSelect
                            label='Local'
                            value={productLocaleName}
                            options={convertArray(dropdownPlace)}
                            changeValue={setProductLocaleName}
                            edit={edit}
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