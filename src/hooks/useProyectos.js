// src/hooks/useProyectos.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';

/**
 * Hook personalizado para gestión de proyectos
 */
export const useProyectos = () => {
  const { 
    proyectos, 
    addProyecto, 
    updateProyecto, 
    removeProyecto,
    loadProyectos 
  } = useApp();

  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [filterEstado, setFilterEstado] = useState('todos');

  // Filtrar proyectos por estado
  useEffect(() => {
    if (filterEstado === 'todos') {
      setFilteredProyectos(proyectos);
    } else {
      setFilteredProyectos(
        proyectos.filter(p => p.estado === filterEstado)
      );
    }
  }, [proyectos, filterEstado]);

  // Crear o actualizar proyecto
  const saveProyecto = async (proyectoData, isEditing = false) => {
    try {
      if (isEditing) {
        const { error } = await updateProyecto(proyectoData.id, proyectoData);
        if (error) throw error;
      } else {
        const { error } = await addProyecto(proyectoData);
        if (error) throw error;
      }
      
      alert(MENSAJES_EXITO.PROYECTO_GUARDADO);
      return { success: true };
    } catch (error) {
      console.error('Error guardando proyecto:', error);
      alert('Error al guardar proyecto: ' + error.message);
      return { success: false, error };
    }
  };

  // Eliminar proyecto
  const deleteProyecto = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_PROYECTO)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await removeProyecto(id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      alert('Error al eliminar proyecto: ' + error.message);
      return { success: false, error };
    }
  };

  // Obtener proyecto por ID
  const getProyectoById = (id) => {
    return proyectos.find(p => p.id === id);
  };

  // Obtener proyectos por estado
  const getProyectosByEstado = (estado) => {
    return proyectos.filter(p => p.estado === estado);
  };

  // Calcular totales
  const proyectosPlanificados = getProyectosByEstado('planificado').length;
  const proyectosEnProceso = getProyectosByEstado('en_proceso').length;
  const proyectosCompletados = getProyectosByEstado('completado').length;

  const presupuestoTotal = proyectos.reduce(
    (acc, p) => acc + parseFloat(p.presupuesto || 0),
    0
  );

  const presupuestoCompletados = getProyectosByEstado('completado').reduce(
    (acc, p) => acc + parseFloat(p.presupuesto || 0),
    0
  );

  return {
    proyectos,
    filteredProyectos,
    filterEstado,
    setFilterEstado,
    saveProyecto,
    deleteProyecto,
    getProyectoById,
    getProyectosByEstado,
    proyectosPlanificados,
    proyectosEnProceso,
    proyectosCompletados,
    presupuestoTotal,
    presupuestoCompletados,
    loadProyectos
  };
};