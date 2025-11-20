// src/views/registro-masivo/RegistroMasivoView.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CrearEventoForm, 
  TablaSeleccionSocios, 
  ModalConfirmacion,
  HistorialRegistros,
  DetalleRegistro
} from '../../components/registro-masivo';

const PASOS = {
  HISTORIAL: 'historial',
  CREAR_EVENTO: 'crear_evento',
  SELECCIONAR_SOCIOS: 'seleccionar_socios',
  VER_DETALLE: 'ver_detalle'
};

const RegistroMasivoView = () => {
  const { 
    socios, 
    registrosMasivos,
    validarDuplicados,
    crearRegistroMasivo,
    getRegistroMasivoConAportes,
    actualizarAporteIndividual,
    eliminarRegistroMasivo,
    loadRegistrosMasivos
  } = useApp();

  const [pasoActual, setPasoActual] = useState(PASOS.HISTORIAL);
  const [eventoData, setEventoData] = useState(null);
  const [aportesData, setAportesData] = useState(null);
  const [resumenData, setResumenData] = useState(null);
  const [duplicados, setDuplicados] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registroDetalle, setRegistroDetalle] = useState(null);
  const [editandoAporte, setEditandoAporte] = useState(null);

  // Cargar registros masivos al montar
  useEffect(() => {
    loadRegistrosMasivos();
  }, []);

  // ==================== HANDLERS ====================

  const handleNuevoRegistro = () => {
    setPasoActual(PASOS.CREAR_EVENTO);
    setEventoData(null);
    setAportesData(null);
    setDuplicados([]);
  };

  const handleContinuarEvento = async (formData) => {
    setEventoData(formData);

    // Validar duplicados
    const sociosIds = socios.map(s => s.id);
    const { duplicados: dups } = await validarDuplicados(
      sociosIds, 
      formData.mes, 
      formData.año
    );
    
    setDuplicados(dups || []);
    setPasoActual(PASOS.SELECCIONAR_SOCIOS);
  };

  const handleContinuarSeleccion = (aportes, resumen) => {
    setAportesData(aportes);
    setResumenData(resumen);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarRegistro = async () => {
    setLoading(true);
    try {
      const registroInfo = {
        concepto: eventoData.concepto,
        tipo: eventoData.tipo,
        mes: eventoData.mes,
        año: eventoData.año,
        montoBase: eventoData.montoBase,
        fechaDefecto: eventoData.fechaDefecto,
        creadoPor: 'Administrador'
      };

      const { data, error } = await crearRegistroMasivo(registroInfo, aportesData);

      if (error) {
        alert('Error al crear el registro masivo: ' + error.message);
        return;
      }

      // Mostrar mensaje de éxito
      alert(`✅ ¡Registro exitoso!\n\n${resumenData.seleccionados + resumenData.noSeleccionados} aportes registrados correctamente.`);

      // Volver al historial
      setMostrarConfirmacion(false);
      setPasoActual(PASOS.HISTORIAL);
      resetearFormulario();
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  const handleVolverAEvento = () => {
    setPasoActual(PASOS.CREAR_EVENTO);
  };

  const handleCancelarCreacion = () => {
    if (confirm('¿Estás seguro de cancelar? Se perderán todos los datos ingresados.')) {
      resetearFormulario();
      setPasoActual(PASOS.HISTORIAL);
    }
  };

  const handleVerDetalle = async (registroId) => {
    setLoading(true);
    try {
      const { data, error } = await getRegistroMasivoConAportes(registroId);
      
      if (error) {
        alert('Error al cargar el detalle');
        return;
      }

      setRegistroDetalle(data);
      setPasoActual(PASOS.VER_DETALLE);
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al cargar el detalle');
    } finally {
      setLoading(false);
    }
  };

  const handleVolverHistorial = () => {
    setRegistroDetalle(null);
    setPasoActual(PASOS.HISTORIAL);
  };

  const handleEliminarRegistro = async (registroId) => {
    setLoading(true);
    try {
      const { error } = await eliminarRegistroMasivo(registroId);
      
      if (error) {
        alert('Error al eliminar el registro: ' + error.message);
        return;
      }

      alert('✅ Registro eliminado correctamente');
      loadRegistrosMasivos();
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarAporte = (aporte) => {
    setEditandoAporte({
      id: aporte.id,
      socio: `${aporte.socio?.nombre}`,
      monto: aporte.monto,
      fecha: aporte.fecha,
      comentario: aporte.comentario || '',
      estado: aporte.estado
    });
  };

  const handleGuardarEdicionAporte = async () => {
    if (!editandoAporte) return;

    setLoading(true);
    try {
      const datosActualizados = {
        monto: parseFloat(editandoAporte.monto),
        fecha: editandoAporte.fecha,
        comentario: editandoAporte.comentario,
        estado: parseFloat(editandoAporte.monto) > 0 ? 'pagado' : 'pendiente'
      };

      const { error } = await actualizarAporteIndividual(editandoAporte.id, datosActualizados);

      if (error) {
        alert('Error al actualizar el aporte: ' + error.message);
        return;
      }

      alert('✅ Aporte actualizado correctamente');
      
      // Recargar el detalle
      if (registroDetalle) {
        await handleVerDetalle(registroDetalle.id);
      }

      setEditandoAporte(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleExportarDetalle = (registro) => {
    // TODO: Implementar exportación a PDF/Excel
    alert('Función de exportación en desarrollo');
  };

  const resetearFormulario = () => {
    setEventoData(null);
    setAportesData(null);
    setResumenData(null);
    setDuplicados([]);
  };

  // ==================== RENDER ====================

  const renderContenido = () => {
    switch (pasoActual) {
      case PASOS.HISTORIAL:
        return (
          <HistorialRegistros
            registros={registrosMasivos}
            onVerDetalle={handleVerDetalle}
            onNuevoRegistro={handleNuevoRegistro}
            onEliminar={handleEliminarRegistro}
          />
        );

      case PASOS.CREAR_EVENTO:
        return (
          <CrearEventoForm
            onContinuar={handleContinuarEvento}
            onCancelar={handleCancelarCreacion}
          />
        );

      case PASOS.SELECCIONAR_SOCIOS:
        return (
          <TablaSeleccionSocios
            socios={socios}
            eventoData={eventoData}
            duplicados={duplicados}
            onContinuar={handleContinuarSeleccion}
            onVolver={handleVolverAEvento}
          />
        );

      case PASOS.VER_DETALLE:
        return (
          <DetalleRegistro
            registro={registroDetalle}
            onVolver={handleVolverHistorial}
            onEditarAporte={handleEditarAporte}
            onExportar={handleExportarDetalle}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <button 
          onClick={() => setPasoActual(PASOS.HISTORIAL)}
          className="hover:text-green-600"
        >
          Registro Masivo
        </button>
        {pasoActual !== PASOS.HISTORIAL && (
          <>
            <span>/</span>
            <span className="text-gray-900">
              {pasoActual === PASOS.CREAR_EVENTO && 'Nuevo Registro'}
              {pasoActual === PASOS.SELECCIONAR_SOCIOS && 'Seleccionar Socios'}
              {pasoActual === PASOS.VER_DETALLE && 'Detalle de Registro'}
            </span>
          </>
        )}
      </div>

      {/* Contenido Principal */}
      {renderContenido()}

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <ModalConfirmacion
          eventoData={eventoData}
          resumen={resumenData}
          onConfirmar={handleConfirmarRegistro}
          onCancelar={handleCancelarConfirmacion}
          loading={loading}
        />
      )}

      {/* Modal de Edición de Aporte */}
      {editandoAporte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Editar Aporte - {editandoAporte.socio}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (S/)
                </label>
                <input
                  type="number"
                  value={editandoAporte.monto}
                  onChange={(e) => setEditandoAporte(prev => ({
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
                  value={editandoAporte.fecha}
                  onChange={(e) => setEditandoAporte(prev => ({
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
                  value={editandoAporte.comentario}
                  onChange={(e) => setEditandoAporte(prev => ({
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
              <button
                onClick={() => setEditandoAporte(null)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarEdicionAporte}
                disabled={loading}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && pasoActual === PASOS.VER_DETALLE && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="text-gray-700">Cargando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroMasivoView;