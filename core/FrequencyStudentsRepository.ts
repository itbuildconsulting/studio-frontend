import FrequencyStudents from "./FrequencyStudents";

export default interface FrequencyStudentsRepository {
    consult(
        startDate: string,
        endDate: string,
    ): Promise<FrequencyStudents[]>;
}
