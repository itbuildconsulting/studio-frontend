import React, { Key, useEffect, useState } from "react";

interface AuthSelectProps {
    label: string;
    options: any;
    value: any;
    required?: boolean;
    noRender?: boolean;
    disabled?: boolean;
    edit?: boolean;
    changeValue: (novoValor: any) => void;
    showColorIcon?: boolean;
}

const AuthSelect = ({
    label,
    options,
    value,
    required,
    noRender,
    disabled,
    edit,
    changeValue,
    showColorIcon = false
}: AuthSelectProps) => {
    const [isFirstSelection, setIsFirstSelection] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const safeOptions = Array.isArray(options) ? options : [];

    const handleChange = (newValue: string) => {
        changeValue?.(newValue);
        setIsOpen(false);
    };

    return noRender ? null : (
        <div className="flex flex-col">
            <label>{label}</label>
            {
                edit === true && value === null ? (
                    <div className="flex justify-start items-center loading-input focus:outline-none">
                        <div className="load load-input"></div>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className={`border px-4 py-2 mb-0 cursor-pointer loading-input select outline-none flex items-center  ${disabled ? "bg-gray-200" : "bg-white"}`}
                            style={{ margin: '0' }}
                        >
                            {showColorIcon &&
                                safeOptions?.find((option: any) => option.value === value).colors.split(' ').map((elem: string, key: Key) => {
                                    return (
                                        <div
                                            key={key}
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: elem,
                                                borderRadius: '50%',
                                                marginRight: '8px',
                                                borderColor: '#ccc',
                                                borderWidth: '1px'
                                            }}
                                        />
                                    )
                                })
                            }
                            {safeOptions ? safeOptions?.find((option: any) => option.value === value)?.label : "Selecione"}
                        </div>
                        <div className="absolute right-4" style={{ top: '25%' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className={`bi bi-chevron-down ${isOpen ? "rotate-180" : ""}`}
                                viewBox="0 0 16 16"
                                style={{ transition: "transform 0.3s" }}
                            >
                                <path d="M1.5 5.5l6 6 6-6H1.5z" />
                            </svg>
                        </div>
                        {isOpen && (
                            <div className="absolute bg-white border w-full z-10 " style={{marginTop: '-30px', maxHeight: '250px', overflow: 'auto'}}>
                                <ul>
                                    {safeOptions.map((option: any) => (
                                        <li
                                            key={option.value}
                                            onClick={() => handleChange(option.value)}
                                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {showColorIcon &&
                                                option.colors.split(' ').map((elem: string, key: Key) => {
                                                    return (
                                                        <div
                                                            key={key}
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                                backgroundColor: elem,
                                                                borderRadius: '50%',
                                                                marginRight: '8px',
                                                                borderColor: '#ccc',
                                                                borderWidth: '1px'
                                                            }}
                                                        />
                                                    )
                                                })
                                            }
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default AuthSelect;
