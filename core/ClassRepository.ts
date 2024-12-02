import Class from "./Class";

export default interface ClassRepository {
    create(
        date: string,
        time: string,
        teacherId: string,
        limit: number,
        hasCommission: boolean,
        kickback: number | null,
        kickbackRule: string,
        productId: string | null,
        students: string[],
        active: boolean
    ): Promise<Class[]>;

    edit(
        id: number | null,
        date: string,
        time: string,
        teacherId: string,
        limit: number,
        hasCommission: boolean,
        kickback: number | null,
        kickbackRule: string,
        productId: string | null,
        students: string[],
        active: boolean
    ): Promise<Class[]>;
}
