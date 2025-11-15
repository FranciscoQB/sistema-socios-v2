// src/components/common/Button.jsx
import React from 'react';

/**
 * Componente Button reutilizable
 * @param {string} variant - Variante del botón: 'primary', 'secondary', 'danger', 'icon'
 * @param {string} size - Tamaño: 'small', 'medium', 'large'
 * @param {React.ReactNode} children - Contenido del botón
 * @param {React.ReactNode} icon - Ícono a mostrar
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {function} onClick - Función al hacer click
 * @param {string} type - Tipo de botón: 'button', 'submit', 'reset'
 * @param {string} className - Clases CSS adicionales
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  icon,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Clases base
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // Clases según variante
  const variantClasses = {
    primary: 'bg-green-700 text-white hover:bg-green-800 active:bg-green-900',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    icon: 'bg-transparent hover:bg-gray-100 text-gray-700',
    'icon-edit': 'bg-transparent hover:bg-blue-50 text-blue-600',
    'icon-delete': 'bg-transparent hover:bg-red-50 text-red-600'
  };

  // Clases según tamaño
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  // Clases para botones de ícono
  const iconOnlyClasses = variant.includes('icon') ? 'p-2' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${iconOnlyClasses || sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;