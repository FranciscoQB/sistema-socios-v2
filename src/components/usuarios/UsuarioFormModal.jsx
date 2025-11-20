// src/components/usuarios/UsuarioFormModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common';
import { ROLES } from '../../utils/permissions';
import { useAuth } from '../../context/AuthContext';

const ROLES_OPTIONS = [
  { value: ROLES.PRESIDENTE, label: 'Presidente', description: 'Administrador de la organización' },
  { value: ROLES.TESORERO, label: 'Tesorero', description: 'Gestiona finanzas y aportes' },
  { value: ROLES.SECRETARIO, label: 'Secretario', description: 'Gestión administrativa' },
  { value: ROLES.DELEGADO, label: 'Delegado de Manzana', description: 'Representa un sector' },
  { value: ROLES.SOCIO, label: 'Socio', description: 'Usuario básico' }
];

export const UsuarioFormModal = ({ 
  usuario = null, 
  onSave, 
  onClose, 
  isOpen 
}) => {
  const { isSuperAdmin, organizacionId } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    rol: ROLES.SOCIO,
    organizacion_id: organizacionId,
    manzana_id: null,
    socio_id: null,
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: '', // No mostrar email en edición
        telefono: usuario.telefono || '',
        password: '',
        rol: usuario.rol || ROLES.SOCIO,
        organizacion_id: usuario.organizacion_id || organizacionId,
        manzana_id: usuario.manzana_id || null,
        socio_id: usuario.socio_id || null,
        estado: usuario.estado || 'activo'
      });
    }
  }, [usuario, organizacionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!usuario) { // Solo validar email y password en creación
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mínimo 6 caracteres';
      }
    }

    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error guardando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {usuario ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Juan Pérez"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Email (solo en creación) */}
            {!usuario && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+51 987654321"
              />
            </div>

            {/* Contraseña (solo en creación) */}
            {!usuario && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  El usuario podrá cambiar su contraseña después
                </p>
              </div>
            )}

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <div className="space-y-2">
                {ROLES_OPTIONS.map((rol) => (
                  <label
                    key={rol.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.rol === rol.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={rol.value}
                      checked={formData.rol === rol.value}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{rol.label}</div>
                      <div className="text-sm text-gray-600">{rol.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.rol && (
                <p className="text-red-500 text-sm mt-1">{errors.rol}</p>
              )}
            </div>

            {/* Estado (solo en edición) */}
            {usuario && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};