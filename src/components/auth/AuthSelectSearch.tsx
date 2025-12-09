// src/components/auth/AuthSelectSearch.tsx
import { useState, useRef, useEffect } from 'react';

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
    edit, // ✅ REMOVIDO o valor padrão true
}: AuthSelectSearchProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const safeOptions = Array.isArray(options) ? options : [];

    // Filtra as opções baseado na pesquisa
    const filteredOptions = safeOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Encontra a opção selecionada
    const selectedOption = safeOptions.find(opt => opt?.value === value);

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

    // Fecha o dropdown quando clica fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Foca no input quando abre o dropdown
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (noRender) return null;

    // ✅ DEBUG: Adicione este console.log temporariamente para ver o que está acontecendo
    console.log('AuthSelectSearch:', { edit, value, isOpen, optionsLength: safeOptions.length });

    return (
        <div className="flex flex-col">
            <label>{label}</label>
            
            {/* ✅ CORRIGIDO: Simplificado a condição de loading */}
            <div className="relative" ref={dropdownRef}>
                {/* Trigger do dropdown */}
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`border px-4 py-2 mb-0 cursor-pointer loading-input mb-0 select outline-none flex items-center justify-between ${
                        disabled ? 'bg-gray-200' : 'bg-white'
                    }`}
                    style={{ margin: '0' }}
                >
                    <span className={selectedOption ? '' : 'text-gray-400'}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Botão de limpar (só aparece quando tem valor) */}
                        {selectedOption && !disabled && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="hover:bg-gray-200 rounded-full p-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>
                            </button>
                        )}
                        {/* Ícone de seta */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className={`bi bi-chevron-down ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 16 16"
                            style={{ transition: 'transform 0.3s' }}
                        >
                            <path d="M1.5 5.5l6 6 6-6H1.5z" />
                        </svg>
                    </div>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div
                        className="absolute bg-white border w-full z-10"
                        style={{ marginTop: '0px', maxHeight: '250px', overflow: 'auto' }}
                    >
                        {/* Campo de pesquisa */}
                        <div className="sticky top-0 bg-white border-b px-4 py-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Digite para pesquisar..."
                                className="w-full px-2 py-1 border rounded outline-none focus:border-purple-600"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Lista de opções */}
                        <ul>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                            option.value === value ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-400 text-center">
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