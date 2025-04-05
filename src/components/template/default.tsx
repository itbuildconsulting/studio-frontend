'use client'

import { ReactNode, useEffect, useState } from "react";
import Header from "../Header/Header";
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import useWindowSize from "@/data/hooks/useWindowSize";

type WindowSizeType = {
    width?: number | undefined;
};

interface SizeProps {
    title: string;
    children: ReactNode;
}

export default function PageDefault(props: SizeProps) {
    const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);

    const size: WindowSizeType = useWindowSize();

    const handleMenuOpen = () => {
        setMenuMobileOpen(!menuMobileOpen);
    };

    useEffect(() => {
        if (size.width && size.width < 1200) {
            setMenuMobileOpen(false);
        }
    }, [size.width]);

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
    );
}