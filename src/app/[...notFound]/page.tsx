import LogoShort from '../../../public/images/logo_sudio_short.png'

import styles from '../../styles/notfound.module.css';
import Image from "next/image";

export default function NotFound() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Image src={LogoShort} alt='Logo Studio Raphael Oliveira' />
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>404</h1>
                    <p className={styles.description}>Oops! A página que você está procurando não foi encontrada.</p>
                    <a className={styles.homeLink} href="/dashboard">Voltar para a Página Inicial</a>
                </div>
            </div>
        </>
    )
}