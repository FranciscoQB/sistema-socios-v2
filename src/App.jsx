// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { MainLayout } from './components/layout';
import { Loading } from './components/common';

// Importar Login normalmente (se necesita inmediatamente)
import { LoginView } from './views/auth';

// Lazy loading para las demás vistas
const DashboardView = lazy(() => import('./views/dashboard/DashboardView'));
const SociosView = lazy(() => import('./views/socios/SociosView'));
const AportesView = lazy(() => import('./views/aportes/AportesView'));
const AsistenciaView = lazy(() => import('./views/asistencia/AsistenciaView'));
const ProyectosView = lazy(() => import('./views/proyectos/ProyectosView'));
const LibroCajaView = lazy(() => import('./views/libro-caja/LibroCajaView'));
const RecibosView = lazy(() => import('./views/recibos/RecibosView'));
const DocumentosView = lazy(() => import('./views/documentos/DocumentosView'));
const ReportesView = lazy(() => import('./views/reportes/ReportesView'));
const ConfiguracionView = lazy(() => import('./views/configuracion/ConfiguracionView'));

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
    // Envolver en Suspense para mostrar loading mientras carga la vista
    return (
      <Suspense fallback={<Loading message="Cargando vista..." />}>
        {(() => {
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
        })()}
      </Suspense>
    );
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
}

export default App;