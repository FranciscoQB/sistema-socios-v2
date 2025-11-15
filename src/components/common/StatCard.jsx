// src/components/common/StatCard.jsx
import React from 'react';

/**
 * Componente StatCard para mostrar estadísticas
 * @param {string} label - Etiqueta de la estadística
 * @param {string|number} value - Valor de la estadística
 * @param {React.ReactNode} icon - Ícono a mostrar
 * @param {string} iconColor - Color del ícono: 'green', 'orange', 'blue', 'purple'
 * @param {string} className - Clases CSS adicionales
 */
const StatCard = ({
  label,
  value,
  icon,
  iconColor = 'green',
  className = '',
  ...props
}) => {
  // Clases de color para el ícono
  const iconColorClasses = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 ${className}`}
      {...props}
    >
      {icon && (
        <div
          className={`p-3 rounded-full flex items-center justify-center ${
            iconColorClasses[iconColor] || iconColorClasses.green
          }`}
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;