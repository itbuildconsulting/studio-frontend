interface AuthCepProps {
    zipCode: string | null
    setAddress: (e: string) => void
    setCity: (e: string) => void
    setState: (e: string) => void
    setErrorMessage: (e: string | string[]) => void
}

const searchCEP = async ({
    zipCode,
    setAddress,
    setCity,
    setState,
    setErrorMessage
}: AuthCepProps) => {
    setAddress("");
    setCity("");
    setState("0");

    try {
        const response = await fetch(`https://opencep.com/v1/${zipCode}`);
        const data = await response?.json();

        if (data?.error) {
            setErrorMessage(["CEP inválido ou não encontrado."]);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        } else {
            setAddress(data?.logradouro || "");
            setCity(data?.localidade || "");
            setState(data.uf || "0");
        }
    } catch (error) {
        setErrorMessage(["CEP inválido ou não encontrado."]);
        setTimeout(() => {
            setErrorMessage('');
        }, 5000);
    }
}

export default searchCEP;