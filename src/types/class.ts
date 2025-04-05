export type ClassFilterType = {
    date: string | null,
    time: string | null,
    teacherId: string | null,
    productTypeId: string | null,
}

export type ClassType = {
    id?: number | null,
    limit: number | null,
    hasCommission: boolean | null,
    kickback: number | null,
    kickbackRule: string | null,
    students: string[] | null,
    active: boolean
} & ClassFilterType;