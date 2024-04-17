import React from "react";

interface AuthSelectProps {
    label: string,
    options: any,
    value: any,
    required?: boolean,
    noRender?: boolean,
    disabled?: boolean
    changeValue: (novoValor: any) => void
}

const AuthSelect = (props: AuthSelectProps) => {
    return props.noRender ? null : (
        <div className="flex flex-col">
            <label className="">{props.label}</label>
            <select
                disabled={props.disabled}
                value={props.value}
                onChange={e => props.changeValue?.(e.target.value)}
                required={props.required}
                className={`
                focus: outline-none                
                `}
            >
                {props.options.map((option: any) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default AuthSelect;