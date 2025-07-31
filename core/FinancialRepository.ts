import Financial from "./Financial";

export default interface FinancialRepository {
    getLatestTransactions(studentId: string, createdAt: string, transactionId: string, page: number): Promise<Financial[]>;
}
