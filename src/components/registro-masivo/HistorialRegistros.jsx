// src/components/registro-masivo/HistorialRegistros.jsx
import React, { useState } from 'react';
import { Search, Eye, FileText, Trash2 } from 'lucide-react';
import { Button } from '../common';

export const HistorialRegistros = ({ 
  registros, 
  onVerDetalle, 
  onNuevoRegistro,
  onEliminar 
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Filtrar registros
  const registrosFiltrados = registros.filter(registro => {
    const cumpleBusqueda = 
      registro.concepto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      registro.mes?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleTipo = filtroTipo === 'todos' || registro.tipo === filtroTipo;

    return cumpleBusqueda && cumpleTipo;
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Historial de Registros Masivos
          </h2>
          <p className="text-gray-600 mt-1">
            Consulta todos los registros masivos realizados
          </p>
        </div>
        <Button variant="primary" onClick={onNuevoRegistro}>
          + Nuevo Registro Masivo
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por concepto o mes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filtro de tipo */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="todos">Todos los tipos</option>
          <option value="cuota_mensual">Cuota Mensual</option>
          <option value="extraordinario">Extraordinario</option>
          <option value="multa">Multa</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Tabla */}
      {registrosFiltrados.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Concepto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Período</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Registros</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Pagados</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Pendientes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrosFiltrados.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatearFecha(registro.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {registro.concepto}
                    </div>
                    {registro.creado_por && (
                      <div className="text-xs text-gray-500">
                        por {registro.creado_por}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTipoLabel(registro.tipo)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {registro.mes} {registro.año}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                    {registro.total_registros}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {registro.total_pagados}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {registro.total_pendientes}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                    S/ {parseFloat(registro.total_monto).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onVerDetalle(registro.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este registro masivo? Esta acción revertirá todos los aportes asociados.')) {
                            onEliminar(registro.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay registros
          </h3>
          <p className="text-gray-500 mb-4">
            {busqueda || filtroTipo !== 'todos' 
              ? 'No se encontraron registros con los filtros aplicados'
              : 'Aún no has creado ningún registro masivo'
            }
          </p>
          {(!busqueda && filtroTipo === 'todos') && (
            <Button variant="primary" onClick={onNuevoRegistro}>
              + Crear Primer Registro
            </Button>
          )}
        </div>
      )}

      {/* Estadísticas generales */}
      {registros.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Registros</div>
            <div className="text-2xl font-bold text-gray-900">{registros.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 mb-1">Total Pagados</div>
            <div className="text-2xl font-bold text-green-700">
              {registros.reduce((sum, r) => sum + r.total_pagados, 0)}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-yellow-600 mb-1">Total Pendientes</div>
            <div className="text-2xl font-bold text-yellow-700">
              {registros.reduce((sum, r) => sum + r.total_pendientes, 0)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Monto Total</div>
            <div className="text-2xl font-bold text-blue-700">
              S/ {registros.reduce((sum, r) => sum + parseFloat(r.total_monto), 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};