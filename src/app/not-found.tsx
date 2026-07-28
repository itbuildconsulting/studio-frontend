'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../../public/images/spingo.png';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 py-5">
        <Link href="/dashboard" aria-label="Ir para o início">
          <Image src={Logo} alt="Logo Studio Raphael Oliveira" width={120} priority />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 sm:p-10 text-center shadow-sm">
          <p
            className="text-7xl sm:text-8xl font-extrabold tracking-tight text-primary leading-none"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">Página não encontrada</h1>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            O endereço que você abriu não existe ou foi movido. Confira o link e tente novamente.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => router.back()} className="btn-outline-primary h-11 flex-1">
              Voltar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
