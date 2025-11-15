// src/services/supabase/sociosService.js
import { supabase } from './client';

/**
 * Servicio de gestión de socios
 */

/**
 * Obtiene todos los socios
 */
export const getSocios = async () => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo socios:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un socio por ID
 */
export const getSocioById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo socio:', error);
    return { data: null, error };
  }
};

/**
 * Crea un nuevo socio
 */
export const createSocio = async (socioData) => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .insert([socioData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando socio:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un socio existente
 */
export const updateSocio = async (id, socioData) => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .update(socioData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando socio:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un socio
 */
export const deleteSocio = async (id) => {
  try {
    const { error } = await supabase
      .from('socios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando socio:', error);
    return { error };
  }
};

/**
 * Obtiene socios activos
 */
export const getSociosActivos = async () => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .select('*')
      .eq('estado', 'activo')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo socios activos:', error);
    return { data: [], error };
  }
};

/**
 * Busca socios por término
 */
export const searchSocios = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('socios')
      .select('*')
      .or(`nombre.ilike.%${searchTerm}%,dni.ilike.%${searchTerm}%,lote.ilike.%${searchTerm}%`)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error buscando socios:', error);
    return { data: [], error };
  }
};

export default {
  getSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
  getSociosActivos,
  searchSocios
};