import { kMaxLength } from 'buffer';
import React, { useEffect, useState } from 'react';

import { IconHidePassword } from '../icons';
import { IconShowPassword } from '../icons';

interface AuthInputProps {
    label: string,
    value: any,
    required?: boolean,
    noRender?: boolean,
    maxLength?: number,
    type?: 'text' | 'email' | 'password' | 'date' | 'number',
    disabled?: boolean,
    maskType?: 'cnpj' | 'cpf' | 'telefone' | 'metros' | 'hora' | 'percent' | 'none' | 'positivo',
    changeValue: (novoValor: any) => void,
    tooltipMessage?: string,
    edit?: boolean
    blurValue?: (novoValor: any) => void,
}

const AuthInput = (props: AuthInputProps) => {
    const [isVisible, setIsVisible] = useState<boolean | null>(null);

    const applyMask = (value: string, maskType?: string) => {
        // Remove todos os caracteres não-dígitos
        let onlyDigits = value.replace(/\D/g, '');

        switch (maskType) {
            case 'cnpj':
                return onlyDigits
                    .replace(/^(\d{2})(\d)/, '$1.$2')
                    .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
                    .replace(/\.(\d{3})(\d)/, '.$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2');

            case 'cpf':
                return onlyDigits
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            case 'telefone':
                if (onlyDigits.length <= 10) {
                    // Telefone residencial
                    return onlyDigits
                        .replace(/^(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    // Telefone móvel
                    return onlyDigits
                        .replace(/^(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d{5})(\d)/, '$1-$2');
                }
            case 'metros':
                return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((Number(onlyDigits.replace(/(\..*)\./g, '$1')) / 100));
            //return (Number(onlyDigits.replace(/(\..*)\./g, '$1')) / 100).toFixed(2).toLocaleString();
            case 'hora':
                if (Number(onlyDigits) > 2359) {
                    return '23:59';
                }

                onlyDigits = `${Number(onlyDigits)}`;

                for (let i: number = 0; onlyDigits.length < 4; i++) {
                    onlyDigits = `0${onlyDigits}`
                }

                return `${onlyDigits.slice(0, 2)}:${onlyDigits.slice(2)}`

            case 'percent': // Máscara de porcentagem
                // Limita a entrada para números de 0 a 100 e adiciona o '%'
                let numericValue = parseInt(onlyDigits);
                if (isNaN(numericValue)) {
                    numericValue = 0; // Se não for número, define 0
                }
                numericValue = Math.min(Math.max(numericValue, 0), 100); // Limita entre 0 e 100
                return `${numericValue}`;

            case 'positivo':
                return value !== '' && Number(value) <= 0 ? 0 : value;

            default:
                return value;
        }
    };

    function handleIsVisiblePassword() {
        if (props.value) {
            if (isVisible) {
                return IconHidePassword('24px', '24px', 'var(--primary)')
            } else {
                return IconShowPassword('24px', '24px', 'var(--primary)')
            }
        }

        return '';
    }

    useEffect(() => {
        if (!props.value) {
            setIsVisible(false);
        }
    }, [props.value])

    return props.noRender ? null : (
        <div className='flex flex-col'>
            <div className="flex justify-start gap-2">
                <label>{props.label}</label>
                {
                    props.tooltipMessage !== undefined &&
                    <div className="tooltip"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                        <span className="tooltiptext">{props.tooltipMessage}</span>
                    </div>
                }
            </div>
            {props.type === 'date'
                ?
                <></>
                :
                props.edit === true && props.value === null ?
                    <div
                        className={`flex justify-start items-center loading-input focus: outline-none`}
                    >
                        <div className='load load-input'></div>
                    </div>
                    :
                    <div style={{ position: 'relative' }}>
                        <input
                            type={props.type && isVisible ? 'text' : props.type}
                            value={props.value ?? ''}
                            maxLength={props.maxLength !== undefined ? props.maxLength : 50}
                            onChange={e => props.changeValue?.(applyMask(e.target.value, props.maskType))}
                            required={props.required}
                            className={`focus: outline-none w-full`}
                            disabled={props.disabled}
                            onBlur={e => props.blurValue?.(applyMask(e.target.value, props.maskType))}
                        />
                        {
                            props.type === "password"
                            &&
                            <div style={{ position: 'absolute', right: "1rem", top: '1rem', cursor: 'pointer' }} onClick={() => setIsVisible(!isVisible)}>{handleIsVisiblePassword()}</div>
                        }
                    </div>
            }
        </div>
    )
}

export default AuthInput