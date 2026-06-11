"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TotalSalesRepository from "../../../../../core/TotalSales";

interface MonthlySale {
  month: number;
  totalSales: number;
}

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function fmtCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtShort(v: number) {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1).replace(".", ",")} mil`;
  return fmtCurrency(v);
}

export default function RevenueCard() {
  const salesRepo = useMemo(() => new TotalSalesRepository(), []);

  const [sales, setSales] = useState<MonthlySale[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;

  useEffect(() => {
    salesRepo.consult(String(year)).then((salesRes) => {
      if (!(salesRes instanceof Error)) setSales(
        ((salesRes as any)?.data ?? []).map((s: any) => ({ ...s, totalSales: s.totalSales / 100 }))
      );
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentSales = sales.find((s) => s.month === currentMonth)?.totalSales ?? 0;
  const prevSales    = sales.find((s) => s.month === prevMonth)?.totalSales ?? 0;
  const maxSales     = Math.max(currentSales, prevSales, 1);

  const changePct =
    prevSales > 0 ? Math.round(((currentSales - prevSales) / prevSales) * 100) : 0;
  const isPositive = changePct >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug">
            Receita do mês vs. mês anterior
          </CardTitle>
          {!loading && changePct !== 0 && (
            <Badge
              variant={isPositive ? "success" : "destructive"}
              className="shrink-0 text-xs"
            >
              {isPositive ? "↑" : "↓"} {Math.abs(changePct)}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-8 w-36 rounded-md bg-muted animate-pulse" />
            <div className="h-3 rounded-full bg-muted animate-pulse" />
            <div className="h-3 rounded-full bg-muted animate-pulse w-4/5" />
          </div>
        ) : (
          <>
            {/* Valor destaque */}
            <p className="text-2xl font-bold">
              {fmtCurrency(currentSales)}{" "}
              <span className="text-sm font-normal text-muted-foreground">este mês</span>
            </p>

            {/* Barras de comparação */}
            <div className="space-y-2.5">
              <MonthBar
                label={`${MONTH_NAMES[currentMonth - 1]} (atual)`}
                value={currentSales}
                max={maxSales}
                primary
              />
              <MonthBar
                label={MONTH_NAMES[prevMonth - 1]}
                value={prevSales}
                max={maxSales}
                primary={false}
              />
            </div>

          </>
        )}
      </CardContent>
    </Card>
  );
}

function MonthBar({
  label,
  value,
  max,
  primary,
}: {
  label: string;
  value: number;
  max: number;
  primary: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{fmtCurrency(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            primary ? "bg-primary" : "bg-muted-foreground/35"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
