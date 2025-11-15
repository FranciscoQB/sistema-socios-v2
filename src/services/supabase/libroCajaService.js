// src/services/supabase/libroCajaService.js
import { supabase } from './client';

/**
 * Servicio de gestión del libro de caja
 */

/**
 * Obtiene todos los movimientos
 */
export const getMovimientos = async () => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un movimiento por ID
 */
export const getMovimientoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo movimiento:', error);
    return { data: null, error };
  }
};

/**
 * Crea un nuevo movimiento
 */
export const createMovimiento = async (movimientoData) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .insert([movimientoData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando movimiento:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un movimiento
 */
export const updateMovimiento = async (id, movimientoData) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .update(movimientoData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando movimiento:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un movimiento
 */
export const deleteMovimiento = async (id) => {
  try {
    const { error } = await supabase
      .from('libro_caja')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando movimiento:', error);
    return { error };
  }
};

/**
 * Obtiene movimientos por tipo
 */
export const getMovimientosByTipo = async (tipo) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .eq('tipo', tipo)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por tipo:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene movimientos por rango de fechas
 */
export const getMovimientosByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .gte('fecha', startDate)
      .lte('fecha', endDate)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por fecha:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene movimientos por mes
 */
export const getMovimientosByMonth = async (yearMonth) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .gte('fecha', `${yearMonth}-01`)
      .lt('fecha', `${yearMonth}-32`)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por mes:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene movimientos por categoría
 */
export const getMovimientosByCategoria = async (categoria) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por categoría:', error);
    return { data: [], error };
  }
};

/**
 * Calcula el balance total
 */
export const getBalance = async () => {
  try {
    // Obtener todos los movimientos
    const { data, error } = await supabase
      .from('libro_caja')
      .select('tipo, monto');

    if (error) throw error;

    // Calcular totales
    let totalIngresos = 0;
    let totalEgresos = 0;

    (data || []).forEach(movimiento => {
      if (movimiento.tipo === 'ingreso') {
        totalIngresos += parseFloat(movimiento.monto);
      } else if (movimiento.tipo === 'egreso') {
        totalEgresos += parseFloat(movimiento.monto);
      }
    });

    const balance = totalIngresos - totalEgresos;

    return {
      data: {
        totalIngresos,
        totalEgresos,
        balance
      },
      error: null
    };
  } catch (error) {
    console.error('Error calculando balance:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene movimientos por socio
 */
export const getMovimientosBySocio = async (socioId) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .eq('socio_id', socioId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por socio:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene movimientos por proyecto
 */
export const getMovimientosByProyecto = async (proyectoId) => {
  try {
    const { data, error } = await supabase
      .from('libro_caja')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo movimientos por proyecto:', error);
    return { data: [], error };
  }
};

export default {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  getMovimientosByTipo,
  getMovimientosByDateRange,
  getMovimientosByMonth,
  getMovimientosByCategoria,
  getBalance,
  getMovimientosBySocio,
  getMovimientosByProyecto
};