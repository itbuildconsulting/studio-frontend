import Place from "./Place";

export default interface PlaceRepository {
    create(
        name: string | null,
        address: string | null,
        active: boolean
    ): Promise<Place[]>;
    list(): Promise<Place[]>;
    details(id: number): Promise<Place[]>
    edit(
        name: string | null,
        address: string | null,
        active: boolean
    ): Promise<Place[]>;
    delete(id: number): Promise<Place[]>
}
