import Cookies from 'js-cookie';

// Função para conectar à API
async function conectAPI(req: object | null, url: string, method: string) {
    let config = {};
    const token = Cookies.get('admin-user-sci-auth');  // Pega o token do cookie

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
        } else if (resp.status === 200) { // List or Details
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

// Repositório para Níveis
export default class LevelRepository implements LevelRepository{
    // Criar um novo nível
    async create(
        name: string,
        numberOfClasses: number,
        title: string,
        benefit: string,
        color: string,
        antecedence: number  // Novo campo para antecedência
    ): Promise<[]> {
        const req = {
            name,
            numberOfClasses,
            title,
            benefit,
            color,
            antecedence  // Passando o campo de antecedência
        };
        return conectAPI(req, "/level/", "POST"); // Envia a requisição para criar o nível
    }

    // Listar todos os níveis com paginação
    async list(page: number): Promise<[]> {
        return conectAPI(null, `/level?page=${page}`, "GET"); // Envia a requisição para listar níveis
    }

    // Detalhes de um nível específico
    async details(id: number): Promise<[]> {
        return conectAPI(null, `/level/${id}`, "GET"); // Envia a requisição para obter os detalhes de um nível
    }

    // Editar um nível existente
    async edit(
        id: number,
        name: string,
        numberOfClasses: number,
        title: string,
        benefit: string,
        color: string,
        antecedence: number  // Novo campo para antecedência
    ): Promise<[]> {
        const req = {
            name,
            numberOfClasses,
            title,
            benefit,
            color,
            antecedence  // Passando o campo de antecedência
        };
        return conectAPI(req, `/level/${id}`, "PUT"); // Envia a requisição para editar um nível
    }

    // Deletar um nível
    async delete(id: number): Promise<[]> {
        return conectAPI(null, `/level/${id}`, "DELETE"); // Envia a requisição para deletar um nível
    }
}
