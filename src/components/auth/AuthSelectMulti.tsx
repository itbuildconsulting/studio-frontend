import Select, { MultiValue } from "react-select";
import SelectType from "@/model/Select";

interface MultiProps {
  label: string;
  options: SelectType[]; // Alterado para SelectType[]
  value: any;
  changeValue: (e: any) => void;
}
interface Option {
  label: string;
  value: string;
}

interface AuthSelectMultiProps {
  options: Option[];
  value: string[]; // valores selecionados
  changeValue: (values: string[]) => void;
  label?: string;
}

const AuthSelectMulti = ({ options, value, changeValue, label }: AuthSelectMultiProps) => {
  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <div>
      {label && <label className="mb-2 block">{label}</label>}
      <Select
        isMulti
        classNamePrefix="select-multi"
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const selectedArray = Array.isArray(selected)
            ? selected.map(option => option.value)
            : [];
          changeValue(selectedArray);
        }}
      />
    </div>
  );
};

export default AuthSelectMulti;
