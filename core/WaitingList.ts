import Cookies from 'js-cookie';
import WaitingListRepository from './WaitingListRepository';

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

export default class WaitingListCollection implements WaitingListRepository {
    async listByClass(classId: number): Promise<[]> {
        return conectAPI(null, `/waiting/class/${classId}`, "GET");
    }

    async add(classId: number, studentId: number): Promise<[]> {
        const req = { classId, studentId };
        return conectAPI(req, "/waiting/add", "POST");
    }

    async remove(classId: number, studentId: number): Promise<[]> {
        const req = { classId, studentId };
        return conectAPI(req, "/waiting/remove", "DELETE");
    }
}