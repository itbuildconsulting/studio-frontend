import Select, { MultiValue } from "react-select";
import SelectType from "@/model/Select";

interface MultiProps {
    label: string
    options: MultiValue<SelectType[]>
    value: string | string[]
    changeValue: (e:any) => void
}

const AuthSelectMulti = ({ label, options, value, changeValue }: MultiProps) => {

    const handleChange = (selectedOptions: MultiValue<SelectType[]>) => {
        let aux: string[] = [];
        selectedOptions.map((elem: any) => aux.push(String(elem.value)));
        changeValue(aux);
    };

    return (
        <>
            <label className="">{label}</label>
            <Select
                options={options}
                placeholder={"Selecione"}
                onChange={handleChange}
                classNamePrefix={"select-multi"}
                isMulti
            />
        </>
    )
}

export default AuthSelectMulti;