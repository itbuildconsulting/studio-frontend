'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthDefault from '@/components/template/auth';
import styles from '@/styles/login.module.css';

interface VerificationState {
  status: 'loading' | 'success' | 'error';
  message: string;
  userName?: string;
  authToken?: string;
}

// Componente separado que usa useSearchParams
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verificando seu email...',
  });

  useEffect(() => {
    if (!token) {
      setState({
        status: 'error',
        message: 'Token de verificação não encontrado.',
      });
      return;
    }

    const verifyEmail = async () => {
      try {
        // Aguarda um pouco para dar feedback visual
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Em produção, fazer chamada real à API
        setState({
          status: 'success',
          message: 'Conta confirmada com sucesso!',
          userName: 'Usuário',
          authToken: token,
        });
      } catch (error) {
        setState({
          status: 'error',
          message: 'Não foi possível verificar seu email. Tente novamente.',
        });
      }
    };

    verifyEmail();
  }, [token]);

  const handleOpenApp = () => {
    const token = state.authToken;
    
    if (!token) {
      console.error('Token não disponível');
      return;
    }

    // Tenta abrir o app via deep link
    window.location.href = `spingo://auth?token=${encodeURIComponent(token)}`;

    // Fallback para web após 2 segundos
    setTimeout(() => {
      window.location.href = `https://app.spingo.com.br/auth?token=${encodeURIComponent(token)}`;
    }, 2000);
  };

  const handleLogout = () => {
    router.push('/');
  };

  // Loading State
  if (state.status === 'loading') {
    return (
      <AuthDefault>
        <div className={`${styles.form_login}`}>
          <div className="w-full text-center">
            <div className="mb-8">
              <div className="inline-block">
                <div className="load"></div>
              </div>
            </div>
            <h2>Verificando...</h2>
            <p className={`${styles.subtitle_login}`}>
              Aguarde enquanto confirmamos seu email.
            </p>
          </div>
        </div>
      </AuthDefault>
    );
  }

  // Error State
  if (state.status === 'error') {
    return (
      <AuthDefault>
        <div className={`${styles.form_login}`}>
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <svg 
                  className="w-10 h-10 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h2>Erro na verificação</h2>
              <p className={`${styles.subtitle_login}`}>{state.message}</p>
            </div>
            
            <div>
              <button 
                onClick={handleLogout} 
                className="btn-primary"
              >
                Voltar para o início
              </button>
            </div>

            <div className="px-8">
              <hr className="my-8" />
              <p className={`${styles.forgotPassword_login}`}>
                Precisa de ajuda? <a href="mailto:suporte@spingo.com.br">Entre em contato</a>
              </p>
            </div>
          </div>
        </div>
      </AuthDefault>
    );
  }

  // Success State
  return (
    <AuthDefault>
      <div className={`${styles.form_login}`}>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg 
                className="w-10 h-10 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Conta confirmada!</h2>
            <p className={`${styles.subtitle_login}`}>
              {state.userName && `Olá ${state.userName}, `}
              Seu acesso foi verificado com sucesso.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleOpenApp} 
              className="btn-primary w-full"
            >
              Abrir Aplicativo
            </button>

            <button 
              onClick={handleLogout} 
              className="btn-outline-primary w-full"
            >
              Sair
            </button>
          </div>

          <div className="px-8">
            <hr className="my-8" />
            <p className={`${styles.forgotPassword_login} text-center`}>
              Link válido por 12 horas
            </p>
          </div>
        </div>
      </div>
    </AuthDefault>
  );
}

// Componente principal exportado com Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <AuthDefault>
        <div className={`${styles.form_login}`}>
          <div className="w-full text-center">
            <div className="mb-8">
              <div className="inline-block">
                <div className="load"></div>
              </div>
            </div>
            <h2>Carregando...</h2>
          </div>
        </div>
      </AuthDefault>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}