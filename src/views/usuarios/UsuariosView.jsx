// src/views/usuarios/UsuariosView.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Search, UserPlus, Edit2, Trash2, Power, Key } from 'lucide-react';
import { Button } from '../../components/common';
import { UsuarioFormModal } from '../../components/usuarios/UsuarioFormModal';
import { getRolLabel, getRolColor } from '../../utils/permissions';

const UsuariosView = () => {
  const { 
    usuarios, 
    addUsuario, 
    updateUsuario, 
    removeUsuario, 
    cambiarEstadoUsuario 
  } = useApp();
  
  const { 
    isSuperAdmin, 
    isPresidente, 
    organizacionId,
    userProfile 
  } = useAuth();

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('activo');
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Filtrar usuarios según permisos
  const getUsuariosFiltrados = () => {
    let usuariosFiltrados = usuarios;

    // Si es presidente, solo ver usuarios de su organización
    if (isPresidente && !isSuperAdmin) {
      usuariosFiltrados = usuarios.filter(u => u.organizacion_id === organizacionId);
    }

    // Filtro de búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      usuariosFiltrados = usuariosFiltrados.filter(u =>
        u.nombre?.toLowerCase().includes(termino) ||
        u.telefono?.toLowerCase().includes(termino)
      );
    }

    // Filtro de rol
    if (filtroRol !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.rol === filtroRol);
    }

    // Filtro de estado
    if (filtroEstado !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estado === filtroEstado);
    }

    return usuariosFiltrados;
  };

  const usuariosFiltrados = getUsuariosFiltrados();

  // Handlers
  const handleNuevoUsuario = () => {
    setUsuarioEditando(null);
    setModalOpen(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  };

  const handleGuardarUsuario = async (usuarioData) => {
    try {
      if (usuarioEditando) {
        const { error } = await updateUsuario(usuarioEditando.id, usuarioData);
        if (error) throw error;
        alert('✅ Usuario actualizado correctamente');
      } else {
        const { error } = await addUsuario(usuarioData);
        if (error) throw error;
        alert('✅ Usuario creado correctamente');
      }
      setModalOpen(false);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleEliminarUsuario = async (usuario) => {
    if (!confirm(`¿Estás seguro de desactivar a ${usuario.nombre}?`)) return;

    try {
      const { error } = await removeUsuario(usuario.id);
      if (error) throw error;
      alert('✅ Usuario desactivado correctamente');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleCambiarEstado = async (usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    if (!confirm(`¿Estás seguro de ${accion} a ${usuario.nombre}?`)) return;

    try {
      const { error } = await cambiarEstadoUsuario(usuario.id, nuevoEstado);
      if (error) throw error;
      alert(`✅ Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const getRolBadgeColor = (rol) => {
    const colores = {
      super_admin: 'bg-purple-100 text-purple-800',
      presidente: 'bg-blue-100 text-blue-800',
      tesorero: 'bg-green-100 text-green-800',
      secretario: 'bg-yellow-100 text-yellow-800',
      delegado: 'bg-orange-100 text-orange-800',
      socio: 'bg-gray-100 text-gray-800'
    };
    return colores[rol] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoBadgeColor = (estado) => {
    const colores = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      suspendido: 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            👥 Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios y roles del sistema
          </p>
        </div>
        <Button variant="primary" onClick={handleNuevoUsuario}>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro de Rol */}
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los roles</option>
            <option value="presidente">Presidente</option>
            <option value="tesorero">Tesorero</option>
            <option value="secretario">Secretario</option>
            <option value="delegado">Delegado</option>
            <option value="socio">Socio</option>
          </select>

          {/* Filtro de Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Organización
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {usuario.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </div>
                        {usuario.socio && (
                          <div className="text-xs text-gray-500">
                            DNI: {usuario.socio.dni}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{usuario.telefono || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRolBadgeColor(usuario.rol)}`}>
                      {getRolLabel(usuario.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeColor(usuario.estado)}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {usuario.organizacion?.nombre || '-'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditarUsuario(usuario)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCambiarEstado(usuario)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title={usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      {usuario.rol !== 'super_admin' && usuario.id !== userProfile?.id && (
                        <button
                          onClick={() => handleEliminarUsuario(usuario)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay usuarios</h3>
              <p>
                {busqueda || filtroRol !== 'todos' || filtroEstado !== 'todos'
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'Crea tu primer usuario para comenzar'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Total Usuarios</div>
          <div className="text-2xl font-bold text-gray-900">{usuarios.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-green-600 mb-1">Activos</div>
          <div className="text-2xl font-bold text-green-700">
            {usuarios.filter(u => u.estado === 'activo').length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-blue-600 mb-1">Administradores</div>
          <div className="text-2xl font-bold text-blue-700">
            {usuarios.filter(u => ['super_admin', 'presidente', 'tesorero', 'secretario'].includes(u.rol)).length}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Socios</div>
          <div className="text-2xl font-bold text-gray-700">
            {usuarios.filter(u => u.rol === 'socio').length}
          </div>
        </div>
      </div>

      {/* Modal de Formulario */}
      <UsuarioFormModal
        usuario={usuarioEditando}
        onSave={handleGuardarUsuario}
        onClose={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
    </div>
  );
};

export default UsuariosView;