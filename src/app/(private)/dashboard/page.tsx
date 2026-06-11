"use client";

import PageDefault from "@/components/template/default";
import DashboardHeader from "./_components/DashboardHeader";
import KpiCards from "./_components/KpiCards";
import TodayClasses from "./_components/TodayClasses";
import RevenueCard from "./_components/RevenueCard";
import FrequencyCard from "./_components/FrequencyCard";
import BirthdaysCard from "./_components/BirthdaysCard";
import { checkUserLevel } from "../../../../core/CheckUserLevel";

export default function DashboardPage() {
  const isAdmin = checkUserLevel("1");

  return (
    <PageDefault title="">
      <DashboardHeader />

      <KpiCards showFinancial={isAdmin} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <TodayClasses />
        </div>
        <div>
          <BirthdaysCard />
        </div>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <RevenueCard />
          <FrequencyCard />
        </div>
      )}
    </PageDefault>
  );
}
