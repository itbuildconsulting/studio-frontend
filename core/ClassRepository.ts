import Class from "./Class";

export default interface ClassRepository {
    create(
        name: string,
        limit: number,
        income: number,
        date: string,
        config: string,
        kickback: number,
        kickbackRule: string,
        active: boolean
    ): Promise<Class[]>;
}
