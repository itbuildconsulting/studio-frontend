export const convertDate = (date: string | null) => {
    return date && date?.split("/").reverse().join("-");
}