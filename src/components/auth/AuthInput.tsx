import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconHidePassword, IconShowPassword } from '../icons';

interface AuthInputProps {
  label: string;
  value: any;
  required?: boolean;
  noRender?: boolean;
  maxLength?: number;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  disabled?: boolean;
  maskType?: 'cnpj' | 'cpf' | 'telefone' | 'metros' | 'hora' | 'percent' | 'none' | 'positivo' | 'currency';
  changeValue: (novoValor: any) => void;
  tooltipMessage?: string;
  edit?: boolean;
  blurValue?: (novoValor: any) => void;
  placeholder?: string;
}

const AuthInput = (props: AuthInputProps) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  const applyMask = (value: string, maskType?: string) => {
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
          return onlyDigits
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
        }
        return onlyDigits
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');

      case 'metros':
        return Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(onlyDigits.replace(/(\..*)\./g, '$1')) / 100);

      case 'hora':
        if (Number(onlyDigits) > 2359) return '23:59';
        onlyDigits = `${Number(onlyDigits)}`;
        while (onlyDigits.length < 4) onlyDigits = `0${onlyDigits}`;
        return `${onlyDigits.slice(0, 2)}:${onlyDigits.slice(2)}`;

      case 'percent': {
        let num = parseInt(onlyDigits);
        if (isNaN(num)) num = 0;
        return `${Math.min(Math.max(num, 0), 100)}`;
      }

      case 'currency': {
        if (!onlyDigits || onlyDigits === '0') return '0,00';
        return Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(onlyDigits) / 100);
      }

      case 'positivo':
        return onlyDigits !== '' && Number(onlyDigits) <= 0 ? 0 : onlyDigits;

      default:
        return value;
    }
  };

  const passwordIcon = () => {
    if (!props.value) return null;
    return isVisible
      ? IconHidePassword('20px', '20px', 'currentColor')
      : IconShowPassword('20px', '20px', 'currentColor');
  };

  useEffect(() => {
    if (!props.value) setIsVisible(false);
  }, [props.value]);

  if (props.noRender) return null;

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={props.label}>{props.label}</Label>
        {props.tooltipMessage !== undefined && (
          <div className="tooltip">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-muted-foreground" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
            <span className="tooltiptext">{props.tooltipMessage}</span>
          </div>
        )}
      </div>

      {props.type === 'date' ? null : props.edit === true && props.value === null ? (
        <div className="flex h-10 items-center border border-input rounded-md px-3 bg-background">
          <div className="load load-input" />
        </div>
      ) : (
        <div className="relative">
          <Input
            id={props.label}
            type={props.type && isVisible ? 'text' : props.type}
            value={props.value ?? ''}
            maxLength={props.maxLength ?? 50}
            onChange={(e) => props.changeValue?.(applyMask(e.target.value, props.maskType))}
            required={props.required}
            disabled={props.disabled}
            onBlur={(e) => props.blurValue?.(applyMask(e.target.value, props.maskType))}
            placeholder={props.placeholder}
            className={props.type === 'password' ? 'pr-10' : undefined}
          />
          {props.type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              style={{ height: 'auto', width: 'auto' }}
              onClick={() => setIsVisible(!isVisible)}
            >
              {passwordIcon()}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthInput;
