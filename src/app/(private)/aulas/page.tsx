"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/pagination/pagination";
import AuthSelect from "@/components/auth/AuthSelect";
import SingleCalendar from "@/components/date/SingleCalendar";
import ClassCollecion from "../../../../core/Class";
import DropDownsCollection from "../../../../core/DropDowns";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import listTimes from "../../../json/time.json";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(cell: string | null): string {
  if (!cell) return "—";
  return cell.split("T")[0].split("-").reverse().join("/");
}

// ─── Options dropdown ────────────────────────────────────────────────────────

function OptionsMenu({ id, onCancel }: { id: number; onCancel: (id: number) => void }) {
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
        <div className="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-border bg-popover shadow-md py-1">
          <Link
            href={`/aulas/listar/${id}`}
            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
            onClick={() => setOpen(false)}
          >
            Ver Detalhes
          </Link>
          <Link
            href={`/aulas/editar/${id}`}
            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
            onClick={() => setOpen(false)}
          >
            Editar
          </Link>
          <button
            onClick={() => { onCancel(id); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md mx-1"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, iconBg, icon,
}: {
  title: string;
  value: string | number;
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

export default function Class() {
  const repo = useMemo(() => new ClassCollecion(), []);
  const repoDrop = useMemo(() => new DropDownsCollection(), []);
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [type, setType] = useState("");

  const [classes, setClasses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);
  const [loading, setLoading] = useState(false);

  const [dropdownType, setDropdownType] = useState<any[]>([]);
  const [dropdownTeacher, setDropdownTeacher] = useState<any[]>([]);

  const total = infoPage?.total ?? 0;
  const activeCount = classes.filter((c) => c.active).length;
  const cancelledCount = classes.filter((c) => !c.active).length;

  const listClass = (dateF: string, timeF: string, teacherF: string, typeF: string, pg: number) => {
    setLoading(true);
    repo.listClass(dateF, timeF, teacherF, typeF, pg).then((result: any) => {
      if (!(result instanceof Error) && result?.data) {
        setClasses(result.data);
        setInfoPage(result.pagination);
      } else {
        setClasses([]);
        setInfoPage(pageDefault);
      }
    }).finally(() => setLoading(false));
  };

  const handleCancel = (id: number) => {
    repo.cancel(id).then((result: any) => {
      if (!(result instanceof Error)) {
        listClass(date, time, teacherId, type, page);
      }
    });
  };

  useEffect(() => {
    listClass(date, time, teacherId, type, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    repoDrop.dropdown("persons/employee/dropdown").then(setDropdownTeacher);
    repoDrop.dropdown("productTypes/dropdown").then(setDropdownType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TABLE_COLS = [
    { label: "DATA / HORA", sort: true },
    { label: "ALUNOS" },
    { label: "PROFESSOR" },
    { label: "TIPO DE PRODUTO" },
    { label: "STATUS" },
    { label: "OPÇÕES" },
  ];

  return (
    <PageDefault>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground">Aulas</h3>
            {total > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                {total}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie as aulas do CT</p>
        </div>
        <Button onClick={() => router.push("/aulas/cadastrar")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova Aula
        </Button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total de Aulas"
          value={total}
          iconBg="bg-blue-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
        />
        <KpiCard
          title="Ativas"
          value={activeCount}
          iconBg="bg-emerald-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Canceladas"
          value={cancelledCount}
          iconBg="bg-red-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-0">
            <SingleCalendar label="Data" date={date} setValue={setDate} />
            <AuthSelect
              label="Hora"
              value={time}
              options={listTimes?.time}
              changeValue={setTime}
            />
            <AuthSelect
              label="Tipo de Produto"
              value={type}
              options={convertArrayType(dropdownType)}
              changeValue={setType}
            />
            <AuthSelect
              label="Professor"
              value={teacherId}
              options={convertArray(dropdownTeacher)}
              changeValue={setTeacherId}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDate(""); setTime(""); setTeacherId(""); setType("");
                listClass("", "", "", "", 1);
              }}
            >
              Limpar
            </Button>
            <Button size="sm" onClick={() => listClass(date, time, teacherId, type, 1)}>
              Pesquisar
            </Button>
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
                      <td colSpan={6} className="px-4 py-3">
                        <div className="h-10 rounded-full bg-muted animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma aula encontrada.
                    </td>
                  </tr>
                ) : (
                  classes.map((aula: any) => {
                    const count = aula.studentsCount ?? (Array.isArray(aula.students) ? aula.students.length : 0);
                    const limit = aula.limit ?? 12;
                    const isFull = count >= limit;
                    return (
                      <tr
                        key={aula.id}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() => router.push(`/aulas/listar/${aula.id}`)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-medium text-foreground">{fmtDate(aula.date)}</p>
                          <p className="text-xs text-muted-foreground">{aula.time ?? "—"}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            isFull
                              ? "bg-destructive/10 text-destructive"
                              : "bg-emerald-500/10 text-emerald-600"
                          )}>
                            {count}
                            <span className="opacity-50">/</span>
                            {limit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {aula.teacher ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {aula.productType ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={aula.active ? "success" : "destructive"}>
                            {aula.active ? "Ativa" : "Cancelada"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <OptionsMenu id={aula.id} onCancel={handleCancel} />
                        </td>
                      </tr>
                    );
                  })
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
