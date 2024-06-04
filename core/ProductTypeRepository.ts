import ProductType from "./ProductType";

export default interface ProductTypeRepository {
    create(
        name: string,
        active: boolean
    ): Promise<ProductType[]>;
}
