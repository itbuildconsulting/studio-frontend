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

export default class PersonsRepository implements PersonsRepository {
    async create(
        name: string | null,
        identity: string | null,
        email: string | null,
        phone: string | null,
        birthday: string | null,
        height: number | null,
        weight: number | null,
        other: string | null,
        password: string | null,
        rule: string | null,
        frequency: string | null,
        employee: boolean,
        employee_level: string | null,
        active: boolean
    ): Promise<[]> {
        const req: any = {
            name,
            identity,
            email,
            phone,
            birthday,
            height,
            weight,
            other,
            password,
            rule,
            frequency,
            employee,
            employee_level,
            active
        };
        return conectAPI(req, "/persons", "POST");
    }

    async listEmployee(
        name: string | null,
        email: string | null,
        identity: string | null,
    ): Promise<[]> {
        const req: any = {
            name,
            email,
            identity
        };
        return conectAPI(req, "/persons/employee/filter", "POST");
    }

    async listStudent(
        name: string | null,
        email: string | null,
        identity: string | null,
    ): Promise<[]> {
        const req: any = {
            name,
            email,
            identity
        };
        return conectAPI(req, "/persons/student/filter", "POST");
    }

    async details(id: number): Promise<[]> {
        return conectAPI(null, `/persons/${id}`, "GET");
    }

    async edit(
        name: string | null,
        identity: string | null,
        email: string | null,
        phone: string | null,
        birthday: string | null,
        height: number | null,
        weight: number | null,
        other: string | null,
        password: string | null,
        rule: string | null,
        frequency: string | null,
        employee: boolean,
        employee_level: string | null,
        active: boolean
    ): Promise<[]> {
        const req: any = {
            name,
            identity,
            email,
            phone,
            birthday,
            height,
            weight,
            other,
            password,
            rule,
            frequency,
            employee,
            employee_level,
            active
        };
        return conectAPI(req, `/persons`, "PUT");
    }

    async delete(id: number): Promise<[]> {
        return conectAPI(null, `/persons/${id}`, "DELETE");
    }
}
