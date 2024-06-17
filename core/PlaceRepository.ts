import Place from "./Place";

export default interface PlaceRepository {
    create(
        name: string | null,
        active: boolean
    ): Promise<Place[]>;
}
