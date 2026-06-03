import Select from "react-select";
import { Label } from "@/components/ui/label";

interface Option {
  label: string;
  value: string;
}

interface AuthSelectMultiProps {
  options: Option[];
  value: string[];
  changeValue: (values: string[]) => void;
  label?: string;
}

const AuthSelectMulti = ({ options, value, changeValue, label }: AuthSelectMultiProps) => {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <div className="flex flex-col mb-4">
      {label && <Label>{label}</Label>}
      <Select
        isMulti
        classNamePrefix="select-multi"
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const selectedArray = Array.isArray(selected)
            ? selected.map((option) => option.value)
            : [];
          changeValue(selectedArray);
        }}
      />
    </div>
  );
};

export default AuthSelectMulti;
