// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/supabase/authService';
import * as permissions from '../utils/permissions';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Cargar perfil del usuario
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await authService.loadUserProfile(userId);
      if (error) {
        console.warn('Error cargando perfil completo, usando perfil básico:', error);
      }
      // Establecer el perfil aunque haya error (puede tener datos básicos)
      if (data) {
        setUserProfile(data);
        return data;
      }
      setUserProfile(null);
      return null;
    } catch (error) {
      console.error('Error crítico cargando perfil:', error);
      setUserProfile(null);
      return null;
    }
  };

  // Cargar sesión inicial - SOLO UNA VEZ
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Obtener sesión actual
        const { data } = await authService.getSession();
        
        if (!mounted) return;

        setSession(data);
        setUser(data?.user || null);

        // Cargar perfil si hay usuario
        if (data?.user) {
          await loadProfile(data.user.id);
        }
      } catch (error) {
        console.error('Error inicializando auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialCheckDone(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Suscribirse a cambios de autenticación
  useEffect(() => {
    if (!initialCheckDone) return;

    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);

        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialCheckDone]);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authService.login(email, password);
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await authService.logout();
      if (error) throw error;
      
      // Limpiar estado local
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      // Limpiar storage
      localStorage.clear();
      sessionStorage.clear();
      
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo usuario
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signUp(email, password);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await authService.updatePassword(newPassword);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      return { success: false, error: error.message };
    }
  };

  // ==================== FUNCIONES DE ROLES ====================
  
  const isSuperAdmin = authService.isSuperAdmin(userProfile);
  const isPresidente = authService.isPresidente(userProfile);
  const isTesorero = authService.isTesorero(userProfile);
  const isSecretario = authService.isSecretario(userProfile);
  const isDelegado = authService.isDelegado(userProfile);
  const isSocio = authService.isSocio(userProfile);

  // ==================== FUNCIONES DE PERMISOS ====================
  
  // Verificar si tiene un permiso específico
  const hasPermission = (permission) => {
    return permissions.hasPermission(userProfile, permission);
  };

  // Verificar permisos por módulo
  const canViewModule = (module, type = 'VIEW') => {
    return permissions.canView(userProfile, module, type);
  };

  const canCreateInModule = (module) => {
    return permissions.canCreate(userProfile, module);
  };

  const canEditInModule = (module) => {
    return permissions.canEdit(userProfile, module);
  };

  const canDeleteInModule = (module) => {
    return permissions.canDelete(userProfile, module);
  };

  // Permisos específicos
  const canViewAllOrganization = permissions.canViewAllOrganization(userProfile);
  const canViewOnlyManzana = permissions.canViewOnlyManzana(userProfile);
  const canViewOnlyOwn = permissions.canViewOnlyOwn(userProfile);

  const canEditSocios = authService.canEditSocios(userProfile);
  const canManageAportes = authService.canManageAportes(userProfile);
  const canApproveAportes = authService.canApproveAportes(userProfile);
  const canManageUsers = authService.canManageUsers(userProfile);

  // Obtener datos de organización
  const organizacionId = authService.getUserOrganizacionId(userProfile);
  const organizacion = userProfile?.organizacion || null;

  // Obtener información del rol
  const rolLabel = permissions.getRolLabel(userProfile?.rol);
  const rolColor = permissions.getRolColor(userProfile?.rol);
  const rolIcon = permissions.getRolIcon(userProfile?.rol);

  const value = {
    // Estados básicos
    session,
    user,
    userProfile,
    loading,
    
    // Información de organización
    organizacionId,
    organizacion,

    // Información del rol
    rolLabel,
    rolColor,
    rolIcon,

    // Funciones de autenticación
    login,
    logout,
    signUp,
    updatePassword,
    loadProfile,

    // Verificadores de rol
    isSuperAdmin,
    isPresidente,
    isTesorero,
    isSecretario,
    isDelegado,
    isSocio,

    // Funciones de permisos generales
    hasPermission,
    canViewModule,
    canCreateInModule,
    canEditInModule,
    canDeleteInModule,

    // Permisos de visualización por alcance
    canViewAllOrganization,
    canViewOnlyManzana,
    canViewOnlyOwn,

    // Permisos específicos por módulo
    canEditSocios,
    canManageAportes,
    canApproveAportes,
    canManageUsers,

    // Legacy (mantener compatibilidad)
    isAdmin: isSuperAdmin || isPresidente
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};