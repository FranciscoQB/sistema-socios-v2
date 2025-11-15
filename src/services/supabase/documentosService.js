// src/services/supabase/documentosService.js
import { supabase } from './client';

/**
 * Servicio de gestión de documentos
 */

/**
 * Obtiene todos los documentos
 */
export const getDocumentos = async () => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .order('fecha_subida', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo documentos:', error);
    return { data: [], error };
  }
};

/**
 * Obtiene un documento por ID
 */
export const getDocumentoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo documento:', error);
    return { data: null, error };
  }
};

/**
 * Sube un archivo al storage
 */
export const uploadFile = async (file, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(fileName, file);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene la URL pública de un archivo
 */
export const getPublicUrl = (fileName) => {
  try {
    const { data } = supabase.storage
      .from('documentos')
      .getPublicUrl(fileName);

    return { data: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error obteniendo URL pública:', error);
    return { data: null, error };
  }
};

/**
 * Crea un registro de documento en la BD
 */
export const createDocumento = async (documentoData) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .insert([documentoData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creando documento:', error);
    return { data: null, error };
  }
};

/**
 * Actualiza un documento
 */
export const updateDocumento = async (id, documentoData) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .update(documentoData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error actualizando documento:', error);
    return { data: null, error };
  }
};

/**
 * Elimina un archivo del storage
 */
export const deleteFile = async (fileName) => {
  try {
    const { error } = await supabase.storage
      .from('documentos')
      .remove([fileName]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    return { error };
  }
};

/**
 * Elimina un documento (BD y storage)
 */
export const deleteDocumento = async (id, url) => {
  try {
    // Extraer nombre del archivo de la URL
    const fileName = url.split('/').pop();

    // Eliminar del storage
    const { error: storageError } = await deleteFile(fileName);
    if (storageError) throw storageError;

    // Eliminar de la BD
    const { error: dbError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando documento:', error);
    return { error };
  }
};

/**
 * Sube documento completo (archivo + registro BD)
 */
export const uploadDocumento = async (file, metadata) => {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Subir archivo
    const { error: uploadError } = await uploadFile(file, fileName);
    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: urlData } = getPublicUrl(fileName);

    // Crear registro en BD
    const documentoData = {
      ...metadata,
      url: urlData,
      nombre: file.name,
      tipo: file.type,
      tamano: file.size,
      fecha_subida: new Date().toISOString()
    };

    const { data, error: dbError } = await createDocumento(documentoData);
    if (dbError) throw dbError;

    return { data, error: null };
  } catch (error) {
    console.error('Error en uploadDocumento:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene documentos por tipo
 */
export const getDocumentosByTipo = async (tipo) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .ilike('tipo', `%${tipo}%`)
      .order('fecha_subida', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error obteniendo documentos por tipo:', error);
    return { data: [], error };
  }
};

/**
 * Busca documentos por nombre
 */
export const searchDocumentos = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .ilike('nombre', `%${searchTerm}%`)
      .order('fecha_subida', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error buscando documentos:', error);
    return { data: [], error };
  }
};

export default {
  getDocumentos,
  getDocumentoById,
  uploadFile,
  getPublicUrl,
  createDocumento,
  updateDocumento,
  deleteFile,
  deleteDocumento,
  uploadDocumento,
  getDocumentosByTipo,
  searchDocumentos
};