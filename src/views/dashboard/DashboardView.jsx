// src/views/dashboard/DashboardView.jsx
import React from 'react';
import { Users, DollarSign, BarChart3, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, Card } from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/formatters';

/**
 * Vista del Dashboard - Pantalla de inicio con estadísticas generales
 */
const DashboardView = () => {
  const {
    getSociosActivos,
    getTotalCuotasPendientes,
    getPromedioAsistencia,
    reuniones,
    avisos
  } = useApp();

  const sociosActivos = getSociosActivos();
  const totalCuotasPendientes = getTotalCuotasPendientes();
  const promedioAsistencia = getPromedioAsistencia();

  // Obtener próxima reunión programada
  const proximaReunion = reuniones
    .filter(r => r.estado === 'programada')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

  return (
    <div>
      <PageHeader title="Dashboard General" />

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Socios activos"
          value={sociosActivos.length}
          icon={<Users size={32} />}
          iconColor="green"
        />

        <StatCard
          label="Cuotas pendientes"
          value={formatCurrency(totalCuotasPendientes)}
          icon={<DollarSign size={32} />}
          iconColor="orange"
        />

        <StatCard
          label="Asistencia promedio"
          value={`${promedioAsistencia}%`}
          icon={<BarChart3 size={32} />}
          iconColor="blue"
        />

        <StatCard
          label="Próxima reunión"
          value={proximaReunion ? proximaReunion.fecha : 'Sin programar'}
          icon={<Calendar size={32} />}
          iconColor="purple"
        />
      </div>

      {/* Avisos importantes */}
      <Card title="Últimos avisos">
        {avisos.length > 0 ? (
          <ul className="space-y-3">
            {avisos.slice(0, 5).map((aviso) => (
              <li key={aviso.id} className="flex gap-3">
                <span className="text-green-600 font-bold text-lg">•</span>
                <div>
                  <span className="font-semibold text-gray-900">
                    {aviso.titulo}
                  </span>
                  {aviso.descripcion && (
                    <span className="text-gray-600"> - {aviso.descripcion}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No hay avisos disponibles
          </p>
        )}
      </Card>
    </div>
  );
};

export default DashboardView;