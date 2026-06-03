"use client";

import Link from "next/link";
import { useEffect, useState, ReactElement } from "react";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  url?: string;
  text: string;
  icon: ReactElement | ((w: string, h: string, color: string) => ReactElement);
  onClick?: () => void;
};

export default function MenuItem({ url, text, icon, onClick }: MenuItemProps) {
  const [hydrated, setHydrated] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (url) {
      setIsActive(window.location.pathname === url);
    }
  }, [url]);

  const iconElement =
    typeof icon === "function" ? icon("18", "18", "currentColor") : icon;

  const itemClass = cn(
    "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
    hydrated && isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
      : "text-[hsl(var(--nav-link-color))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  );

  if (!url) {
    return (
      <li>
        <button className={cn(itemClass, "w-full")} onClick={onClick} suppressHydrationWarning>
          <span className="flex-shrink-0">{iconElement}</span>
          <span>{text}</span>
        </button>
      </li>
    );
  }

  return (
    <li suppressHydrationWarning>
      <Link href={url} className={itemClass}>
        <span className="flex-shrink-0">{iconElement}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
}
