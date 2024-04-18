'use client'

import { useRouter } from 'next/navigation';
import styles from '../../styles/card.module.css';

interface TitleProps {
    title?: string,
    children: any,
    hasButton?: boolean,
    setShowModal?: any,
    url?: any
}

export default function Card(props: TitleProps) {
    const router = useRouter();

    return (
        <div className={`${styles.bg_card}`}>
            <div className='flex justify-between'>
                {props.title && <h4 style={{ marginBottom: "32px" }}>{props.title}</h4>}

                {props.hasButton && <button className="btn-outline-primary" onClick={() => props.setShowModal ? props.setShowModal(true) : router.push(props.url)}><p>Adicionar</p></button>}
            </div>
            {props.children}
        </div>
    )
}