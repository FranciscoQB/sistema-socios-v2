// src/views/auth/LoginView.jsx
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input, Button, Loading } from '../../components/common';
import { ASOCIACION_INFO } from '../../utils/constants';

/**
 * Vista de Login - Pantalla de inicio de sesión
 */
const LoginView = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const { success, error } = await login(email, password);

    if (!success) {
      setError(error || 'Error al iniciar sesión');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Users size={32} className="text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema de Gestión de Socios
          </h1>
          <p className="text-sm text-gray-600">
            {ASOCIACION_INFO.nombre}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="admin@asociacion.com"
            required
            autoComplete="username"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Usuario admin:</strong> admin@asociacion.com<br />
              <strong className="text-gray-900">Contraseña:</strong> Admin123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;