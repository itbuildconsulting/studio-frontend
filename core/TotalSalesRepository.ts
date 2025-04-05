import TotalSales from "./TotalSales";

export default interface TotalSalesRepository {
    consult(
        year: string,
    ): Promise<TotalSales[]>;
}
