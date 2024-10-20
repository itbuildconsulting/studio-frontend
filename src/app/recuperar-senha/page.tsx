'use client'

import styles from '../../styles/login.module.css';
import AuthInput from "@/components/auth/AuthInput";
import { Key, useState } from "react";
import Link from "next/link";
import AuthDefault from "@/components/template/auth";

export default function RecoverPassword() {
    const [email, setEmail] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string[]>([]);

    const handleSubmit = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    }

    return (
        <AuthDefault>
            <div className={`${styles.form_login}`}>
                <div className="w-full">
                    <div>
                        <h2>Recuperar senha</h2>
                        <p className={`${styles.subtitle_login}`}>Digite seu endereço de e-mail para receber um link de redefinição de senha</p>
                    </div>
                    <div className="mt-8">
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
                                    <button type="submit" className="btn-primary" onClick={handleSubmit}>Enviar</button>
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
                    </div>
                </div>
            </div>
        </AuthDefault>
    )
}