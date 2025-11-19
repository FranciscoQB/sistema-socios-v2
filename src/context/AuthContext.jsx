// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/supabase/authService';

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
      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error cargando perfil:', error);
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
  }, []); // Solo se ejecuta UNA VEZ al montar

  // Suscribirse a cambios de autenticación - DESPUÉS de la carga inicial
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
      
      // El onAuthStateChange manejará la actualización del estado
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
      
      // Limpiar storage por si acaso
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

  // Verificar si el usuario es admin
  const isAdmin = userProfile?.rol === 'admin';

  const value = {
    session,
    user,
    userProfile,
    loading,
    isAdmin,
    login,
    logout,
    signUp,
    updatePassword,
    loadProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};