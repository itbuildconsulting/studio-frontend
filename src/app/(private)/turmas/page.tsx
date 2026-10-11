"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TurmasRepository from "../../../../core/Turmas";
import { DIAS_SEMANA_ABREV, TurmaType } from "@/types/turmas";

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

function OptionsMenu({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
          <button
            onClick={() => { router.push(`/turmas/listar/${id}`); setOpen(false); }}
            className="w-full text-left block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => { router.push(`/turmas/editar/${id}`); setOpen(false); }}
            className="w-full text-left block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md mx-1"
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

export default function Turmas() {
  const repo = useMemo(() => new TurmasRepository(), []);
  const router = useRouter();

  const [turmas, setTurmas] = useState<TurmaType[]>([]);
  const [loading, setLoading] = useState(false);

  const total = turmas.length;
  const ativas = turmas.filter((t) => t.active).length;
  const inativas = total - ativas;

  const loadTurmas = () => {
    setLoading(true);
    repo.list().then((result: any) => {
      if (!(result instanceof Error) && result?.data) {
        setTurmas(result.data);
      } else {
        setTurmas([]);
      }
    }).finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;
    repo.remove(id).then((result: any) => {
      if (!(result instanceof Error)) loadTurmas();
    });
  };

  useEffect(() => { loadTurmas(); }, []);

  const TABLE_COLS = ["TURMA", "HORÁRIOS", "PROFESSOR", "TIPO DE PRODUTO", "LIMITE", "STATUS", "OPÇÕES"];

  const formatSlots = (slots: any[]) => {
    if (!slots || slots.length === 0) return "—";
    return slots
      .map((s) => `${DIAS_SEMANA_ABREV[s.diaSemana]} ${s.horarioInicio}`)
      .join(", ");
  };

  return (
    <PageDefault>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground">Turmas</h3>
            {total > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                {total}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie as turmas recorrentes</p>
        </div>
        <Button onClick={() => router.push("/turmas/cadastrar")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova Turma
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total de turmas"
          value={loading ? "—" : total}
          iconBg="bg-blue-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Turmas ativas"
          value={loading ? "—" : ativas}
          iconBg="bg-emerald-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Turmas inativas"
          value={loading ? "—" : inativas}
          iconBg="bg-orange-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />
      </div>

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
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="h-10 rounded-full bg-muted animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : turmas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma turma cadastrada.
                    </td>
                  </tr>
                ) : (
                  turmas.map((turma: any) => (
                    <tr
                      key={turma.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/turmas/listar/${turma.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{turma.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatSlots(turma.slots)}</td>
                      <td className="px-4 py-3 text-foreground">{turma.teacher ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{turma.productTypeName ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{turma.limit}</td>
                      <td className="px-4 py-3">
                        <Badge variant={turma.active ? "success" : "destructive"}>
                          {turma.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <OptionsMenu id={turma.id} onDelete={handleDelete} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageDefault>
  );
}
