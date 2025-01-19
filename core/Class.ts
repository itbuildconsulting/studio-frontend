import Cookies from 'js-cookie';

import { ClassFilterType, ClassType } from '@/types/class';

async function conectAPI(req: object | null, url: string, method: string) {
    const token = Cookies.get('admin-user-sci-auth');
    let config = {};

    if (req === null) {
        config = {
            method,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        };
    } else {
        config = {
            method,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(req),
        };
    }

    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`,
            config
        );

        if (resp.status === 201 || resp.status === 200) {
            const authResp = await resp.json();

            return authResp;
        } else {
            const error = await resp?.json();
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        return error;
    }
}

export default class ClassRepository implements ClassRepository {
    async create (
        date: string | null,
        time: string | null,
        teacherId: string | null,
        limit: number,
        hasCommission: boolean,
        kickback: number | null,
        kickbackRule: string,
        productTypeId: string | null,
        students: string[],
        active: boolean
    ): Promise<[]> {
        const req = {
            date,
            time,
            teacherId,
            limit,
            hasCommission,
            kickback,
            kickbackRule,
            productTypeId,
            students,
            active
        };
        return conectAPI(req, "/class", "POST");
    }

    async listClass (
        date: string | null,
        time: string | null,
        teacherId: string | null,
        productTypeId: string | null,
    ): Promise<[]> {
        const req = {
            date,
            time,
            teacherId,           
            productTypeId,
        };
        return conectAPI(req, "/class/filter", "POST");
    }

    async details (id: number): Promise<[]> {
        return conectAPI(null, `/class/${id}`, "GET");
    }


    async edit (
        id: number | null,
        date: string | null,
        time: string | null,
        teacherId: string | null,
        limit: number | null,
        hasCommission: boolean | null,
        kickback: number | null,
        kickbackRule: string | null,
        productTypeId: string | null,
        bikes: string[] | null,
        active: boolean
    ): Promise<[]> {
        const req = {
            id,
            date,
            time,
            teacherId,
            limit,
            hasCommission,
            kickback,
            kickbackRule,
            productTypeId,
            bikes,
            active
        };
        return conectAPI(req, `/class/${id}`, "PUT");
    }
}
