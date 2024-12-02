import React, { useEffect, useState } from "react";

interface AuthSelectProps {
    label: string,
    options: any,
    value: any,
    required?: boolean,
    noRender?: boolean,
    disabled?: boolean,
    edit?: boolean,
    changeValue: (novoValor: any) => void
}


const AuthSelect = ({label, options, value, required, noRender, disabled, edit, changeValue}: AuthSelectProps) => {
    const [isFirstSelection, setIsFirstSelection] = useState<boolean>(true);

    const handleChange = (e: any) => {
        changeValue?.(e.target.value);
    };

    useEffect(() => {
        if (!value) {
            setIsFirstSelection(false);
        }
    }, [value]);

    return noRender ? null : (
        <div className="flex flex-col">
            <label className="">{label}</label>
            {
                edit === true && value === null ?
                    <div
                        className={`flex justify-start items-center loading-input focus: outline-none`}
                    >
                        <div className='load load-input'></div>
                    </div>
                    :
                    <select
                        disabled={disabled}
                        value={value}
                        onChange={e => handleChange(e)}
                        required={required}
                        className={`
                        focus: outline-none                
                        `}
                    >
                        <option value={''} disabled={!isFirstSelection}>Selecione</option>
                        {options.map((option: any) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
            }
        </div>
    );
};
export default AuthSelect;