import Financial from "./Financial";

export default interface FinancialRepository {
    getLatestTransactions(): Promise<Financial[]>;
}
