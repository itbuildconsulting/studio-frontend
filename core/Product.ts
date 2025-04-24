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
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`,
            config
        );

        if (resp.status === 201) { // Created
            const authResp = await resp.json();
            return authResp.data;
        } else if (resp.status === 200) { // List
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

export default class ProductRepository implements ProductRepository {
    async create(
        name: string | null,
        credit: number | null,
        validateDate: number | null,
        value: number | null,
        productTypeId: number | null,
        placeId: number | null,
        active: boolean
    ): Promise<[]> {
        const req = {
            name,
            credit,
            validateDate,
            value,
            productTypeId,
            placeId,
            active
        };
        return conectAPI(req, "/products", "POST");
    }

    async list(page: number): Promise<[]> {
        return conectAPI(null, `/products?page=${page}`, "GET");
    }

    async listFiltered(page: number, productTypeId: string | null): Promise<[]> {
        return conectAPI(null, `/products/filtered?page=${page}&pageSize=10&productTypeId=${productTypeId}`, "GET");
    }

    async details(id: number): Promise<[]> {
        return conectAPI(null, `/products/${id}`, "GET");
    }

    async edit(
        id: number | null,
        name: string | null,
        credit: number | null,
        validateDate: number | null,
        value: number | null,
        productTypeId: number | null,
        placeId: number | null,
        active: boolean
    ): Promise<[]> {
        const req = {
            name,
            credit,
            validateDate,
            value,
            productTypeId,
            placeId,
            active
        };
        return conectAPI(req, `/products/${id}`, "PUT");
    }

    async delete(id: number): Promise<[]> {
        return conectAPI(null, `/products/${id}`, "DELETE");
    }
}
