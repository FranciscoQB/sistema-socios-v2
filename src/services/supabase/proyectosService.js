// src/services/supabase/proyectosService.js
import { supabase } from './client';

/**
 * Servicio de gestión de proyectos
 */

/**
 * Obtiene todos los proyectos
 */
export const getProyectos = async () => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un proyecto por ID
 */
export const getProyectoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    return { data: null, error };
  }
};

/**
 * Crea un nuevo proyecto
 */
export const createProyecto = async (proyectoData) => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .insert([proyectoData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando proyecto:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un proyecto
 */
export const updateProyecto = async (id, proyectoData) => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .update(proyectoData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un proyecto
 */
export const deleteProyecto = async (id) => {
  try {
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    return { error };
  }
};

/**
 * Obtiene proyectos por estado
 */
export const getProyectosByEstado = async (estado) => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('estado', estado)
      .order('id', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo proyectos por estado:', error);
    return { data: [], error };
  }
};

export default {
  getProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getProyectosByEstado
};