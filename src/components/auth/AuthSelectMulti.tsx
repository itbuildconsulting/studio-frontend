import Select, { MultiValue } from "react-select";
import SelectType from "@/model/Select";

interface MultiProps {
  label: string;
  options: SelectType[]; // Alterado para SelectType[]
  value: any;
  changeValue: (e: any) => void;
}

const AuthSelectMulti = ({ label, options, value, changeValue }: MultiProps) => {

  const handleChange = (selectedOptions: MultiValue<SelectType>) => {
    let aux: string[] = [];
    selectedOptions.forEach((elem: any) => aux.push(String(elem.value))); // Usando forEach ao invés de map para modificar aux diretamente
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
        value={options.filter(option => value?.includes(option.value))}
      />
    </>
  );
}

export default AuthSelectMulti;
