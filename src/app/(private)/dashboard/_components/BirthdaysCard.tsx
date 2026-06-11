"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PersonsRepository from "../../../../../core/Persons";

interface BirthdayPerson {
  id: number;
  name: string;
  age: number | null;
  date: string | null;
  today: boolean;
}

export default function BirthdaysCard() {
  const repo = useMemo(() => new PersonsRepository(), []);
  const [todayList, setTodayList] = useState<BirthdayPerson[]>([]);
  const [weekList, setWeekList] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    repo.getBirthdays().then((result: any) => {
      if (!(result instanceof Error) && result?.data) {
        setTodayList((result.data.today ?? []).map((p: any) => ({ ...p, today: true })));
        setWeekList((result.data.week ?? []).map((p: any) => ({ ...p, today: false })));
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const all = [...todayList, ...weekList];
  const empty = !loading && all.length === 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Aniversariantes</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : empty ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Nenhum aniversariante esta semana.
          </p>
        ) : (
          <div className="space-y-1.5">
            {all.map((p) => (
              <BirthdayRow key={p.id} person={p} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BirthdayRow({ person }: { person: BirthdayPerson }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-semibold text-muted-foreground">
        {person.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
      </div>
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        {person.date && (
          <span className="text-[11px] text-muted-foreground">{person.date}</span>
        )}
        {person.today ? (
          <Badge variant="success" className="text-[10px]">🎂 Hoje</Badge>
        ) : (
          person.age != null && (
            <span className="text-[11px] text-muted-foreground">{person.age} anos</span>
          )
        )}
      </div>
    </div>
  );
}
