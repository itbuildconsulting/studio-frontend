'use client'

import React, { createContext, ReactNode, useState } from 'react';
import Cookies from 'js-cookie';

import { useRouter } from "next/navigation";
import { UserAuth } from '@/types/auth';
import { CookiesAuth } from '@/shared/enum';
interface AuthContextProps<> {
    user?: UserAuth | null | undefined,
    load?: boolean,
    loginError?: boolean,
    msgError?: string[],
    login?: (email: string, senha: string) => void,
    recoverPassword?: ((email: string) => void) | undefined,
    resetPassword?: ((password: string) => void) | undefined,
    logout?: () => void
}

const AuthContext = createContext<AuthContextProps>({});

function managementCookie({logado, expiresIn, token, name }: UserAuth) {
    const data = new Date(expiresIn);

    if (logado) {
        Cookies.set(CookiesAuth.USERLOGADO, String(logado), {
            expires: data
        });
        Cookies.set(CookiesAuth.USERTOKEN, String(token), {
            expires: data
        });
        Cookies.set(CookiesAuth.USERNAME, String(name), {
            expires: data
        })
    } else {
        Cookies.remove(CookiesAuth.USERLOGADO);
        Cookies.remove(CookiesAuth.USERTOKEN);
        Cookies.remove(CookiesAuth.USERNAME);
    }
}

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState<UserAuth | null | undefined>();
    const [loginError, setLoginError] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string[]>([]);

    const router = useRouter();

    function showErro(msg: string, time = 5) {
        setMsgError([msg]);
        setLoginError(true);
        setTimeout(() => {setMsgError([]); setLoginError(false)}, time * 1000)
    }

    async function sessionConfig(sistemUser: UserAuth) {
        if (sistemUser?.token) {
            setUser({ logado: true, expiresIn: sistemUser?.expiresIn, token: sistemUser?.token, name: sistemUser?.name});
            managementCookie({ logado: true, expiresIn: sistemUser?.expiresIn, token: sistemUser?.token, name: sistemUser?.name});
            setLoad(false);
        } else {
            setUser(null);
            managementCookie({ logado: false, expiresIn: '', token: '', name: ''});
            setLoad(false);
            return false
        }
    }

    async function login(email: string, password: string) {
        setLoad(true);

        const req = {
            "email": email,
            "password": password
        }

        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req),
                }
            );
            if (resp.status === 200) {
                router.push("/dashboard");

                const authResp = await resp.json();
                await sessionConfig(authResp);
                setLoad(false);
            } else if (resp.status === 500) {
                setLoad(false);
                showErro('Erro desconhecido - Entre em contato com o Suporte');
            } else {
                setLoad(false);
                const authResp = await resp.json();
                showErro(authResp.error);
            }
        } catch {
            setLoad(false);
            showErro('Erro desconhecido - Entre em contato com o Suporte');
        } finally {
            setLoad(false);
            return true;
        }
    }

    async function recoverPassword(email: string) {
        setLoad(true);

        const req = {
            "email": email
        }

        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/request-reset`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req),
                }
            );
            
            if (resp.status === 200) {
                setLoad(false);
                const authResp = await resp.json();
            } else if (resp.status === 500) {
                setLoad(false);
                showErro('Erro desconhecido - Entre em contato com o Suporte');
            } else {
                setLoad(false);
                const authResp = await resp.json();
                showErro(authResp.error);
            }
        } catch {
            setLoad(false);
            showErro('Erro desconhecido - Entre em contato com o Suporte');
        } finally {
            setLoad(false);
            return true;
        }
    }
    async function resetPassword(password: string) {
        setLoad(true);

        const req = {
            "password": password
        }

        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/reset`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req),
                }
            );
            
            if (resp.status === 200) {
                setLoad(false);
                const authResp = await resp.json();
            } else if (resp.status === 500) {
                setLoad(false);
                showErro('Erro desconhecido - Entre em contato com o Suporte');
            } else {
                setLoad(false);
                const authResp = await resp.json();
                showErro(authResp.error);
            }
        } catch {
            setLoad(false);
            showErro('Erro desconhecido - Entre em contato com o Suporte');
        } finally {
            setLoad(false);
            return true;
        }
    }

    async function logout() {
        Cookies.remove(CookiesAuth.USERLOGADO);
        Cookies.remove(CookiesAuth.USERTOKEN);
        Cookies.remove(CookiesAuth.USERNAME);
        
        try {
            setLoad(true)
            return 'Test';
        } finally {
            setLoad(false)
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            load,
            loginError,
            msgError,
            login,
            recoverPassword,
            resetPassword,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext