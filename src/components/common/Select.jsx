// src/components/common/Select.jsx
import React from 'react';

/**
 * Componente Select reutilizable
 * @param {string} label - Etiqueta del select
 * @param {string} name - Nombre del select
 * @param {string} value - Valor seleccionado
 * @param {function} onChange - Función cuando cambia el valor
 * @param {Array} options - Array de opciones [{value, label}]
 * @param {boolean} required - Si es requerido
 * @param {boolean} disabled - Si está deshabilitado
 * @param {string} error - Mensaje de error
 * @param {string} placeholder - Placeholder (primera opción vacía)
 * @param {string} className - Clases CSS adicionales
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  placeholder,
  className = '',
  ...props
}) => {
  const selectId = name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          px-3 py-2 border rounded-md text-sm
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;