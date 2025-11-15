// src/utils/validators.js

/**
 * Funciones de validación
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un DNI peruano (8 dígitos)
 * @param {string} dni - DNI a validar
 * @returns {boolean} True si es válido
 */
export const isValidDNI = (dni) => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
};

/**
 * Valida un número de teléfono peruano (9 dígitos)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida una contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si es válida
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Valida un monto (número positivo)
 * @param {number|string} amount - Monto a validar
 * @returns {boolean} True si es válido
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
};

/**
 * Valida un porcentaje (0-100)
 * @param {number|string} percentage - Porcentaje a validar
 * @returns {boolean} True si es válido
 */
export const isValidPercentage = (percentage) => {
  const num = parseFloat(percentage);
  return !isNaN(num) && num >= 0 && num <= 100;
};

/**
 * Valida el tamaño de un archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSizeMB - Tamaño máximo en MB
 * @returns {boolean} True si es válido
 */
export const isValidFileSize = (file, maxSizeMB = 10) => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file && file.size <= maxBytes;
};

/**
 * Valida el tipo de archivo
 * @param {File} file - Archivo a validar
 * @param {string[]} allowedTypes - Tipos permitidos
 * @returns {boolean} True si es válido
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file || allowedTypes.length === 0) return true;
  return allowedTypes.some(type => file.type.includes(type));
};

/**
 * Valida una fecha (formato YYYY-MM-DD)
 * @param {string} date - Fecha a validar
 * @returns {boolean} True si es válida
 */
export const isValidDateFormat = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Valida una hora (formato HH:MM)
 * @param {string} time - Hora a validar
 * @returns {boolean} True si es válida
 */
export const isValidTimeFormat = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

/**
 * Valida que dos valores sean iguales
 * @param {any} value1 - Primer valor
 * @param {any} value2 - Segundo valor
 * @returns {boolean} True si son iguales
 */
export const areEqual = (value1, value2) => {
  return value1 === value2;
};

/**
 * Valida un número entero positivo
 * @param {number|string} value - Valor a validar
 * @returns {boolean} True si es válido
 */
export const isPositiveInteger = (value) => {
  const num = parseInt(value, 10);
  return Number.isInteger(num) && num > 0;
};

/**
 * Valida la longitud mínima de un string
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} True si cumple
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Valida la longitud máxima de un string
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} True si cumple
 */
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Valida un objeto de formulario completo
 * @param {object} formData - Datos del formulario
 * @param {object} rules - Reglas de validación
 * @returns {object} Objeto con errores (vacío si todo está bien)
 */
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    // Requerido
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = 'Este campo es requerido';
      return;
    }

    // Email
    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = 'Email inválido';
      return;
    }

    // DNI
    if (fieldRules.dni && value && !isValidDNI(value)) {
      errors[field] = 'DNI debe tener 8 dígitos';
      return;
    }

    // Teléfono
    if (fieldRules.phone && value && !isValidPhone(value)) {
      errors[field] = 'Teléfono debe tener 9 dígitos';
      return;
    }

    // Monto
    if (fieldRules.amount && value && !isValidAmount(value)) {
      errors[field] = 'Monto inválido';
      return;
    }

    // Longitud mínima
    if (fieldRules.minLength && value && !hasMinLength(value, fieldRules.minLength)) {
      errors[field] = `Mínimo ${fieldRules.minLength} caracteres`;
      return;
    }

    // Longitud máxima
    if (fieldRules.maxLength && value && !hasMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Máximo ${fieldRules.maxLength} caracteres`;
      return;
    }

    // Coincidencia
    if (fieldRules.matches && value !== formData[fieldRules.matches]) {
      errors[field] = 'Los valores no coinciden';
      return;
    }
  });

  return errors;
};

/**
 * Obtiene mensajes de error personalizados
 * @param {string} field - Campo
 * @param {string} rule - Regla violada
 * @returns {string} Mensaje de error
 */
export const getErrorMessage = (field, rule) => {
  const messages = {
    required: 'Este campo es requerido',
    email: 'Email inválido',
    dni: 'DNI debe tener 8 dígitos',
    phone: 'Teléfono debe tener 9 dígitos',
    password: 'Contraseña debe tener al menos 6 caracteres',
    amount: 'Monto inválido',
    percentage: 'Porcentaje debe estar entre 0 y 100',
    fileSize: 'Archivo muy grande (máximo 10MB)',
    fileType: 'Tipo de archivo no permitido'
  };

  return messages[rule] || 'Valor inválido';
};

export default {
  isValidEmail,
  isValidDNI,
  isValidPhone,
  isValidPassword,
  isRequired,
  isValidAmount,
  isValidPercentage,
  isValidFileSize,
  isValidFileType,
  isValidDateFormat,
  isValidTimeFormat,
  areEqual,
  isPositiveInteger,
  hasMinLength,
  hasMaxLength,
  validateForm,
  getErrorMessage
};