// TODO: conectar ao endpoint real quando disponível: GET /persons/birthdays?period=today|week
// TODO: substituir MOCK_NEWS por endpoint de notícias/avisos do sistema

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BirthdayPerson {
  id: number;
  name: string;
  age: number;
  today: boolean;
}

interface NewsItem {
  id: number;
  title: string;
  time: string;
  type: "info" | "success" | "warning";
}

const MOCK_BIRTHDAYS: BirthdayPerson[] = [
  { id: 1, name: "Mariana Silva",   age: 29, today: true  },
  { id: 2, name: "Lucas Ferreira",  age: 34, today: false },
  { id: 3, name: "Amanda Rocha",    age: 26, today: false },
];

const MOCK_NEWS: NewsItem[] = [
  { id: 1, title: "Renovação de planos em aberto",    time: "há 2h",  type: "warning" },
  { id: 2, title: "Novo aluno cadastrado: João P.",   time: "há 5h",  type: "success" },
  { id: 3, title: "Pagamento confirmado – R$ 350",    time: "ontem",  type: "info"    },
];

export default function BirthdaysCard() {
  const todayBirthdays = MOCK_BIRTHDAYS.filter((p) => p.today);
  const upcomingBirthdays = MOCK_BIRTHDAYS.filter((p) => !p.today);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Aniversariantes & Avisos</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-3">
        {/* Aniversariantes */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Aniversariantes
          </p>
          <div className="space-y-1.5">
            {todayBirthdays.length > 0 && todayBirthdays.map((p) => (
              <BirthdayRow key={p.id} person={p} />
            ))}
            {upcomingBirthdays.map((p) => (
              <BirthdayRow key={p.id} person={p} />
            ))}
            {MOCK_BIRTHDAYS.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">Nenhum aniversariante esta semana.</p>
            )}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t border-border" />

        {/* Avisos recentes */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Avisos recentes
          </p>
          <div className="space-y-2">
            {MOCK_NEWS.map((news) => (
              <div key={news.id} className="flex items-start gap-2">
                <NewsDot type={news.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-tight">{news.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{news.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
      {person.today ? (
        <Badge variant="success" className="text-[10px] shrink-0">
          🎂 Hoje
        </Badge>
      ) : (
        <span className="text-[11px] text-muted-foreground shrink-0">{person.age} anos</span>
      )}
    </div>
  );
}

function NewsDot({ type }: { type: NewsItem["type"] }) {
  const color =
    type === "success" ? "bg-success" :
    type === "warning" ? "bg-warning" :
    "bg-info";
  return <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${color}`} />;
}
