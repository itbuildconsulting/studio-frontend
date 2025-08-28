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

export default class configRepository implements configRepository {
    async create(
        configKey: string | null,
        configValue: string | null,
        description: string | null
    ): Promise<[]> {
        const req = {
            configKey,
            configValue,
            description
        };
        return conectAPI(req, "/config/create", "POST");
    }

    async list(): Promise<[]> {
        return conectAPI(null, "/config/read", "GET");
    }

    async edit(
        configKey: string | null,
        configValue: string | null,
        description: string | null,
        id: number
    ): Promise<[]> {
        const req = {
            configKey,
            configValue,
            description,
            id
        };
        return conectAPI(req, `/config/update/`, "POST");
    }

    async delete(
        configKey: string
    ): Promise<[]> {
        return conectAPI(null, `/config/delete/${configKey}`, "GET");
    }
}
