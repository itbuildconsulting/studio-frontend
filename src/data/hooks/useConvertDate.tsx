const useConvertDate = (date: string | null) => {
    return date && date?.split("-").reverse().join("/");
}

export default useConvertDate;