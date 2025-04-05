import Checkout from "./Checkout";

export default interface CheckoutRepository {
    checkout(
        personId: string,
        products: { productId: string, quantity: number }[],  // Lista de produtos
        cashPayment: { description: string, confirm: boolean, metadata: object }, // Dados de pagamento
        discountType?: number, // Tipo de desconto (1 para percentual, 2 para fixo)
        discountPercent?: number // Percentual de desconto
    ): Promise<Checkout[]>;
}
