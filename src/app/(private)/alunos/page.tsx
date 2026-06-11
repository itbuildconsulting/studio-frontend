"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/pagination/pagination";
import PersonsCollection from "../../../../core/Persons";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import { convertUpdateAt } from "@/utils/formatterText";

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

function fmtDate(cell: string | null): string {
  if (!cell) return "—";
  return cell.split("T")[0].split("-").reverse().join("/");
}

// ─── Options dropdown ────────────────────────────────────────────────────────

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
            href={`/alunos/editar/${id}`}
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

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, sub, iconBg, icon,
}: {
  title: string;
  value: string | number;
  sub?: React.ReactNode;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
            {sub && <div className="mt-1">{sub}</div>}
          </div>
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-white", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Students() {
  const repo = useMemo(() => new PersonsCollection(), []);
  const router = useRouter();

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");

  const [listPersons, setListPersons] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);
  const [loading, setLoading] = useState(false);

  const total = infoPage?.totalRecords ?? 0;
  // TODO: chamar endpoint com filtro active=1/0 quando disponível
  const activeCount = listPersons.filter((p) => p.active === 1).length;
  const pendingCount = listPersons.filter((p) => p.active !== 1).length;

  const listStudents = (n: string, e: string, d: string, pg: number) => {
    setLoading(true);
    repo.listStudent(n, e, d, pg).then((result: any) => {
      if (!(result instanceof Error) && result?.data) {
        setListPersons(result.data);
        setInfoPage(result.pagination);
      } else {
        setListPersons([]);
        setInfoPage(pageDefault);
      }
    }).finally(() => setLoading(false));
  };

  const deleteStudent = (id: number) => {
    repo.delete(id).then((result: any) => {
      if (!(result instanceof Error)) {
        listStudents(name, email, document, page);
      }
    });
  };

  useEffect(() => {
    listStudents(name, email, document, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const TABLE_COLS = [
    { label: "USUÁRIO", sort: true },
    { label: "TELEFONE" },
    { label: "NÍVEL" },
    { label: "ÚLTIMO CHECK-IN" },
    { label: "STATUS" },
    { label: "CRIADO EM", sort: true },
    { label: "OPÇÕES" },
  ];

  return (
    <PageDefault>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground">Alunos</h3>
            {total > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                {total}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie os alunos do CT</p>
        </div>
        <Button onClick={() => router.push("/alunos/cadastrar")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Aluno
        </Button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total de Alunos"
          value={total}
          iconBg="bg-emerald-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          }
        />
        <KpiCard
          title="Ativos"
          value={activeCount}
          iconBg="bg-emerald-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <KpiCard
          title="Pendentes"
          value={pendingCount}
          iconBg="bg-amber-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* ── Filter ─────────────────────────────────────────── */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Filtro
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1 min-w-[160px]">
              <Label className="mb-0">Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Buscar por nome"
                onKeyDown={(e) => e.key === "Enter" && listStudents(name, email, document, 1)}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <Label className="mb-0">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Buscar por email"
                onKeyDown={(e) => e.key === "Enter" && listStudents(name, email, document, 1)}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <Label className="mb-0">CPF</Label>
              <Input
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Buscar por CPF"
                onKeyDown={(e) => e.key === "Enter" && listStudents(name, email, document, 1)}
              />
            </div>
            <div className="flex gap-2 pb-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setName(""); setEmail(""); setDocument(""); listStudents("", "", "", 1); }}
              >
                Limpar
              </Button>
              <Button size="sm" onClick={() => listStudents(name, email, document, 1)}>
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ──────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {TABLE_COLS.map((col) => (
                    <th
                      key={col.label}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    >
                      {col.label}
                      {col.sort && (
                        <span className="ml-1 text-muted-foreground/50">↑↓</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="h-10 rounded-full bg-muted animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : listPersons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  listPersons.map((student: any) => (
                    <tr
                      key={student.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/alunos/editar/${student.id}`)}
                    >
                      {/* Usuário */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0", avatarColor(student.name ?? ""))}>
                            {getInitials(student.name ?? "")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{student.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Telefone */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {fmtPhone(student.phone)}
                      </td>

                      {/* Nível */}
                      <td className="px-4 py-3">
                        {student.levelInfo ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: student.levelInfo.color ?? "#ccc" }}
                            />
                            <span className="text-foreground">{student.levelInfo.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Último Check-in */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {student.updatedAt ? convertUpdateAt(student.updatedAt) : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge variant={student.active === 1 ? "success" : "destructive"}>
                          {student.active === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>

                      {/* Criado em */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {fmtDate(student.createdAt)}
                      </td>

                      {/* Opções */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <OptionsMenu id={student.id} onDelete={deleteStudent} />
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
    </PageDefault>
  );
}
