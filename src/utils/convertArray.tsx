export function convertArray(array: any) {
    return array?.length > 0 && array?.map((item: any) => {
        const { name, id, ...rest } = item;
        return { label: name, value: id, ...rest };
    });
}

export function convertArrayType(array: any) {
    return array?.length > 0 && array?.map((item: any) => {
        const { name, id, place, address, ...rest } = item;
        return { label: `${name} - ${place?.name || address}`, value: id, ...rest };
    });
}