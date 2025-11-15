// src/views/recibos/RecibosView.jsx
import React, { useState } from 'react';
import { Download, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecibos } from '../../hooks/useRecibos';
import { useSocios } from '../../hooks/useSocios';
import {
  Button,
  Table,
  Badge,
  Select,
  StatCard
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Vista de Recibos - Gestión de recibos de pago
 */
const RecibosView = () => {
  const { isAdmin } = useAuth();
  const { socios } = useSocios();
  const {
    filteredRecibos,
    filterEstado,
    setFilterEstado,
    totalRecibos,
    recibosEmitidos,
    recibosAnulados,
    anularRecibo
  } = useRecibos();

  // Anular recibo
  const handleAnular = async (id) => {
    await anularRecibo(id);
  };

  // Descargar recibo (función placeholder)
  const handleDescargar = (recibo) => {
    alert('Función de descarga de recibo en desarrollo');
    // Aquí se implementaría la lógica de generación de PDF
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'numero_recibo',
      label: 'N° Recibo',
      render: (numero) => (
        <span className="font-bold">{numero}</span>
      )
    },
    {
      key: 'fecha_emision',
      label: 'Fecha',
      render: (fecha) => formatDate(fecha)
    },
    {
      key: 'socio_id',
      label: 'Socio',
      render: (socioId) => {
        const socio = socios.find(s => s.id === socioId);
        return socio?.nombre || 'N/A';
      }
    },
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'monto',
      label: 'Monto',
      render: (monto) => (
        <span className="font-bold">{formatCurrency(monto)}</span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado) => (
        <Badge variant={estado === 'emitido' ? 'green' : 'red'}>
          {estado === 'emitido' ? 'Emitido' : 'Anulado'}
        </Badge>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, recibo) => (
        <div className="flex gap-2">
          {recibo.estado === 'emitido' && (
            <>
              <Button
                variant="icon-edit"
                onClick={() => handleDescargar(recibo)}
                title="Descargar"
              >
                <Download size={18} />
              </Button>
              {isAdmin && (
                <Button
                  variant="icon-delete"
                  onClick={() => handleAnular(recibo.id)}
                  title="Anular"
                >
                  <XCircle size={18} />
                </Button>
              )}
            </>
          )}
          {recibo.estado === 'anulado' && (
            <span className="text-sm text-red-600">Anulado</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Gestión de Recibos" />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Recibos"
          value={totalRecibos}
          iconColor="blue"
        />

        <StatCard
          label="Emitidos"
          value={recibosEmitidos}
          iconColor="green"
        />

        <StatCard
          label="Anulados"
          value={recibosAnulados}
          iconColor="orange"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <Select
              label="Estado"
              name="filterEstado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'emitido', label: 'Emitidos' },
                { value: 'anulado', label: 'Anulados' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabla de recibos */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredRecibos}
          emptyMessage="No hay recibos registrados"
        />
      </div>
    </div>
  );
};

export default RecibosView;