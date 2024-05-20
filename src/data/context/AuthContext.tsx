import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import User from '../../model/User'
import Router from 'next/router'
import { stringify } from 'querystring'

interface AuthContextProps {
    user?: User | null | undefined,
    load?: boolean,
    loginError?: boolean,
    msgError?: Array<{}>,
    login?: (email: string, senha: string) => Promise<any>,
    cadastrar?: ((email: string, senha: string) => Promise<any>) | undefined,
    logout?: () => Promise<any>
}

const AuthContext = createContext<AuthContextProps>({});

function managementCookie(logado: boolean, expireAt: string, token: string) {

    const dataString = expireAt;
    const partes = dataString.split('T')[0].split('-');
    const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Os meses em JavaScript são base 0 (0 - janeiro, 1 - fevereiro, etc.)
    const dia = parseInt(partes[2]);

    const data = new Date(expireAt);

    if (logado) {
        Cookies.set('admin-template-sci-auth', String(logado), {
            expires: data
        })
        Cookies.set('admin-user-sci-auth', String(token), {
            expires: data
        })
    } else {
        Cookies.remove('admin-template-sci-auth')
    }
}


export function AuthProvider(props: any) {
    const [load, setLoad] = useState(true);
    const [user, setUser] = useState<User | null | undefined>();
    const [loginError, setLoginError] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<Array<{}>>([]);

    async function sessionConfig(sistemUser: any) {
        if (sistemUser?.token) {
            //const user = await normalizeUser(firebaseUser)
            setUser(user);
            managementCookie(true, sistemUser?.expireAt, sistemUser?.token);
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
        const req: any = {
            "email": email,
            "password": password
        }

        try {
            const resp: any = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                }
            );
            setLoad(true)
            if (resp.status === 200) {
                const authResp: any = await resp.json();

                console.log(authResp.data)
                await sessionConfig(authResp.data);
                perfil(authResp.data.token)

            } else if (resp.status === 500) {
                setLoginError(true);
                setMsgError(['Erro desconhecido - Entre em contato com o Suporte']);
            } else {
                setLoginError(true);
                const authResp: any = await resp.json();
                setMsgError(authResp.errors)
            }
        } catch {
            setLoad(false);
            setLoginError(true);
            setMsgError(['Erro desconhecido - Entre em contato com o Suporte']);
        } finally {
            setLoad(false);
            return true;
        }
    }

    async function perfil(token: string) {

        const config = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        };

        try {
            const resp: any = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL_API}/auth/profile`,
                config
            );
            setLoad(true)
            if (resp.status === 200) {
                const authResp: any = await resp.json();

                console.log(authResp.data)

                Cookies.set('admin-user-sci-info', JSON.stringify(authResp.data), {
                    expires: 1
                })
                console.log('AQUIII')
                Router.push('/construcao');

            } else {
                setLoginError(true);
                const authResp: any = await resp.json();
                setMsgError(authResp.errors)
            }

        } finally {
            setLoad(false);
            return true;
        }


    }

    async function cadastrar(email: string, password: string) {
        try {
            setLoad(true)
            //const resp = await firebase.auth().createUserWithEmailAndPassword(email, password)
            //await sessionConfig(resp.user);
            Router.push('/construcao')
        } finally {
            setLoad(false)
            return true;
        }
    }

    async function logout() {
        try {
            setLoad(true)
            //await firebase.auth().signOut()
            //await sessionConfig(null)
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
            cadastrar,
            logout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext