import Level from "./Level";  // Supondo que você tenha o modelo `Level` já definido

export default interface LevelRepository {
    create(
        name: string,
        numberOfClasses: number,
        title: string,
        benefit: string,
        color: string,
        antecedence: number  // Novo campo para antecedência
    ): Promise<Level[]>;

    list(page: number): Promise<Level[]>;

    details(id: number): Promise<Level[]>;

    edit(
        id: number,
        name: string,
        numberOfClasses: number,
        title: string,
        benefit: string,
        color: string,
        antecedence: number  // Novo campo para antecedência
    ): Promise<Level[]>;

    delete(id: number): Promise<Level[]>;
}
