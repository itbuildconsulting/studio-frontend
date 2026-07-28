import { redirect } from 'next/navigation';

// Rota legada: os e-mails antigos apontavam para cá enquanto a página real
// vivia em /verify. Mantida apenas para não quebrar links já enviados.
export default async function LegacyVerifyRedirect({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  redirect(token ? `/verify?token=${encodeURIComponent(token)}` : '/verify');
}
