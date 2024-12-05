import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
    let config = {};
    const token = Cookies.get('admin-user-sci-auth');

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

        if (resp.status === 201) { // Created
            const authResp: any = await resp.json();
            return authResp.data;
        } else if (resp.status === 200) { // List
            const authResp: any = await resp.json();
            return authResp;
        } else {
            const error = await resp?.json();
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        return error;
    }
}

export default class ProductTypeRepository implements ProductTypeRepository {
    async create(
        name: string | null,
        placeId: number | null,
        active: boolean
    ): Promise<[]> {
        const req: any = {
            name,
            placeId,
            active
        };
        return conectAPI(req, "/productTypes", "POST");
    }

    async list(): Promise<[]> {
        return conectAPI(null, "/productTypes", "GET");
    }

    async details(id: number): Promise<[]> {
        return conectAPI(null, `/productTypes/${id}`, "GET");
    }

    async edit(
        name: string | null,
        placeId: number | null,
        active: boolean,
        id: number
    ): Promise<[]> {
        const req: any = {
            name,
            placeId,
            active
        };
        return conectAPI(req, `/productTypes/${id}`, "PUT");
    }

    async delete(id: number): Promise<[]> {
        return conectAPI(null, `/productTypes/${id}`, "DELETE");
    }
}
