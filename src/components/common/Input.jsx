// src/components/common/Input.jsx
import React from 'react';

/**
 * Componente Input reutilizable
 * @param {string} label - Etiqueta del input
 * @param {string} type - Tipo de input
 * @param {string} name - Nombre del input
 * @param {string} value - Valor del input
 * @param {function} onChange - Función cuando cambia el valor
 * @param {string} placeholder - Placeholder
 * @param {boolean} required - Si es requerido
 * @param {boolean} disabled - Si está deshabilitado
 * @param {string} error - Mensaje de error
 * @param {string} helperText - Texto de ayuda
 * @param {string} className - Clases CSS adicionales
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          px-3 py-2 border rounded-md text-sm
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;