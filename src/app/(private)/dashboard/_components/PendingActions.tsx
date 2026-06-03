// TODO: conectar aos endpoints reais quando disponíveis:
//   - mensalidades vencidas: GET /financial/overdue
//   - planos expirando:      GET /products/expiring
//   - aula sem professor:    GET /class/without-teacher
//   - lista de espera:       GET /class/waitlist

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PendingItem {
  id: string;
  icon: "money" | "clock" | "calendar" | "people";
  title: string;
  subtitle: string;
  action: string;
  actionColor?: string;
}

const MOCK_ITEMS: PendingItem[] = [
  {
    id: "1",
    icon: "money",
    title: "3 mensalidades venc.",
    subtitle: "R$ 1.240,00 a receber",
    action: "Cobrar",
    actionColor: "text-primary",
  },
  {
    id: "2",
    icon: "clock",
    title: "2 planos expirando",
    subtitle: "Mariana S., Luc...",
    action: "Renovar",
    actionColor: "text-warning",
  },
  {
    id: "3",
    icon: "calendar",
    title: "1 aula sem professor",
    subtitle: "Tênis · 18:00 hoje",
    action: "Atribuir",
    actionColor: "text-info",
  },
  {
    id: "4",
    icon: "people",
    title: "4 alunos na l. espera",
    subtitle: "Spinning · turm...",
    action: "Encaixar",
    actionColor: "text-success",
  },
];

export default function PendingActions() {
  const total = MOCK_ITEMS.length;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Ações pendentes</CardTitle>
            <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {total}
            </span>
          </div>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
            Ver tudo
            <ChevronRightIcon />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-1 pb-3">
        {MOCK_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              <PendingIcon type={item.icon} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
            </div>

            <button
              className={cn(
                "text-xs font-semibold shrink-0 flex items-center gap-0.5 hover:underline",
                item.actionColor ?? "text-primary"
              )}
            >
              {item.action}
              <ChevronRightIcon />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Ícones ─────────────────────────────────────────────────────────────────

function PendingIcon({ type }: { type: PendingItem["icon"] }) {
  switch (type) {
    case "money":
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "clock":
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
        </svg>
      );
    case "people":
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
  }
}

function ChevronRightIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
