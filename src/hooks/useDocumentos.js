// src/hooks/useDocumentos.js
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MENSAJES_CONFIRMACION, MENSAJES_EXITO, MENSAJES_ERROR, LIMITES } from '../utils/constants';
import { isValidFileSize } from '../utils/validators';
import { formatFileSize } from '../utils/formatters';

/**
 * Hook personalizado para gestión de documentos
 */
export const useDocumentos = () => {
  const { 
    documentos,
    uploadDocumento, 
    removeDocumento,
    loadDocumentos 
  } = useApp();

  const { session } = useAuth();

  const [filteredDocumentos, setFilteredDocumentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  // Filtrar documentos por búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDocumentos(documentos);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = documentos.filter(doc =>
        doc.nombre.toLowerCase().includes(term) ||
        (doc.descripcion && doc.descripcion.toLowerCase().includes(term))
      );
      setFilteredDocumentos(filtered);
    }
  }, [searchTerm, documentos]);

  // Validar archivo antes de subir
  const validateFile = (file) => {
    // Validar tamaño
    if (!isValidFileSize(file, 10)) {
      return {
        valid: false,
        error: MENSAJES_ERROR.ARCHIVO_GRANDE
      };
    }

    // Validar tipo (opcional - puedes agregar más validaciones)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten PDF, Word, Excel e imágenes.'
      };
    }

    return { valid: true };
  };

  // Subir documento
  const subirDocumento = async (file, descripcion = '') => {
    // Validar archivo
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return { success: false, error: validation.error };
    }

    setUploading(true);

    try {
      const metadata = {
        id: Date.now(),
        descripcion,
        subido_por: session?.user?.id
      };

      const { data, error } = await uploadDocumento(file, metadata);
      if (error) throw error;

      alert(MENSAJES_EXITO.DOCUMENTO_SUBIDO);
      return { success: true, data };
    } catch (error) {
      console.error('Error subiendo documento:', error);
      alert('Error al subir documento: ' + error.message);
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  // Eliminar documento
  const eliminarDocumento = async (id, url) => {
    if (!window.confirm(MENSAJES_CONFIRMACION.ELIMINAR_DOCUMENTO)) {
      return { success: false, cancelled: true };
    }

    try {
      const { error } = await removeDocumento(id, url);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando documento:', error);
      alert('Error al eliminar documento: ' + error.message);
      return { success: false, error };
    }
  };

  // Obtener documento por ID
  const getDocumentoById = (id) => {
    return documentos.find(d => d.id === id);
  };

  // Obtener documentos por tipo
  const getDocumentosByTipo = (tipo) => {
    return documentos.filter(d => 
      d.tipo && d.tipo.toLowerCase().includes(tipo.toLowerCase())
    );
  };

  // Obtener documentos del mes actual
  const getDocumentosDelMes = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return documentos.filter(d => {
      const fecha = new Date(d.fecha_subida);
      return fecha.getMonth() === currentMonth && 
             fecha.getFullYear() === currentYear;
    });
  };

  // Calcular tamaño total usado
  const getTamanoTotal = () => {
    return documentos.reduce((acc, d) => acc + (d.tamano || 0), 0);
  };

  // Calcular estadísticas
  const totalDocumentos = documentos.length;
  const documentosDelMes = getDocumentosDelMes().length;
  const tamanoTotal = getTamanoTotal();
  const tamanoTotalFormateado = formatFileSize(tamanoTotal);

  // Obtener documentos PDF
  const getDocumentosPDF = () => {
    return documentos.filter(d => 
      d.tipo && d.tipo.includes('pdf')
    );
  };

  // Obtener documentos de Word
  const getDocumentosWord = () => {
    return documentos.filter(d => 
      d.tipo && (d.tipo.includes('word') || d.tipo.includes('document'))
    );
  };

  // Obtener documentos de Excel
  const getDocumentosExcel = () => {
    return documentos.filter(d => 
      d.tipo && (d.tipo.includes('excel') || d.tipo.includes('sheet'))
    );
  };

  // Obtener imágenes
  const getImagenes = () => {
    return documentos.filter(d => 
      d.tipo && d.tipo.includes('image')
    );
  };

  // Descargar documento
  const descargarDocumento = (url, nombre) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = nombre;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    } catch (error) {
      console.error('Error descargando documento:', error);
      return { success: false, error };
    }
  };

  return {
    documentos,
    filteredDocumentos,
    searchTerm,
    setSearchTerm,
    uploading,
    subirDocumento,
    eliminarDocumento,
    getDocumentoById,
    getDocumentosByTipo,
    getDocumentosDelMes,
    getTamanoTotal,
    totalDocumentos,
    documentosDelMes,
    tamanoTotal,
    tamanoTotalFormateado,
    getDocumentosPDF,
    getDocumentosWord,
    getDocumentosExcel,
    getImagenes,
    descargarDocumento,
    loadDocumentos
  };
};