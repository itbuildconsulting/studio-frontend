import Image from 'next/image';
import styles from '../../styles/menu.module.css';

import { IconAdmin, IconAdminFilter, IconClass, IconClose, IconDollar, IconFinance, IconHome, IconLeave, IconProducts, IconStudents, IconWorkers } from "../icons"
import LogoShort from '../../../public/images/logo_sudio_short.png'

import MenuItem from './MenuItem';
import { usePathname } from 'next/navigation';
import useAuthData from '@/data/hooks/useAuthData';
import { checkUserLevel } from '../../../core/CheckUserLevel';

interface MenuSideBarProps {
    menuMobileOpen: boolean,
    handleMenuOpen: () => void
}

export default function MenuSideBar(props: MenuSideBarProps) {
    const pathname = usePathname();

    const { logout } = useAuthData();

    const hasAccess = checkUserLevel('1');

    

    return (
        <>
            <div className={`${styles.bg_menu} ${props.menuMobileOpen ? styles.bg_menu_mobile_open : ""}`}>
                <div>
                    <div className='flex justify-between'>
                        <Image src={LogoShort} alt='Logo Studio Raphael Oliveira' />

                        <div className={`${styles.close_menu}`} onClick={props.handleMenuOpen}>
                            {IconClose('16', '16', '#003D58')}
                        </div>
                    </div>
                    <div>
                        {!hasAccess ? 
                            <ul>                           
                                <MenuItem url="/aulas" text="Aulas" icon={IconClass} className={pathname === "/aulas" ? "active" : ""} />
                            </ul>

                            :
                            <ul>  
                                <MenuItem url="/dashboard" text="Home" icon={IconHome} className={pathname === "/dashboard" ? "active" : ""} />
                                <MenuItem url="/aulas" text="Aulas" icon={IconClass} className={pathname === "/aulas" ? "active" : ""} />
                                <MenuItem url="/alunos" text="Alunos" icon={IconStudents} className={pathname === "/alunos" ? "active" : ""} />
                                <MenuItem url="/financeiro" text="Financeiro" icon={IconFinance} className={pathname === "/financeiro" ? "active" : ""} />
                                <MenuItem url="/funcionarios" text="Funcionários" icon={IconWorkers} className={pathname === "/funcionarios" ? "active" : ""} />
                                <MenuItem url="/produtos" text="Produtos" icon={IconProducts} className={pathname === "/produtos" ? "active" : ""} />
                                <MenuItem url="/creditos" text="Créditos" icon={IconDollar} className={pathname === "/creditos" ? "active" : ""} />
                                <MenuItem url="/administrativo" text="Administrativo" icon={IconAdmin} className={pathname === "/administrativo" ? "active" : ""} />
                                <MenuItem url="/configuracoes" text="Configurações" icon={IconAdminFilter} className={pathname === "/configuracoes" ? "active" : ""} />
                            </ul>
                            }
                            
                    </div>
                </div>
                <div>
                    <ul className='mb-4 pt-3' style={{ border: "1px solid #EFF4F6 " }}>
                        <MenuItem
                            text="Sair"
                            icon={IconLeave}
                            onClick={logout} 
                        />
                    </ul>
                </div>
            </div>
            {props.menuMobileOpen && <div className={`${styles.shadow_menu}`}></div>}
            
        </>
    )
}