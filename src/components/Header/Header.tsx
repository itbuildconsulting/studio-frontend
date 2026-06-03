"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CookiesAuth } from "@/shared/enum";
import { IconMenuHamburguer } from "../icons";
import { cn } from "@/lib/utils";

interface HeaderProps {
  handleMenuOpen: () => void;
}

export default function Header({ handleMenuOpen }: HeaderProps) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(Cookies.get(CookiesAuth.USERNAME) || null);
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
      {/* Hamburguer — visível apenas no mobile */}
      <button
        className={cn(
          "lg:hidden flex items-center justify-center h-9 w-9 rounded-md",
          "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        )}
        onClick={handleMenuOpen}
        aria-label="Abrir menu"
      >
        {IconMenuHamburguer("22", "22", "currentColor")}
      </button>

      {/* Espaço central */}
      <div className="flex-1" />

      {/* Avatar do usuário */}
      {userName && (
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{userName}</span>
          </span>
          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{initials}</span>
          </div>
        </div>
      )}
    </header>
  );
}
