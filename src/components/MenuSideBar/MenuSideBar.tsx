"use client";
import Image from "next/image";
import styles from "../../styles/menu.module.css";
import {
  IconAdmin, IconAdminFilter, IconClass, IconClose, IconDollar, IconFinance,
  IconHome, IconLeave, IconProducts, IconStudents, IconWorkers
} from "../icons";
import LogoShort from "../../../public/images/spingo.png";
import MenuItem from "./MenuItem";
import useAuthData from "@/data/hooks/useAuthData";
import { checkUserLevel } from "../../../core/CheckUserLevel";
import { useEffect, useState } from "react";
import SkeletonMenu from "./SkeletonMenu";

interface MenuSideBarProps {
  menuMobileOpen: boolean;
  handleMenuOpen: () => void;
}

export default function MenuSideBar({ menuMobileOpen, handleMenuOpen }: MenuSideBarProps) {
  const { logout } = useAuthData();

  const [ready, setReady] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    // roda só no client, pode ler cookie/localStorage aqui
    try {
      setHasAccess(checkUserLevel("1"));
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <>
      <div className={`${styles.bg_menu} ${menuMobileOpen ? styles.bg_menu_mobile_open : ""}`}>
        <div>
          <div className="flex justify-center items-center w-100">
            <Image src={LogoShort} alt="Logo Studio Raphael Oliveira"  width={150}/>
            <button className={styles.close_menu} onClick={handleMenuOpen} aria-label="Fechar menu">
              {IconClose("16", "16", "#003D58")}
            </button>
          </div>

          <div aria-busy={!ready}>
            {!ready ? (
              <SkeletonMenu />
            ) : !hasAccess ? (
              <ul>
                <MenuItem url="/aulas" text="Aulas" icon={IconClass} />
              </ul>
            ) : (
              <ul>
                <MenuItem url="/dashboard" text="Home" icon={IconHome} />
                <MenuItem url="/aulas" text="Aulas" icon={IconClass} />
                <MenuItem url="/alunos" text="Alunos" icon={IconStudents} />
                <MenuItem url="/financeiro" text="Financeiro" icon={IconFinance} />
                <MenuItem url="/funcionarios" text="Funcionários" icon={IconWorkers} />
                <MenuItem url="/produtos" text="Produtos" icon={IconProducts} />
                <MenuItem url="/creditos" text="Créditos" icon={IconDollar} />
                <MenuItem url="/administrativo" text="Administrativo" icon={IconAdmin} />
                <MenuItem url="/configuracoes" text="Configurações" icon={IconAdminFilter} />
              </ul>
            )}
          </div>
        </div>

        <div>
          <ul className="mb-4 pt-3" style={{ border: "1px solid #EFF4F6 " }}>
            {!ready ? (
              <li className="h-9 my-2 rounded-md bg-slate-200 animate-pulse" />
            ) : (
              <MenuItem text="Sair" icon={IconLeave} onClick={logout} />
            )}
          </ul>
        </div>
      </div>

      {menuMobileOpen && <div className={styles.shadow_menu} />}
    </>
  );
}
