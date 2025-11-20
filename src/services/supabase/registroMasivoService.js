// src/services/supabase/registroMasivoService.js
import { supabase } from './client';

/**
 * Servicio de gestión de registros masivos de aportes
 */

/**
 * Valida si existen aportes duplicados para un conjunto de socios en un período
 */
export const validarDuplicados = async (sociosIds, mes, año) => {
  try {
    const { data, error } = await supabase
      .from('aportes')
      .select('id, socio_id, concepto, monto, fecha')
      .in('socio_id', sociosIds)
      .eq('mes', mes)
      .eq('año', año);

    if (error) throw error;

    return { 
      duplicados: data || [], 
      tieneDuplicados: (data || []).length > 0,
      error: null 
    };
  } catch (error) {
    console.error('Error validando duplicados:', error);
    return { duplicados: [], tieneDuplicados: false, error };
  }
};

/**
 * Crea un registro masivo con todos sus aportes
 */
export const crearRegistroMasivo = async (registroData, aportes) => {
  try {
    // 1. Crear el registro masivo principal
    const { data: registroMasivo, error: registroError } = await supabase
      .from('registros_masivos')
      .insert([{
        concepto: registroData.concepto,
        tipo: registroData.tipo,
        mes: registroData.mes,
        año: registroData.año,
        monto_base: registroData.montoBase,
        fecha_defecto: registroData.fechaDefecto,
        total_registros: aportes.length,
        total_pagados: aportes.filter(a => a.estado === 'pagado').length,
        total_pendientes: aportes.filter(a => a.estado === 'pendiente').length,
        total_monto: aportes.reduce((sum, a) => sum + (a.monto || 0), 0),
        creado_por: registroData.creadoPor || 'Administrador'
      }])
      .select()
      .single();

    if (registroError) throw registroError;

    // 2. Preparar los aportes con el ID del registro masivo
    const aportesConRegistro = aportes.map(aporte => ({
      ...aporte,
      registro_masivo_id: registroMasivo.id
    }));

    // 3. Insertar todos los aportes
    const { data: aportesCreados, error: aportesError } = await supabase
      .from('aportes')
      .insert(aportesConRegistro)
      .select();

    if (aportesError) throw aportesError;

    // 4. Actualizar el monto pagado de cada socio (solo los que pagaron)
    const aportesPagados = aportesCreados.filter(a => a.estado === 'pagado' && a.monto > 0);
    
    for (const aporte of aportesPagados) {
      await actualizarMontoPagadoSocio(aporte.socio_id, aporte.monto);
    }

    return { 
      data: {
        registroMasivo,
        aportes: aportesCreados
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error creando registro masivo:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene todos los registros masivos
 */
export const getRegistrosMasivos = async () => {
  try {
    const { data, error } = await supabase
      .from('registros_masivos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo registros masivos:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un registro masivo con sus aportes
 */
export const getRegistroMasivoConAportes = async (registroMasivoId) => {
  try {
    // Obtener el registro masivo
    const { data: registro, error: registroError } = await supabase
      .from('registros_masivos')
      .select('*')
      .eq('id', registroMasivoId)
      .single();

    if (registroError) throw registroError;

    // Obtener los aportes asociados con información del socio
    const { data: aportes, error: aportesError } = await supabase
      .from('aportes')
      .select(`
        *,
        socio:socios(id, dni, nombre, lote)
      `)
      .eq('registro_masivo_id', registroMasivoId)
      .order('socio_id', { ascending: true });

    if (aportesError) throw aportesError;

    return { 
      data: {
        ...registro,
        aportes: aportes || []
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error obteniendo registro masivo con aportes:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un aporte individual del registro masivo
 */
export const actualizarAporteIndividual = async (aporteId, aporteData) => {
  try {
    // Obtener el aporte anterior para calcular diferencias
    const { data: aporteAnterior, error: getError } = await supabase
      .from('aportes')
      .select('*')
      .eq('id', aporteId)
      .single();

    if (getError) throw getError;

    // Actualizar el aporte
    const { data, error } = await supabase
      .from('aportes')
      .update(aporteData)
      .eq('id', aporteId)
      .select()
      .single();

    if (error) throw error;

    // Si cambió el monto y el estado es pagado, actualizar el socio
    if (aporteData.monto !== undefined && data.estado === 'pagado') {
      const diferencia = aporteData.monto - (aporteAnterior.monto || 0);
      if (diferencia !== 0) {
        await actualizarMontoPagadoSocio(data.socio_id, diferencia);
      }
    }

    // Actualizar estadísticas del registro masivo
    if (data.registro_masivo_id) {
      await actualizarEstadisticasRegistroMasivo(data.registro_masivo_id);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando aporte individual:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza las estadísticas de un registro masivo
 */
const actualizarEstadisticasRegistroMasivo = async (registroMasivoId) => {
  try {
    // Obtener todos los aportes del registro
    const { data: aportes, error: aportesError } = await supabase
      .from('aportes')
      .select('estado, monto')
      .eq('registro_masivo_id', registroMasivoId);

    if (aportesError) throw aportesError;

    // Calcular estadísticas
    const totalPagados = aportes.filter(a => a.estado === 'pagado').length;
    const totalPendientes = aportes.filter(a => a.estado === 'pendiente').length;
    const totalMonto = aportes.reduce((sum, a) => sum + (a.monto || 0), 0);

    // Actualizar el registro masivo
    const { error: updateError } = await supabase
      .from('registros_masivos')
      .update({
        total_pagados: totalPagados,
        total_pendientes: totalPendientes,
        total_monto: totalMonto
      })
      .eq('id', registroMasivoId);

    if (updateError) throw updateError;
    return { error: null };
  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
    return { error };
  }
};

/**
 * Actualiza el monto pagado de un socio
 */
const actualizarMontoPagadoSocio = async (socioId, montoDiferencia) => {
  try {
    // Obtener el socio actual
    const { data: socio, error: socioError } = await supabase
      .from('socios')
      .select('pagado')
      .eq('id', socioId)
      .single();

    if (socioError) throw socioError;

    // Calcular nuevo monto pagado
    const nuevoPagado = (socio.pagado || 0) + montoDiferencia;

    // Actualizar el socio
    const { error: updateError } = await supabase
      .from('socios')
      .update({ pagado: Math.max(0, nuevoPagado) })
      .eq('id', socioId);

    if (updateError) throw updateError;
    return { error: null };
  } catch (error) {
    console.error('Error actualizando monto pagado del socio:', error);
    return { error };
  }
};

/**
 * Elimina un registro masivo completo (con precaución)
 */
export const eliminarRegistroMasivo = async (registroMasivoId) => {
  try {
    // Obtener todos los aportes para revertir los montos pagados
    const { data: aportes, error: aportesError } = await supabase
      .from('aportes')
      .select('socio_id, monto, estado')
      .eq('registro_masivo_id', registroMasivoId);

    if (aportesError) throw aportesError;

    // Revertir montos pagados de los socios
    const aportesPagados = aportes.filter(a => a.estado === 'pagado' && a.monto > 0);
    for (const aporte of aportesPagados) {
      await actualizarMontoPagadoSocio(aporte.socio_id, -aporte.monto);
    }

    // Eliminar los aportes
    const { error: deleteAportesError } = await supabase
      .from('aportes')
      .delete()
      .eq('registro_masivo_id', registroMasivoId);

    if (deleteAportesError) throw deleteAportesError;

    // Eliminar el registro masivo
    const { error: deleteRegistroError } = await supabase
      .from('registros_masivos')
      .delete()
      .eq('id', registroMasivoId);

    if (deleteRegistroError) throw deleteRegistroError;

    return { error: null };
  } catch (error) {
    console.error('Error eliminando registro masivo:', error);
    return { error };
  }
};

export default {
  validarDuplicados,
  crearRegistroMasivo,
  getRegistrosMasivos,
  getRegistroMasivoConAportes,
  actualizarAporteIndividual,
  eliminarRegistroMasivo
};