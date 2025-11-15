// src/components/common/Loading.jsx
import React from 'react';

/**
 * Componente Loading para estados de carga
 * @param {string} message - Mensaje a mostrar
 * @param {string} size - Tamaño: 'small', 'medium', 'large'
 * @param {boolean} fullScreen - Si ocupa toda la pantalla
 */
const Loading = ({
  message = 'Cargando...',
  size = 'medium',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`
            ${sizeClasses[size] || sizeClasses.medium}
            border-4 border-gray-200 border-t-green-700
            rounded-full animate-spin
          `}
        />
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;