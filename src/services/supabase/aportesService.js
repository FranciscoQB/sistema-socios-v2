// src/services/supabase/aportesService.js
import { supabase } from './client';

/**
 * Servicio de gestión de aportes
 */

/**
 * Obtiene todos los aportes
 */
export const getAportes = async () => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo aportes:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene aportes por socio
 */
export const getAportesBySocio = async (socioId) => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .select('*')
      .eq('socio_id', socioId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo aportes del socio:', error);
    return { data: [], error };
  }
};

/**
 * Crea un nuevo aporte
 */
export const createAporte = async (aporteData) => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .insert([aporteData])
      .select()
      .single();

    if (error) throw error;

    // Actualizar el monto pagado del socio
    if (data && aporteData.socio_id) {
      await updateSocioPagado(aporteData.socio_id, aporteData.monto);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creando aporte:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un aporte
 */
export const updateAporte = async (id, aporteData) => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .update(aporteData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando aporte:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un aporte
 */
export const deleteAporte = async (id) => {
  try {
    const { error } = await supabase
      .from('aportes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando aporte:', error);
    return { error };
  }
};

/**
 * Obtiene aportes por rango de fechas
 */
export const getAportesByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .select('*')
      .gte('fecha', startDate)
      .lte('fecha', endDate)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo aportes por fecha:', error);
    return { data: [], error };
  }
};

/**
 * Actualiza el monto pagado de un socio
 */
const updateSocioPagado = async (socioId, monto) => {
  try {
    // Obtener el socio actual
    const { data: socio, error: socioError } = await supabase
      .from('socios')
      .select('pagado')
      .eq('id', socioId)
      .single();

    if (socioError) throw socioError;

    // Actualizar el monto pagado
    const nuevoPagado = (socio.pagado || 0) + monto;
    
    const { error: updateError } = await supabase
      .from('socios')
      .update({ pagado: nuevoPagado })
      .eq('id', socioId);

    if (updateError) throw updateError;
    return { error: null };
  } catch (error) {
    console.error('Error actualizando pagado del socio:', error);
    return { error };
  }
};

export default {
  getAportes,
  getAportesBySocio,
  createAporte,
  updateAporte,
  deleteAporte,
  getAportesByDateRange
};