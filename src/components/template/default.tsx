'use client'

import { useEffect, useState } from "react";;
import Header from "../Header/Header";
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import useWindowSize from "@/data/hooks/useWindowSize";

export default function PageDefault(props: any) {
    const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);

    const size = useWindowSize();

    const handleMenuOpen = () => {
        setMenuMobileOpen(!menuMobileOpen);
    };

    /* Evita o menu ficar aberto ao renderizar o tamanho da tela */
    useEffect(() => {
        if (size.width < 1200) {
            setMenuMobileOpen(false);
        }
    }, [size.width])
    /* END - Evita o menu ficar aberto ao renderizar o tamanho da tela */

    return (
        <main>
            <div className="flex">
                <MenuSideBar menuMobileOpen={menuMobileOpen} handleMenuOpen={handleMenuOpen} />
                <div className="w-full">
                    <Header handleMenuOpen={handleMenuOpen} />
                    <div className="container-content">
                        <h3 style={{ marginBottom: "64px" }}>{props.title}</h3>

                        <div>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}