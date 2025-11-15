// src/hooks/useAportes.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';
import { getCurrentMonth } from '../utils/formatters';

/**
 * Hook personalizado para gestión de aportes
 */
export const useAportes = () => {
  const { 
    aportes, 
    socios,
    addAporte, 
    updateAporte, 
    removeAporte,
    loadAportes 
  } = useApp();

  const [filteredAportes, setFilteredAportes] = useState([]);
  const [filterMonth, setFilterMonth] = useState('todos');
  const [filterType, setFilterType] = useState('todos');

  // Filtrar aportes
  useEffect(() => {
    let filtered = [...aportes];

    // Filtrar por mes
    if (filterMonth !== 'todos') {
      filtered = filtered.filter(a => a.fecha.startsWith(filterMonth));
    }

    // Filtrar por tipo
    if (filterType !== 'todos') {
      filtered = filtered.filter(a => a.tipo === filterType);
    }

    setFilteredAportes(filtered);
  }, [aportes, filterMonth, filterType]);

  // Crear aporte
  const saveAporte = async (aporteData) => {
    try {
      const { error } = await addAporte(aporteData);
      if (error) throw error;
      
      alert(MENSAJES_EXITO.APORTE_GUARDADO);
      return { success: true };
    } catch (error) {
      console.error('Error guardando aporte:', error);
      alert('Error al guardar aporte: ' + error.message);
      return { success: false, error };
    }
  };

  // Eliminar aporte
  const deleteAporte = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_APORTE)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await removeAporte(id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando aporte:', error);
      alert('Error al eliminar aporte: ' + error.message);
      return { success: false, error };
    }
  };

  // Obtener aporte con información del socio
  const getAporteWithSocio = (aporte) => {
    const socio = socios.find(s => s.id === aporte.socio_id);
    return {
      ...aporte,
      socio: socio || null
    };
  };

  // Calcular total recaudado
  const totalRecaudado = aportes.reduce(
    (acc, a) => acc + parseFloat(a.monto), 
    0
  );

  // Calcular aportes del mes actual
  const aportesDelMes = aportes.filter(
    a => a.fecha.startsWith(getCurrentMonth())
  );

  const totalDelMes = aportesDelMes.reduce(
    (acc, a) => acc + parseFloat(a.monto),
    0
  );

  // Obtener aportes por socio
  const getAportesBySocio = (socioId) => {
    return aportes.filter(a => a.socio_id === socioId);
  };

  // Obtener aportes por tipo
  const getAportesByTipo = (tipo) => {
    return aportes.filter(a => a.tipo === tipo);
  };

  return {
    aportes,
    filteredAportes,
    filterMonth,
    setFilterMonth,
    filterType,
    setFilterType,
    saveAporte,
    deleteAporte,
    getAporteWithSocio,
    totalRecaudado,
    aportesDelMes,
    totalDelMes,
    getAportesBySocio,
    getAportesByTipo,
    loadAportes
  };
};