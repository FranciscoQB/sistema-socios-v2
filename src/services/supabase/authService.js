// src/services/supabase/authService.js
import { supabase } from './client';

/**
 * Servicio de autenticación
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
 * Carga el perfil del usuario
 */
export const loadUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error cargando perfil:', error);
    return { data: null, error };
  }
};

export default {
  login,
  logout,
  getSession,
  getCurrentUser,
  signUp,
  updatePassword,
  onAuthStateChange,
  loadUserProfile
};