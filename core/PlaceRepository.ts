import Place from "./Place";

export default interface PlaceRepository {
    create(
        name: string | null,
        address: string | null,
        active: boolean
    ): Promise<Place[]>;

    list(): Promise<Place[]>;
}
