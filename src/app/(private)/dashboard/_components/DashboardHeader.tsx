"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CookiesAuth } from "@/shared/enum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Bom dia", emoji: "👋" };
  if (h < 18) return { text: "Boa tarde", emoji: "☀️" };
  return { text: "Boa noite", emoji: "🌙" };
}

function formatDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export default function DashboardHeader() {
  const [firstName, setFirstName] = useState("");
  const router = useRouter();
  const { text, emoji } = getGreeting();

  useEffect(() => {
    const name = Cookies.get(CookiesAuth.USERNAME) ?? "";
    setFirstName(name.split(" ")[0]);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {text}, {firstName || "..."} {emoji}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5 capitalize">
          {formatDate()} · aqui está o que precisa da sua atenção hoje.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button onClick={() => router.push("/checkout")}>
          <PlusIcon />
          Nova Venda
        </Button>
        <Button variant="outline" onClick={() => router.push("/aulas/cadastrar")}>
          <CalendarIcon />
          Agendar Aula
        </Button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
