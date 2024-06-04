async function conectAPI(req: object | null, url: string, method: string) {
    let config = {};

    if (req === null) {
        config = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };
    } else {
        config = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        };
    }

    try {
        const resp: any = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`,
            config
        );

        if (resp.status === 200) {
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
        name: string,
        limit: number,
        income: number,
        date: string,
        config: string,
        kickback: number,
        kickbackRule: string,
        active: boolean
    ): Promise<[]> {
        const req: any = {
            name,
            limit,
            income,
            date,
            config,
            kickback,
            kickbackRule,
            active
        };
        return conectAPI(req, "/class", "POST");
    }
}
