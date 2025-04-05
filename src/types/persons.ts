export type EmployeeFilterType = {
    name: string | null,
    email: string | null,
    identity: string | null,
}

export type EmployeeType = {
    id?: number | null,
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
    zipCode: string | null,
    state: string | null,
    city: string | null,
    address: string | null,
    country: string | null,
    active: boolean
} & EmployeeFilterType;