// src/components/common/Card.jsx
import React from 'react';

/**
 * Componente Card reutilizable
 * @param {React.ReactNode} children - Contenido de la card
 * @param {string} title - Título opcional de la card
 * @param {React.ReactNode} headerAction - Acción en el header (ej: botón)
 * @param {string} className - Clases CSS adicionales
 */
const Card = ({
  children,
  title,
  headerAction,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;