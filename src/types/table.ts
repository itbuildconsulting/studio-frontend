export type Column = {
    dataField: string,
    text?: string,
    formatter?: (c: any, r?: string | number | undefined) => JSX.Element
}