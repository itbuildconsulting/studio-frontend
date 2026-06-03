"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "../Header/Header";
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import useWindowSize from "@/data/hooks/useWindowSize";

interface PageDefaultProps {
  title?: string;
  children: ReactNode;
}

export default function PageDefault({ title, children }: PageDefaultProps) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const { width } = useWindowSize();

  const handleMenuOpen = () => setMenuMobileOpen((prev) => !prev);

  useEffect(() => {
    if (width && width >= 1024) {
      setMenuMobileOpen(false);
    }
  }, [width]);

  return (
    <div className="flex min-h-screen bg-background">
      <MenuSideBar menuMobileOpen={menuMobileOpen} handleMenuOpen={handleMenuOpen} />

      {/* Área de conteúdo */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header handleMenuOpen={handleMenuOpen} />

        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          {title && <h3 className="mb-8 text-foreground">{title}</h3>}
          {children}
        </main>
      </div>
    </div>
  );
}
