import WaitingList from "./WaitingList";

export default interface WaitingListRepository {
    listByClass(classId: number): Promise<WaitingList[]>;
    add(classId: number, studentId: number): Promise<WaitingList[]>;
    remove(classId: number, studentId: number): Promise<WaitingList[]>;
}