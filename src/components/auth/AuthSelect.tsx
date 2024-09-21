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


const AuthSelect = (props: AuthSelectProps) => {
    const [isFirstSelection, setIsFirstSelection] = useState<boolean>(true);
    
    const handleChange = (e:any) => {
        props.changeValue?.(e.target.value);
    };

    useEffect(() => {
        if(props.value !== null) {
            setIsFirstSelection(false);
        }
    }, [props.value]);

    console.log(props.edit, props.value)

    return props.noRender ? null : (
        <div className="flex flex-col">
            <label className="">{props.label}</label>
            {
                props.edit === true && props.value === null ?
                <div
                        className={`flex justify-start items-center loading-input focus: outline-none`}
                    >
                        <div className='load load-input'></div>
                    </div>
                    :
                    <select
                        disabled={props.disabled}
                        value={props.value}
                        onChange={e => handleChange(e)}
                        required={props.required}
                        className={`
                focus: outline-none                
                `}
                    >
                        <option value={'0'} disabled={!isFirstSelection}>Selecione</option>
                        {props?.options.map((option: any) => (
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