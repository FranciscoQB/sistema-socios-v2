// src/services/supabase/authService.js
import { supabase } from './client';

/**
 * Servicio de autenticación con soporte para roles y multi-tenant
 */

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Actualizar último acceso
    if (data.user) {
      await updateLastAccess(data.user.id);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error en login:', error);
    return { data: null, error };
  }
};

/**
 * Cierra la sesión actual
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error en logout:', error);
    return { error };
  }
};

/**
 * Obtiene la sesión actual
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data: data.session, error: null };
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: user, error: null };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return { data: null, error };
  }
};

/**
 * Registra un nuevo usuario
 */
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error en signUp:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza la contraseña del usuario
 */
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    return { data: null, error };
  }
};

/**
 * Suscribe a cambios de autenticación
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Carga el perfil completo del usuario con información de organización
 */
export const loadUserProfile = async (userId) => {
  try {
    // Primero intentar obtener el perfil básico
    const { data: profileData, error: profileError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      // Si la tabla perfiles no existe, intentar obtener datos del usuario directamente
      console.warn('Tabla perfiles no encontrada, usando datos básicos del usuario');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      // Retornar un perfil básico con los datos del usuario
      return { 
        data: {
          id: user.id,
          email: user.email,
          rol: 'socio', // rol por defecto
          created_at: user.created_at
        }, 
        error: null 
      };
    }

    // Si el perfil existe, intentar cargar relaciones opcionales
    try {
      const { data: fullData, error: relError } = await supabase
        .from('perfiles')
        .select(`
          *,
          organizacion:organizaciones(
            id,
            nombre,
            razon_social,
            cuota_mensual,
            plan,
            estado,
            max_socios,
            max_usuarios
          ),
          manzana:manzanas(
            id,
            nombre,
            descripcion
          ),
          socio:socios(
            id,
            nombre,
            dni,
            lote,
            cuota,
            pagado
          )
        `)
        .eq('id', userId)
        .single();

      // Si hay error en las relaciones, usar solo el perfil básico
      if (relError) {
        console.warn('Error cargando relaciones del perfil, usando datos básicos:', relError);
        return { data: profileData, error: null };
      }

      return { data: fullData, error: null };
    } catch (relError) {
      // Si falla cargar las relaciones, retornar solo el perfil básico
      console.warn('Error en relaciones, usando perfil básico:', relError);
      return { data: profileData, error: null };
    }

  } catch (error) {
    console.error('Error cargando perfil:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza el último acceso del usuario
 */
const updateLastAccess = async (userId) => {
  try {
    await supabase
      .from('perfiles')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Error actualizando último acceso:', error);
  }
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (userProfile, role) => {
  if (!userProfile) return false;
  return userProfile.rol === role;
};

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export const hasAnyRole = (userProfile, roles) => {
  if (!userProfile) return false;
  return roles.includes(userProfile.rol);
};

/**
 * Verifica si el usuario es super_admin
 */
export const isSuperAdmin = (userProfile) => {
  return hasRole(userProfile, 'super_admin');
};

/**
 * Verifica si el usuario es presidente
 */
export const isPresidente = (userProfile) => {
  return hasRole(userProfile, 'presidente');
};

/**
 * Verifica si el usuario es tesorero
 */
export const isTesorero = (userProfile) => {
  return hasRole(userProfile, 'tesorero');
};

/**
 * Verifica si el usuario es secretario
 */
export const isSecretario = (userProfile) => {
  return hasRole(userProfile, 'secretario');
};

/**
 * Verifica si el usuario es delegado
 */
export const isDelegado = (userProfile) => {
  return hasRole(userProfile, 'delegado');
};

/**
 * Verifica si el usuario es socio
 */
export const isSocio = (userProfile) => {
  return hasRole(userProfile, 'socio');
};

/**
 * Verifica si el usuario puede ver datos de toda la organización
 */
export const canViewAllOrganization = (userProfile) => {
  return hasAnyRole(userProfile, ['super_admin', 'presidente', 'tesorero', 'secretario']);
};

/**
 * Verifica si el usuario puede editar socios
 */
export const canEditSocios = (userProfile) => {
  return hasAnyRole(userProfile, ['super_admin', 'presidente', 'secretario']);
};

/**
 * Verifica si el usuario puede gestionar aportes
 */
export const canManageAportes = (userProfile) => {
  return hasAnyRole(userProfile, ['super_admin', 'presidente', 'tesorero']);
};

/**
 * Verifica si el usuario puede aprobar aportes
 */
export const canApproveAportes = (userProfile) => {
  return hasAnyRole(userProfile, ['super_admin', 'presidente']);
};

/**
 * Verifica si el usuario puede gestionar usuarios
 */
export const canManageUsers = (userProfile) => {
  return hasAnyRole(userProfile, ['super_admin', 'presidente']);
};

/**
 * Obtiene el organizacion_id del usuario actual
 */
export const getUserOrganizacionId = (userProfile) => {
  if (!userProfile) return null;
  // Super admin no tiene organizacion_id
  if (isSuperAdmin(userProfile)) return null;
  return userProfile.organizacion_id;
};

export default {
  login,
  logout,
  getSession,
  getCurrentUser,
  signUp,
  updatePassword,
  onAuthStateChange,
  loadUserProfile,
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isPresidente,
  isTesorero,
  isSecretario,
  isDelegado,
  isSocio,
  canViewAllOrganization,
  canEditSocios,
  canManageAportes,
  canApproveAportes,
  canManageUsers,
  getUserOrganizacionId
};