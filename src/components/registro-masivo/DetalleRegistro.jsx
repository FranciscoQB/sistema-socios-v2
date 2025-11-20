// src/components/registro-masivo/DetalleRegistro.jsx
import React, { useState } from 'react';
import { ArrowLeft, Search, Edit2, Download } from 'lucide-react';
import { Button } from '../common';

export const DetalleRegistro = ({ 
  registro, 
  onVolver, 
  onEditarAporte,
  onExportar 
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  if (!registro) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">Cargando...</p>
      </div>
    );
  }

  // Filtrar aportes
  const aportesFiltrados = (registro.aportes || []).filter(aporte => {
    const socio = aporte.socio;
    const cumpleBusqueda = 
      socio?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio?.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio?.dni?.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio?.lote?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'todos' || aporte.estado === filtroEstado;

    return cumpleBusqueda && cumpleEstado;
  });

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      'cuota_mensual': 'Cuota Mensual',
      'extraordinario': 'Extraordinario',
      'multa': 'Multa',
      'otro': 'Otro'
    };
    return tipos[tipo] || tipo;
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'pagado': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'pago_parcial': 'bg-orange-100 text-orange-800'
    };
    
    const labels = {
      'pagado': 'Pagado',
      'pendiente': 'Pendiente',
      'pago_parcial': 'Pago Parcial'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estilos[estado]}`}>
        {labels[estado]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onVolver}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Historial
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              📄 {registro.concepto}
            </h2>
            <p className="text-gray-600 mt-1">
              Creado el {formatearFecha(registro.created_at)} por {registro.creado_por || 'Administrador'}
            </p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => onExportar(registro)}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Información del Registro */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Tipo</div>
          <div className="font-semibold text-gray-900">{getTipoLabel(registro.tipo)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Período</div>
          <div className="font-semibold text-gray-900">{registro.mes} {registro.año}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Monto Base</div>
          <div className="font-semibold text-gray-900">S/ {parseFloat(registro.monto_base).toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Fecha Defecto</div>
          <div className="font-semibold text-gray-900">{formatearFecha(registro.fecha_defecto)}</div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Total Registros</div>
          <div className="text-2xl font-bold text-blue-700">{registro.total_registros}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">Pagados</div>
          <div className="text-2xl font-bold text-green-700">{registro.total_pagados}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600 mb-1">Pendientes</div>
          <div className="text-2xl font-bold text-yellow-700">{registro.total_pendientes}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">Total Recaudado</div>
          <div className="text-2xl font-bold text-purple-700">S/ {parseFloat(registro.total_monto).toFixed(2)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar socio..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filtro de estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="todos">Todos los estados</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
          <option value="pago_parcial">Pago Parcial</option>
        </select>
      </div>

      {/* Tabla de Aportes */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">DNI</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Socio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Lote</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Monto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Comentario</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {aportesFiltrados.map((aporte) => (
              <tr key={aporte.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {aporte.socio?.dni}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {aporte.socio?.nombre}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {aporte.socio?.lote}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  S/ {parseFloat(aporte.monto).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {aporte.fecha ? formatearFecha(aporte.fecha) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                  {aporte.comentario || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {getEstadoBadge(aporte.estado)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEditarAporte(aporte)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {aportesFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron aportes
          </div>
        )}
      </div>
    </div>
  );
};