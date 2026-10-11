"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading/Loading";
import { DIAS_SEMANA_ABREV } from "@/types/turmas";
import TurmasRepository from "../../../../../../core/Turmas";

function fmtDate(cell: string): string {
  if (!cell) return "—";
  return cell.split("T")[0].split("-").reverse().join("/");
}

export default function DetalhesTurma() {
  const repo = useMemo(() => new TurmasRepository(), []);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.slug);

  const [turma, setTurma] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  useEffect(() => {
    repo.details(id).then((result: any) => {
      if (result?.data) setTurma(result.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleGerarAulas = () => {
    setGenerating(true);
    setGenMessage(null);
    repo.gerarAulas(id).then((result: any) => {
      if (result instanceof Error) {
        setGenMessage("Erro ao gerar aulas.");
      } else {
        setGenMessage(result.message || "Aulas geradas com sucesso.");
      }
    }).finally(() => setGenerating(false));
  };

  if (loading) {
    return (
      <PageDefault title="Detalhes da Turma">
        <div className="flex justify-center items-center h-40">
          <Loading />
        </div>
      </PageDefault>
    );
  }

  if (!turma) {
    return (
      <PageDefault title="Detalhes da Turma">
        <p className="text-muted-foreground">Turma não encontrada.</p>
      </PageDefault>
    );
  }

  return (
    <PageDefault>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground">{turma.name}</h3>
            <Badge variant={turma.active ? "success" : "destructive"}>
              {turma.active ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {turma.teacher ?? "—"} · {turma.productTypeName ?? "—"} · Limite: {turma.limit}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/turmas/editar/${id}`)}>
            Editar
          </Button>
          <Button
            onClick={handleGerarAulas}
            disabled={generating}
          >
            {generating ? "Gerando..." : "Gerar Aulas"}
          </Button>
        </div>
      </div>

      {genMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-border bg-muted text-sm text-foreground">
          {genMessage}
        </div>
      )}

      {/* Horários */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Horários recorrentes
          </p>
          {turma.slots?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {turma.slots.map((slot: any, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium bg-muted/40"
                >
                  <span className="font-semibold">{DIAS_SEMANA_ABREV[slot.diaSemana]}</span>
                  <span className="text-muted-foreground">{slot.horarioInicio.slice(0, 5)} – {slot.horarioFim.slice(0, 5)}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum horário cadastrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Aulas geradas */}
      <Card>
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Aulas geradas
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["DATA", "HORÁRIO", "ALUNOS", "STATUS"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!turma.classes || turma.classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma aula gerada ainda. Clique em &ldquo;Gerar Aulas&rdquo; para criar as próximas aulas.
                    </td>
                  </tr>
                ) : (
                  turma.classes.map((aula: any) => (
                    <tr
                      key={aula.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/aulas/listar/${aula.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{fmtDate(aula.date)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{aula.time?.slice(0, 5) ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{aula.studentCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <Badge variant={aula.active ? "success" : "destructive"}>
                          {aula.active ? "Ativa" : "Cancelada"}
                        </Badge>
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
