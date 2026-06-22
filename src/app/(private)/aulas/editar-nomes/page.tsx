"use client";

import { useEffect, useMemo, useState } from "react";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/pagination/pagination";
import AuthSelect from "@/components/auth/AuthSelect";
import SingleCalendar from "@/components/date/SingleCalendar";
import ClassCollecion from "../../../../../core/Class";
import DropDownsCollection from "../../../../../core/DropDowns";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import listTimes from "../../../../json/time.json";

function fmtDate(cell: string | null): string {
  if (!cell) return "—";
  return cell.split("T")[0].split("-").reverse().join("/");
}

export default function RenameClasses() {
  const repo = useMemo(() => new ClassCollecion(), []);
  const repoDrop = useMemo(() => new DropDownsCollection(), []);

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

  const [selected, setSelected] = useState<Map<number, any>>(new Map());
  const [newTitle, setNewTitle] = useState("");
  const [applying, setApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    listClass(date, time, teacherId, type, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    repoDrop.dropdown("persons/employee/dropdown").then(setDropdownTeacher);
    repoDrop.dropdown("productTypes/dropdown").then(setDropdownType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOne = (row: any) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(row.id)) next.delete(row.id);
      else next.set(row.id, row);
      return next;
    });
  };

  const allOnPageSelected = classes.length > 0 && classes.every((c) => selected.has(c.id));

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (allOnPageSelected) {
        classes.forEach((c) => next.delete(c.id));
      } else {
        classes.forEach((c) => next.set(c.id, c));
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Map());

  const applyRename = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setErrorMessage("Informe o novo nome.");
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }
    if (selected.size === 0) return;

    setApplying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const rows = Array.from(selected.values());
    const results = await Promise.all(
      rows.map((row) =>
        repo.edit(
          row.id,
          row.date,
          row.time,
          row.teacherId,
          row.limit,
          row.hasCommission,
          row.kickback,
          row.kickbackRule,
          row.productTypeId,
          null,
          row.active,
          trimmed,
          row.description
        )
      )
    );

    const failedCount = results.filter((r: any) => r instanceof Error).length;
    setApplying(false);

    if (failedCount > 0) {
      setErrorMessage(`${failedCount} de ${rows.length} aula(s) não puderam ser atualizadas.`);
    } else {
      setSuccessMessage(`Nome atualizado em ${rows.length} aula(s).`);
    }
    setTimeout(() => { setErrorMessage(null); setSuccessMessage(null); }, 4000);

    setNewTitle("");
    clearSelection();
    listClass(date, time, teacherId, type, page);
  };

  return (
    <PageDefault title="Editar Nomes das Aulas">
      <p className="text-sm text-muted-foreground -mt-6 mb-6">
        Selecione uma ou mais aulas e aplique um novo nome para todas de uma vez.
      </p>

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
          <div className="flex gap-2 justify-end">
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

      {/* ── Selection bar ──────────────────────────────────── */}
      {selected.size > 0 && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex flex-col gap-1 min-w-[240px] flex-1">
                <Label className="mb-0">
                  Novo nome para {selected.size} aula{selected.size > 1 ? "s" : ""} selecionada{selected.size > 1 ? "s" : ""}
                </Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Digite o novo nome da aula"
                  onKeyDown={(e) => e.key === "Enter" && applyRename()}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection} disabled={applying}>
                  Limpar seleção
                </Button>
                <Button size="sm" onClick={applyRename} disabled={applying}>
                  {applying ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            </div>
            {errorMessage && <p className="text-sm text-destructive mt-3">{errorMessage}</p>}
            {successMessage && <p className="text-sm text-success mt-3">{successMessage}</p>}
          </CardContent>
        </Card>
      )}

      {/* ── Table ──────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={toggleAllOnPage}
                      disabled={classes.length === 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    DATA / HORA
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    NOME ATUAL
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    PROFESSOR
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    TIPO DE PRODUTO
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-10 rounded-full bg-muted animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma aula encontrada.
                    </td>
                  </tr>
                ) : (
                  classes.map((aula: any) => (
                    <tr
                      key={aula.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => toggleOne(aula)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected.has(aula.id)}
                          onCheckedChange={() => toggleOne(aula)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-foreground">{fmtDate(aula.date)}</p>
                        <p className="text-xs text-muted-foreground">{aula.time ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {aula.title ?? <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {aula.teacher ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {aula.productType ?? "—"}
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
