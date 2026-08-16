import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
    const token = Cookies.get('admin-user-sci-auth');
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        ...(req !== null ? { body: JSON.stringify(req) } : {}),
    };

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`, config);

        if (resp.status === 201) {
            const json = await resp.json();
            return json.data;
        } else if (resp.status === 200) {
            return await resp.json();
        } else {
            const error = await resp.json();
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        return error;
    }
}

export default class CouponRepository {
    async list(): Promise<any> {
        return conectAPI(null, '/coupons', 'GET');
    }

    async details(id: number): Promise<any> {
        return conectAPI(null, `/coupons/${id}`, 'GET');
    }

    async create(
        code: string,
        type: 'percent' | 'fixed',
        value: number,
        expiresAt: string | null,
        maxUses: number | null,
        maxUsesPerStudent: number,
    ): Promise<any> {
        return conectAPI({ code, type, value, expiresAt, maxUses, maxUsesPerStudent }, '/coupons', 'POST');
    }

    async edit(
        id: number,
        code: string,
        type: 'percent' | 'fixed',
        value: number,
        expiresAt: string | null,
        maxUses: number | null,
        maxUsesPerStudent: number,
        active: boolean,
    ): Promise<any> {
        return conectAPI({ code, type, value, expiresAt, maxUses, maxUsesPerStudent, active }, `/coupons/${id}`, 'PUT');
    }

    async toggleActive(id: number, active: boolean): Promise<any> {
        return conectAPI({ active }, `/coupons/${id}`, 'PUT');
    }

    async delete(id: number): Promise<any> {
        return conectAPI(null, `/coupons/${id}`, 'DELETE');
    }
}
