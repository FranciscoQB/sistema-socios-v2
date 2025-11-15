// src/services/supabase/reunionesService.js
import { supabase } from './client';

/**
 * Servicio de gestión de reuniones y asistencia
 */

/**
 * Obtiene todas las reuniones
 */
export const getReuniones = async () => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo reuniones:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene una reunión por ID
 */
export const getReunionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo reunión:', error);
    return { data: null, error };
  }
};

/**
 * Crea una nueva reunión
 */
export const createReunion = async (reunionData) => {
  try {
    const reunionCompleta = {
      ...reunionData,
      asistentes: reunionData.asistentes || [],
      estado: reunionData.estado || 'programada'
    };

    const { data, error } = await supabase
      .from('reuniones')
      .insert([reunionCompleta])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando reunión:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza una reunión
 */
export const updateReunion = async (id, reunionData) => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .update(reunionData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando reunión:', error);
    return { data: null, error };
  }
};

/**
 * Elimina una reunión
 */
export const deleteReunion = async (id) => {
  try {
    const { error } = await supabase
      .from('reuniones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando reunión:', error);
    return { error };
  }
};

/**
 * Actualiza la lista de asistentes
 */
export const updateAsistentes = async (reunionId, asistentes) => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .update({ asistentes })
      .eq('id', reunionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando asistentes:', error);
    return { data: null, error };
  }
};

/**
 * Agrega un asistente a una reunión
 */
export const addAsistente = async (reunionId, socioId) => {
  try {
    // Obtener la reunión actual
    const { data: reunion, error: getError } = await supabase
      .from('reuniones')
      .select('asistentes')
      .eq('id', reunionId)
      .single();

    if (getError) throw getError;

    // Agregar el socio si no está ya en la lista
    const asistentes = reunion.asistentes || [];
    if (!asistentes.includes(socioId)) {
      asistentes.push(socioId);
    }

    // Actualizar
    const { data, error } = await supabase
      .from('reuniones')
      .update({ asistentes })
      .eq('id', reunionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error agregando asistente:', error);
    return { data: null, error };
  }
};

/**
 * Remueve un asistente de una reunión
 */
export const removeAsistente = async (reunionId, socioId) => {
  try {
    // Obtener la reunión actual
    const { data: reunion, error: getError } = await supabase
      .from('reuniones')
      .select('asistentes')
      .eq('id', reunionId)
      .single();

    if (getError) throw getError;

    // Remover el socio de la lista
    const asistentes = (reunion.asistentes || []).filter(id => id !== socioId);

    // Actualizar
    const { data, error } = await supabase
      .from('reuniones')
      .update({ asistentes })
      .eq('id', reunionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error removiendo asistente:', error);
    return { data: null, error };
  }
};

/**
 * Finaliza una reunión
 */
export const finalizarReunion = async (reunionId) => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .update({ estado: 'finalizada' })
      .eq('id', reunionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error finalizando reunión:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene reuniones programadas
 */
export const getReunionesProgramadas = async () => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .select('*')
      .eq('estado', 'programada')
      .order('fecha', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo reuniones programadas:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene reuniones finalizadas
 */
export const getReunionesFinalizadas = async () => {
  try {
    const { data, error } = await supabase
      .from('reuniones')
      .select('*')
      .eq('estado', 'finalizada')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo reuniones finalizadas:', error);
    return { data: [], error };
  }
};

export default {
  getReuniones,
  getReunionById,
  createReunion,
  updateReunion,
  deleteReunion,
  updateAsistentes,
  addAsistente,
  removeAsistente,
  finalizarReunion,
  getReunionesProgramadas,
  getReunionesFinalizadas
};