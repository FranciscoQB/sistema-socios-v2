// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { MENSAJES_CONFIRMACION } from '../../utils/constants';

/**
 * Componente MainLayout - Layout principal de la aplicación
 * @param {React.ReactNode} children - Contenido a renderizar
 */
const MainLayout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const { currentView, setCurrentView, setSidebarOpen, sidebarOpen } = useApp();

  // Manejar navegación
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    if (window.confirm(MENSAJES_CONFIRMACION.CERRAR_SESION)) {
      await logout();
      setCurrentView('inicio');
    }
  };

  // Manejar ir a configuración
  const handleSettings = () => {
    setCurrentView('configuracion');
    setSidebarOpen(false);
  };

  // Manejar toggle del sidebar
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Manejar cierre del sidebar
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Manejar exportación de datos
  const handleExport = () => {
    // Esta función se puede implementar en el contexto o aquí
    const datos = {
      fecha: new Date().toISOString(),
      version: '2.0.0'
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-socios-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onExport={handleExport}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userProfile={userProfile}
          onLogout={handleLogout}
          onSettings={handleSettings}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;