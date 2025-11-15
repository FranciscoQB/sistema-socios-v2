// src/hooks/useRecibos.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';
import * as recibosService from '../services/supabase/recibosService';

/**
 * Hook personalizado para gestión de recibos
 */
export const useRecibos = () => {
  const { 
    recibos,
    socios,
    aportes,
    addRecibo, 
    anularRecibo: anularReciboContext,
    loadRecibos 
  } = useApp();

  const [filteredRecibos, setFilteredRecibos] = useState([]);
  const [filterEstado, setFilterEstado] = useState('todos');

  // Filtrar recibos por estado
  useEffect(() => {
    if (filterEstado === 'todos') {
      setFilteredRecibos(recibos);
    } else {
      setFilteredRecibos(
        recibos.filter(r => r.estado === filterEstado)
      );
    }
  }, [recibos, filterEstado]);

  // Generar nuevo recibo
  const generarRecibo = async (aporteId, metadata = {}) => {
    try {
      // Buscar el aporte
      const aporte = aportes.find(a => a.id === aporteId);
      if (!aporte) {
        throw new Error('Aporte no encontrado');
      }

      // Buscar el socio
      const socio = socios.find(s => s.id === aporte.socio_id);
      if (!socio) {
        throw new Error('Socio no encontrado');
      }

      // Verificar si ya existe un recibo para este aporte
      const reciboExistente = recibos.find(r => r.aporte_id === aporteId);
      if (reciboExistente) {
        return { 
          success: false, 
          error: 'Ya existe un recibo para este aporte',
          recibo: reciboExistente
        };
      }

      // Generar número de recibo
      const { data: numeroRecibo, error: numeroError } = 
        await recibosService.generarNumeroRecibo();
      
      if (numeroError) throw numeroError;

      // Crear datos del recibo
      const reciboData = {
        id: Date.now(),
        numero_recibo: numeroRecibo,
        socio_id: aporte.socio_id,
        aporte_id: aporte.id,
        fecha_emision: new Date().toISOString().split('T')[0],
        monto: aporte.monto,
        concepto: aporte.concepto,
        metodo_pago: aporte.tipo,
        estado: 'emitido',
        ...metadata
      };

      // Guardar en la base de datos
      const { error } = await addRecibo(reciboData);
      if (error) throw error;

      alert(MENSAJES_EXITO.RECIBO_GENERADO);
      return { success: true, recibo: reciboData };
    } catch (error) {
      console.error('Error generando recibo:', error);
      alert('Error al generar recibo: ' + error.message);
      return { success: false, error };
    }
  };

  // Anular recibo
  const anularRecibo = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ANULAR_RECIBO)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await anularReciboContext(id);
      if (error) throw error;
      
      alert(MENSAJES_EXITO.RECIBO_ANULADO);
      return { success: true };
    } catch (error) {
      console.error('Error anulando recibo:', error);
      alert('Error al anular recibo: ' + error.message);
      return { success: false, error };
    }
  };

  // Obtener recibo por ID
  const getReciboById = (id) => {
    return recibos.find(r => r.id === id);
  };

  // Obtener recibo por número
  const getReciboByNumero = (numeroRecibo) => {
    return recibos.find(r => r.numero_recibo === numeroRecibo);
  };

  // Obtener recibo por aporte
  const getReciboByAporte = (aporteId) => {
    return recibos.find(r => r.aporte_id === aporteId);
  };

  // Obtener recibos por socio
  const getRecibosBySocio = (socioId) => {
    return recibos.filter(r => r.socio_id === socioId);
  };

  // Obtener recibo con información completa
  const getReciboCompleto = (reciboId) => {
    const recibo = getReciboById(reciboId);
    if (!recibo) return null;

    const socio = socios.find(s => s.id === recibo.socio_id);
    const aporte = aportes.find(a => a.id === recibo.aporte_id);

    return {
      ...recibo,
      socio: socio || null,
      aporte: aporte || null
    };
  };

  // Obtener recibos emitidos
  const getRecibosEmitidos = () => {
    return recibos.filter(r => r.estado === 'emitido');
  };

  // Obtener recibos anulados
  const getRecibosAnulados = () => {
    return recibos.filter(r => r.estado === 'anulado');
  };

  // Calcular estadísticas
  const totalRecibos = recibos.length;
  const recibosEmitidos = getRecibosEmitidos().length;
  const recibosAnulados = getRecibosAnulados().length;

  const montoTotalEmitidos = getRecibosEmitidos().reduce(
    (acc, r) => acc + parseFloat(r.monto || 0),
    0
  );

  return {
    recibos,
    filteredRecibos,
    filterEstado,
    setFilterEstado,
    generarRecibo,
    anularRecibo,
    getReciboById,
    getReciboByNumero,
    getReciboByAporte,
    getRecibosBySocio,
    getReciboCompleto,
    getRecibosEmitidos,
    getRecibosAnulados,
    totalRecibos,
    recibosEmitidos,
    recibosAnulados,
    montoTotalEmitidos,
    loadRecibos
  };
};