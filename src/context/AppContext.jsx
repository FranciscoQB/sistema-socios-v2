// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase/client'; 
import * as sociosService from '../services/supabase/sociosService';
import * as aportesService from '../services/supabase/aportesService';
import * as proyectosService from '../services/supabase/proyectosService';
import * as reunionesService from '../services/supabase/reunionesService';
import * as libroCajaService from '../services/supabase/libroCajaService';
import * as recibosService from '../services/supabase/recibosService';
import * as documentosService from '../services/supabase/documentosService';
import * as registroMasivoService from '../services/supabase/registroMasivoService';
import * as usuariosService from '../services/supabase/usuariosService';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Estados
  const [socios, setSocios] = useState([]);
  const [aportes, setAportes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [reuniones, setReuniones] = useState([]);
  const [libroCaja, setLibroCaja] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrosMasivos, setRegistrosMasivos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // UI States
  const [currentView, setCurrentView] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cargar todos los datos al iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  // Función principal para cargar datos
  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadSocios(),
      loadAportes(),
      loadProyectos(),
      loadReuniones(),
      loadLibroCaja(),
      loadRecibos(),
      loadDocumentos(),
      loadAvisos(),
      loadRegistrosMasivos(),
      loadUsuarios()
    ]);
    setLoading(false);
  };

  // ==================== SOCIOS ====================
  const loadSocios = async () => {
    const { data } = await sociosService.getSocios();
    setSocios(data);
  };

  const addSocio = async (socioData) => {
    const { data, error } = await sociosService.createSocio(socioData);
    if (!error && data) {
      setSocios([...socios, data]);
    }
    return { data, error };
  };

  const updateSocio = async (id, socioData) => {
    const { data, error } = await sociosService.updateSocio(id, socioData);
    if (!error && data) {
      setSocios(socios.map(s => s.id === id ? data : s));
    }
    return { data, error };
  };

  const removeSocio = async (id) => {
    const { error } = await sociosService.deleteSocio(id);
    if (!error) {
      setSocios(socios.filter(s => s.id !== id));
    }
    return { error };
  };

  // ==================== APORTES ====================
  const loadAportes = async () => {
    const { data } = await aportesService.getAportes();
    setAportes(data);
  };

  const addAporte = async (aporteData) => {
    const { data, error } = await aportesService.createAporte(aporteData);
    if (!error && data) {
      setAportes([data, ...aportes]);
      // Recargar socios para actualizar el monto pagado
      await loadSocios();
    }
    return { data, error };
  };

  const updateAporte = async (id, aporteData) => {
    const { data, error } = await aportesService.updateAporte(id, aporteData);
    if (!error && data) {
      setAportes(aportes.map(a => a.id === id ? data : a));
    }
    return { data, error };
  };

  const removeAporte = async (id) => {
    const { error } = await aportesService.deleteAporte(id);
    if (!error) {
      setAportes(aportes.filter(a => a.id !== id));
    }
    return { error };
  };

  // ==================== PROYECTOS ====================
  const loadProyectos = async () => {
    const { data } = await proyectosService.getProyectos();
    setProyectos(data);
  };

  const addProyecto = async (proyectoData) => {
    const { data, error } = await proyectosService.createProyecto(proyectoData);
    if (!error && data) {
      setProyectos([...proyectos, data]);
    }
    return { data, error };
  };

  const updateProyecto = async (id, proyectoData) => {
    const { data, error } = await proyectosService.updateProyecto(id, proyectoData);
    if (!error && data) {
      setProyectos(proyectos.map(p => p.id === id ? data : p));
    }
    return { data, error };
  };

  const removeProyecto = async (id) => {
    const { error } = await proyectosService.deleteProyecto(id);
    if (!error) {
      setProyectos(proyectos.filter(p => p.id !== id));
    }
    return { error };
  };

  // ==================== REUNIONES ====================
  const loadReuniones = async () => {
    const { data } = await reunionesService.getReuniones();
    setReuniones(data);
  };

  const addReunion = async (reunionData) => {
    const { data, error } = await reunionesService.createReunion(reunionData);
    if (!error && data) {
      setReuniones([data, ...reuniones]);
    }
    return { data, error };
  };

  const updateReunion = async (id, reunionData) => {
    const { data, error } = await reunionesService.updateReunion(id, reunionData);
    if (!error && data) {
      setReuniones(reuniones.map(r => r.id === id ? data : r));
    }
    return { data, error };
  };

  const removeReunion = async (id) => {
    const { error } = await reunionesService.deleteReunion(id);
    if (!error) {
      setReuniones(reuniones.filter(r => r.id !== id));
    }
    return { error };
  };

  const updateAsistentes = async (reunionId, asistentes) => {
    const { data, error } = await reunionesService.updateAsistentes(reunionId, asistentes);
    if (!error && data) {
      setReuniones(reuniones.map(r => r.id === reunionId ? data : r));
    }
    return { data, error };
  };

  const finalizarReunion = async (reunionId) => {
    const { data, error } = await reunionesService.finalizarReunion(reunionId);
    if (!error && data) {
      setReuniones(reuniones.map(r => r.id === reunionId ? data : r));
    }
    return { data, error };
  };

  // ==================== LIBRO DE CAJA ====================
  const loadLibroCaja = async () => {
    const { data } = await libroCajaService.getMovimientos();
    setLibroCaja(data);
  };

  const addMovimiento = async (movimientoData) => {
    const { data, error } = await libroCajaService.createMovimiento(movimientoData);
    if (!error && data) {
      setLibroCaja([data, ...libroCaja]);
    }
    return { data, error };
  };

  const updateMovimiento = async (id, movimientoData) => {
    const { data, error } = await libroCajaService.updateMovimiento(id, movimientoData);
    if (!error && data) {
      setLibroCaja(libroCaja.map(m => m.id === id ? data : m));
    }
    return { data, error };
  };

  const removeMovimiento = async (id) => {
    const { error } = await libroCajaService.deleteMovimiento(id);
    if (!error) {
      setLibroCaja(libroCaja.filter(m => m.id !== id));
    }
    return { error };
  };

  // ==================== RECIBOS ====================
  const loadRecibos = async () => {
    const { data } = await recibosService.getRecibos();
    setRecibos(data);
  };

  const addRecibo = async (reciboData) => {
    const { data, error } = await recibosService.createRecibo(reciboData);
    if (!error && data) {
      setRecibos([data, ...recibos]);
    }
    return { data, error };
  };

  const anularRecibo = async (id) => {
    const { data, error } = await recibosService.anularRecibo(id);
    if (!error && data) {
      setRecibos(recibos.map(r => r.id === id ? data : r));
    }
    return { data, error };
  };

  // ==================== DOCUMENTOS ====================
  const loadDocumentos = async () => {
    const { data } = await documentosService.getDocumentos();
    setDocumentos(data);
  };

  const uploadDocumento = async (file, metadata) => {
    const { data, error } = await documentosService.uploadDocumento(file, metadata);
    if (!error && data) {
      setDocumentos([data, ...documentos]);
    }
    return { data, error };
  };

  const removeDocumento = async (id, url) => {
    const { error } = await documentosService.deleteDocumento(id, url);
    if (!error) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
    return { error };
  };

  // ==================== AVISOS ====================
  const loadAvisos = async () => {
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setAvisos(data || []);
    } catch (error) {
      console.error('Error cargando avisos:', error);
    }
  };

  // ==================== USUARIOS ====================
  const loadUsuarios = async () => {
    try {
      const { data, error } = await usuariosService.getUsuarios();
      if (error) {
        console.error('Error cargando usuarios:', error);
        setUsuarios([]);
      } else {
        setUsuarios(data || []);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsuarios([]);
    }
  };

  const addUsuario = async (usuarioData) => {
  const { data, error } = await usuariosService.createUsuario(usuarioData);
  if (!error && data) {
    setUsuarios([...usuarios, data]);
  }
  return { data, error };
};

const updateUsuario = async (id, usuarioData) => {
  const { data, error } = await usuariosService.updateUsuario(id, usuarioData);
  if (!error && data) {
    setUsuarios(usuarios.map(u => u.id === id ? data : u));
  }
  return { data, error };
};

const removeUsuario = async (id) => {
  const { error } = await usuariosService.deleteUsuario(id);
  if (!error) {
    setUsuarios(usuarios.filter(u => u.id !== id));
  }
  return { error };
};

const cambiarEstadoUsuario = async (id, nuevoEstado) => {
  const { data, error } = await usuariosService.cambiarEstadoUsuario(id, nuevoEstado);
  if (!error && data) {
    setUsuarios(usuarios.map(u => u.id === id ? data : u));
  }
  return { data, error };
};

  // ==================== CÁLCULOS ====================
  const getSociosActivos = () => {
    return socios.filter(s => s.estado === 'activo');
  };

  const getTotalCuotasPendientes = () => {
    return socios.reduce((acc, s) => acc + (s.cuota - s.pagado), 0);
  };

  const getPromedioAsistencia = () => {
    const reunionesFinalizadas = reuniones.filter(r => r.estado === 'finalizada');
    if (reunionesFinalizadas.length === 0) return 0;
    
    const sociosActivos = getSociosActivos().length;
    if (sociosActivos === 0) return 0;

    const totalAsistencias = reunionesFinalizadas.reduce((acc, r) => 
      acc + (r.asistentes?.length || 0), 0
    );
    
    const promedio = (totalAsistencias / reunionesFinalizadas.length / sociosActivos) * 100;
    return Math.round(promedio);
  };

  const getBalance = () => {
    const ingresos = libroCaja
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    
    const egresos = libroCaja
      .filter(m => m.tipo === 'egreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);

    return {
      ingresos,
      egresos,
      balance: ingresos - egresos
    };
  };

  // ==================== REGISTROS MASIVOS ====================
const loadRegistrosMasivos = async () => {
  const { data } = await registroMasivoService.getRegistrosMasivos();
  setRegistrosMasivos(data);
};

const validarDuplicados = async (sociosIds, mes, año) => {
  return await registroMasivoService.validarDuplicados(sociosIds, mes, año);
};

const crearRegistroMasivo = async (registroData, aportes) => {
  const { data, error } = await registroMasivoService.crearRegistroMasivo(registroData, aportes);
  if (!error && data) {
    setRegistrosMasivos([data.registroMasivo, ...registrosMasivos]);
    // Recargar aportes y socios para actualizar las vistas
    await loadAportes();
    await loadSocios();
  }
  return { data, error };
};

const getRegistroMasivoConAportes = async (registroMasivoId) => {
  return await registroMasivoService.getRegistroMasivoConAportes(registroMasivoId);
};

const actualizarAporteIndividual = async (aporteId, aporteData) => {
  const { data, error } = await registroMasivoService.actualizarAporteIndividual(aporteId, aporteData);
  if (!error && data) {
    // Actualizar el aporte en la lista general
    setAportes(aportes.map(a => a.id === aporteId ? data : a));
    // Recargar socios para actualizar montos
    await loadSocios();
  }
  return { data, error };
};

const eliminarRegistroMasivo = async (registroMasivoId) => {
  const { error } = await registroMasivoService.eliminarRegistroMasivo(registroMasivoId);
  if (!error) {
    setRegistrosMasivos(registrosMasivos.filter(rm => rm.id !== registroMasivoId));
    // Recargar aportes y socios
    await loadAportes();
    await loadSocios();
  }
  return { error };
};

  const value = {
    // Estados
    socios,
    aportes,
    proyectos,
    reuniones,
    libroCaja,
    recibos,
    documentos,
    avisos,
    registrosMasivos,
    usuarios,
    loading,
    currentView,
    sidebarOpen,

    // Setters UI
    setCurrentView,
    setSidebarOpen,

    // Funciones de carga
    loadAllData,
    loadSocios,
    loadAportes,
    loadProyectos,
    loadReuniones,
    loadLibroCaja,
    loadRecibos,
    loadDocumentos,
    loadUsuarios,

    // Socios
    addSocio,
    updateSocio,
    removeSocio,

    // Aportes
    addAporte,
    updateAporte,
    removeAporte,

    // Proyectos
    addProyecto,
    updateProyecto,
    removeProyecto,

    // Reuniones
    addReunion,
    updateReunion,
    removeReunion,
    updateAsistentes,
    finalizarReunion,

    // Libro de Caja
    addMovimiento,
    updateMovimiento,
    removeMovimiento,

    // Recibos
    addRecibo,
    anularRecibo,

    // Documentos
    uploadDocumento,
    removeDocumento,

    // Registros Masivos ← AGREGAR ESTA SECCIÓN COMPLETA
    loadRegistrosMasivos,
    validarDuplicados,
    crearRegistroMasivo,
    getRegistroMasivoConAportes,
    actualizarAporteIndividual,
    eliminarRegistroMasivo,

      // Usuarios
    addUsuario,
    updateUsuario,
    removeUsuario,
    cambiarEstadoUsuario,

    // Cálculos
    getSociosActivos,
    getTotalCuotasPendientes,
    getPromedioAsistencia,
    getBalance
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};