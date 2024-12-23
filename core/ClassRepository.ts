import Class from "./Class";

export default interface ClassRepository {
    create(
        date: string | null,
        time: string | null,
        teacherId: string | null,
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
        date: string | null,
        time: string | null,
        teacherId: string | null,
        limit: number | null,
        hasCommission: boolean | null,
        kickback: number | null,
        kickbackRule: string | null,
        productId: string | null,
        students: string[] | null,
        active: boolean
    ): Promise<Class[]>;

    listClass(
        id: number | null,
        date: string | null,
        time: string | null,
        teacherId: string | null,
        productId: string | null,
    ): Promise<Class[]>;

    details(
        id: number,
    ): Promise<Class[]>;
}
