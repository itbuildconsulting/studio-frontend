import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
    const token = Cookies.get('admin-user-sci-auth');
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(req !== null ? { body: JSON.stringify(req) } : {}),
    };

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`, config);
        if (resp.status === 200 || resp.status === 201) return await resp.json();
        throw new Error(JSON.stringify(await resp.json()));
    } catch (error) {
        return error;
    }
}

export default class NpsRepository {
    async submit(classId: number, studentId: number, score: number, comment?: string) {
        return conectAPI({ classId, studentId, score, comment }, '/nps', 'POST');
    }

    async getReport(months: number = 3) {
        return conectAPI(null, `/nps/report?months=${months}`, 'GET');
    }
}
