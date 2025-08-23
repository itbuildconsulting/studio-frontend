"use client";

import Link from "next/link";
import { useEffect, useState, ReactElement } from "react";

type MenuItemProps = {
  url?: string;
  text: string;
  icon: ReactElement;
  /** classes fixas (não dinâmicas) */
  baseClassName?: string;
  onClick?: () => void;
};

export default function MenuItem({
  url,
  text,
  icon,
  baseClassName = "",
  onClick,
}: MenuItemProps) {
  // Estado de hidratação
  const [hydrated, setHydrated] = useState(false);
  // Aplica "active" só depois da hidratação
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (url) {
      setIsActive(window.location.pathname === url);
    }
  }, [url]);

  // IMPORTANTÍSSIMO: classe inicial é sempre a mesma no SSR e 1º render do client
  const liClass = hydrated && isActive ? `${baseClassName} active`.trim() : baseClassName;

  return (
    <li className={liClass} onClick={onClick} suppressHydrationWarning>
      <Link href={url || "/"} className="">
        {icon}
        <span className="ml-3">{text}</span>
      </Link>
    </li>
  );
}
