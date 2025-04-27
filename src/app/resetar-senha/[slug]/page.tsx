'use client'

import styles from '../../../styles/login.module.css';
import AuthInput from "@/components/auth/AuthInput";
import { Key, useEffect, useState } from "react";
import Link from "next/link";
import AuthDefault from "@/components/template/auth";
import useAuthData from '@/data/hooks/useAuthData';
import { useParams } from 'next/navigation';

export default function ResetPassword() {
    const { slug } = useParams();
    const { resetPassword, loginError, msgError, load } = useAuthData();

    const [password, setPassword] = useState<string>('');
    const [, setError] = useState<string[]>(['']);

    // Password Control
    var regex = /^(?=.*[a-z]{1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    var regexLetter = /^(?=.*[A-Za-z]{1})/;
    var regexNumber = /^(?=.*\d)/;
    var regexSymble = /^(?=.*[@$!%*#?&])/;

    const [passwordValidation, setPasswordValidation] = useState<boolean>(false); ///usado nos atributos "isValid" e "isInvald" dos inputs

    const [passwordStr, setPasswordStr] = useState<any>(0);
    const [passwordStrColor, setPasswordStrColor] = useState<any>('#ccc');
    const [passwordStrText, setPasswordStrText] = useState<any>('');

    const handleSubmit = async () => {
        if (resetPassword) {
            try {
                await resetPassword(password, String(slug));
            } catch (e) {
                setError(['Erro desconhecido - Entre em contato com o Suporte']);
                //showErro('Erro desconhecido');
            }
        } else {
            setError(['Erro desconhecido - Entre em contato com o Suporte']);
            //showErro('Erro desconhecido');
        }
    }

    const passwordStrength = () => {
        return (
            <div
                className={`grid grid-cols-12`}
                style={{
                    gap: "5px",
                    position: 'relative',
                    top: '-1rem'
                }}
            >
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 1 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 2 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 3 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 4 ? passwordStrColor : ''}`,
                    }}
                ></div>
            </div>
        );
    };

    function Validation() {
        var strength: any = 0;

        if (regexNumber.exec(password)) {
            strength += 1;
        }

        if (regexSymble.exec(password)) {
            strength += 1;
        }

        if (regexLetter.exec(password)) {
            strength += 1;
        }

        if (!regex.exec(password)) {
            setPasswordValidation(false);
        } else {
            strength = 4;
            setPasswordValidation(true);
        }

        if (strength === 0) {
            setPasswordStrColor('#ccc');
            setPasswordStrText('');
        } else if (strength === 1) {
            setPasswordStrColor('red');
            setPasswordStrText('Senha Fraca');
        } else if (strength === 2 || strength === 3) {
            setPasswordStrColor('#e0e00d');
            setPasswordStrText('Senha Média');
        } else {
            setPasswordStrColor('green');
            setPasswordStrText('Senha Forte');
        }

        setPasswordStr(strength);

        return true;
    };

    useEffect(() => {
        Validation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password])

    return (
        <AuthDefault>
            <div className={`${styles.form_login}`}>
                <div className="w-full">
                    <div>
                        <h2>Resetar senha</h2>
                        <p className={`${styles.subtitle_login}`}>Escolha uma nova senha para a sua conta</p>
                    </div>
                    <form className="mt-8" action={() => handleSubmit()}>
                        <div>
                            <AuthInput
                                label="Nova Senha"
                                value={password}
                                type='password'
                                changeValue={setPassword}
                                tooltipMessage={"Use oito ou mais caracteres com uma combinação de letras, números e símbolos"}
                                required
                            />
                            {passwordStrength()}
                            <div
                                className="flex justify-center"
                                style={{ color: `${passwordStrColor}`, position: 'relative', top: '-1rem' }}
                            >
                                {passwordStrText}
                            </div>
                        </div>
                        <div>
                            {
                                load
                                    ?
                                    <button className="btn-primary">
                                        <div className="load" />
                                    </button>
                                    :
                                    <button type="submit" className="btn-primary">Resetar</button>
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