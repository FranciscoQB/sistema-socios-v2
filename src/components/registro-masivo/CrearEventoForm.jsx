// src/components/registro-masivo/CrearEventoForm.jsx
import React, { useState } from 'react';
import { Button } from '../common';

const TIPOS_APORTE = [
  { value: 'cuota_mensual', label: 'Cuota Mensual' },
  { value: 'extraordinario', label: 'Aporte Extraordinario' },
  { value: 'multa', label: 'Multa' },
  { value: 'otro', label: 'Otro' }
];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CrearEventoForm = ({ onContinuar, onCancelar }) => {
  const [formData, setFormData] = useState({
    concepto: '',
    montoBase: '',
    fechaDefecto: new Date().toISOString().split('T')[0],
    tipo: 'cuota_mensual',
    mes: MESES[new Date().getMonth()],
    año: new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido';
    }

    if (!formData.montoBase || parseFloat(formData.montoBase) < 0) {
      newErrors.montoBase = 'Ingrese un monto válido';
    }

    if (!formData.fechaDefecto) {
      newErrors.fechaDefecto = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onContinuar({
        ...formData,
        montoBase: parseFloat(formData.montoBase)
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📝 Nuevo Registro Masivo de Aportes
        </h2>
        <p className="text-gray-600 mt-2">
          Define los datos generales del aporte. Estos valores serán aplicados por defecto a todos los socios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-4">
            Información General del Aporte
          </h3>

          <div className="space-y-4">
            {/* Concepto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concepto *
              </label>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleChange}
                placeholder="Ej: Cuota Enero 2024"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.concepto ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.concepto && (
                <p className="text-red-500 text-sm mt-1">{errors.concepto}</p>
              )}
            </div>

            {/* Tipo de Aporte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Aporte *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {TIPOS_APORTE.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto Base y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Base (S/) *
                </label>
                <input
                  type="number"
                  name="montoBase"
                  value={formData.montoBase}
                  onChange={handleChange}
                  placeholder="50.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.montoBase ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.montoBase && (
                  <p className="text-red-500 text-sm mt-1">{errors.montoBase}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha por Defecto *
                </label>
                <input
                  type="date"
                  name="fechaDefecto"
                  value={formData.fechaDefecto}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.fechaDefecto ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaDefecto && (
                  <p className="text-red-500 text-sm mt-1">{errors.fechaDefecto}</p>
                )}
              </div>
            </div>

            {/* Mes y Año */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <select
                  name="mes"
                  value={formData.mes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {MESES.map(mes => (
                    <option key={mes} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  min="2020"
                  max="2100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-blue-500 text-xl mr-3">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Nota importante:</p>
              <p>
                La fecha y el monto podrán ajustarse individualmente para cada socio en el siguiente paso.
                Los socios no seleccionados se registrarán automáticamente como "Pendiente".
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancelar}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Continuar a Selección →
          </Button>
        </div>
      </form>
    </div>
  );
};