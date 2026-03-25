'use client'

import styles from '@/styles/login.module.css';
import Link from 'next/link';
import AuthDefault from '@/components/template/auth';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Status = 'loading' | 'success' | 'error';

export default function ConfirmarEmail() {
    const { token } = useParams();

    const [status, setStatus] = useState<Status>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Token não encontrado. Solicite um novo código no aplicativo.');
            return;
        }

        const confirm = async () => {
            try {
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL_API}/auth/verify?token=${token}`,
                    { method: 'GET' }
                );

                if (resp.status === 200) {
                    setStatus('success');
                } else {
                    const json = await resp.json().catch(() => ({}));
                    setErrorMessage(json.error || 'Link inválido ou expirado. Solicite um novo código no aplicativo.');
                    setStatus('error');
                }
            } catch {
                setErrorMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
                setStatus('error');
            }
        };

        confirm();
    }, [token]);

    return (
        <AuthDefault>
            <div className={`${styles.form_login}`}>
                <div className="w-full">

                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <button className="btn-primary" disabled>
                                <div className="load" />
                            </button>
                            <p className={`${styles.subtitle_login}`}>Verificando seu e-mail...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <>
                            <div>
                                <h2>E-mail confirmado!</h2>
                                <p className={`${styles.subtitle_login}`}>
                                    Sua conta foi ativada com sucesso. Agora você já pode fazer login no aplicativo.
                                </p>
                            </div>

                            <div className="flex justify-center mt-8">
                                <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <div className="px-8 mt-8">
                                <hr className="my-4" />
                                <p className={`${styles.forgotPassword_login}`}>
                                    <Link href="/">Voltar para o Login</Link>
                                </p>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div>
                                <h2>Ops! Algo deu errado</h2>
                                <p className={`${styles.subtitle_login}`}>{errorMessage}</p>
                            </div>

                            <div className="flex justify-center mt-8">
                                <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>

                            <div className="px-8 mt-8">
                                <hr className="my-4" />
                                <p className={`${styles.forgotPassword_login}`}>
                                    <Link href="/">Voltar para o Login</Link>
                                </p>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </AuthDefault>
    );
}