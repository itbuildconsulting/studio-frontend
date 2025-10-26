'use client'

import styles from '../../../styles/login.module.css';
import AuthInput from "@/components/auth/AuthInput";
import { Key, useState } from "react";
import Link from "next/link";
import AuthDefault from "@/components/template/auth";
import useAuthData from '@/data/hooks/useAuthData';

export default function RecoverPassword() {
    const { recoverPassword, loginError, msgError, load } = useAuthData();

    const [email, setEmail] = useState<string>('');
    const [, setError] = useState<string[]>(['']);

    const handleSubmit = async () => {
        if (recoverPassword) {
            try {
              await recoverPassword(email);
            } catch (e) {
              setError(['Erro desconhecido - Entre em contato com o Suporte']);
              //showErro('Erro desconhecido');
            }
          } else {
            setError(['Erro desconhecido - Entre em contato com o Suporte']);
            //showErro('Erro desconhecido');
          }
    }

    return (
        <AuthDefault>
            <div className={`${styles.form_login}`}>
                <div className="w-full">
                    <div>
                        <h2>Recuperar senha</h2>
                        <p className={`${styles.subtitle_login}`}>Digite seu endereço de e-mail para receber um link de redefinição de senha</p>
                    </div>
                    <form className="mt-8" action={() => handleSubmit()}>
                        <div>
                            <AuthInput
                                label="Email"
                                value={email}
                                type='email'
                                maxLength={60}
                                changeValue={setEmail}
                                required
                            />
                        </div>
                        <div>
                            {
                                load
                                    ?
                                    <button className="btn-primary">
                                        <div className="load" />
                                    </button>
                                    :
                                    <button type="submit" className="btn-primary">Enviar</button>
                            }
                        </div>
                        {loginError ? (
                            msgError?.map((err: any, index: Key) => (
                                <div className={`error-message`} key={index}>
                                    <span className='ml-2 text-sm'>{err}</span>
                                </div>
                            ))
                        ) :
                            false
                        }
                        <div className="px-8">
                            <hr className="my-8" />
                            <p className={`${styles.forgotPassword_login}`}>Já tem uma conta? <Link href={"/"}>Voltar para Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </AuthDefault>
    )
}