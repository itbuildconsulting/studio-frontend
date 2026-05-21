import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
    const token = Cookies.get('admin-user-sci-auth');
    const config: RequestInit = req === null
        ? { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
        : { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(req) };

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`, config);
        if (resp.status === 200 || resp.status === 201) return await resp.json();
        const error = await resp.json();
        throw new Error(JSON.stringify(error));
    } catch (error) {
        return error;
    }
}

export default class CalendarClassRepository {
    async consult(): Promise<any> {
        return conectAPI({}, '/dashboard/calendarClass', 'POST');
    }
}