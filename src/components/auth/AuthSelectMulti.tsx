import Select from "react-select";
import SelectType from "@/model/Select";

interface MultiProps {
    label: string
    options: SelectType[]
}

const AuthSelectMulti = ({ label, options }: MultiProps) => {

    const handleChange = (selectedOptions: SelectType) => {
        console.log('Selecionado:', selectedOptions);
    };

    return (
        <>
            <label className="">{label}</label>
            <Select
                options={options}
                placeholder={"Selecione"}
                onChange={() => handleChange}
                classNamePrefix={"select-multi"}
                isMulti
            />
        </>
    )
}

export default AuthSelectMulti;