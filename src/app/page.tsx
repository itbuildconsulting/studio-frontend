'use client'

import AuthInput from "@/components/auth/AuthInput";

import styles from '../styles/login.module.css';
import { useState, Key } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import useAuthData from '../data/hooks/useAuthData';
import AuthDefault from "@/components/template/auth";

export default function Auth() {
  const { login, loginError, msgError, load } = useAuthData();

  const [error, setError] = useState<any>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  async function handleSubmit() {
    if (login) {
      try {
        await login(username, password);
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
            <h2>Bem-vindo!</h2>
            <p className={`${styles.subtitle_login}`}>Entre com seus dados, para fazer login</p>
          </div>
          <form className="mt-8" action={() => handleSubmit()}>
            <div>
              <AuthInput
                label="Usuário"
                value={username}
                type='email'
                maxLength={60}
                changeValue={setUsername}
                required
              />
            </div>
            <div>
              <AuthInput
                label="Senha"
                value={password}
                type='password'
                changeValue={setPassword}
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
                  <button className="btn-primary">Entrar</button>
              }
            </div>
            {loginError ? (
              msgError?.map((err: any, index: Key) => (
                <div className={`error-message`} key={index}>
                  {/* {IconWarning} */}
                  <span className='ml-2 text-sm'>{err}</span>
                </div>
              ))
            ) :
              false
            }
            <div className="px-8">
              <hr className="my-8" />
              <p className={`${styles.forgotPassword_login}`}>Você esqueceu sua senha? <Link href={"/recuperar-senha"}>Recuperar senha</Link></p>
            </div>
          </form>
        </div>
      </div>
    </AuthDefault>
  );
}