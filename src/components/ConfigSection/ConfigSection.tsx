import AuthInput from "../auth/AuthInput";
import AuthSelect from "../auth/AuthSelect";
import AuthSelectMulti from "../auth/AuthSelectMulti";

interface ConfigSectionProps {
    label: string;
    isEnabled: boolean;
    onToggleChange: (enabled: boolean) => void;
    inputType?: 'select' | 'input' | 'none';
    selectOptions?: { value: string | number; label: string }[];
    selectValue?: number;
    onSelectChange?: (values: number) => void;
    inputValue?: string;
    onInputChange?: (novoValor: any) => void;
    placeholder?: string;
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({
    label,
    isEnabled,
    onToggleChange,
    inputType = 'none',
    selectOptions = [],
    selectValue = 0,
    onSelectChange = () => { },
    inputValue = '',
    onInputChange = () => { },
    placeholder = ''
}) => {
    return (
        <>
            <div className="grid grid-cols-12 gap-x-8">
                <div className="col-span-6 flex" style={{ minHeight: "116px" }}>
                    <label className="inline-flex items-center cursor-pointer mb-[2rem]">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={(e) => onToggleChange(e.target.checked)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">{label}</span>
                    </label>
                </div>
                <div className="col-span-2">
                </div>
                <div className="col-span-4">
                    {isEnabled && inputType === 'select' && selectOptions.length > 0 && (
                        <AuthSelect
                            label="Produtos"
                            value={selectValue}
                            options={selectOptions}
                            changeValue={onSelectChange}
                        />
                    )}
                    {isEnabled && inputType === 'input' &&
                        <AuthInput
                            label="Valor"
                            value={inputValue}
                            type="text"
                            maskType="positivo"
                            changeValue={onInputChange}
                            placeholder={placeholder}
                        />
                    }
                </div>
            </div>
            <hr className="mb-[2rem]" />
        </>
    );
};
