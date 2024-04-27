import styles from '../../styles/header.module.css';
import { IconArrowBack, IconMenuHamburguer, IconNotification, IconPeople } from '../icons';

interface HeaderProps {
    handleMenuOpen: any
}

export default function Header(props: HeaderProps) {
    return (
        <header className={`${styles.bg_header}`}>
            <span className={`${styles.header_menu}`} onClick={props.handleMenuOpen}>{IconMenuHamburguer(32, 30, '#003D58')}</span>
            <div>

            </div>
            <div className='flex items-center'>
                <div className={`${styles.notification_header}`}>
                    <div className={`${styles.bagde_notification_header}`}>
                        <span>3</span> {/* Integrar e colocar o número de notificações */}
                    </div>
                    {IconNotification}
                </div>
                <div className={`${styles.user_header}`}>
                    <div className={`${styles.user_icon_header}`}>
                        {IconPeople}
                    </div>
                    <div className={`${styles.user_name_header}`}>
                        <span>Olá, Fulano de Tal</span>
                        <span>{IconArrowBack}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}