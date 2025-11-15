// src/App.jsx
import React from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { MainLayout } from './components/layout';
import { Loading } from './components/common';

// Importar todas las vistas
import { LoginView } from './views/auth';
import { DashboardView } from './views/dashboard';
import { SociosView } from './views/socios';
import { AportesView } from './views/aportes';
import { AsistenciaView } from './views/asistencia';
import { ProyectosView } from './views/proyectos';
import { LibroCajaView } from './views/libro-caja';
import { RecibosView } from './views/recibos';
import { DocumentosView } from './views/documentos';
import { ReportesView } from './views/reportes';
import { ConfiguracionView } from './views/configuracion';

function App() {
  const { session, loading: authLoading } = useAuth();
  const { currentView, loading: appLoading } = useApp();

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return <Loading fullScreen message="Cargando sistema..." />;
  }

  // Si no hay sesión, mostrar login
  if (!session) {
    return <LoginView />;
  }

  // Mostrar loading mientras cargan los datos
  if (appLoading) {
    return <Loading fullScreen message="Cargando datos..." />;
  }

  // Renderizar vista según currentView
  const renderView = () => {
    switch (currentView) {
      case 'inicio':
        return <DashboardView />;
      case 'socios':
        return <SociosView />;
      case 'aportes':
        return <AportesView />;
      case 'asistencia':
        return <AsistenciaView />;
      case 'proyectos':
        return <ProyectosView />;
      case 'libro-caja':
        return <LibroCajaView />;
      case 'recibos':
        return <RecibosView />;
      case 'documentos':
        return <DocumentosView />;
      case 'reportes':
        return <ReportesView />;
      case 'configuracion':
        return <ConfiguracionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
}

export default App;