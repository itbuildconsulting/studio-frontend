export const convertDate = (date: string | null) => {
    return date && date?.split("/").reverse().join("-");
}

export const convertDateDayMonthYear = (date: string | null) => {
    return date && date.split("-").reverse().join("/");
}

export const convertTime = (time: string | null) => {
    let timeSplit = time && `${time.split(":")[0]}:${time.split(":")[1]}`;

    return timeSplit;
}

export const convertUpdateAt = (date: string | null) => {
    let dateFormatter = date && date.split("T")[0];
    let timeFormatter =  date && date.split("T")[1];

    return `${convertDateDayMonthYear(dateFormatter)} - ${convertTime(timeFormatter)}`;
}