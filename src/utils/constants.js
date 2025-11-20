// src/utils/constants.js

/**
 * Constantes de la aplicación
 */

// Información de la asociación
export const ASOCIACION_INFO = {
  nombre: 'Asociación Centro Poblado Esperanza Central',
  ubicacion: 'Asentamiento Humano Esperanza Central II Etapa - Huaral',
  version: '2.0.0',
  direccion: 'Asentamiento Humano Esperanza Central II Etapa - Huaral',
  telefono: '+51 923732863',
  email: 'cp.esperanzacentral@gmail.com',
  ruc: '20613166077',
  web: 'www.esperanzacentral.com'
};

// Estados de socios
export const ESTADOS_SOCIO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
};

// Tipos de aportes
export const TIPOS_APORTE = {
  CUOTA: 'cuota',
  EXTRAORDINARIO: 'extraordinario',
  MULTA: 'multa',
  OTRO: 'otro'
};

// Métodos de pago para aportes (versión simplificada)
export const TIPOS_PAGO = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  YAPE: 'yape',
  PLIN: 'plin',
  DEPOSITO: 'deposito',
  CHEQUE: 'cheque'
};

// Estados de proyectos
export const ESTADOS_PROYECTO = {
  PLANIFICADO: 'planificado',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado'
};

// Estados de reuniones
export const ESTADOS_REUNION = {
  PROGRAMADA: 'programada',
  FINALIZADA: 'finalizada'
};

// Tipos de reuniones
export const TIPOS_REUNION = {
  ORDINARIA: 'ordinaria',
  EXTRAORDINARIA: 'extraordinaria'
};

// Tipos de movimientos en libro de caja
export const TIPOS_MOVIMIENTO = {
  INGRESO: 'ingreso',
  EGRESO: 'egreso'
};

// Categorías de libro de caja
export const CATEGORIAS_INGRESO = [
  { value: 'cuota_mensual', label: 'Cuota mensual' },
  { value: 'aporte_extraordinario', label: 'Aporte extraordinario' },
  { value: 'multa', label: 'Multa' },
  { value: 'donacion', label: 'Donación' },
  { value: 'otro_ingreso', label: 'Otro ingreso' }
];

export const CATEGORIAS_EGRESO = [
  { value: 'servicio_luz', label: 'Servicio de luz' },
  { value: 'servicio_agua', label: 'Servicio de agua' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'construccion', label: 'Construcción/Obra' },
  { value: 'papeleria', label: 'Papelería' },
  { value: 'legal', label: 'Gastos legales' },
  { value: 'otro_egreso', label: 'Otro egreso' }
];

// Métodos de pago
export const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'deposito', label: 'Depósito bancario' },
  { value: 'cheque', label: 'Cheque' }
];

// Estados de recibos
export const ESTADOS_RECIBO = {
  EMITIDO: 'emitido',
  ANULADO: 'anulado'
};

// Roles de usuarios (ACTUALIZADO CON NUEVO SISTEMA)
export const ROLES_USUARIO = {
  SUPER_ADMIN: 'super_admin',
  PRESIDENTE: 'presidente',
  TESORERO: 'tesorero',
  SECRETARIO: 'secretario',
  DELEGADO: 'delegado',
  SOCIO: 'socio',
  // Mantener compatibilidad con roles antiguos
  ADMIN: 'admin',
  USUARIO: 'usuario'
};

// Navegación del sidebar CON ROLES
export const MENU_ITEMS = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: 'Home',
    path: '/inicio',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'socios',
    label: 'Socios',
    icon: 'Users',
    path: '/socios',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado']
  },
  {
    id: 'aportes',
    label: 'Aportes',
    icon: 'DollarSign',
    path: '/aportes',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'registro-masivo',
    label: 'Registro Masivo',
    icon: 'CheckSquare',
    path: '/registro-masivo',
    roles: ['super_admin', 'presidente', 'tesorero']
  },
  {
    id: 'libro-caja',
    label: 'Libro de Caja',
    icon: 'BookOpen',
    path: '/libro-caja',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario']
  },
  {
    id: 'recibos',
    label: 'Recibos',
    icon: 'FileText',
    path: '/recibos',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    icon: 'BarChart3',
    path: '/asistencia',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: 'PieChart',
    path: '/reportes',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: 'FolderOpen',
    path: '/documentos',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'proyectos',
    label: 'Proyectos',
    icon: 'Briefcase',
    path: '/proyectos',
    roles: ['super_admin', 'presidente', 'tesorero', 'secretario', 'delegado', 'socio']
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: 'UserCog',
    path: '/usuarios',
    roles: ['super_admin', 'presidente']
  }
];

// Mensajes de confirmación
export const MENSAJES_CONFIRMACION = {
  ELIMINAR_SOCIO: '¿Está seguro de eliminar este socio?',
  ELIMINAR_APORTE: '¿Está seguro de eliminar este aporte?',
  ELIMINAR_PROYECTO: '¿Está seguro de eliminar este proyecto?',
  ELIMINAR_REUNION: '¿Está seguro de eliminar esta reunión?',
  ELIMINAR_MOVIMIENTO: '¿Está seguro de eliminar este movimiento?',
  ELIMINAR_DOCUMENTO: '¿Está seguro de eliminar este documento?',
  ELIMINAR_USUARIO: '¿Está seguro de eliminar al usuario',
  FINALIZAR_REUNION: '¿Está seguro de finalizar esta reunión?',
  ANULAR_RECIBO: '¿Está seguro de anular este recibo?',
  CERRAR_SESION: '¿Está seguro de cerrar sesión?'
};

// Mensajes de éxito
export const MENSAJES_EXITO = {
  SOCIO_GUARDADO: 'Socio guardado exitosamente',
  APORTE_GUARDADO: 'Aporte registrado exitosamente',
  PROYECTO_GUARDADO: 'Proyecto guardado exitosamente',
  REUNION_GUARDADA: 'Reunión guardada exitosamente',
  MOVIMIENTO_GUARDADO: 'Movimiento registrado exitosamente',
  DOCUMENTO_SUBIDO: 'Documento subido exitosamente',
  RECIBO_GENERADO: 'Recibo generado exitosamente',
  USUARIO_CREADO: 'Usuario creado exitosamente',
  PASSWORD_ACTUALIZADA: 'Contraseña actualizada exitosamente',
  REUNION_FINALIZADA: 'Reunión finalizada exitosamente',
  RECIBO_ANULADO: 'Recibo anulado exitosamente'
};

// Mensajes de error
export const MENSAJES_ERROR = {
  GENERICO: 'Ocurrió un error. Intente nuevamente.',
  LOGIN: 'Email o contraseña incorrectos',
  ARCHIVO_GRANDE: 'El archivo no puede ser mayor a 10MB',
  SIN_SOCIO: 'No se encontró el socio asociado',
  SIN_APORTE: 'No se encontró el aporte asociado',
  SIN_RECIBO: 'No existe recibo para este aporte'
};

// Límites
export const LIMITES = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  PASSWORD_MIN_LENGTH: 6
};

// Formatos de fecha
export const FORMATO_FECHA = {
  CORTA: 'DD/MM/YYYY',
  LARGA: 'DD de MMMM de YYYY',
  HORA: 'HH:mm'
};

export default {
  ASOCIACION_INFO,
  ESTADOS_SOCIO,
  TIPOS_APORTE,
  TIPOS_PAGO,
  ESTADOS_PROYECTO,
  ESTADOS_REUNION,
  TIPOS_REUNION,
  TIPOS_MOVIMIENTO,
  CATEGORIAS_INGRESO,
  CATEGORIAS_EGRESO,
  METODOS_PAGO,
  ESTADOS_RECIBO,
  ROLES_USUARIO,
  MENU_ITEMS,
  MENSAJES_CONFIRMACION,
  MENSAJES_EXITO,
  MENSAJES_ERROR,
  LIMITES,
  FORMATO_FECHA
};