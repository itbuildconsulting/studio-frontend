'use client';

import { ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { CookiesAuth } from '@/shared/enum';

interface PrivateRouteProps {
    children: ReactNode;
}

interface DecodedToken {
    userId: number;
    level: string;
    exp: number;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // Obtém o token do cookie
    const token = Cookies.get(CookiesAuth.USERTOKEN);

    useEffect(() => {
        const checkAuth = () => {
            if (!token) {
                // Se não houver token, redireciona para a página de login
                console.log('Usuário não autenticado, redirecionando...');
                router.push('/');
                return;
            }

            try {
                // Decodifica o token
                const decoded: DecodedToken = jwtDecode(token);

                // Verifica o nível do usuário
                const userLevel = decoded.level;

                // Exemplo de restrição de acesso: impedir que um funcionário acesse qualquer página, exceto a de aula
                if (userLevel === '2' && !pathname.startsWith('/aula')) {
                    router.push('/aulas');
                    return;
                }

                if (userLevel === '3' && !pathname.startsWith('/estatisticas')) {
                    router.push('/estatisticas');
                    return;
                }

                // Se for outro nível (por exemplo, administrador), permite o acesso
                // Se necessário, adicione mais verificações de permissões aqui
            } catch (error) {
                console.error('Erro ao decodificar o token', error);
                router.push('/'); // Se o token for inválido, redireciona para a página de login
            }
        };

        if(!pathname.startsWith('/recuperar-senha')){
            checkAuth();
        }
    }, [pathname, router, token]);  // Dependências: pathname, router e token

    return <>{children}</>;
};
