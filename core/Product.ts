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
        active: boolean,
        usageRestrictionType: string = 'none',           // ⭐ NOVO: Tipo de restrição de uso
        usageRestrictionLimit: number | null = null,     // ⭐ NOVO: Limite de uso
        requiredLevel: number | null = null,             // 📌 EXISTENTE: Nível mínimo
        exclusiveLevels: string | null = null,           // 📌 EXISTENTE: Níveis exclusivos
        purchaseLimit: number = 0                        // 📌 EXISTENTE: Limite de compras
    ): Promise<[]> {
        const req = {
            name,
            credit,
            validateDate,
            value,
            productTypeId,
            placeId,
            active: active ? 1 : 0,
            usageRestrictionType,    // ⭐ NOVO
            usageRestrictionLimit,   // ⭐ NOVO
            requiredLevel,           // 📌 EXISTENTE
            exclusiveLevels,         // 📌 EXISTENTE
            purchaseLimit            // 📌 EXISTENTE
        };
        return conectAPI(req, "/products", "POST");
    }

    async list(page: number): Promise<[]> {
        return conectAPI(null, `/products?page=${page}`, "GET");
    }

    async listFiltered(page: number, productTypeId: string | null): Promise<[]> {
        return conectAPI(null, `/products/filtered?page=${page}&pageSize=10&productTypeId=${productTypeId}`, "GET");
    }

    async listFilteredByLevel(studentLevel: number): Promise<[]> {
        return conectAPI(null, `/products/filtered?studentLevel=${studentLevel}`, "GET");
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
        active: boolean,
        usageRestrictionType: string = 'none',           // ⭐ NOVO: Tipo de restrição de uso
        usageRestrictionLimit: number | null = null,     // ⭐ NOVO: Limite de uso
        requiredLevel: number | null = null,             // 📌 EXISTENTE: Nível mínimo
        exclusiveLevels: string | null = null,           // 📌 EXISTENTE: Níveis exclusivos
        purchaseLimit: number = 0                        // 📌 EXISTENTE: Limite de compras
    ): Promise<[]> {
        const req = {
            name,
            credit,
            validateDate,
            value,
            productTypeId,
            placeId,
            active: active ? 1 : 0,
            usageRestrictionType,    // ⭐ NOVO
            usageRestrictionLimit,   // ⭐ NOVO
            requiredLevel,           // 📌 EXISTENTE
            exclusiveLevels,         // 📌 EXISTENTE
            purchaseLimit            // 📌 EXISTENTE
        };
        return conectAPI(req, `/products/${id}`, "PUT");
    }

    async delete(id: number): Promise<[]> {
        return conectAPI(null, `/products/remove/${id}`, "POST");
    }
}