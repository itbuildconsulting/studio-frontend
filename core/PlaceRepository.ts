import Place from "./Place";

export default interface PlaceRepository {
    create(
        name: string,
        active: boolean
    ): Promise<Place[]>;
}
