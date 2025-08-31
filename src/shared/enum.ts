export enum CookiesAuth {
    USERLOGADO = "admin-template-sci-auth",
    USERTOKEN = "admin-user-sci-auth",
    USERNAME = "admin-name-sci-auth"
}

export enum PaymentStatus {
    PAID = "Pago",
    PENDING = "Pendente",
    CANCELLED = "Cancelado",
    REFUNDED = "Reembolsado",
    FAILED = "Falhou"
}

export enum PaymentMethod {
    CREDIT_CARD = "Cartão de crédito",
    DEBIT_CARD = "Cartão de débito",
    PIX = "PIX",
    BANK_SLIP = "Boleto bancário",
    CASH = "Dinheiro",
    TRANSFER = "Transferência bancária"
}