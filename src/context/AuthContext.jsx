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

  // Cargar sesión inicial
  useEffect(() => {
    checkSession();

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Verificar sesión actual
  const checkSession = async () => {
    try {
      const { data } = await authService.getSession();
      setSession(data);
      setUser(data?.user || null);

      if (data?.user) {
        await loadProfile(data.user.id);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar perfil del usuario
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await authService.loadUserProfile(userId);
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const { data, error } = await authService.login(email, password);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      const { error } = await authService.logout();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  };

  // Registrar nuevo usuario
  const signUp = async (email, password) => {
    try {
      const { data, error } = await authService.signUp(email, password);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { success: false, error: error.message };
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