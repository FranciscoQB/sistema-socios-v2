// src/utils/formatters.js

/**
 * Funciones de formateo y utilidades
 */

/**
 * Formatea un número a formato de moneda peruana
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado (ej: "S/ 150.00")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'S/ 0.00';
  return `S/ ${parseFloat(amount).toFixed(2)}`;
};

/**
 * Formatea una fecha al formato DD/MM/YYYY
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha al formato legible (ej: "15 de Noviembre de 2024")
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('es-PE', options);
};

/**
 * Formatea una hora al formato HH:MM
 * @param {string} time - Hora a formatear
 * @returns {string} Hora formateada
 */
export const formatTime = (time) => {
  if (!time) return '';
  return time.substring(0, 5);
};

/**
 * Formatea un tamaño de archivo a formato legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} Tamaño formateado (ej: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formatea un DNI con espacios
 * @param {string} dni - DNI a formatear
 * @returns {string} DNI formateado (ej: "12345678" -> "12 345 678")
 */
export const formatDNI = (dni) => {
  if (!dni) return '';
  return dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Teléfono a formatear
 * @returns {string} Teléfono formateado (ej: "987654321" -> "987 654 321")
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Trunca un texto largo
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado con "..."
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calcula el porcentaje
 * @param {number} value - Valor
 * @param {number} total - Total
 * @returns {number} Porcentaje (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Obtiene el ícono de un archivo según su tipo
 * @param {string} mimeType - Tipo MIME del archivo
 * @returns {string} Emoji del ícono
 */
export const getFileIcon = (mimeType) => {
  if (!mimeType) return '📎';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
  if (mimeType.includes('image')) return '🖼️';
  return '📎';
};

/**
 * Genera un ID único basado en timestamp
 * @returns {number} ID único
 */
export const generateId = () => {
  return Date.now();
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Obtiene la hora actual en formato HH:MM
 * @returns {string} Hora actual
 */
export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * Compara dos fechas
 * @param {string|Date} date1 - Primera fecha
 * @param {string|Date} date2 - Segunda fecha
 * @returns {number} -1 si date1 < date2, 0 si son iguales, 1 si date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

/**
 * Valida si una fecha es válida
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} True si es válida
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Obtiene el mes y año actual en formato YYYY-MM
 * @returns {string} Mes y año
 */
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Obtiene el nombre del mes en español
 * @param {number} monthNumber - Número del mes (1-12)
 * @returns {string} Nombre del mes
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthNumber - 1] || '';
};

/**
 * Sanitiza un string para usar como nombre de archivo
 * @param {string} filename - Nombre a sanitizar
 * @returns {string} Nombre sanitizado
 */
export const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_.]/g, '');
};

export default {
  formatCurrency,
  formatDate,
  formatDateLong,
  formatTime,
  formatFileSize,
  formatDNI,
  formatPhone,
  capitalize,
  truncateText,
  calculatePercentage,
  getFileIcon,
  generateId,
  getTodayDate,
  getCurrentTime,
  compareDates,
  isValidDate,
  getCurrentMonth,
  getMonthName,
  sanitizeFilename
};