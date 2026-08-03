'use client'

import AuthInput from "@/components/auth/AuthInput";
import styles from '../styles/login.module.css';
import { useState, useEffect, Key, FormEvent } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import useAuthData from '../data/hooks/useAuthData';
import AuthDefault from "@/components/template/auth";
import { CookiesAuth } from "@/shared/enum";

export default function Auth() {
  const { login, loginError, msgError, load } = useAuthData();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberEmail, setRememberEmail] = useState<boolean>(false);

  useEffect(() => {
    const savedEmail = Cookies.get(CookiesAuth.REMEMBEREMAIL);

    if (savedEmail) {
      setUsername(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Previne o reload da página

    if (rememberEmail) {
      Cookies.set(CookiesAuth.REMEMBEREMAIL, username, { expires: 30 });
    } else {
      Cookies.remove(CookiesAuth.REMEMBEREMAIL);
    }

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
            <div className="flex items-center gap-2 mb-4">
              <input
                id="rememberEmail"
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="rememberEmail" className="text-sm cursor-pointer select-none">
                Lembrar meu e-mail
              </label>
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