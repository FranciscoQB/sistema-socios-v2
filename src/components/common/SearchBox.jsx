// src/components/common/SearchBox.jsx
import React from 'react';
import { Search } from 'lucide-react';

/**
 * Componente SearchBox para búsquedas
 * @param {string} value - Valor del input
 * @param {function} onChange - Función cuando cambia el valor
 * @param {string} placeholder - Texto de placeholder
 * @param {string} className - Clases CSS adicionales
 */
const SearchBox = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm flex items-center gap-3 px-4 py-3 ${className}`}
      {...props}
    >
      <Search size={20} className="text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBox;