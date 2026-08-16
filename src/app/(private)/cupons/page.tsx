'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PageDefault from '@/components/template/default'
import Modal from '@/components/Modal/Modal'
import AuthInput from '@/components/auth/AuthInput'
import AuthSelect from '@/components/auth/AuthSelect'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ValidationForm } from '@/components/formValidation/validation'
import ValidationFields from '@/validators/fields'
import CouponRepository from '../../../../../core/Coupon'

function CouponOptionsMenu({ id, active, onEdit, onToggle, onDelete }: {
    id: number;
    active: boolean;
    onEdit: (id: number) => void;
    onToggle: (id: number, active: boolean) => void;
    onDelete: (id: number) => void;
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
            >
                ···
            </button>
            {open && (
                <div className="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-border bg-popover shadow-md py-1">
                    <button
                        onClick={() => { onEdit(id); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => { onToggle(id, active); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                    >
                        {active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                        onClick={() => { onDelete(id); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md mx-1"
                    >
                        Excluir
                    </button>
                </div>
            )}
        </div>
    )
}

const typeOptions = [
    { value: 'percent', label: 'Percentual (%)' },
    { value: 'fixed', label: 'Valor fixo (R$)' },
]

const maxUsesOptions = [
    { value: 0, label: 'Ilimitado' },
    { value: 1, label: '1 uso' },
    { value: 5, label: '5 usos' },
    { value: 10, label: '10 usos' },
    { value: 50, label: '50 usos' },
    { value: 100, label: '100 usos' },
]

const maxUsesPerStudentOptions = [
    { value: 1, label: '1 uso por aluno' },
    { value: 2, label: '2 usos por aluno' },
    { value: 3, label: '3 usos por aluno' },
    { value: 5, label: '5 usos por aluno' },
]

const activeOptions = [
    { value: 1, label: 'Ativo' },
    { value: 0, label: 'Inativo' },
]

export default function CuponsPage() {
    const repo = useMemo(() => new CouponRepository(), [])

    const [modalOpen, setModalOpen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [listLoading, setListLoading] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [log, setLog] = useState(0)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [coupons, setCoupons] = useState<any[]>([])

    // Form state
    const [id, setId] = useState<number | null>(null)
    const [code, setCode] = useState<string | null>(null)
    const [type, setType] = useState<'percent' | 'fixed'>('percent')
    const [value, setValue] = useState<number | null>(null)
    const [expiresAt, setExpiresAt] = useState<string | null>(null)
    const [maxUses, setMaxUses] = useState<number>(0)
    const [maxUsesPerStudent, setMaxUsesPerStudent] = useState<number>(1)
    const [activeStatus, setActiveStatus] = useState<number>(1)

    const loadCoupons = () => {
        setListLoading(true)
        repo.list().then((result: any) => {
            if (!(result instanceof Error) && result?.data) {
                setCoupons(result.data)
            }
        }).finally(() => setListLoading(false))
    }

    useEffect(() => {
        loadCoupons()
    }, [])

    useEffect(() => {
        if (!modalOpen) {
            setEdit(false)
            setId(null)
            setCode(null)
            setType('percent')
            setValue(null)
            setExpiresAt(null)
            setMaxUses(0)
            setMaxUsesPerStudent(1)
            setActiveStatus(1)
            setErrorMessage(null)
        }
    }, [modalOpen])

    const handleSubmit = () => {
        setErrorMessage(null)
        const validationError = ValidationFields({
            'Código do cupom': code,
            'Tipo': type,
            'Valor': `${value}`,
        })
        if (validationError) {
            setErrorMessage(validationError)
            return
        }

        setLoading(true)
        const finalMaxUses = maxUses === 0 ? null : maxUses
        const finalExpiresAt = expiresAt && expiresAt.trim() !== '' ? expiresAt : null

        const promise = edit
            ? repo.edit(id!, code!, type, Number(value), finalExpiresAt, finalMaxUses, maxUsesPerStudent, activeStatus === 1)
            : repo.create(code!, type, Number(value), finalExpiresAt, finalMaxUses, maxUsesPerStudent)

        promise.then((result: any) => {
            if (result instanceof Error) {
                try {
                    const msg = JSON.parse(result.message)
                    setErrorMessage(msg.error || 'Erro ao salvar cupom.')
                } catch {
                    setErrorMessage('Erro ao salvar cupom.')
                }
                setLog(1)
                setModalSuccess(true)
            } else {
                setSuccessMessage(edit ? 'Cupom atualizado com sucesso!' : 'Cupom criado com sucesso!')
                setLog(0)
                setModalSuccess(true)
                setModalOpen(false)
                loadCoupons()
            }
        }).finally(() => setLoading(false))
    }

    const handleEdit = (couponId: number) => {
        setEdit(true)
        setModalOpen(true)
        setErrorMessage(null)
        repo.details(couponId).then((result: any) => {
            if (!(result instanceof Error) && result?.data) {
                const c = result.data
                setId(c.id)
                setCode(c.code)
                setType(c.type)
                setValue(Number(c.value))
                setExpiresAt(c.expiresAt ? c.expiresAt.substring(0, 10) : null)
                setMaxUses(c.maxUses ?? 0)
                setMaxUsesPerStudent(c.maxUsesPerStudent ?? 1)
                setActiveStatus(c.active ? 1 : 0)
            }
        })
    }

    const handleToggle = (couponId: number, currentActive: boolean) => {
        repo.toggleActive(couponId, !currentActive).then((result: any) => {
            if (!(result instanceof Error)) {
                setSuccessMessage(currentActive ? 'Cupom desativado.' : 'Cupom ativado.')
                setLog(0)
                setModalSuccess(true)
                loadCoupons()
            }
        })
    }

    const handleDelete = (couponId: number) => {
        setModalSuccess(true)
        setLoading(true)
        repo.delete(couponId).then((result: any) => {
            if (result instanceof Error) {
                setErrorMessage('Erro ao excluir cupom.')
                setLog(1)
            } else {
                setSuccessMessage('Cupom excluído com sucesso!')
                setLog(0)
                loadCoupons()
            }
        }).finally(() => setLoading(false))
    }

    const formatValue = (coupon: any) => {
        if (coupon.type === 'percent') {
            return `${Number(coupon.value).toFixed(0)}%`
        }
        return Number(coupon.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const formatExpiry = (expiresAt: string | null) => {
        if (!expiresAt) return '—'
        return new Date(expiresAt).toLocaleDateString('pt-BR')
    }

    const TABLE_COLS = ['CÓDIGO', 'TIPO', 'DESCONTO', 'VALIDADE', 'USOS', 'STATUS', 'OPÇÕES']

    const LoadingStatus = () => (
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            <h5>Carregando...</h5>
        </div>
    )

    const SuccessStatus = () => (
        <div className="flex flex-col items-center gap-4">
            {log === 0 ? (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )}
            <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>
            <button className="btn-outline-primary px-5 mt-5" onClick={() => setModalSuccess(false)}>
                Fechar
            </button>
        </div>
    )

    return (
        <PageDefault>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-foreground">Cupons de Desconto</h3>
                        {coupons.length > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                                {coupons.length}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Gerencie cupons de desconto percentual e de valor fixo</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Cupom
                </Button>
            </div>

            {/* Tabela */}
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
                                {listLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border last:border-0">
                                            <td colSpan={7} className="px-4 py-3">
                                                <div className="h-10 rounded-full bg-muted animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                            Nenhum cupom cadastrado.
                                        </td>
                                    </tr>
                                ) : (
                                    coupons.map((coupon: any) => (
                                        <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3 font-mono font-semibold text-foreground">{coupon.code}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {coupon.type === 'percent' ? 'Percentual' : 'Valor fixo'}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-foreground">{formatValue(coupon)}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatExpiry(coupon.expiresAt)}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {coupon.usedCount}
                                                {coupon.maxUses ? `/${coupon.maxUses}` : ''}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={coupon.active ? 'success' : 'destructive'}>
                                                    {coupon.active ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <CouponOptionsMenu
                                                    id={coupon.id}
                                                    active={coupon.active}
                                                    onEdit={handleEdit}
                                                    onToggle={handleToggle}
                                                    onDelete={handleDelete}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal criar/editar */}
            <Modal
                title={edit ? 'Editar Cupom' : 'Novo Cupom'}
                btnClose={true}
                setShowModal={setModalOpen}
                showModal={modalOpen}
                hasFooter={true}
                onSubmit={handleSubmit}
                loading={loading}
                edit={edit}
            >
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-6">
                        <AuthInput
                            label="Código do cupom*"
                            value={code}
                            type="text"
                            changeValue={(v: string) => setCode(v?.toUpperCase())}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Tipo*"
                            options={typeOptions}
                            value={type}
                            changeValue={setType}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label={type === 'percent' ? 'Desconto (%)*' : 'Valor do desconto (R$)*'}
                            value={value}
                            type="number"
                            changeValue={setValue}
                            edit={edit}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Validade (opcional)"
                            value={expiresAt}
                            type="date"
                            changeValue={setExpiresAt}
                            edit={edit}
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Limite total de usos"
                            options={maxUsesOptions}
                            value={maxUses}
                            changeValue={setMaxUses}
                            edit={edit}
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthSelect
                            label="Limite por aluno"
                            options={maxUsesPerStudentOptions}
                            value={maxUsesPerStudent}
                            changeValue={setMaxUsesPerStudent}
                            edit={edit}
                        />
                    </div>
                    {edit && (
                        <div className="col-span-6">
                            <AuthSelect
                                label="Status"
                                options={activeOptions}
                                value={activeStatus}
                                changeValue={setActiveStatus}
                                edit={edit}
                            />
                        </div>
                    )}
                    <ValidationForm errorMessage={errorMessage} />
                </div>
            </Modal>

            {/* Modal de status (sucesso/erro) */}
            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    {loading ? <LoadingStatus /> : <SuccessStatus />}
                </div>
            </Modal>
        </PageDefault>
    )
}
