'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from '../../styles/administrative.module.css';
import Modal from "@/components/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";

import PlaceCollecion from "../../../core/Place";
import ProductTypeCollecion from "../../../core/ProductType";
import DropDownsCollection from "../../../core/DropDowns";
import Loading from "@/components/loading/Loading";

import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import AuthSelect from "@/components/auth/AuthSelect";
import { Column } from "@/types/table";
import { convertArrayType } from "@/utils/convertArray";
import { ValidationForm } from "@/components/formValidation/validation";

import ValidationFields from "@/validators/fields";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";

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

    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingListType, setLoadingListType] = useState<boolean>(false);
    const [loadingListPlace, setLoadingListPlace] = useState<boolean>(false);

    const [edit, setEdit] = useState<boolean>(false);

    const actionLocaleName = (cell: any) => {
        return cell?.name || "Não definido";
    }

    const actionButtonLocale = (cell: any) => {
        return (
            <DropDown style={'bg-white'}>
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

    const actionButtonProductType = (cell: any) => {
        return (
            <DropDown style={'bg-white'}>
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

    const columns: Column[] = [
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

    const columns2: Column[] = [
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
        setSuccessMessage('');

        const validationError = ValidationFields({ "Local": localeName, "Endereço": addressName });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            setTimeout(() => setErrorMessage(null), 2500);
            return;
        }

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

        const validationError = ValidationFields({ "Nome do Tipo": typeName, "Local": String(productLocaleName) });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            setTimeout(() => setErrorMessage(null), 2500);
            return;
        }

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
        setLoadingListPlace(true);

        repo.list().then((result: any) => {
            setLoadingListPlace(false);

            if (result instanceof Error) {
                setListLocales([]);
            } else {
                setListLocales(result);
            }
        }).catch(() => {
            setListLocales([]);
        });
    }

    const listGeneralProductType = () => {
        setLoadingListType(true);

        repoType.list().then((result: any) => {
            setLoadingListType(false);

            if (result instanceof Error) {
                setListProductType([]);
            } else {
                setListProductType(result);
            }
        }).catch(() => {
            setListProductType([]);
        });
    }

    useEffect(() => {
        listGeneralProductType();
    }, []);

    useEffect(() => {
        listGeneral();
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
                            loading={loadingListPlace}
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
                            loading={loadingListType}
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
                    <AuthInput
                        label="Local"
                        value={localeName}
                        type='text'
                        changeValue={setLocaleName}
                        edit={edit}
                        required
                    />
                    <AuthInput
                        label="Endereço"
                        value={addressName}
                        type='text'
                        changeValue={setAdressName}
                        edit={edit}
                        required
                    />
                    <ValidationForm errorMessage={errorMessage} />
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
                    <AuthInput
                        label="Nome do tipo"
                        value={typeName}
                        type='text'
                        changeValue={setTypeName}
                        edit={edit}
                        required
                    />
                    <AuthSelect
                        label='Local'
                        value={productLocaleName}
                        options={convertArrayType(dropdownPlace)}
                        changeValue={setProductLocaleName}
                        edit={edit}
                        required
                    />
                </div>
                <div className="grid grid-cols-12">
                    <ValidationForm errorMessage={errorMessage} />
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