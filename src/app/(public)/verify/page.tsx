'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthDefault from '@/components/template/auth';
import styles from '@/styles/login.module.css';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_API || 'https://backend.spingo.com.br';
const APP_DEEP_LINK = 'spingo://auth';
const APP_WEB_URL = 'https://app.spingo.com.br/auth';

type Status = 'loading' | 'success' | 'expired' | 'error';

interface VerifyState {
  status: Status;
  message: string;
  userName?: string;
  email?: string;
  authToken?: string;
  alreadyVerified?: boolean;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>({
    status: 'loading',
    message: 'Confirmando seu e-mail...',
  });
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // O React 18 monta duas vezes em dev; sem isso a verificação dispara em duplicado
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    if (!token) {
      setState({
        status: 'error',
        message: 'O link está incompleto. Abra o e-mail e clique no botão novamente.',
      });
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          setState({
            status: 'success',
            message: data.alreadyVerified
              ? 'Sua conta já estava confirmada.'
              : 'Seu acesso foi verificado com sucesso.',
            userName: data.name,
            email: data.email,
            authToken: data.token,
            alreadyVerified: data.alreadyVerified,
          });
          return;
        }

        if (data.reason === 'expired') {
          setState({
            status: 'expired',
            message: 'Este link expirou. Podemos enviar um novo para você.',
            email: data.email ?? undefined,
          });
          return;
        }

        setState({
          status: 'error',
          message: data.error || 'Não foi possível confirmar seu e-mail.',
        });
      } catch {
        setState({
          status: 'error',
          message: 'Não conseguimos falar com o servidor. Verifique sua conexão e tente novamente.',
        });
      }
    };

    verify();
  }, [token]);

  const handleResend = useCallback(async () => {
    if (!state.email) return;

    setResendState('sending');
    try {
      const response = await fetch(`${API_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email }),
      });

      setResendState(response.ok ? 'sent' : 'error');
    } catch {
      setResendState('error');
    }
  }, [state.email]);

  const handleOpenApp = useCallback(() => {
    if (!state.authToken) return;

    const encoded = encodeURIComponent(state.authToken);
    window.location.href = `${APP_DEEP_LINK}?token=${encoded}`;

    // Se o app não estiver instalado o deep link não sai do lugar: caímos na web
    setTimeout(() => {
      window.location.href = `${APP_WEB_URL}?token=${encoded}`;
    }, 2000);
  }, [state.authToken]);

  if (state.status === 'loading') {
    return (
      <div className={`${styles.form_login}`}>
        <div className="w-full text-center">
          <div className="mb-8 inline-block">
            <div className="load" />
          </div>
          <h2>Confirmando...</h2>
          <p className={`${styles.subtitle_login}`}>{state.message}</p>
        </div>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className={`${styles.form_login}`}>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>{state.alreadyVerified ? 'Conta já confirmada' : 'Conta confirmada!'}</h2>
            <p className={`${styles.subtitle_login}`}>
              {state.userName ? `Olá ${state.userName}, ` : ''}
              {state.message}
            </p>
          </div>

          <div className="space-y-3">
            <button onClick={handleOpenApp} className="btn-primary w-full h-11">
              Abrir aplicativo
            </button>
            <Link href="/" className="btn-outline-primary w-full h-11">
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = state.status === 'expired';

  return (
    <div className={`${styles.form_login}`}>
      <div className="w-full">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isExpired ? 'bg-amber-100' : 'bg-red-100'
            }`}
          >
            <svg
              className={`w-10 h-10 ${isExpired ? 'text-amber-600' : 'text-red-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              {isExpired ? (
                <polyline points="12 6 12 12 16 14" />
              ) : (
                <>
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </>
              )}
            </svg>
          </div>
          <h2>{isExpired ? 'Link expirado' : 'Não foi possível confirmar'}</h2>
          <p className={`${styles.subtitle_login}`}>{state.message}</p>
        </div>

        <div className="space-y-3">
          {isExpired && state.email && resendState !== 'sent' && (
            <button
              onClick={handleResend}
              className="btn-primary w-full h-11"
              disabled={resendState === 'sending'}
            >
              {resendState === 'sending' ? <div className="load" /> : 'Enviar novo link'}
            </button>
          )}

          {resendState === 'sent' && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-sm text-green-800">
              Enviamos um novo link para {state.email}. Confira sua caixa de entrada e o spam.
            </div>
          )}

          {resendState === 'error' && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center text-sm text-red-700">
              Não foi possível reenviar. Tente novamente em instantes.
            </div>
          )}

          <Link href="/" className="btn-outline-primary w-full h-11">
            Voltar para o início
          </Link>
        </div>

        <div className="px-8">
          <hr className="my-8" />
          <p className={`${styles.forgotPassword_login}`}>
            Precisa de ajuda? <a href="mailto:suporte@spingo.com.br">Fale com o suporte</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <AuthDefault>
      <Suspense
        fallback={
          <div className={`${styles.form_login}`}>
            <div className="w-full text-center">
              <div className="mb-8 inline-block">
                <div className="load" />
              </div>
              <h2>Carregando...</h2>
            </div>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </AuthDefault>
  );
}
