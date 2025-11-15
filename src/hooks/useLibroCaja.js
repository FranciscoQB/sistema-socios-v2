// src/hooks/useLibroCaja.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';

/**
 * Hook personalizado para gestión del libro de caja
 */
export const useLibroCaja = () => {
  const { 
    libroCaja,
    addMovimiento, 
    updateMovimiento, 
    removeMovimiento,
    loadLibroCaja 
  } = useApp();

  const [filteredMovimientos, setFilteredMovimientos] = useState([]);
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterMes, setFilterMes] = useState('todos');

  // Filtrar movimientos
  useEffect(() => {
    let filtered = [...libroCaja];

    // Filtrar por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(m => m.tipo === filterTipo);
    }

    // Filtrar por mes
    if (filterMes !== 'todos') {
      filtered = filtered.filter(m => m.fecha.startsWith(filterMes));
    }

    setFilteredMovimientos(filtered);
  }, [libroCaja, filterTipo, filterMes]);

  // Crear o actualizar movimiento
  const saveMovimiento = async (movimientoData, isEditing = false) => {
    try {
      if (isEditing) {
        const { error } = await updateMovimiento(movimientoData.id, movimientoData);
        if (error) throw error;
      } else {
        const { error } = await addMovimiento(movimientoData);
        if (error) throw error;
      }
      
      alert(MENSAJES_EXITO.MOVIMIENTO_GUARDADO);
      return { success: true };
    } catch (error) {
      console.error('Error guardando movimiento:', error);
      alert('Error al guardar movimiento: ' + error.message);
      return { success: false, error };
    }
  };

  // Eliminar movimiento
  const deleteMovimiento = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_MOVIMIENTO)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await removeMovimiento(id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando movimiento:', error);
      alert('Error al eliminar movimiento: ' + error.message);
      return { success: false, error };
    }
  };

  // Calcular totales
  const totalIngresos = libroCaja
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);

  const totalEgresos = libroCaja
    .filter(m => m.tipo === 'egreso')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);

  const balance = totalIngresos - totalEgresos;

  // Obtener movimientos por tipo
  const getMovimientosByTipo = (tipo) => {
    return libroCaja.filter(m => m.tipo === tipo);
  };

  // Obtener movimientos por categoría
  const getMovimientosByCategoria = (categoria) => {
    return libroCaja.filter(m => m.categoria === categoria);
  };

  // Obtener meses únicos para filtros
  const mesesUnicos = [...new Set(
    libroCaja.map(m => m.fecha.substring(0, 7))
  )].sort().reverse();

  return {
    libroCaja,
    filteredMovimientos,
    filterTipo,
    setFilterTipo,
    filterMes,
    setFilterMes,
    saveMovimiento,
    deleteMovimiento,
    totalIngresos,
    totalEgresos,
    balance,
    getMovimientosByTipo,
    getMovimientosByCategoria,
    mesesUnicos,
    loadLibroCaja
  };
};