"use client";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { CookiesAuth } from '@/shared/enum';

interface DecodedToken {
  userId: number;
  employee_level: string; // ou outro tipo, dependendo de como você armazena o nível
  exp: number;
}

export function checkUserLevel(requiredLevel: string): boolean {
    // Obtém o token do cookie ou localStorage
    const token = Cookies.get(CookiesAuth.USERTOKEN); // ou `localStorage.getItem('token')`

    

    if (!token) {
        return false; // Se não houver token, retorna false
    }

    try {
        // Decodifica o token
        const decoded: DecodedToken = jwtDecode(token);

        // Verifica se o nível do usuário corresponde ao nível necessário
        if (decoded.employee_level === requiredLevel) {
            return true; // Nível corresponde
        }

        return false; // Nível não corresponde
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return false; // Se ocorrer algum erro, retorna false
    }
}
