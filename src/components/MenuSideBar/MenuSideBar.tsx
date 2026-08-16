"use client";

import Image from "next/image";
import {
  IconAdmin,
  IconAdminFilter,
  IconClass,
  IconClose,
  IconCoupon,
  IconCrm,
  IconDollar,
  IconFinance,
  IconHome,
  IconInstallment,
  IconLeave,
  IconNps,
  IconProducts,
  IconStats,
  IconStudents,
  IconWorkers,
} from "../icons";
import LogoShort from "../../../public/images/spingo.png";
import MenuItem from "./MenuItem";
import useAuthData from "@/data/hooks/useAuthData";
import { checkUserLevel } from "../../../core/CheckUserLevel";
import { useEffect, useState } from "react";
import SkeletonMenu from "./SkeletonMenu";
import { cn } from "@/lib/utils";

interface MenuSideBarProps {
  menuMobileOpen: boolean;
  handleMenuOpen: () => void;
}

export default function MenuSideBar({ menuMobileOpen, handleMenuOpen }: MenuSideBarProps) {
  const { logout } = useAuthData();

  const [ready, setReady] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      setHasAccess(checkUserLevel("1"));
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <>
      {/* Overlay mobile */}
      {menuMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={handleMenuOpen}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          menuMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header da sidebar */}
        <div className="relative flex items-center justify-center px-4 py-5 border-b border-sidebar-border">
          <Image
            src={LogoShort}
            alt="Logo Studio Raphael Oliveira"
            width={120}
          />
          <button
            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={handleMenuOpen}
            aria-label="Fechar menu"
          >
            {IconClose("16", "16", "currentColor")}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-busy={!ready}>
          {!ready ? (
            <SkeletonMenu />
          ) : !hasAccess ? (
            <ul className="space-y-0.5">
              <MenuItem url="/aulas" text="Aulas" icon={IconClass} />
            </ul>
          ) : (
            <ul className="space-y-0.5">
              <MenuItem url="/dashboard" text="Home" icon={IconHome} />
              <MenuItem url="/aulas" text="Aulas" icon={IconClass} />
              <MenuItem url="/alunos" text="Alunos" icon={IconStudents} />
              <MenuItem url="/financeiro" text="Financeiro" icon={IconFinance} />
              <MenuItem url="/funcionarios" text="Funcionários" icon={IconWorkers} />
              <MenuItem url="/produtos" text="Produtos" icon={IconProducts} />
              <MenuItem url="/creditos" text="Créditos" icon={IconDollar} />
              <MenuItem url="/estatisticas" text="Estatísticas" icon={IconStats} />
              <MenuItem url="/nps" text="NPS" icon={IconNps} />
              <MenuItem url="/crm" text="CRM" icon={IconCrm} />
              <MenuItem url="/administrativo" text="Administrativo" icon={IconAdmin} />
              <MenuItem url="/configuracoes" text="Configurações" icon={IconAdminFilter} />
              <MenuItem url="/parcelamento" text="Parcelamento" icon={IconInstallment} />
              <MenuItem url="/cupons" text="Cupons" icon={IconCoupon} />
            </ul>
          )}
        </nav>

        {/* Footer — sair */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          {!ready ? (
            <div className="h-10 rounded-md bg-sidebar-accent animate-pulse" />
          ) : (
            <MenuItem text="Sair" icon={IconLeave} onClick={logout} />
          )}
        </div>
      </aside>
    </>
  );
}
