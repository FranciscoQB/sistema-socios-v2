// src/components/common/Badge.jsx
import React from 'react';

/**
 * Componente Badge para mostrar etiquetas/estados
 * @param {string} variant - Variante del badge: 'green', 'red', 'blue', 'gray', 'orange'
 * @param {React.ReactNode} children - Contenido del badge
 * @param {string} className - Clases CSS adicionales
 */
const Badge = ({
  variant = 'gray',
  children,
  className = '',
  ...props
}) => {
  // Clases base
  const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-medium';

  // Clases según variante
  const variantClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-600',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-800'
  };

  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.gray}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;