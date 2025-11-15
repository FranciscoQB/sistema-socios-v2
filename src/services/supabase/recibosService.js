// src/services/supabase/recibosService.js
import { supabase } from './client';

/**
 * Servicio de gestión de recibos
 */

/**
 * Obtiene todos los recibos
 */
export const getRecibos = async () => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .order('fecha_emision', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo recibos:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un recibo por ID
 */
export const getReciboById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo recibo:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene un recibo por número
 */
export const getReciboByNumero = async (numeroRecibo) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .eq('numero_recibo', numeroRecibo)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo recibo por número:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene recibo por aporte
 */
export const getReciboByAporte = async (aporteId) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .eq('aporte_id', aporteId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo recibo por aporte:', error);
    return { data: null, error };
  }
};

/**
 * Crea un nuevo recibo
 */
export const createRecibo = async (reciboData) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .insert([reciboData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando recibo:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un recibo
 */
export const updateRecibo = async (id, reciboData) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .update(reciboData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando recibo:', error);
    return { data: null, error };
  }
};

/**
 * Anula un recibo
 */
export const anularRecibo = async (id) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .update({ estado: 'anulado' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error anulando recibo:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene recibos por socio
 */
export const getRecibosBySocio = async (socioId) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .eq('socio_id', socioId)
      .order('fecha_emision', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo recibos por socio:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene recibos por estado
 */
export const getRecibosByEstado = async (estado) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .eq('estado', estado)
      .order('fecha_emision', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo recibos por estado:', error);
    return { data: [], error };
  }
};

/**
 * Genera un nuevo número de recibo
 */
export const generarNumeroRecibo = async () => {
  try {
    const { data, error } = await supabase.rpc('generar_numero_recibo');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error generando número de recibo:', error);
    
    // Si la función RPC no existe, usar fallback
    try {
      const { data: recibos, error: countError } = await supabase
        .from('recibos')
        .select('numero_recibo')
        .order('numero_recibo', { ascending: false })
        .limit(1);

      if (countError) throw countError;

      const lastNumber = recibos && recibos.length > 0 
        ? parseInt(recibos[0].numero_recibo) || 0
        : 0;

      const newNumber = String(lastNumber + 1).padStart(6, '0');
      return { data: newNumber, error: null };
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return { data: null, error: fallbackError };
    }
  }
};

/**
 * Obtiene recibos por rango de fechas
 */
export const getRecibosByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('recibos')
      .select('*')
      .gte('fecha_emision', startDate)
      .lte('fecha_emision', endDate)
      .order('fecha_emision', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo recibos por fecha:', error);
    return { data: [], error };
  }
};

export default {
  getRecibos,
  getReciboById,
  getReciboByNumero,
  getReciboByAporte,
  createRecibo,
  updateRecibo,
  anularRecibo,
  getRecibosBySocio,
  getRecibosByEstado,
  generarNumeroRecibo,
  getRecibosByDateRange
};