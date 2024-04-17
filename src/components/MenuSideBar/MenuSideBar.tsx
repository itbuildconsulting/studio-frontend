import Image from 'next/image';
import styles from '../../styles/menu.module.css';

import { IconAdmin, IconClass, IconFinance, IconHome, IconLeave, IconProducts, IconStudents, IconWorkers } from "../icons"
import LogoShort from '../../../public/images/logo_sudio_short.png'

import MenuItem from './MenuItem';
import { usePathname } from 'next/navigation';

export default function MenuSideBar() {
    const pathname = usePathname();

    //const { logout } = useAuthData();

    return (
        <div className={`${styles.bg_menu}`}>
            <div>
                <div>
                    <Image src={LogoShort} alt='Logo Studio Raphael Oliveira' />
                </div>
                <div>
                    <ul>
                        <MenuItem url="/dashboard" text="Home" icon={IconHome} className={pathname === "/dashboard" ? "active" : ""} />
                        <MenuItem url="/aulas" text="Aulas" icon={IconClass} className={pathname === "/aulas" ? "active" : ""} />
                        <MenuItem url="/alunos" text="Alunos" icon={IconStudents} className={pathname === "/alunos" ? "active" : ""} />
                        <MenuItem url="/financeiro" text="Financeiro" icon={IconFinance} className={pathname === "/financeiro" ? "active" : ""} />
                        <MenuItem url="/funcionarios" text="Funcionários" icon={IconWorkers} className={pathname === "/funcionarios" ? "active" : ""} />
                        <MenuItem url="/produtos" text="Produtos" icon={IconProducts} className={pathname === "/produtos" ? "active" : ""} />
                        <MenuItem url="/administrativo" text="Administrativo" icon={IconAdmin} className={pathname === "/administrativo" ? "active" : ""} />
                    </ul>
                </div>
            </div>
            <div>
                <ul className='mb-4 pt-3' style={{ border: "1px solid #EFF4F6 "}}>
                    <MenuItem
                        text="Sair"
                        icon={IconLeave}
                    //onClick={logout} 
                    />
                </ul>
            </div>
        </div>
    )
}