// src/services/supabase/usuariosService.js
import { supabase } from './client';

/**
 * Servicio de gestión de usuarios
 */

/**
 * Obtiene todos los usuarios (super_admin ve todo, presidente ve su organización)
 */
export const getUsuarios = async (organizacionId = null) => {
  try {
    let query = supabase
      .from('perfiles')
      .select(`
        *,
        organizacion:organizacion_id(id, nombre),
        manzana:manzana_id(id, nombre),
        socio:socio_id(id, nombre, dni, lote)
      `)
      .order('created_at', { ascending: false });

    // Si no es super_admin, filtrar por organización
    if (organizacionId) {
      query = query.eq('organizacion_id', organizacionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un usuario por ID
 */
export const getUsuarioById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select(`
        *,
        organizacion:organizacion_id(id, nombre),
        manzana:manzana_id(id, nombre),
        socio:socio_id(id, nombre, dni, lote)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return { data: null, error };
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    // 1. Crear usuario en Supabase Auth (usando signUp público)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: usuarioData.email,
      password: usuarioData.password,
      options: {
        data: {
          nombre: usuarioData.nombre,
          rol: usuarioData.rol
        }
      }
    });

    if (authError) throw authError;

    // 2. Crear perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from('perfiles')
      .insert([{
        id: authData.user.id,
        nombre: usuarioData.nombre,
        telefono: usuarioData.telefono,
        email: usuarioData.email,
        rol: usuarioData.rol,
        organizacion_id: usuarioData.organizacion_id,
        manzana_id: usuarioData.manzana_id || null,
        socio_id: usuarioData.socio_id || null,
        estado: 'activo'
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    return { data: profileData, error: null };
  } catch (error) {
    console.error('Error creando usuario:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un usuario existente
 */
export const updateUsuario = async (id, usuarioData) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update({
        nombre: usuarioData.nombre,
        telefono: usuarioData.telefono,
        rol: usuarioData.rol,
        manzana_id: usuarioData.manzana_id || null,
        socio_id: usuarioData.socio_id || null,
        estado: usuarioData.estado
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return { data: null, error };
  }
};

/**
 * Cambia el estado de un usuario (activar/desactivar)
 */
export const cambiarEstadoUsuario = async (id, nuevoEstado) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un usuario (desactiva en lugar de eliminar permanentemente)
 */
export const deleteUsuario = async (id) => {
  try {
    // En lugar de eliminar, desactivamos
    const { data, error } = await supabase
      .from('perfiles')
      .update({ estado: 'inactivo' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return { data: null, error };
  }
};

/**
 * Resetea la contraseña de un usuario
 */
export const resetearPassword = async (email, nuevaPassword) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      email,
      { password: nuevaPassword }
    );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene usuarios por rol
 */
export const getUsuariosByRol = async (rol, organizacionId = null) => {
  try {
    let query = supabase
      .from('perfiles')
      .select('*')
      .eq('rol', rol)
      .eq('estado', 'activo')
      .order('nombre', { ascending: true });

    if (organizacionId) {
      query = query.eq('organizacion_id', organizacionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo usuarios por rol:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene delegados disponibles
 */
export const getDelegadosDisponibles = async (organizacionId) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('rol', 'delegado')
      .eq('organizacion_id', organizacionId)
      .eq('estado', 'activo')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo delegados:', error);
    return { data: [], error };
  }
};

export default {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  cambiarEstadoUsuario,
  deleteUsuario,
  resetearPassword,
  getUsuariosByRol,
  getDelegadosDisponibles
};