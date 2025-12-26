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
            const error = await resp.json();
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        return error;
    }
}

export interface FinancialMetrics {
    totalRevenue: number;
    totalTransactions: number;
    successRate: number;
    averageTicket: number;
    revenueGrowth: number;
    transactionsGrowth: number;
}

export interface RevenueOverTime {
    labels: string[];
    data: number[];
}

export interface PaymentMethodDistribution {
    method: string;
    count: number;
    percentage: number;
}

// Interface para resposta da API com wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export default class ResultsRepository {
    async getLatestTransactions(
        studentId: string | null, 
        createdAt: string | null, 
        transactionId: string | null, 
        page: number
    ): Promise<any> {
        const req = {
            studentId, 
            createdAt, 
            transactionId, 
            page
        };
        return conectAPI(req, "/financial/lastTransactions", "POST");
    }

    async getSingleTransactions(
        transactionId: string | null, 
    ): Promise<any> {
        return conectAPI(null, `/financial/transaction/${transactionId}`, "GET");
    }

    // Novo: Buscar métricas financeiras (KPIs)
    async getFinancialMetrics(
        startDate?: string,
        endDate?: string
    ): Promise<FinancialMetrics | any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/results/metrics", "POST");
    }

    // Novo: Buscar receita ao longo do tempo
    async getRevenueOverTime(
        period: 'week' | 'month' | 'year' = 'month',
        startDate?: string,
        endDate?: string
    ): Promise<RevenueOverTime | ApiResponse<RevenueOverTime> | any> {
        const req = { period, startDate, endDate };
        return conectAPI(req, "/results/revenue-over-time", "POST");
    }

    // Novo: Buscar distribuição por forma de pagamento
    async getPaymentMethodDistribution(
        startDate?: string,
        endDate?: string
    ): Promise<PaymentMethodDistribution[] | ApiResponse<PaymentMethodDistribution[]> | any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/results/payment-distribution", "POST");
    }

    // Novo: Buscar transações por status
    async getTransactionsByStatus(
        startDate?: string,
        endDate?: string
    ): Promise<any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/results/transactions-by-status", "POST");
    }
}