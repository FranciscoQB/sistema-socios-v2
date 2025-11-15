// src/components/layout/Sidebar.jsx
import React from 'react';
import { Download } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MENU_ITEMS, ASOCIACION_INFO } from '../../utils/constants';

/**
 * Componente Sidebar - Barra lateral de navegación
 * @param {string} currentView - Vista actual activa
 * @param {function} onNavigate - Función para cambiar de vista
 * @param {boolean} isOpen - Si el sidebar está abierto (móvil)
 * @param {function} onClose - Función para cerrar el sidebar (móvil)
 * @param {function} onExport - Función para exportar datos
 */
const Sidebar = ({
  currentView,
  onNavigate,
  isOpen = false,
  onClose,
  onExport
}) => {
  // Función para obtener el componente de ícono
  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  // Manejar click en item del menú
  const handleItemClick = (itemId) => {
    onNavigate(itemId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          flex flex-col h-screen
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            {ASOCIACION_INFO.nombre}
          </h2>
          <p className="text-xs text-gray-600">
            {ASOCIACION_INFO.ubicacion}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-colors
                    ${
                      currentView === item.id
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {getIcon(item.icon)}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={onExport}
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-gray-700
              hover:bg-gray-50 transition-colors
            "
          >
            <Download size={20} />
            <span>Exportar Datos</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;