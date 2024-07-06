'use client'

import Image from "next/image";
import AuthInput from "@/components/auth/AuthInput";

import LogoStudio from "../../public/images/logo_studio.png";

import styles from '../styles/login.module.css';
import { useState, Key } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import useAuthData from '../data/hooks/useAuthData';

export default function Auth() {
  const { login, loginError, msgError } = useAuthData();

  const [error, setError] = useState<any>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  function showErro(msg: string, time = 5) {
    setError(msg);
    setTimeout(() => setError(null), time * 1000)

  }

  async function handleSubmit() {
    console.log('Aquiii')
    if (login) {
      try {
        await login(username, password);
      } catch (e) {
        setError(['Erro desconhecido - Entre em contato com o Suporte']);
        showErro('Erro desconhecido');
      }
    } else {
      setError(['Erro desconhecido - Entre em contato com o Suporte']);
      showErro('Erro desconhecido');
    }
  }

  return (
    <main className="bg-white h-screen py-6">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-12 lg:col-span-6 px-6 lg:px-0 lg:pl-6">
          <div className={`${styles.bg_login}`}>
            <Image src={LogoStudio} alt={"Logo Studio Raphael Oliveira"} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
          <div className={`${styles.form_login}`}>
            <div className="w-full">
              <div>
                <h2>Bem-vindo!</h2>
                <p className={`${styles.subtitle_login}`}>Entre com seus dados, para fazer login</p>
              </div>
              <div className="mt-8">
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
                  <button className="btn-primary" onClick={handleSubmit}>Entrar</button>
                </div>
                {loginError ? (

                  msgError?.map((err: any, index: Key) => (
                    <div className={` 
              bg-red-400 text-white py-1 px-2 my-3 
              border border-red-500 rounded-md
              flex flex-row items-center
              `} key={index}>
                      {/* {IconWarning} */}
                      <span className='ml-2 text-sm'>{err}</span>
                    </div>
                  ))


                ) :
                  false
                }
                <div className="px-8">
                  <hr className="my-8" />
                  <p className={`${styles.forgotPassword_login}`}>Você esqueceu sua senha? <Link href={"#"}>Recuperar senha</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}