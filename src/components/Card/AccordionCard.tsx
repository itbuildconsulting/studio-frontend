'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/card.module.css';

interface TitleProps {
    title?: string;
    children: any;
    hasButton?: boolean;
    setShowModal?: (e: boolean) => void;
    url?: string | undefined;
    hasFooter?: boolean;
    eventsButton?: any;
    loading?: boolean;
    customClass?: string;
}

export default function AccordionCard({
    title,
    children,
    hasButton,
    setShowModal,
    url,
    hasFooter,
    eventsButton,
    loading,
    customClass = ''
}: TitleProps) {
    const [isOpen, setIsOpen] = useState(true); // Estado para controlar se o acordeão está aberto ou fechado
    const router = useRouter();

    const toggleAccordion = () => {
        setIsOpen(!isOpen); // Alterna o estado de aberto/fechado
    };

    return (
        <div className={`${styles.bg_card} ${customClass}`}>
            <div className='flex justify-between'>
                {title && (
                    <h4 
                        style={{ marginBottom: "32px", cursor: 'pointer' }} 
                        onClick={toggleAccordion}
                    >
                        {title}
                    </h4>
                )}

                {hasButton && (
                    <button className="btn-outline-primary" onClick={() => setShowModal ? setShowModal(true) : router.push(`${url}`)}>
                        <p>Adicionar</p>
                    </button>
                )}
            </div>

            {/* Conteúdo do acordeão, que será mostrado ou ocultado com base no estado "isOpen" */}
            {isOpen && (
                <div className={styles.accordionContent}>
                    {children}
                    {hasFooter && (
                        <div className={`${styles.footer_card}`}>
                            {eventsButton?.map((btn: any) => {
                                if (loading && (btn.name === "Cadastrar" || btn.name === "Editar")) {
                                    return (
                                        <button key={btn.name} className={btn.class} onClick={() => btn.function()}>
                                            <div className='load'/>
                                        </button>
                                    );
                                } else {
                                    return (
                                        <button key={btn.name} className={btn.class} onClick={() => btn.function()}>
                                            {btn.name}
                                        </button>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
