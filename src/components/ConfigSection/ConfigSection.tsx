import AuthInput from "../auth/AuthInput";
import AuthSelect from "../auth/AuthSelect";
import AuthSelectMulti from "../auth/AuthSelectMulti";

interface Option {
  value: string | number;
  label: string;
}

interface ConfigSectionProps {
  label: string;
  isEnabled: boolean;
  onToggleChange: (enabled: boolean) => void;
  inputType?: "select" | "select-multi" | "input" | "none";
  selectOptions?: Option[] | any;
  selectValue?: number | number[];
  onSelectChange?: (values: number | number[]) => void;
  inputValue?: string;
  onInputChange?: (novoValor: any) => void;
  placeholder?: string;
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({
  label,
  isEnabled,
  onToggleChange,
  inputType = "none",
  selectOptions = [],
  selectValue,
  onSelectChange = () => {},
  inputValue = "",
  onInputChange = () => {},
  placeholder = ""
}) => {
  // Normaliza selectOptions => array
  const toOptionsArray = (val: any): Option[] => {
    if (Array.isArray(val)) return val as Option[];
    if (val && typeof val === "object") {
      if (Array.isArray(val.data)) return val.data as Option[];
      return Object.entries(val).map(([value, label]) => ({
        value,
        label: String(label)
      }));
    }
    return [];
  };

  const optionsArray: Option[] = toOptionsArray(selectOptions);
  const stringOptions = optionsArray.map((o) => ({ ...o, value: String(o.value) }));

  // SINGLE (string p/ AuthSelect que usa string)
  const singleValueNum =
    !Array.isArray(selectValue) && typeof selectValue === "number" ? selectValue : undefined;
  const singleValueStr = singleValueNum !== undefined ? String(singleValueNum) : undefined;

  // MULTI (string[] p/ AuthSelectMulti)
  const multiValueNums: number[] = Array.isArray(selectValue)
    ? (selectValue as number[])
    : typeof selectValue === "number"
    ? [selectValue]
    : [];
  const multiValueStrs = multiValueNums.map((n) => String(n));

  return (
    <>
      <div className="grid grid-cols-12 gap-x-8">
        <div className="col-span-6 flex" style={{ minHeight: "80px" }}>
          <label className="inline-flex items-center cursor-pointer mb-[2rem]">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isEnabled}
              onChange={(e) => onToggleChange(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#7DC143] dark:peer-checked:bg-[#7DC143]"/>
            <span className="ms-3 text-sm font-medium">{label}</span>
          </label>
        </div>

        <div className="col-span-2" />

        <div className="col-span-4">
          {isEnabled && inputType === "select" && stringOptions.length > 0 && (
            <AuthSelect
              label="Selecione"
              value={singleValueStr as any}
              options={stringOptions as any}
              changeValue={(v: string) => {
                const n = Number(v);
                onSelectChange(Number.isNaN(n) ? (v as any) : n);
              }}
            />
          )}

          {isEnabled && inputType === "select-multi" && stringOptions.length > 0 && (
            <AuthSelectMulti
              label="Produtos"
              value={multiValueStrs}
              options={stringOptions as any}
              changeValue={(vals: string[]) => {
                const nums = vals.map((v) => Number(v)).filter((n) => Number.isFinite(n));
                onSelectChange(nums);
              }}
            />
          )}

          {isEnabled && inputType === "input" && (
            <AuthInput
              label="Valor"
              value={inputValue}
              type="text"
              maskType="positivo"
              changeValue={onInputChange}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>

      <hr className="mb-[2rem]" />
    </>
  );
};
