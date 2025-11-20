// src/utils/permissions.js

/**
 * Sistema de permisos basado en roles
 */

// Definición de roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRESIDENTE: 'presidente',
  TESORERO: 'tesorero',
  SECRETARIO: 'secretario',
  DELEGADO: 'delegado',
  SOCIO: 'socio'
};

// Definición de permisos por módulo
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO],
    VIEW_FINANCIAL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    VIEW_LIMITED: [ROLES.DELEGADO],
    VIEW_PERSONAL: [ROLES.SOCIO]
  },

  // Socios
  SOCIOS: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO],
    VIEW_MANZANA: [ROLES.DELEGADO],
    VIEW_OWN: [ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO]
  },

  // Aportes
  APORTES: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO],
    VIEW_MANZANA: [ROLES.DELEGADO],
    VIEW_OWN: [ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    APPROVE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE]
  },

  // Registro Masivo
  REGISTRO_MASIVO: {
    VIEW: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE]
  },

  // Libro de Caja
  LIBRO_CAJA: {
    VIEW: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO]
  },

  // Recibos
  RECIBOS: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO],
    VIEW_MANZANA: [ROLES.DELEGADO],
    VIEW_OWN: [ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO],
    ANULAR: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO]
  },

  // Reuniones
  REUNIONES: {
    VIEW: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO, ROLES.DELEGADO, ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO]
  },

  // Asistencia
  ASISTENCIA: {
    VIEW: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO, ROLES.DELEGADO],
    VIEW_OWN: [ROLES.SOCIO],
    MANAGE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO]
  },

  // Reportes
  REPORTES: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE],
    VIEW_FINANCIAL: [ROLES.TESORERO],
    VIEW_GENERAL: [ROLES.SECRETARIO],
    VIEW_BASIC: [ROLES.DELEGADO],
    VIEW_PERSONAL: [ROLES.SOCIO]
  },

  // Documentos
  DOCUMENTOS: {
    VIEW_ALL: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO, ROLES.DELEGADO],
    VIEW_PUBLIC: [ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO]
  },

  // Proyectos
  PROYECTOS: {
    VIEW: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.TESORERO, ROLES.SECRETARIO, ROLES.DELEGADO, ROLES.SOCIO],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE, ROLES.SECRETARIO]
  },

  // Configuración
  CONFIGURACION: {
    VIEW_ALL: [ROLES.SUPER_ADMIN],
    VIEW_BASIC: [ROLES.PRESIDENTE],
    EDIT_ALL: [ROLES.SUPER_ADMIN],
    EDIT_BASIC: [ROLES.PRESIDENTE]
  },

  // Usuarios
  USUARIOS: {
    VIEW_ALL: [ROLES.SUPER_ADMIN],
    VIEW_ORG: [ROLES.PRESIDENTE],
    CREATE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE],
    EDIT: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE],
    DELETE: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE],
    ASSIGN_ROLES: [ROLES.SUPER_ADMIN, ROLES.PRESIDENTE]
  }
};

// Funciones helper para verificar permisos
export const hasPermission = (userProfile, permission) => {
  if (!userProfile || !userProfile.rol) return false;
  if (!permission || !Array.isArray(permission)) return false;
  return permission.includes(userProfile.rol);
};

export const canView = (userProfile, module, type = 'VIEW') => {
  const permission = PERMISSIONS[module]?.[type];
  return hasPermission(userProfile, permission);
};

export const canCreate = (userProfile, module) => {
  return canView(userProfile, module, 'CREATE');
};

export const canEdit = (userProfile, module) => {
  return canView(userProfile, module, 'EDIT');
};

export const canDelete = (userProfile, module) => {
  return canView(userProfile, module, 'DELETE');
};

// Verificar si puede ver datos de toda la organización
export const canViewAllOrganization = (userProfile) => {
  if (!userProfile) return false;
  return [
    ROLES.SUPER_ADMIN,
    ROLES.PRESIDENTE,
    ROLES.TESORERO,
    ROLES.SECRETARIO
  ].includes(userProfile.rol);
};

// Verificar si solo puede ver su manzana
export const canViewOnlyManzana = (userProfile) => {
  if (!userProfile) return false;
  return userProfile.rol === ROLES.DELEGADO;
};

// Verificar si solo puede ver sus propios datos
export const canViewOnlyOwn = (userProfile) => {
  if (!userProfile) return false;
  return userProfile.rol === ROLES.SOCIO;
};

// Obtener label del rol
export const getRolLabel = (rol) => {
  const labels = {
    [ROLES.SUPER_ADMIN]: 'Super Administrador',
    [ROLES.PRESIDENTE]: 'Presidente',
    [ROLES.TESORERO]: 'Tesorero',
    [ROLES.SECRETARIO]: 'Secretario',
    [ROLES.DELEGADO]: 'Delegado de Manzana',
    [ROLES.SOCIO]: 'Socio'
  };
  return labels[rol] || rol;
};

// Obtener color del rol para badges
export const getRolColor = (rol) => {
  const colors = {
    [ROLES.SUPER_ADMIN]: 'purple',
    [ROLES.PRESIDENTE]: 'blue',
    [ROLES.TESORERO]: 'green',
    [ROLES.SECRETARIO]: 'yellow',
    [ROLES.DELEGADO]: 'orange',
    [ROLES.SOCIO]: 'gray'
  };
  return colors[rol] || 'gray';
};

// Obtener icono del rol
export const getRolIcon = (rol) => {
  const icons = {
    [ROLES.SUPER_ADMIN]: 'Shield',
    [ROLES.PRESIDENTE]: 'Crown',
    [ROLES.TESORERO]: 'DollarSign',
    [ROLES.SECRETARIO]: 'FileText',
    [ROLES.DELEGADO]: 'Users',
    [ROLES.SOCIO]: 'User'
  };
  return icons[rol] || 'User';
};

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  canView,
  canCreate,
  canEdit,
  canDelete,
  canViewAllOrganization,
  canViewOnlyManzana,
  canViewOnlyOwn,
  getRolLabel,
  getRolColor,
  getRolIcon
};