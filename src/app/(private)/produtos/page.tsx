'use client'

import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";

import ProductCollection from "../../../../core/Product";
import DropDownsCollection from "../../../../core/DropDowns";
import Loading from "@/components/loading/Loading";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import { ValidationForm } from "@/components/formValidation/validation";

import listValidate from '../../../json/validate.json';
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import ValidationFields from "@/validators/fields";

export default function Products() {
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const repo = useMemo(() => new ProductCollection(), []);

    const [modalProductAdd, setModalProductAdd] = useState<boolean>(false);

    const [id, setId] = useState<number | null>(null);
    const [productName, setProductName] = useState<string | null>(null);
    const [creditValue, setCreditValue] = useState<number | null>(null);
    const [validity, setValidity] = useState<number | null>(null);
    const [typeProduct, setTypeProduct] = useState<number | null>(null);
    const [localeName, setLocaleName] = useState<number | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [status, setStatus] = useState<boolean>(true);

    // 🆕 NOVOS ESTADOS PARA RESTRIÇÕES
    const [restrictionType, setRestrictionType] = useState<'none' | 'minimum' | 'exclusive'>('none');
    const [requiredLevel, setRequiredLevel] = useState<number | null>(null);
    const [exclusiveLevels, setExclusiveLevels] = useState<number[]>([]);
    const [purchaseLimit, setPurchaseLimit] = useState<number>(0);

    const [dropdownPlace, setDropdownPlace] = useState<string[]>([]);
    const [dropdownType, setDropdownType] = useState<string[]>([]);
    const [dropdownLevels, setDropdownLevels] = useState<any[]>([]);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [listProduct, setListProduct] = useState<string[]>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const [dropdownValidate] = useState<any>(listValidate.validate);

    const [page, setPage] = useState<number>(1);
    const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

    const handleExclusiveLevelToggle = (levelId: number) => {
        setExclusiveLevels(prev =>
            prev.includes(levelId)
                ? prev.filter(id => id !== levelId)
                : [...prev, levelId]
        );
    };

    const actionLocaleName = (cell: any, row: any) => {
        return cell?.place?.name || " - ";
    }

    const actionProductTypeName = (cell: any, row: any) => {
        return cell?.name;
    }

    const convertValue = (cell: any, row: any) => {
        return Number(cell).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    const convertStatus = (cell: any, row: any) => {
        return cell === 1 ? "Ativo" : "Inativo"
    }

    const actionButtonProduct = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
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
            dataField: 'productType',
            text: `Tipo`,
            formatter: actionProductTypeName
        },
        {
            dataField: 'productType',
            text: `Local`,
            formatter: actionLocaleName
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
        setErrorMessage(null);
        setLoading(true);

        const validationError = ValidationFields({ 
            "Nome do Produto": productName, 
            "Créditos": `${creditValue}`, 
            "Validade": `${validity}`, 
            "Tipo de Produto": `${typeProduct}`, 
            "Valor": `${value}` 
        });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            return;
        }

        let finalRequiredLevel = null;
        let finalExclusiveLevels = null;

        if (restrictionType === 'minimum' && requiredLevel) {
            finalRequiredLevel = requiredLevel;
        } else if (restrictionType === 'exclusive' && exclusiveLevels.length > 0) {
            finalExclusiveLevels = exclusiveLevels.join(',');
        }

        setLoading(true);
        setErrorMessage(null);

        (edit 
            ? repo?.edit(
                id, 
                productName, 
                Number(creditValue), 
                Number(validity), 
                Number(value), 
                typeProduct, 
                localeName, 
                status,
                finalRequiredLevel,
                finalExclusiveLevels,
                purchaseLimit
            ) 
            : repo?.create(
                productName, 
                Number(creditValue), 
                Number(validity), 
                Number(value), 
                typeProduct, 
                localeName, 
                status,
                finalRequiredLevel,
                finalExclusiveLevels,
                purchaseLimit
            )
        ).then((result: any) => {
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
                setSuccessMessage(edit ? "Edição realizada com sucesso!" : "Cadastro realizado com sucesso!");
                setLog(0);
                listGeneralProduct(1);
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

    const listGeneralProduct = (page: number) => {
        setPage(page);
        setLoading(true);

        repo.list(page).then((result: any) => {
            setLoading(false);

            if (result instanceof Error) {
                setListProduct([]);
                setInfoPage(pageDefault);
            } else {
                setListProduct(result?.data);
                setInfoPage(result?.pagination);
            }
        }).catch(() => {
            setListProduct([]);
            setInfoPage(pageDefault);
        });
    }

    useEffect(() => {
        listGeneralProduct(page);
    }, [page]);

    const detailsProduct = (id: number) => {
        setEdit(true);
        setModalProductAdd(true);
        setErrorMessage(null);

        repo.details(id).then((result: any) => {
            if (result instanceof Error) {
                console.log("erro");
            } else {
                setId(result.id);
                setProductName(result.name);
                setCreditValue(result.credit);
                setValidity(result.validateDate);
                setTypeProduct(result.productTypeId);
                setLocaleName(result.placeId);
                setValue(result.value);
                setStatus(result.active);
                
                setPurchaseLimit(result.purchaseLimit || 0);
                
                if (result.exclusiveLevels) {
                    setRestrictionType('exclusive');
                    setExclusiveLevels(result.exclusiveLevels.split(',').map(Number));
                } else if (result.requiredLevel) {
                    setRestrictionType('minimum');
                    setRequiredLevel(result.requiredLevel);
                } else {
                    setRestrictionType('none');
                }
            }
        }).catch(() => { });
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
                setSuccessMessage("Item removido com sucesso!");
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
            setValidity(null);
            setCreditValue(null);
            setTypeProduct(null);
            setLocaleName(null);
            setValue(null);
            setStatus(true);
            
            setRestrictionType('none');
            setRequiredLevel(null);
            setExclusiveLevels([]);
            setPurchaseLimit(0);
        } else {
            repoDrop.dropdown('places').then(setDropdownPlace);
            repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
            repoDrop.dropdown('level/dropdown').then((levels: any) => {
                setDropdownLevels(levels);
            });
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
                            setPage={setPage}
                            infoPage={infoPage}
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
                            label="Nome do Produto*"
                            value={productName}
                            type='text'
                            changeValue={setProductName}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Créditos*"
                            value={creditValue}
                            type='number'
                            changeValue={setCreditValue}
                            edit={edit}
                            maskType="positivo"
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Validade*"
                            options={convertArray(dropdownValidate)}
                            value={validity}
                            changeValue={setValidity}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label='Tipo de Produto'
                            value={typeProduct}
                            options={convertArrayType(dropdownType)}
                            changeValue={setTypeProduct}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Valor*"
                            value={value}
                            type='number'
                            changeValue={setValue}
                            edit={edit}
                            maskType="positivo"
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Status*"
                            options={[
                                {
                                    value: 1,
                                    label: "Ativo"
                                },
                                {
                                    value: 0,
                                    label: "Inativo"
                                }
                            ]}
                            value={status}
                            changeValue={setStatus}
                            edit={edit}
                            required
                        />
                    </div>

                    {/* 🆕 SEÇÃO DE RESTRIÇÕES - ESTILO AJUSTADO */}
                    <div className="col-span-12 mt-6">
                        {/* Header da Seção */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🎯</span>
                            <h3 className="text-lg font-semibold text-gray-800">Restrições de Acesso</h3>
                        </div>

                        {/* Pergunta */}
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Quem pode ver este produto?
                        </label>

                        {/* Opções de Radio */}
                        <div className="space-y-3">
                            {/* Opção 1: Todos os alunos */}
                            <label 
                                className={`
                                    flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                                    ${restrictionType === 'none' 
                                        ? 'border-green-500 bg-white' 
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="restrictionType"
                                    value="none"
                                    checked={restrictionType === 'none'}
                                    onChange={() => {
                                        setRestrictionType('none');
                                        setRequiredLevel(null);
                                        setExclusiveLevels([]);
                                    }}
                                    className="w-5 h-5 text-green-600"
                                />
                                <span className="text-sm">
                                    ✨ Todos os alunos
                                </span>
                            </label>

                            {/* Opção 2: Nível mínimo */}
                            <div 
                                className={`
                                    border-2 rounded-xl transition-all
                                    ${restrictionType === 'minimum' 
                                        ? 'border-green-500 bg-white' 
                                        : 'border-gray-200 bg-white'
                                    }
                                `}
                            >
                                <label className="flex items-center gap-3 p-4 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="restrictionType"
                                        value="minimum"
                                        checked={restrictionType === 'minimum'}
                                        onChange={() => {
                                            setRestrictionType('minimum');
                                            setExclusiveLevels([]);
                                        }}
                                        className="w-5 h-5 text-green-600"
                                    />
                                    <span className="text-sm">
                                        📈 Apenas alunos do nível
                                    </span>
                                </label>
                                
                                {restrictionType === 'minimum' && (
                                    <div className="px-4 pb-4">
                                        <select
                                            value={requiredLevel || ''}
                                            onChange={(e) => setRequiredLevel(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="">Selecione o nível...</option>
                                            {dropdownLevels.map((level: any) => (
                                                <option key={level.id} value={level.id}>
                                                    {level.name} ou superior
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Opção 3: Níveis exclusivos */}
                            <div 
                                className={`
                                    border-2 rounded-xl transition-all
                                    ${restrictionType === 'exclusive' 
                                        ? 'border-green-500 bg-white' 
                                        : 'border-gray-200 bg-white'
                                    }
                                `}
                            >
                                <label className="flex items-center gap-3 p-4 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="restrictionType"
                                        value="exclusive"
                                        checked={restrictionType === 'exclusive'}
                                        onChange={() => {
                                            setRestrictionType('exclusive');
                                            setRequiredLevel(null);
                                        }}
                                        className="w-5 h-5 text-green-600"
                                    />
                                    <span className="text-sm">
                                        👑 Apenas níveis específicos:
                                    </span>
                                </label>

                                {restrictionType === 'exclusive' && (
                                    <div className="px-4 pb-4">
                                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                                            {dropdownLevels.map((level: any) => (
                                                <label 
                                                    key={level.id}
                                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-all"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={exclusiveLevels.includes(level.id)}
                                                        onChange={() => handleExclusiveLevelToggle(level.id)}
                                                        className="w-4 h-4 text-green-600 rounded"
                                                    />
                                                    <span 
                                                        className="text-xs font-semibold px-3 py-1 rounded-full text-black"
                                                        style={{ backgroundColor: level.color || '#gray' }}
                                                    >
                                                        {level.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Limite de Compras */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Limite de compras por aluno
                            </label>
                            <select
                                value={purchaseLimit}
                                onChange={(e) => setPurchaseLimit(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value={0}>Sem limite - pode comprar infinitas vezes</option>
                                <option value={1}>Máximo 1 compra por aluno</option>
                                <option value={2}>Máximo 2 compras por aluno</option>
                                <option value={3}>Máximo 3 compras por aluno</option>
                                <option value={5}>Máximo 5 compras por aluno</option>
                                <option value={10}>Máximo 10 compras por aluno</option>
                            </select>
                            <p className="text-xs text-gray-500 italic mt-1">
                                {purchaseLimit === 0 
                                    ? '✨ Sem limite - pode comprar infinitas vezes'
                                    : `⚠️ Máximo ${purchaseLimit} compra(s) por aluno`
                                }
                            </p>
                        </div>
                    </div>

                    <ValidationForm errorMessage={errorMessage} />
                </div>
            </Modal>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/proprietarios'}
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