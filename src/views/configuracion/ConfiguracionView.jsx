// src/views/configuracion/ConfiguracionView.jsx
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase/client';
import {
  Button,
  Card,
  Input,
  Select,
  Table,
  Modal,
  ModalFooter,
  Badge
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatDate } from '../../utils/formatters';
import { ASOCIACION_INFO, MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../../utils/constants';

/**
 * Vista de Configuración - Gestión de usuarios y configuración del sistema
 */
const ConfiguracionView = () => {
  const { isAdmin, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    if (activeTab === 'usuarios' && isAdmin) {
      loadUsuarios();
    }
  }, [activeTab, isAdmin]);

  const loadUsuarios = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const nombre = formData.get('nombre');
    const rol = formData.get('rol');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('perfiles')
        .insert([{
          id: authData.user.id,
          nombre: nombre,
          rol: rol
        }]);

      if (profileError) throw profileError;

      alert(MENSAJES_EXITO.USUARIO_CREADO);
      setShowModal(false);
      loadUsuarios();
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Error al crear usuario: ' + error.message);
    }
  };

  // Actualizar rol de usuario
  const handleUpdateRole = async (userId, nuevoRol) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ rol: nuevoRol })
        .eq('id', userId);

      if (error) throw error;

      alert('Rol actualizado exitosamente');
      loadUsuarios();
    } catch (error) {
      console.error('Error actualizando rol:', error);
      alert('Error al actualizar rol');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`${MENSAJES_CONFIRMACION.ELIMINAR_USUARIO} ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('perfiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('Usuario eliminado exitosamente');
      loadUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const { success } = await updatePassword(newPassword);
    if (success) {
      alert(MENSAJES_EXITO.PASSWORD_ACTUALIZADA);
      e.target.reset();
    }
  };

  // Tabs
  const tabs = [
    { id: 'usuarios', label: '👥 Usuarios' },
    { id: 'seguridad', label: '🔒 Seguridad' },
    { id: 'general', label: '⚙️ General' }
  ];

  return (
    <div>
      <PageHeader title="Configuración" />

      {/* Tabs */}
      <Card className="mb-6">
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-green-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* TAB: USUARIOS */}
      {activeTab === 'usuarios' && isAdmin && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Gestión de Usuarios
            </h2>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Nuevo Usuario
            </Button>
          </div>

          {loadingUsers ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                Cargando usuarios...
              </p>
            </Card>
          ) : (
            <Card>
              <Table
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'email', label: 'Email' },
                  {
                    key: 'rol',
                    label: 'Rol',
                    render: (rol, usuario) =>
                      isAdmin ? (
                        <Select
                          value={rol}
                          onChange={(e) =>
                            handleUpdateRole(usuario.id, e.target.value)
                          }
                          options={[
                            { value: 'admin', label: 'Administrador' },
                            { value: 'usuario', label: 'Usuario' }
                          ]}
                        />
                      ) : (
                        <Badge variant={rol === 'admin' ? 'green' : 'blue'}>
                          {rol === 'admin' ? 'Administrador' : 'Usuario'}
                        </Badge>
                      )
                  },
                  {
                    key: 'created_at',
                    label: 'Fecha de registro',
                    render: (fecha) => formatDate(fecha)
                  },
                  {
                    key: 'acciones',
                    label: 'Acciones',
                    render: (_, usuario) => (
                      <Button
                        variant="icon-delete"
                        onClick={() => handleDeleteUser(usuario.id, usuario.email)}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )
                  }
                ]}
                data={usuarios}
              />
            </Card>
          )}
        </div>
      )}

      {/* TAB: SEGURIDAD */}
      {activeTab === 'seguridad' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Cambiar Contraseña
          </h2>
          <Card className="max-w-md">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />

              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                placeholder="Repite la contraseña"
              />

              <Button type="submit" variant="primary" className="w-full">
                Actualizar Contraseña
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* TAB: GENERAL */}
      {activeTab === 'general' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Información General
          </h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Nombre de la Asociación
                </p>
                <p className="text-gray-600">{ASOCIACION_INFO.nombre}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Ubicación
                </p>
                <p className="text-gray-600">{ASOCIACION_INFO.ubicacion}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Versión del Sistema
                </p>
                <p className="text-gray-600">{ASOCIACION_INFO.version}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Base de Datos
                </p>
                <p className="text-gray-600">Supabase (PostgreSQL)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Crear Usuario */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Usuario"
          size="medium"
        >
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4">
              <Input
                label="Nombre completo"
                name="nombre"
                type="text"
                required
                placeholder="Juan Pérez"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                required
                placeholder="ejemplo@correo.com"
              />

              <Input
                label="Contraseña"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />

              <Select
                label="Rol"
                name="rol"
                required
                options={[
                  { value: 'usuario', label: 'Usuario' },
                  { value: 'admin', label: 'Administrador' }
                ]}
              />
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Crear Usuario
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ConfiguracionView;