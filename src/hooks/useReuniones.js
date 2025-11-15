// src/hooks/useReuniones.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';

/**
 * Hook personalizado para gestión de reuniones y asistencia
 */
export const useReuniones = () => {
  const { 
    reuniones,
    socios,
    addReunion, 
    updateReunion, 
    removeReunion,
    updateAsistentes,
    finalizarReunion: finalizarReunionContext,
    loadReuniones,
    getSociosActivos
  } = useApp();

  const [filteredReuniones, setFilteredReuniones] = useState([]);
  const [filterEstado, setFilterEstado] = useState('todos');

  // Filtrar reuniones por estado
  useEffect(() => {
    if (filterEstado === 'todos') {
      setFilteredReuniones(reuniones);
    } else {
      setFilteredReuniones(
        reuniones.filter(r => r.estado === filterEstado)
      );
    }
  }, [reuniones, filterEstado]);

  // Crear o actualizar reunión
  const saveReunion = async (reunionData, isEditing = false) => {
    try {
      if (isEditing) {
        const { error } = await updateReunion(reunionData.id, reunionData);
        if (error) throw error;
      } else {
        const { error } = await addReunion(reunionData);
        if (error) throw error;
      }
      
      alert(MENSAJES_EXITO.REUNION_GUARDADA);
      return { success: true };
    } catch (error) {
      console.error('Error guardando reunión:', error);
      alert('Error al guardar reunión: ' + error.message);
      return { success: false, error };
    }
  };

  // Eliminar reunión
  const deleteReunion = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_REUNION)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await removeReunion(id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando reunión:', error);
      alert('Error al eliminar reunión: ' + error.message);
      return { success: false, error };
    }
  };

  // Toggle asistencia de un socio
  const toggleAsistencia = async (reunionId, socioId) => {
    try {
      const reunion = reuniones.find(r => r.id === reunionId);
      if (!reunion) throw new Error('Reunión no encontrada');

      const asistentes = reunion.asistentes || [];
      let nuevosAsistentes;

      if (asistentes.includes(socioId)) {
        // Quitar asistencia
        nuevosAsistentes = asistentes.filter(id => id !== socioId);
      } else {
        // Agregar asistencia
        nuevosAsistentes = [...asistentes, socioId];
      }

      const { error } = await updateAsistentes(reunionId, nuevosAsistentes);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error actualizando asistencia:', error);
      alert('Error al actualizar asistencia: ' + error.message);
      return { success: false, error };
    }
  };

  // Finalizar reunión
  const finalizarReunion = async (reunionId) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.FINALIZAR_REUNION)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await finalizarReunionContext(reunionId);
      if (error) throw error;
      
      alert(MENSAJES_EXITO.REUNION_FINALIZADA);
      return { success: true };
    } catch (error) {
      console.error('Error finalizando reunión:', error);
      alert('Error al finalizar reunión: ' + error.message);
      return { success: false, error };
    }
  };

  // Obtener reunión por ID
  const getReunionById = (id) => {
    return reuniones.find(r => r.id === id);
  };

  // Obtener reuniones programadas
  const getReunionesProgramadas = () => {
    return reuniones.filter(r => r.estado === 'programada');
  };

  // Obtener reuniones finalizadas
  const getReunionesFinalizadas = () => {
    return reuniones.filter(r => r.estado === 'finalizada');
  };

  // Calcular promedio de asistencia
  const calcularPromedioAsistencia = () => {
    const finalizadas = getReunionesFinalizadas();
    if (finalizadas.length === 0) return 0;
    
    const sociosActivosCount = getSociosActivos().length;
    if (sociosActivosCount === 0) return 0;

    const totalAsistencias = finalizadas.reduce(
      (acc, r) => acc + (r.asistentes?.length || 0), 
      0
    );
    
    const promedio = (totalAsistencias / finalizadas.length / sociosActivosCount) * 100;
    return Math.round(promedio);
  };

  // Obtener asistentes de una reunión con info completa
  const getAsistentesInfo = (reunionId) => {
    const reunion = getReunionById(reunionId);
    if (!reunion) return [];

    const asistentesIds = reunion.asistentes || [];
    return asistentesIds
      .map(id => socios.find(s => s.id === id))
      .filter(Boolean);
  };

  // Obtener ausentes de una reunión
  const getAusentesInfo = (reunionId) => {
    const reunion = getReunionById(reunionId);
    if (!reunion) return [];

    const asistentesIds = reunion.asistentes || [];
    return getSociosActivos().filter(
      socio => !asistentesIds.includes(socio.id)
    );
  };

  // Calcular estadísticas
  const totalReuniones = reuniones.length;
  const reunionesProgramadas = getReunionesProgramadas().length;
  const reunionesFinalizadas = getReunionesFinalizadas().length;
  const promedioAsistencia = calcularPromedioAsistencia();

  return {
    reuniones,
    filteredReuniones,
    filterEstado,
    setFilterEstado,
    saveReunion,
    deleteReunion,
    toggleAsistencia,
    finalizarReunion,
    getReunionById,
    getReunionesProgramadas,
    getReunionesFinalizadas,
    calcularPromedioAsistencia,
    getAsistentesInfo,
    getAusentesInfo,
    totalReuniones,
    reunionesProgramadas,
    reunionesFinalizadas,
    promedioAsistencia,
    loadReuniones
  };
};