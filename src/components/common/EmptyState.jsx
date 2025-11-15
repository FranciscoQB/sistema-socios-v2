// src/components/common/EmptyState.jsx
import React from 'react';

/**
 * Componente EmptyState - Estado vacío cuando no hay datos
 * @param {React.ReactNode} icon - Ícono a mostrar
 * @param {string} title - Título del mensaje
 * @param {string} message - Mensaje descriptivo
 * @param {React.ReactNode} action - Acción (botón) opcional
 * @param {string} className - Clases CSS adicionales
 */
const EmptyState = ({
  icon,
  title = 'No hay datos',
  message,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-gray-600 text-center max-w-md mb-6">
          {message}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;