// src/components/registro-masivo/ModalConfirmacion.jsx
import React from 'react';
import { Button } from '../common';

export const ModalConfirmacion = ({ 
  eventoData, 
  resumen, 
  onConfirmar, 
  onCancelar,
  loading = false 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ⚠️ Confirmar Registro Masivo
            </h2>
          </div>

          {/* Información del Evento */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Información del Aporte:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Concepto:</span>
                <span className="font-semibold text-gray-900">{eventoData.concepto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-semibold text-gray-900">
                  {eventoData.tipo === 'cuota_mensual' ? 'Cuota Mensual' : 
                   eventoData.tipo === 'extraordinario' ? 'Aporte Extraordinario' : 
                   eventoData.tipo === 'multa' ? 'Multa' : 'Otro'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Período:</span>
                <span className="font-semibold text-gray-900">
                  {eventoData.mes} {eventoData.año}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto Base:</span>
                <span className="font-semibold text-gray-900">
                  S/ {eventoData.montoBase.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen de Registros */}
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold text-gray-800">
              📊 Resumen de Registros:
            </h3>

            {/* Pagados */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-2">
                    PAGADO ({resumen.seleccionados} socios)
                  </h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex justify-between">
                      <span>Total recaudado:</span>
                      <span className="font-semibold">S/ {resumen.totalMonto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Con comentarios:</span>
                      <span className="font-semibold">{resumen.conComentarios} registros</span>
                    </div>
                    {resumen.conComentarios > 0 && (
                      <p className="text-xs mt-2">
                        (Incluye pagos parciales, atrasados, etc.)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pendientes */}
            {resumen.noSeleccionados > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏳</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      NO PAGÓ / PENDIENTE ({resumen.noSeleccionados} socios)
                    </h4>
                    <div className="space-y-1 text-sm text-yellow-700">
                      <div className="flex justify-between">
                        <span>Monto:</span>
                        <span className="font-semibold">S/ 0.00</span>
                      </div>
                      <p className="text-xs mt-2">
                        Se marcarán como "Pendiente de pago" y aparecerán en reportes de morosidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Duplicados */}
            {resumen.duplicados > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      DUPLICADOS ({resumen.duplicados} socios)
                    </h4>
                    <p className="text-sm text-orange-700">
                      Estos socios ya tienen registros para {eventoData.mes} {eventoData.año} y fueron excluidos automáticamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total de registros */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-800">
                📝 Total de registros a crear:
              </span>
              <span className="text-2xl font-bold text-blue-900">
                {resumen.seleccionados + resumen.noSeleccionados}
              </span>
            </div>
          </div>

          {/* Advertencia */}
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Esta acción creará {resumen.seleccionados + resumen.noSeleccionados} registros en el sistema de aportes</li>
                  <li>Los montos pagados se sumarán automáticamente a cada socio</li>
                  <li>Los pendientes aparecerán en reportes de morosidad</li>
                  <li>Podrás editar registros individuales después si es necesario</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={onCancelar}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={onConfirmar}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Registrando...
                </>
              ) : (
                <>✅ Confirmar y Registrar</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};