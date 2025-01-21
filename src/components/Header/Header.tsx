import Cookies from 'js-cookie';
import { IconArrowBack, IconMenuHamburguer, IconNotification, IconPeople } from '../icons';

import styles from '../../styles/header.module.css';
import { CookiesAuth } from '@/shared/enum';
import { useEffect, useState } from 'react';
interface HeaderProps {
    handleMenuOpen: () => void
}

export default function Header({ handleMenuOpen }: HeaderProps) {
    const [userNameAuth, setUserNameAuth] = useState<string | null>(null);

    useEffect(() => {
      const username = Cookies.get(CookiesAuth.USERNAME) || '';
      setUserNameAuth(username);
    }, []);

    return (
        <header className={`${styles.bg_header}`}>
            <span className={`${styles.header_menu}`} onClick={handleMenuOpen}>{IconMenuHamburguer('32px', '30px', '#003D58')}</span>
            <div>

            </div>
            <div className='flex items-center'>
                {/* <div className={`${styles.notification_header}`}>
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
                        <span>Olá, {userNameAuth}</span>
                        <span>{IconArrowBack}</span>
                    </div>
                </div>*/}
            </div>
        </header>
    )
}