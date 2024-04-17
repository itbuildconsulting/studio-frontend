import styles from '../../styles/header.module.css';
import { IconArrowBack, IconNotification, IconPeople } from '../icons';

export default function Header() {
    return (
        <header className={`${styles.bg_header}`}>
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
        </header>
    )
}