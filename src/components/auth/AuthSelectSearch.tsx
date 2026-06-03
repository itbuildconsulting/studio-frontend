import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Option {
  value: string | number;
  label: string;
}

interface AuthSelectSearchProps {
  label: string;
  options: Option[];
  value: string | number | null;
  changeValue: (value: string | number | null) => void;
  placeholder?: string;
  required?: boolean;
  noRender?: boolean;
  disabled?: boolean;
  edit?: boolean;
}

export default function AuthSelectSearch({
  label,
  options,
  value,
  changeValue,
  placeholder = "Pesquise...",
  required = false,
  noRender = false,
  disabled = false,
  edit,
}: AuthSelectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedOption = safeOptions.find((o) => o?.value === value);

  const handleSelect = (newValue: string | number) => {
    changeValue(newValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    changeValue(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  if (noRender) return null;

  return (
    <div className="flex flex-col mb-4">
      <Label>{label}</Label>

      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-full border border-input bg-background px-3 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selectedOption && "text-muted-foreground"
          )}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>

          <span className="flex items-center gap-1 shrink-0 ml-2">
            {selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                onKeyDown={(e) => e.key === 'Enter' && handleClear()}
                className="rounded p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-md">
            {/* Search input */}
            <div className="sticky top-0 border-b border-border bg-popover px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite para pesquisar..."
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full rounded border border-input bg-background px-2 py-1 text-sm text-foreground",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
            </div>

            {/* Options */}
            <ul className="max-h-52 overflow-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer select-none rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      option.value === value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-muted-foreground text-center">
                  Nenhuma opção encontrada
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
