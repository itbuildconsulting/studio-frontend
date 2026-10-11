import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
  const token = Cookies.get('admin-user-sci-auth');

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(req !== null && { body: JSON.stringify(req) }),
  };

  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`, config);

    if (resp.status === 200 || resp.status === 201) {
      return await resp.json();
    } else {
      const error = await resp.json();
      throw new Error(JSON.stringify(error));
    }
  } catch (error) {
    return error;
  }
}

export default class TurmasRepository {
  async list(active?: boolean): Promise<any> {
    const query = active !== undefined ? `?active=${active}` : '';
    return conectAPI(null, `/turmas${query}`, 'GET');
  }

  async details(id: number): Promise<any> {
    return conectAPI(null, `/turmas/${id}`, 'GET');
  }

  async create(payload: {
    name: string;
    teacherId: string | number;
    productTypeId: string | number;
    limit: number;
    active: boolean;
    slots: { diaSemana: number; horarioInicio: string; horarioFim: string }[];
  }): Promise<any> {
    return conectAPI(payload, '/turmas', 'POST');
  }

  async edit(
    id: number,
    payload: {
      name?: string;
      teacherId?: string | number;
      productTypeId?: string | number;
      limit?: number;
      active?: boolean;
      slots?: { diaSemana: number; horarioInicio: string; horarioFim: string }[];
    }
  ): Promise<any> {
    return conectAPI(payload, `/turmas/${id}`, 'PUT');
  }

  async remove(id: number): Promise<any> {
    return conectAPI(null, `/turmas/${id}`, 'DELETE');
  }

  async gerarAulas(id: number): Promise<any> {
    return conectAPI(null, `/turmas/${id}/gerar-aulas`, 'POST');
  }
}
