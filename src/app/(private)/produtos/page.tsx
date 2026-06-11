'use client'

import Modal from "@/components/Modal/Modal";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useRef, useState } from "react";
import AuthSelect from "@/components/auth/AuthSelect";
import ProductCollection from "../../../../core/Product";
import DropDownsCollection from "../../../../core/DropDowns";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import { ValidationForm } from "@/components/formValidation/validation";
import listValidate from '../../../json/validate.json';
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import ValidationFields from "@/validators/fields";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination/pagination";

function ProductOptionsMenu({ id, onEdit, onDelete }: {
    id: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
            >
                ···
            </button>
            {open && (
                <div className="absolute right-0 z-50 mt-1 w-36 rounded-xl border border-border bg-popover shadow-md py-1">
                    <button
                        onClick={() => { onEdit(id); setOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => { onDelete(id); setOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md mx-1"
                    >
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}

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

    // RESTRIÇÕES DE NÍVEL
    const [restrictionType, setRestrictionType] = useState<'none' | 'minimum' | 'exclusive'>('none');
    const [requiredLevel, setRequiredLevel] = useState<number | null>(null);
    const [exclusiveLevels, setExclusiveLevels] = useState<number[]>([]);
    const [purchaseLimit, setPurchaseLimit] = useState<number>(0);

    // RESTRIÇÕES DE USO
    const [usageRestrictionType, setUsageRestrictionType] = useState<string>('none');
    const [usageRestrictionLimit, setUsageRestrictionLimit] = useState<number | null>(null);

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

    const usageRestrictionOptions = [
        { value: 'none', label: 'Ilimitado' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensal' },
        { value: 'lifetime', label: 'Vitalício' }
    ];

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

    const formatUsageRestriction = (row: any) => {
        if (row.usageRestrictionType === 'none' || !row.usageRestrictionLimit) {
            return 'Ilimitado';
        }
        const typeLabels: any = {
            'weekly': '/sem',
            'monthly': '/mês',
            'lifetime': ' total'
        };
        return `${row.usageRestrictionLimit}x${typeLabels[row.usageRestrictionType]}`;
    }

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

        if (usageRestrictionType !== 'none' && (!usageRestrictionLimit || usageRestrictionLimit < 1)) {
            setErrorMessage('Quando há restrição de uso, o limite deve ser maior que zero');
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
                usageRestrictionType,
                usageRestrictionLimit,
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
                usageRestrictionType,
                usageRestrictionLimit,
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
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
                setUsageRestrictionType(result.usageRestrictionType || 'none');
                setUsageRestrictionLimit(result.usageRestrictionLimit || null);
                
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
            setUsageRestrictionType('none');
            setUsageRestrictionLimit(null);
        } else {
            repoDrop.dropdown('places').then(setDropdownPlace);
            repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
            repoDrop.dropdown('level/dropdown').then((levels: any) => {
                setDropdownLevels(levels);
            });
        }
    }, [modalProductAdd]);

    const TABLE_COLS = ["PRODUTO", "CRÉDITOS", "TIPO", "LOCAL", "VALOR", "USO", "STATUS", "OPÇÕES"];

    return (
        <PageDefault>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-foreground">Produtos</h3>
                        {infoPage?.totalRecords > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                                {infoPage.totalRecords}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Gerencie os produtos e pacotes de créditos</p>
                </div>
                <Button onClick={() => setModalProductAdd(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Produto
                </Button>
            </div>

            {/* ── Tabela ─────────────────────────────────────────── */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    {TABLE_COLS.map((col) => (
                                        <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border last:border-0">
                                            <td colSpan={8} className="px-4 py-3">
                                                <div className="h-10 rounded-full bg-muted animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : listProduct.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                            Nenhum produto encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    listProduct.map((product: any) => (
                                        <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.credit}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.productType?.name ?? "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.productType?.place?.name ?? "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {Number(product.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {formatUsageRestriction(product)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={product.active === 1 ? "success" : "destructive"}>
                                                    {product.active === 1 ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <ProductOptionsMenu
                                                    id={product.id}
                                                    onEdit={detailsProduct}
                                                    onDelete={deleteProduct}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {infoPage?.totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-border">
                            <Pagination infoPage={infoPage} setPage={setPage} />
                        </div>
                    )}
                </CardContent>
            </Card>

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
                    {/* ========== INFORMAÇÕES BÁSICAS ========== */}
                    <div className="col-span-12 mb-2">
                        <h3 className="text-base font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                            📦 Informações Básicas
                        </h3>
                    </div>

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
                            label='Tipo de Produto*'
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
                                { value: 1, label: "Ativo" },
                                { value: 0, label: "Inativo" }
                            ]}
                            value={status}
                            changeValue={setStatus}
                            edit={edit}
                            required
                        />
                    </div>

                    {/* ========== SEÇÃO 1: LIMITE DE USO ========== */}
                    <div className="col-span-12 mt-8">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-l-4 border-blue-500">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">⏱️</span>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Limite de Uso por Período</h3>
                                    <p className="text-xs text-gray-600">Quantas aulas o aluno pode fazer por semana/mês</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Limite
                                    </label>
                                    <select
                                        value={usageRestrictionType}
                                        onChange={(e) => setUsageRestrictionType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        {usageRestrictionOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {usageRestrictionType === 'weekly' ? 'Aulas por Semana' :
                                         usageRestrictionType === 'monthly' ? 'Aulas por Mês' :
                                         usageRestrictionType === 'lifetime' ? 'Total de Aulas' :
                                         'Quantidade'}
                                    </label>
                                    <input
                                        type="number"
                                        value={usageRestrictionLimit || ''}
                                        onChange={(e) => setUsageRestrictionLimit(e.target.value ? Number(e.target.value) : null)}
                                        disabled={usageRestrictionType === 'none'}
                                        placeholder={usageRestrictionType === 'none' ? 'Ilimitado' : 'Ex: 2, 3, 12...'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-white/80 rounded-lg text-xs text-gray-700 italic">
                                {usageRestrictionType === 'none' && '✨ Sem limite - aluno pode usar quantos créditos quiser'}
                                {usageRestrictionType === 'weekly' && '📅 Aluno só pode fazer X aulas por semana (segunda a domingo)'}
                                {usageRestrictionType === 'monthly' && '📅 Aluno só pode fazer X aulas por mês'}
                                {usageRestrictionType === 'lifetime' && '🎯 Limite total de aulas desde a compra do produto'}
                            </div>
                        </div>
                    </div>

                    {/* ========== SEÇÃO 2: QUEM PODE VER ========== */}
                    <div className="col-span-12 mt-6">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border-l-4 border-purple-500">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">👥</span>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Quem Pode Ver Este Produto?</h3>
                                    <p className="text-xs text-gray-600">Restrinja por nível do aluno</p>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                {/* Opção: Todos */}
                                <label 
                                    className={`
                                        flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                                        ${restrictionType === 'none' 
                                            ? 'border-purple-500 bg-white shadow-md' 
                                            : 'border-gray-200 bg-white/50 hover:border-purple-300'
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
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <span className="text-sm font-medium">✨ Todos os alunos podem ver</span>
                                </label>

                                {/* Opção: Nível Mínimo */}
                                <div 
                                    className={`
                                        border-2 rounded-lg transition-all
                                        ${restrictionType === 'minimum' 
                                            ? 'border-purple-500 bg-white shadow-md' 
                                            : 'border-gray-200 bg-white/50'
                                        }
                                    `}
                                >
                                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="restrictionType"
                                            value="minimum"
                                            checked={restrictionType === 'minimum'}
                                            onChange={() => {
                                                setRestrictionType('minimum');
                                                setExclusiveLevels([]);
                                            }}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <span className="text-sm font-medium">📈 A partir de um nível mínimo</span>
                                    </label>
                                    
                                    {restrictionType === 'minimum' && (
                                        <div className="px-3 pb-3">
                                            <select
                                                value={requiredLevel || ''}
                                                onChange={(e) => setRequiredLevel(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Selecione o nível mínimo...</option>
                                                {dropdownLevels.map((level: any) => (
                                                    <option key={level.id} value={level.id}>
                                                        {level.name} ou superior
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Opção: Níveis Específicos */}
                                <div 
                                    className={`
                                        border-2 rounded-lg transition-all
                                        ${restrictionType === 'exclusive' 
                                            ? 'border-purple-500 bg-white shadow-md' 
                                            : 'border-gray-200 bg-white/50'
                                        }
                                    `}
                                >
                                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="restrictionType"
                                            value="exclusive"
                                            checked={restrictionType === 'exclusive'}
                                            onChange={() => {
                                                setRestrictionType('exclusive');
                                                setRequiredLevel(null);
                                            }}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <span className="text-sm font-medium">👑 Apenas níveis específicos</span>
                                    </label>

                                    {restrictionType === 'exclusive' && (
                                        <div className="px-3 pb-3">
                                            <div className="grid grid-cols-2 gap-2 p-3 bg-purple-50/50 rounded-lg">
                                                {dropdownLevels.map((level: any) => (
                                                    <label 
                                                        key={level.id}
                                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-all"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={exclusiveLevels.includes(level.id)}
                                                            onChange={() => handleExclusiveLevelToggle(level.id)}
                                                            className="w-4 h-4 text-purple-600 rounded"
                                                        />
                                                        <span 
                                                            className="text-xs font-semibold px-3 py-1 rounded-full text-black"
                                                            style={{ backgroundColor: level.color || '#d1d5db' }}
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
                        </div>
                    </div>

                    {/* ========== SEÇÃO 3: LIMITE DE COMPRAS ========== */}
                    <div className="col-span-12 mt-6 mb-4">
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border-l-4 border-amber-500">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">🛒</span>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Limite de Compras</h3>
                                    <p className="text-xs text-gray-600">Quantas vezes o aluno pode comprar este produto</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <select
                                    value={purchaseLimit}
                                    onChange={(e) => setPurchaseLimit(Number(e.target.value))}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                >
                                    <option value={0}>♾️ Sem limite - pode comprar infinitas vezes</option>
                                    <option value={1}>1️⃣ Máximo 1 compra (produto único)</option>
                                    <option value={2}>2️⃣ Máximo 2 compras</option>
                                    <option value={3}>3️⃣ Máximo 3 compras</option>
                                    <option value={5}>5️⃣ Máximo 5 compras</option>
                                    <option value={10}>🔟 Máximo 10 compras</option>
                                </select>
                                
                                <div className="mt-3 p-3 bg-white/80 rounded-lg text-xs text-gray-700 italic">
                                    {purchaseLimit === 0 
                                        ? '✨ Aluno pode renovar este produto sempre que quiser'
                                        : `⚠️ Após ${purchaseLimit} compra(s), o produto ficará bloqueado para este aluno`
                                    }
                                </div>
                            </div>
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