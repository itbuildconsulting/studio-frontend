import Persons from "./Persons";

export default interface PersonsRepository {
    create(
        name: string | null,
        identity: string | null,
        email: string | null,
        phone: string | null,
        birthday: string | null,
        height: number | null,
        weight: number | null,
        other: string | null,
        password: string | null,
        rule: string | null,
        frequency: string | null,
        employee: boolean,
        employee_level: string | null,
        active: boolean
    ): Promise<Persons[]>;
    list(): Promise<Persons[]>;
    details(id: number): Promise<Persons[]>
    edit(
        name: string | null,
        identity: string | null,
        email: string | null,
        phone: string | null,
        birthday: string | null,
        height: number | null,
        weight: number | null,
        other: string | null,
        password: string | null,
        rule: string | null,
        frequency: string | null,
        employee: boolean,
        employee_level: string | null,
        active: boolean
    ): Promise<Persons[]>;
    delete(id: number): Promise<Persons[]>
}
