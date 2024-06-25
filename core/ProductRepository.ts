import Product from "./Product";

export default interface ProductRepository {
    create(
        name: string | null,
        credit: number | null,
        validateDate: string | null,
        value: number | null,
        productTypeId: number | null,
        placeId: number | null,
        active: boolean
    ): Promise<Product[]>;
    list(): Promise<Product[]>;
    details(id: number): Promise<Product[]>
    edit(
        name: string | null,
        credit: number | null,
        validateDate: string | null,
        value: number | null,
        productTypeId: number | null,
        placeId: number | null,
        active: boolean
    ): Promise<Product[]>;
    delete(id: number): Promise<Product[]>
}
