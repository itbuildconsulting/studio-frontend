import ProductType from "./ProductType";

export default interface ProductTypeRepository {
    create(
        name: string | null,
        placeId: number | null,
        active: boolean
    ): Promise<ProductType[]>;
    list(): Promise<ProductType[]>;
    details(id: number): Promise<ProductType[]>;
    edit(
        name: string | null,
        placeId: number | null,
        active: boolean,
        id: number
    ): Promise<ProductType[]>;
    delete(id: number): Promise<ProductType[]>;
}
