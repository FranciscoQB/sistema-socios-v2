// src/components/layout/PageHeader.jsx
import React from 'react';

/**
 * Componente PageHeader - Encabezado de página con título y acciones
 * @param {string} title - Título de la página
 * @param {React.ReactNode} actions - Acciones (botones) a la derecha
 * @param {React.ReactNode} subtitle - Subtítulo opcional
 * @param {string} className - Clases CSS adicionales
 */
const PageHeader = ({
  title,
  actions,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;