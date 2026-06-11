'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/pagination/pagination";
import PersonsCollecion from "../../../../core/Persons";
import Modal from "@/components/Modal/Modal";
import { convertUpdateAt } from "@/utils/formatterText";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    const parts = (name ?? "").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const AVATAR_PALETTE = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-orange-500", "bg-pink-500", "bg-cyan-500",
];

function avatarColor(name: string): string {
    const code = (name ?? "A").charCodeAt(0);
    return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

function fmtPhone(cell: string): string {
    if (!cell) return "—";
    const d = cell.replace(/\D/g, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return cell;
}

// ─── Options menu ────────────────────────────────────────────────────────────

function OptionsMenu({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
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
                    <Link
                        href={`/funcionarios/editar/${id}`}
                        className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
                        onClick={() => setOpen(false)}
                    >
                        Editar
                    </Link>
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Teachers() {
    const repo = useMemo(() => new PersonsCollecion(), []);
    const router = useRouter();

    const [name, setName] = useState("");
    const [document, setDocument] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [listPersons, setListPersons] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

    const [modalSuccess, setModalSuccess] = useState(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const listGeneralTeachers = (n: string, e: string, d: string, pg: number) => {
        setLoading(true);
        setName(n); setEmail(e); setDocument(d); setPage(pg);
        repo.listEmployee(n, e, d, pg).then((result: any) => {
            if (!(result instanceof Error) && result?.data) {
                setListPersons(result.data);
                setInfoPage(result.pagination);
            } else {
                setListPersons([]);
                setInfoPage(pageDefault);
            }
        }).finally(() => setLoading(false));
    };

    const deletePersons = (id: number) => {
        setModalSuccess(true);
        setLoading(true);
        repo.delete(id).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLog(1);
            } else {
                setSuccessMessage("Funcionário removido com sucesso!");
                setLog(0);
                listGeneralTeachers(name, email, document, 1);
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setLog(1);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        listGeneralTeachers(name, email, document, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const TABLE_COLS = ["FUNCIONÁRIO", "NÍVEL", "TELEFONE", "ÚLTIMO CHECK-IN", "STATUS", "OPÇÕES"];

    return (
        <PageDefault>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-foreground">Funcionários</h3>
                        {infoPage?.totalRecords > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                                {infoPage.totalRecords}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Gerencie os funcionários do estúdio</p>
                </div>
                <Button onClick={() => router.push("/funcionarios/cadastrar")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Funcionário
                </Button>
            </div>

            {/* ── Filtro ─────────────────────────────────────────── */}
            <Card className="mb-4">
                <CardContent className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Filtro</p>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1 min-w-[160px]">
                            <Label>Nome</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Buscar por nome"
                                onKeyDown={(e) => e.key === "Enter" && listGeneralTeachers(name, email, document, 1)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 min-w-[160px]">
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Buscar por email"
                                onKeyDown={(e) => e.key === "Enter" && listGeneralTeachers(name, email, document, 1)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 min-w-[160px]">
                            <Label>CPF</Label>
                            <Input
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                placeholder="Buscar por CPF"
                                onKeyDown={(e) => e.key === "Enter" && listGeneralTeachers(name, email, document, 1)}
                            />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setName(""); setEmail(""); setDocument(""); listGeneralTeachers("", "", "", 1); }}
                            >
                                Limpar
                            </Button>
                            <Button size="sm" onClick={() => listGeneralTeachers(name, email, document, 1)}>
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Tabela ─────────────────────────────────────────── */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    {TABLE_COLS.map((col) => (
                                        <th
                                            key={col}
                                            className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border last:border-0">
                                            <td colSpan={6} className="px-4 py-3">
                                                <div className="h-10 rounded-full bg-muted animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : listPersons.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                            Nenhum funcionário encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    listPersons.map((person: any) => (
                                        <tr
                                            key={person.id}
                                            className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/funcionarios/editar/${person.id}`)}
                                        >
                                            {/* Funcionário */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0", avatarColor(person.name ?? ""))}>
                                                        {getInitials(person.name ?? "")}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-foreground truncate">{person.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{person.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Nível */}
                                            <td className="px-4 py-3">
                                                {person.levelInfo ? (
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="h-2.5 w-2.5 rounded-full shrink-0"
                                                            style={{ backgroundColor: person.levelInfo.color ?? "#ccc" }}
                                                        />
                                                        <span className="text-foreground">{person.levelInfo.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>

                                            {/* Telefone */}
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {fmtPhone(person.phone)}
                                            </td>

                                            {/* Último Check-in */}
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {person.updatedAt ? convertUpdateAt(person.updatedAt) : "—"}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <Badge variant={person.active === 1 ? "success" : "destructive"}>
                                                    {person.active === 1 ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>

                                            {/* Opções */}
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <OptionsMenu id={person.id} onDelete={deletePersons} />
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

            {/* ── Modal de feedback ──────────────────────────────── */}
            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose="/funcionarios"
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                            <h5>Carregando...</h5>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                                {log === 0
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                }
                            </svg>
                            <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>
                            <button className="btn-outline-primary px-5 mt-5" onClick={() => setModalSuccess(false)}>
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </PageDefault>
    );
}
