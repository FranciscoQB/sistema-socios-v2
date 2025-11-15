// src/components/common/Table.jsx
import React from 'react';

/**
 * Componente Table reutilizable
 * @param {Array} columns - Array de columnas [{key, label, render?}]
 * @param {Array} data - Array de datos
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 * @param {string} className - Clases CSS adicionales
 */
const Table = ({
  columns = [],
  data = [],
  emptyMessage = 'No hay datos disponibles',
  className = '',
  ...props
}) => {
  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className="text-left px-4 py-3 font-semibold text-sm text-gray-700 border-b border-gray-200"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className="px-4 py-3 text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;