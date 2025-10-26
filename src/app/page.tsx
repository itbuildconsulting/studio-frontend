'use client'

import AuthInput from "@/components/auth/AuthInput";
import styles from '../styles/login.module.css';
import { useState, Key, FormEvent } from "react";
import Link from "next/link";
import useAuthData from '../data/hooks/useAuthData';
import AuthDefault from "@/components/template/auth";

export default function Auth() {
  const { login, loginError, msgError, load } = useAuthData();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Previne o reload da página
    
    if (login) {
      await login(username, password);
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
          
          {/* MUDANÇA AQUI: onSubmit ao invés de action */}
          <form className="mt-8" onSubmit={handleSubmit}>
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
              {load ? (
                <button 
                  type="submit" 
                  className="btn-primary btn-custom"
                  disabled
                >
                  <div className="load" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary btn-custom"
                >
                  Entrar
                </button>
              )}
            </div>
            
            {loginError && msgError?.map((err: string, index: Key) => (
              <div className={`error-message`} key={index}>
                <span className='ml-2 text-sm'>{err}</span>
              </div>
            ))}
            
            <div className="px-8">
              <hr className="my-8" />
              <p className={`${styles.forgotPassword_login}`}>
                Você esqueceu sua senha? <Link href={"/recuperar-senha"}>Recuperar senha</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthDefault>
  );
}