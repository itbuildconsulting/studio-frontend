import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';
import User from '../../model/User';

import { useRouter } from "next/navigation";

interface AuthContextProps<> {
    user?: User | null | undefined,
    load?: boolean,
    loginError?: boolean,
    msgError?: string[],
    login?: (email: string, senha: string) => Promise<any>,
    recoverPassword?: ((email: string) => Promise<any>) | undefined,
    resetPassword?: ((password: string) => Promise<any>) | undefined,
    logout?: () => Promise<any>
}

const AuthContext = createContext<AuthContextProps>({});

function managementCookie(logado: boolean, expireAt: string, token: string) {

    //const dataString = expireAt;
    //const partes = dataString.split('T')[0].split('-');
    /* const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; 
    const dia = parseInt(partes[2]); */

    const data = new Date(expireAt);

    if (logado) {
        Cookies.set('admin-template-sci-auth', String(logado), {
            expires: data
        })
        Cookies.set('admin-user-sci-auth', String(token), {
            expires: data
        })
    } else {
        Cookies.remove('admin-template-sci-auth');
    }
}

export function AuthProvider(props: any) {
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState<User | null | undefined>();
    const [loginError, setLoginError] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string[]>([]);

    const router = useRouter();

    function showErro(msg: string, time = 5) {
        setMsgError([msg]);
        setLoginError(true);
        setTimeout(() => {setMsgError([]); setLoginError(false)}, time * 1000)
    }

    async function sessionConfig(sistemUser: any) {
        if (sistemUser?.token) {
            //const user = await normalizeUser(firebaseUser)
            setUser(user);
            managementCookie(true, sistemUser?.expiresIn, sistemUser?.token);
            setLoad(false);
            //return user.email
        } else {
            setUser(null);
            managementCookie(false, '', '');
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
                console.log(authResp)
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
                console.log(authResp)
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
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext