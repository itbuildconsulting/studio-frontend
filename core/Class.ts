import Cookies from 'js-cookie';

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
        const resp: any = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`,
            config
        );

        if (resp.status === 201) {
            const authResp: any = await resp.json();

            return authResp.data;
        } else {
            const error = await resp.json();
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        return error;
    }
}

export default class ClassRepository implements ClassRepository {
    async create(
        date: string,
        time: string,
        teacherId: string,
        limit: number,
        hasCommission: boolean,
        kickback: number | null,
        kickbackRule: string,
        productId: string | null,
        students: number[] | string[],
        active: boolean
    ): Promise<[]> {
        const req: any = {
            date,
            time,
            teacherId,
            limit,
            hasCommission,
            kickback,
            kickbackRule,
            productId,
            students,
            active
        };
        return conectAPI(req, "/class", "POST");
    }

    async edit(
        id: number | null,
        date: string,
        time: string,
        teacherId: string,
        limit: number,
        hasCommission: boolean,
        kickback: number | null,
        kickbackRule: string,
        productId: string | null,
        students: number[] | string[],
        active: boolean
    ): Promise<[]> {
        const req: any = {
            id,
            date,
            time,
            teacherId,
            limit,
            hasCommission,
            kickback,
            kickbackRule,
            productId,
            students,
            active
        };
        return conectAPI(req, `/class/${id}`, "PUT");
    }
}
