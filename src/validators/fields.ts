function ValidationFields(fields: { [key: string]: string | null }) {
    for (const [key, value] of Object.entries(fields)) {
        if (!value?.trim() || value === "null") {
            return `Por favor, informe o campo: ${key}`;
        }
    }
    return null;
}

export default ValidationFields;