// src/hooks/useSocios.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as sociosService from '../services/supabase/sociosService';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO } from '../utils/constants';

/**
 * Hook personalizado para gestión de socios
 */
export const useSocios = () => {
  const { 
    socios, 
    loadSocios 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSocios, setFilteredSocios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtrar socios cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSocios(socios);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = socios.filter(socio =>
        socio.nombre.toLowerCase().includes(term) ||
        socio.dni.includes(term) ||
        socio.lote.toLowerCase().includes(term)
      );
      setFilteredSocios(filtered);
    }
  }, [searchTerm, socios]);

  // Crear o actualizar socio
  const saveSocio = async (socioData, isEditing = false) => {
    setLoading(true);
    try {
      console.log('Guardando socio:', socioData, 'isEditing:', isEditing);
      
      let result;
      if (isEditing) {
        // Actualizar socio existente
        result = await sociosService.updateSocio(socioData.id, socioData);
      } else {
        // Crear nuevo socio - Remover el ID generado en el cliente
        const { id, ...newSocioData } = socioData;
        result = await sociosService.createSocio(newSocioData);
      }
      
      console.log('Resultado de guardar:', result);
      
      if (result.error) {
        throw result.error;
      }
      
      // Recargar la lista de socios
      await loadSocios();
      
      alert(MENSAJES_EXITO.SOCIO_GUARDADO);
      return { success: true };
    } catch (error) {
      console.error('Error guardando socio:', error);
      alert('Error al guardar socio: ' + (error.message || 'Error desconocido'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar socio
  const deleteSocio = async (id) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_SOCIO)) {
      return { success: false, cancelled: true };
    }

    setLoading(true);
    try {
      console.log('Eliminando socio:', id);
      
      const result = await sociosService.deleteSocio(id);
      
      if (result.error) {
        throw result.error;
      }
      
      // Recargar la lista de socios
      await loadSocios();
      
      alert('Socio eliminado correctamente');
      return { success: true };
    } catch (error) {
      console.error('Error eliminando socio:', error);
      alert('Error al eliminar socio: ' + (error.message || 'Error desconocido'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Obtener socio por ID
  const getSocioById = (id) => {
    return socios.find(s => s.id === id);
  };

  // Obtener socios activos
  const getSociosActivos = () => {
    return socios.filter(s => s.estado === 'activo');
  };

  // Obtener socios inactivos
  const getSociosInactivos = () => {
    return socios.filter(s => s.estado === 'inactivo');
  };

  // Obtener socios morosos
  const getSociosMorosos = () => {
    return socios.filter(s => 
      s.estado === 'activo' && s.pagado < s.cuota
    );
  };

  // Calcular total de socios activos
  const totalSociosActivos = getSociosActivos().length;

  // Calcular total de cuotas pendientes
  const totalCuotasPendientes = socios.reduce(
    (acc, s) => acc + Math.max(0, s.cuota - s.pagado), 
    0
  );

  return {
    socios,
    filteredSocios,
    searchTerm,
    setSearchTerm,
    saveSocio,
    deleteSocio,
    getSocioById,
    getSociosActivos,
    getSociosInactivos,
    getSociosMorosos,
    totalSociosActivos,
    totalCuotasPendientes,
    loadSocios,
    loading
  };
};