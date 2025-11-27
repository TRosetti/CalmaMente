// components/CustomSelect.tsx (Versão Customizada - Não usa <select> nativo)
'use client'
import React, { useState, ReactNode, FocusEventHandler, MouseEventHandler } from 'react';
import styles from './styles.module.css'; // Para o layout base
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'; // Ícones

// Interface de Opção e Props
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  id: string; // ID necessário para acessibilidade
  options: SelectOption[];
  value: string; // Valor selecionado atual
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Mantemos o tipo de evento por compatibilidade com o Formulário
  icon?: ReactNode; 
  required?: boolean;
  placeholder?: string;
  className?: string; // Para estilizar o container externo
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  id,
  options,
  value,
  onChange,
  icon,
  required,
  placeholder = "Selecione uma opção",
  className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    
    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    
    const handleOptionClick = (optionValue: string) => {
    
        const simulatedEvent = {
            target: { value: optionValue, name: id },
    
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(simulatedEvent);
        setIsOpen(false); 
    };

  
    const containerClasses = `
        w-full flex items-center gap-4 bg-white rounded-lg shadow-sm cursor-pointer
        ${className || ''}
        ${styles.containerClasses}
        ${isOpen ? 'ring-1 ring-violet-500' : 'border border-gray-300'}
    `;
    
    return (
        <div className="relative w-full">
            <label htmlFor={id} className={styles.label}>                
                <div className="flex">
                    {label}
                    {required && (
                        <span className="text-red-500 text-lg flex-shrink-0 px-1" title="Obrigatório">*</span>
                    )}
                </div>
            </label>

            {/* O SELETOR VISÍVEL (Simula o Input) */}
            <div
                className={containerClasses}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`dropdown-menu-${id}`}
                role="button"
                tabIndex={0}
            >
                {icon && (
                    <div className="flex-shrink-0 text-gray-500">
                        {icon}
                    </div>
                )}
                
                {/* Texto Selecionado */}
                <span className={`w-full p-1 outline-none bg-transparent ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedLabel}
                </span>

                {/* Ícone de Seta */}
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* MENU DE OPÇÕES CUSTOMIZADO */}
            {isOpen && (
                <ul
                    id={`dropdown-menu-${id}`}
                    role="listbox"
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`
                                flex items-center justify-between px-4 py-2 text-gray-700 cursor-pointer 
                                hover:bg-indigo-50 transition-colors duration-150
                                ${option.value === value ? 'bg-indigo-100 font-medium' : ''}
                            `}
                        >
                            {option.label}
                            {option.value === value && (
                                <CheckIcon className="h-5 w-5 text-indigo-600" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default CustomSelect;