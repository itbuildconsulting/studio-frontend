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

export default class StatisticsRepository {
    // ==================== VISÃO GERAL ====================
    
    async getOverviewMetrics(startDate?: string, endDate?: string): Promise<any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/performance/overview", "POST");
    }

    // ==================== ENGAJAMENTO DE ALUNOS ====================
    
    async getTopStudents(limit: number = 10, period?: string): Promise<any> {
        const req = { limit, period };
        return conectAPI(req, "/performance/top-students", "POST");
    }

    async getInactiveStudents(days: number = 14): Promise<any> {
        const req = { days };
        return conectAPI(req, "/performance/inactive-students", "POST");
    }

    async getStudentsAtRisk(): Promise<any> {
        return conectAPI(null, "/performance/students-at-risk", "GET");
    }

    async getFrequencyDropStudents(): Promise<any> {
        return conectAPI(null, "/performance/frequency-drop", "GET");
    }

    async getStudentsWithIdleCredits(days: number = 30): Promise<any> {
        const req = { days };
        return conectAPI(req, "/performance/idle-credits", "POST");
    }

    async getNoShowStudents(threshold: number = 3): Promise<any> {
        const req = { threshold };
        return conectAPI(req, "/performance/no-show-students", "POST");
    }

    // ==================== ANÁLISE DE CRÉDITOS ====================
    
    async getStudentsWithMostCredits(limit: number = 10): Promise<any> {
        const req = { limit };
        return conectAPI(req, "/performance/most-credits", "POST");
    }

    async getCreditsExpiringSoon(days: number = 7): Promise<any> {
        const req = { days };
        return conectAPI(req, "/performance/expiring-credits", "POST");
    }

    async getCreditUtilizationRate(): Promise<any> {
        return conectAPI(null, "/performance/credit-utilization", "GET");
    }

    // ==================== PERFORMANCE DE AULAS ====================
    
    async getOccupancyByTime(startDate?: string, endDate?: string): Promise<any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/performance/occupancy-by-time", "POST");
    }

    async getMostPopularClasses(limit: number = 10): Promise<any> {
        const req = { limit };
        return conectAPI(req, "/performance/popular-classes", "POST");
    }

    async getTopTeachers(limit: number = 10): Promise<any> {
        const req = { limit };
        return conectAPI(req, "/performance/top-teachers", "POST");
    }

    async getOccupancyByDayOfWeek(): Promise<any> {
        return conectAPI(null, "/performance/occupancy-by-day", "GET");
    }

    async getIdleBikes(): Promise<any> {
        return conectAPI(null, "/performance/idle-bikes", "GET");
    }

    async getLastMinuteCancellations(days: number = 30): Promise<any> {
        const req = { days };
        return conectAPI(req, "/performance/last-minute-cancellations", "POST");
    }

    // ==================== FINANCEIRO ====================
    
    async getBestSellingProducts(limit: number = 10): Promise<any> {
        const req = { limit };
        return conectAPI(req, "/performance/best-selling-products", "POST");
    }

    async getAverageTicketPerStudent(): Promise<any> {
        return conectAPI(null, "/performance/average-ticket", "GET");
    }

    async getStudentLTV(limit: number = 10): Promise<any> {
        const req = { limit };
        return conectAPI(req, "/performance/student-ltv", "POST");
    }

    async getRevenueByTeacher(startDate?: string, endDate?: string): Promise<any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/performance/revenue-by-teacher", "POST");
    }

    async getRevenueByClassType(startDate?: string, endDate?: string): Promise<any> {
        const req = { startDate, endDate };
        return conectAPI(req, "/performance/revenue-by-class-type", "POST");
    }

    // ==================== INSIGHTS AUTOMÁTICOS ====================
    
    async getAutomatedInsights(): Promise<any> {
        return conectAPI(null, "/performance/insights", "GET");
    }

    // ==================== COMPARAÇÕES TEMPORAIS ====================
    
    async getMonthlyComparison(): Promise<any> {
        return conectAPI(null, "/performance/monthly-comparison", "GET");
    }

    async getWeeklyTrends(): Promise<any> {
        return conectAPI(null, "/performance/weekly-trends", "GET");
    }
}