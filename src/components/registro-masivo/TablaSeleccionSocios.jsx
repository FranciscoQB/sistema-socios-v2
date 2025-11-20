// src/components/registro-masivo/TablaSeleccionSocios.jsx
import React, { useState, useEffect } from 'react';
import { Search, Edit2, CheckSquare, Square } from 'lucide-react';
import { Button } from '../common';

export const TablaSeleccionSocios = ({ 
  socios, 
  eventoData, 
  onContinuar, 
  onVolver,
  duplicados = []
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [sociosSeleccionados, setSociosSeleccionados] = useState({});
  const [editandoSocio, setEditandoSocio] = useState(null);
  const [datosPersonalizados, setDatosPersonalizados] = useState({});

  // Inicializar todos los socios con datos por defecto
  useEffect(() => {
    const inicial = {};
    const personalizados = {};
    
    socios.forEach(socio => {
      const tieneDuplicado = duplicados.some(d => d.socio_id === socio.id);
      
      inicial[socio.id] = !tieneDuplicado; // Seleccionar todos excepto duplicados
      personalizados[socio.id] = {
        monto: eventoData.montoBase,
        fecha: eventoData.fechaDefecto,
        comentario: '',
        estado: 'pagado' // Por defecto "pagado"
      };
    });
    
    setSociosSeleccionados(inicial);
    setDatosPersonalizados(personalizados);
  }, [socios, eventoData, duplicados]);

  // Filtrar socios según búsqueda
  const sociosFiltrados = socios.filter(socio => {
    const termino = busqueda.toLowerCase();
    return (
      socio.nombre?.toLowerCase().includes(termino) ||
      socio.apellidos?.toLowerCase().includes(termino) ||
      socio.dni?.toLowerCase().includes(termino) ||
      socio.lote?.toLowerCase().includes(termino)
    );
  });

  // Toggle selección de socio
  const toggleSocio = (socioId) => {
    setSociosSeleccionados(prev => ({
      ...prev,
      [socioId]: !prev[socioId]
    }));
  };

  // Seleccionar todos
  const seleccionarTodos = () => {
    const nuevaSeleccion = {};
    sociosFiltrados.forEach(socio => {
      nuevaSeleccion[socio.id] = true;
    });
    setSociosSeleccionados(prev => ({ ...prev, ...nuevaSeleccion }));
  };

  // Deseleccionar todos
  const deseleccionarTodos = () => {
    const nuevaSeleccion = {};
    sociosFiltrados.forEach(socio => {
      nuevaSeleccion[socio.id] = false;
    });
    setSociosSeleccionados(prev => ({ ...prev, ...nuevaSeleccion }));
  };

  // Seleccionar solo activos
  const seleccionarActivos = () => {
    const nuevaSeleccion = {};
    sociosFiltrados
      .filter(socio => socio.estado === 'activo')
      .forEach(socio => {
        nuevaSeleccion[socio.id] = true;
      });
    setSociosSeleccionados(prev => ({ ...prev, ...nuevaSeleccion }));
  };

  // Abrir modal de edición
  const abrirEdicion = (socio) => {
    setEditandoSocio({
      ...socio,
      ...datosPersonalizados[socio.id]
    });
  };

  // Guardar datos personalizados
  const guardarDatosPersonalizados = () => {
    if (editandoSocio) {
      setDatosPersonalizados(prev => ({
        ...prev,
        [editandoSocio.id]: {
          monto: parseFloat(editandoSocio.monto) || 0,
          fecha: editandoSocio.fecha,
          comentario: editandoSocio.comentario || '',
          estado: parseFloat(editandoSocio.monto) > 0 ? 'pagado' : 'pendiente'
        }
      }));
      setEditandoSocio(null);
    }
  };

  // Calcular resumen
  const getResumen = () => {
    const seleccionados = Object.entries(sociosSeleccionados)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    const noSeleccionados = socios.length - seleccionados.length;
    
    const totalMonto = seleccionados.reduce((sum, id) => {
      return sum + (datosPersonalizados[id]?.monto || 0);
    }, 0);

    const conComentarios = seleccionados.filter(id => 
      datosPersonalizados[id]?.comentario
    ).length;

    return {
      seleccionados: seleccionados.length,
      noSeleccionados,
      totalMonto,
      conComentarios,
      duplicados: duplicados.length
    };
  };

  // Preparar datos para continuar
  const handleContinuar = () => {
    const aportes = socios.map(socio => {
      const seleccionado = sociosSeleccionados[socio.id];
      const datos = datosPersonalizados[socio.id];
      
      return {
        socio_id: socio.id,
        concepto: eventoData.concepto,
        tipo: eventoData.tipo,
        mes: eventoData.mes,
        año: eventoData.año,
        monto: seleccionado ? datos.monto : 0,
        fecha: seleccionado ? datos.fecha : eventoData.fechaDefecto,
        estado: seleccionado && datos.monto > 0 ? 'pagado' : 'pendiente',
        comentario: datos.comentario || (seleccionado ? '' : 'No pagó')
      };
    });

    onContinuar(aportes, getResumen());
  };

  const resumen = getResumen();

  const verificarDuplicado = (socioId) => {
    return duplicados.some(d => d.socio_id === socioId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ✓ Seleccionar Socios que Pagaron
        </h2>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">{eventoData.concepto}</span> - S/ {eventoData.montoBase.toFixed(2)}
        </p>
      </div>

      {/* Alertas de duplicados */}
      {duplicados.length > 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-500 text-xl mr-3">⚠️</span>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Duplicados Detectados</p>
              <p>
                {duplicados.length} socios ya tienen aportes registrados para {eventoData.mes} {eventoData.año}.
                Estos socios están desmarcados por defecto.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={seleccionarTodos}>
          ✓ Todos
        </Button>
        <Button variant="secondary" size="sm" onClick={deseleccionarTodos}>
          □ Ninguno
        </Button>
        <Button variant="secondary" size="sm" onClick={seleccionarActivos}>
          ✓ Solo Activos
        </Button>

        {/* Búsqueda */}
        <div className="flex-1 min-w-[200px]">
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
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sel.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">DNI</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Lote</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Monto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Comentario</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sociosFiltrados.map((socio) => {
              const seleccionado = sociosSeleccionados[socio.id];
              const datos = datosPersonalizados[socio.id] || {};
              const esDuplicado = verificarDuplicado(socio.id);

              return (
                <tr 
                  key={socio.id}
                  className={`hover:bg-gray-50 ${esDuplicado ? 'bg-yellow-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSocio(socio.id)}
                      className="text-gray-600 hover:text-green-600"
                    >
                      {seleccionado ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{socio.dni}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {socio.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{socio.lote}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    S/ {seleccionado ? datos.monto?.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {seleccionado ? datos.fecha : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
                    {datos.comentario || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      esDuplicado 
                        ? 'bg-yellow-100 text-yellow-800'
                        : seleccionado && datos.monto > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {esDuplicado ? 'Duplicado' : seleccionado ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => abrirEdicion(socio)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sociosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron socios
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">📊 Resumen:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Seleccionados:</span>
            <p className="font-semibold text-gray-900">{resumen.seleccionados} socios</p>
          </div>
          <div>
            <span className="text-gray-600">Pendientes:</span>
            <p className="font-semibold text-gray-900">{resumen.noSeleccionados} socios</p>
          </div>
          <div>
            <span className="text-gray-600">Total a registrar:</span>
            <p className="font-semibold text-green-600">S/ {resumen.totalMonto.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-600">Con comentarios:</span>
            <p className="font-semibold text-gray-900">{resumen.conComentarios}</p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="secondary" onClick={onVolver}>
          ← Atrás
        </Button>
        <Button 
          variant="primary" 
          onClick={handleContinuar}
          disabled={resumen.seleccionados === 0 && resumen.noSeleccionados === 0}
        >
          Continuar a Confirmación →
        </Button>
      </div>

      {/* Modal de Edición */}
      {editandoSocio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Editar Aporte - {editandoSocio.nombre} {editandoSocio.apellidos}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (S/)
                </label>
                <input
                  type="number"
                  value={editandoSocio.monto}
                  onChange={(e) => setEditandoSocio(prev => ({
                    ...prev,
                    monto: e.target.value
                  }))}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago
                </label>
                <input
                  type="date"
                  value={editandoSocio.fecha}
                  onChange={(e) => setEditandoSocio(prev => ({
                    ...prev,
                    fecha: e.target.value
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  value={editandoSocio.comentario}
                  onChange={(e) => setEditandoSocio(prev => ({
                    ...prev,
                    comentario: e.target.value
                  }))}
                  placeholder="Ej: Pago parcial - debe S/25"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setEditandoSocio(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={guardarDatosPersonalizados}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};