// src/components/layout/Header.jsx
import React from 'react';
import { Users, Settings, LogOut, Menu } from 'lucide-react';
import Button from '../common/Button';

/**
 * Componente Header - Encabezado de la aplicación
 * @param {object} userProfile - Perfil del usuario actual
 * @param {function} onLogout - Función para cerrar sesión
 * @param {function} onSettings - Función para ir a configuración
 * @param {function} onToggleSidebar - Función para toggle del sidebar (móvil)
 */
const Header = ({
  userProfile,
  onLogout,
  onSettings,
  onToggleSidebar
}) => {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Menu button para móvil */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <Users size={28} />
              <div>
                <h1 className="text-lg lg:text-xl font-bold">
                  Sistema de Gestión de Socios
                </h1>
                {userProfile && (
                  <p className="text-xs opacity-90 hidden sm:block">
                    {userProfile.nombre}
                    {userProfile.rol === 'admin' && ' (Administrador)'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              onClick={onSettings}
              className="text-white hover:bg-green-600"
              title="Configuración"
            >
              <Settings size={20} />
              <span className="hidden sm:inline">Configurar</span>
            </Button>

            <Button
              variant="icon"
              onClick={onLogout}
              className="text-white hover:bg-green-600"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;