import Image from "next/image";

import LogoStudio from "../../../public/images/logo_spingo_login.png";

import styles from '../../styles/login.module.css';
import { ReactNode } from "react";

interface AuthProps {
    children: ReactNode
}

export default function AuthDefault(props: AuthProps) {
    return (
        <main className="bg-white h-screen py-6">
            <div className="grid grid-cols-12 h-full">
                <div className="col-span-12 lg:col-span-6 px-6 lg:px-0 lg:pl-6">
                    <div className={`${styles.bg_login}`}>
                        <Image src={LogoStudio} alt={"Logo Studio Raphael Oliveira"} />
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
                    {props.children}
                </div>
            </div>
        </main>
    )
}