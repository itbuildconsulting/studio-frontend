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
    resetPassword?: ((password: string, token: string) => void) | undefined,
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
        email,
        password
    };

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req),
        });

        if (resp.status === 200) {
            const authResp = await resp.json();

            await sessionConfig(authResp);

            if (authResp.level == "2") {
                router.push("/aulas");
            } else {
                router.push("/dashboard");
            }

        } else {
            const errorResp = await resp.json();
            showErro(errorResp?.error || 'Erro desconhecido');

            await sendMonitoringLog({
                email,
                message: `Erro na autenticação: ${errorResp?.error}`,
            });
        }
    } catch (error) {
        showErro('Erro desconhecido - Entre em contato com o Suporte');

        await sendMonitoringLog({
            email,
            message: `Falha no fetch de login: ${error}`,
        });
    } finally {
        setLoad(false);
        return true;
    }
}

    async function sendMonitoringLog(params: any) {
        try {
            await fetch('http://localhost:3014/log/monitoring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 500,
                    level: "Auth",
                    sublevel: "Login",
                    message: "Erro no login",
                    bookingLoc: "",
                    uniqueId: generateUID(), // você pode gerar algo como uuid
                    applicationId: "Admin",
                    apiEndpoint: "api/login",
                    boxId: "MU000901",
                    paternId: "Studio",
                    bodyInfo: JSON.stringify(params),
                    timestamp: Date.now()
                }),
            });
        } catch (e) {
            console.warn("Falha ao enviar log de monitoramento:", e);
        }
    }

    function generateUID() {
        return Math.random().toString(36).substring(2, 18);
    }

    async function recoverPassword(email: string) {
        setLoad(true);

        const req = {
            "email": email
        }

        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/password/request-reset`,
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
    async function resetPassword(password: string, token: string) {
        setLoad(true);

        const req = {
            "newPassword": password,
            "token": token
        }

        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/password/reset`,
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