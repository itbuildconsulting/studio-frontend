import styles from '../../styles/header.module.css';
import { IconArrowBack, IconMenuHamburguer, IconNotification, IconPeople } from '../icons';

interface HeaderProps {
    handleMenuOpen: () => void
}

export default function Header({ handleMenuOpen }: HeaderProps) {
    return (
        <header className={`${styles.bg_header}`}>
            <span className={`${styles.header_menu}`} onClick={handleMenuOpen}>{IconMenuHamburguer('32px', '30px', '#003D58')}</span>
            <div>

            </div>
            {/*<div className='flex items-center'>
                <div className={`${styles.notification_header}`}>
                    <div className={`${styles.bagde_notification_header}`}>
                        <span>3</span> 
                    </div>
                    {IconNotification}
                </div>
                <div className={`${styles.user_header}`}>
                    <div className={`${styles.user_icon_header}`}>
                        {IconPeople('16px', '16px', "var(--secondary)")}
                    </div>
                    <div className={`${styles.user_name_header}`}>
                        <span>Olá, Fulano de Tal</span>
                        <span>{IconArrowBack}</span>
                    </div>
                </div>
            </div>*/}
        </header>
    )
}