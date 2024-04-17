'use client'

import Image from "next/image";
import AuthInput from "@/components/auth/AuthInput";

import LogoStudio from "../../public/images/logo_studio.png";

import styles from '../styles/login.module.css';
import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const onSubmit = () => {
    router.push("/dashboard");
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
                    type='text'
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
                  <button className="btn-primary" onClick={() => onSubmit()}>Entrar</button>
                </div>
                <div className="px-8">
                  <hr className="my-8"/>
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