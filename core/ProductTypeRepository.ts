import ProductType from "./ProductType";

export default interface ProductTypeRepository {
    create(
        name: string | null,
        active: boolean
    ): Promise<ProductType[]>;

    list(): Promise<ProductType[]>;
    details(id: number): Promise<ProductType[]>
}
