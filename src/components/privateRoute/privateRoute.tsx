'use client';

import { ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { CookiesAuth } from '@/shared/enum';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const userName: string | undefined = Cookies.get(CookiesAuth.USERTOKEN);

    useEffect(() => {
        const checkAuth = () => {
            if (!userName && pathname !== "/") {
                console.log('Usuário não autenticado, redirecionando...');
                router.push('/');
            }
        };

        checkAuth();
    }, [pathname, router, userName]);

    return <>{children}</>;
};