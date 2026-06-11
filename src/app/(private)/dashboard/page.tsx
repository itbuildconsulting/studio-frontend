"use client";

import PageDefault from "@/components/template/default";
import DashboardHeader from "./_components/DashboardHeader";
import KpiCards from "./_components/KpiCards";
import TodayClasses from "./_components/TodayClasses";
import RevenueCard from "./_components/RevenueCard";
import FrequencyCard from "./_components/FrequencyCard";
import BirthdaysCard from "./_components/BirthdaysCard";

export default function DashboardPage() {
  return (
    <PageDefault title="">
      {/* Saudação + ações rápidas */}
      <DashboardHeader />

      {/* Row 1 – KPIs */}
      <KpiCards />

      {/* Row 2 – Aulas hoje (wide) + Aniversariantes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <TodayClasses />
        </div>
        <div>
          <BirthdaysCard />
        </div>
      </div>

      {/* Row 3 – Receita | Frequência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <RevenueCard />
        <FrequencyCard />
      </div>
    </PageDefault>
  );
}
