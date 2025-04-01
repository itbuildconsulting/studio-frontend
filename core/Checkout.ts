import Cookies from 'js-cookie';

async function conectAPI(req: object | null, url: string, method: string) {
    const token = Cookies.get('admin-user-sci-auth');
    let config = {};

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

export default class CheckoutRepository implements CheckoutRepository {
    async checkout (
        personId: string,
        products: { productId: string, quantity: number }[],  // Lista de produtos
        cashPayment: { description: string, confirm: boolean, metadata: object }, // Dados de pagamento
        discountType?: number, // Tipo de desconto (1 para percentual, 2 para fixo)
        discountPercent?: number // Percentual de desconto
    ): Promise<[]> {
        const req = {
            personId,
            products,
            cashPayment,
            discountType,  // Pode ser 1 (percentual) ou 2 (fixo)
            discountPercent  // Percentual de desconto, se necessário
        };

        console.log(req)
        return conectAPI(req, "/checkout/dashboard/", "POST");
    }
}
