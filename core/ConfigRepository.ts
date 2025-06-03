import Config from "./Config";

export default interface ConfigRepository {
    create(
        name: string | null,
        address: string | null,
        active: boolean
    ): Promise<Config[]>;
    list(): Promise<Config[]>;
    details(id: number): Promise<Config[]>
    edit(
        name: string | null,
        address: string | null,
        active: boolean,
        ide: number
    ): Promise<Config[]>;
    delete(id: number): Promise<Config[]>
}
