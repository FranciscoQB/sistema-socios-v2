// src/hooks/useReportes.js
import { useApp } from '../context/AppContext';
import { getCurrentMonth, getMonthName } from '../utils/formatters';
// NUEVAS IMPORTACIONES
import * as pdfService from '../services/pdf/pdfService';
import * as excelService from '../services/excel/excelService';

/**
 * Hook personalizado para generación de reportes
 */
export const useReportes = () => {
  const { 
    socios, 
    aportes, 
    reuniones,
    libroCaja,
    proyectos // Agregar proyectos
  } = useApp();

  // ==================== REPORTE DE SOCIOS ====================
  const generarReporteSocios = () => {
    const sociosActivos = socios.filter(s => s.estado === 'activo');
    const sociosInactivos = socios.filter(s => s.estado === 'inactivo');
    
    return {
      total: socios.length,
      activos: sociosActivos.length,
      inactivos: sociosInactivos.length,
      porcentajeActivos: socios.length > 0 
        ? ((sociosActivos.length / socios.length) * 100).toFixed(1)
        : 0,
      lista: socios
    };
  };

  // ==================== REPORTE DE MOROSOS ====================
  const generarReporteMorosos = () => {
    const morosos = socios.filter(s => 
      s.estado === 'activo' && s.pagado < s.cuota
    );
    
    const totalDeuda = morosos.reduce(
      (acc, s) => acc + (s.cuota - s.pagado), 
      0
    );
    
    return {
      cantidad: morosos.length,
      totalDeuda,
      deudaPromedio: morosos.length > 0 
        ? (totalDeuda / morosos.length).toFixed(2)
        : 0,
      lista: morosos.map(s => ({
        ...s,
        deuda: s.cuota - s.pagado
      })).sort((a, b) => b.deuda - a.deuda)
    };
  };

  // ==================== REPORTE FINANCIERO ====================
  const generarReporteFinanciero = () => {
    // Totales de aportes
    const totalAportes = aportes.reduce(
      (acc, a) => acc + parseFloat(a.monto), 
      0
    );
    
    // Totales de libro de caja
    const ingresos = libroCaja
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    
    const egresos = libroCaja
      .filter(m => m.tipo === 'egreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    
    const balance = ingresos - egresos;

    // Totales de cuotas
    const totalCuotas = socios.reduce(
      (acc, s) => acc + parseFloat(s.cuota), 
      0
    );
    
    const totalPagado = socios.reduce(
      (acc, s) => acc + parseFloat(s.pagado), 
      0
    );
    
    const pendiente = totalCuotas - totalPagado;
    
    const porcentajeRecaudacion = totalCuotas > 0 
      ? ((totalPagado / totalCuotas) * 100).toFixed(1)
      : 0;

    // Aportes por mes
    const aportesPorMes = {};
    aportes.forEach(a => {
      const mes = a.fecha.substring(0, 7);
      aportesPorMes[mes] = (aportesPorMes[mes] || 0) + parseFloat(a.monto);
    });

    // Aportes del mes actual
    const mesActual = getCurrentMonth();
    const aportesDelMes = aportes.filter(a => 
      a.fecha.startsWith(mesActual)
    );

    return {
      totalAportes,
      totalIngresos: ingresos,
      totalEgresos: egresos,
      balance,
      totalCuotas,
      totalPagado,
      pendiente,
      porcentajeRecaudacion,
      aportesPorMes,
      aportesDelMes,
      ultimosAportes: aportes.slice(-10).reverse()
    };
  };

  // ==================== REPORTE DE ASISTENCIAS ====================
  const generarReporteAsistencias = () => {
    const reunionesFinalizadas = reuniones.filter(r => r.estado === 'finalizada');
    const sociosActivos = socios.filter(s => s.estado === 'activo');
    
    // Asistencia por socio
    const asistenciasPorSocio = sociosActivos.map(socio => {
      const asistencias = reunionesFinalizadas.filter(r => 
        r.asistentes && r.asistentes.includes(socio.id)
      ).length;
      
      const porcentaje = reunionesFinalizadas.length > 0 
        ? ((asistencias / reunionesFinalizadas.length) * 100).toFixed(1)
        : 0;

      return {
        ...socio,
        asistencias,
        totalReuniones: reunionesFinalizadas.length,
        porcentaje: parseFloat(porcentaje)
      };
    }).sort((a, b) => b.porcentaje - a.porcentaje);

    // Promedio general
    const promedioGeneral = reunionesFinalizadas.length > 0 && sociosActivos.length > 0
      ? (reunionesFinalizadas.reduce((acc, r) => 
          acc + (r.asistentes?.length || 0), 0
        ) / reunionesFinalizadas.length / sociosActivos.length * 100).toFixed(1)
      : 0;

    // Socios con mejor asistencia (>= 80%)
    const mejorAsistencia = asistenciasPorSocio.filter(s => 
      s.porcentaje >= 80
    );

    // Socios con baja asistencia (< 50%)
    const bajaAsistencia = asistenciasPorSocio.filter(s => 
      s.porcentaje < 50
    );

    return {
      totalReuniones: reunionesFinalizadas.length,
      promedioGeneral: parseFloat(promedioGeneral),
      asistenciasPorSocio,
      mejorAsistencia,
      bajaAsistencia,
      sociosMejorAsistencia: mejorAsistencia.length,
      sociosBajaAsistencia: bajaAsistencia.length
    };
  };

  // ==================== REPORTE DE PROYECTOS ====================
  const generarReporteProyectos = () => {
    const planificados = proyectos.filter(p => p.estado === 'planificado');
    const enProceso = proyectos.filter(p => p.estado === 'en_proceso');
    const completados = proyectos.filter(p => p.estado === 'completado');

    const presupuestoTotal = proyectos.reduce(
      (acc, p) => acc + parseFloat(p.presupuesto || 0),
      0
    );

    const presupuestoCompletados = completados.reduce(
      (acc, p) => acc + parseFloat(p.presupuesto || 0),
      0
    );

    const avancePromedio = proyectos.length > 0
      ? proyectos.reduce((acc, p) => acc + (p.avance || 0), 0) / proyectos.length
      : 0;

    return {
      total: proyectos.length,
      planificados: planificados.length,
      enProceso: enProceso.length,
      completados: completados.length,
      presupuestoTotal,
      presupuestoCompletados,
      presupuestoPendiente: presupuestoTotal - presupuestoCompletados,
      avancePromedio: Math.round(avancePromedio),
      lista: proyectos
    };
  };

  // ==================== EXPORTAR A CSV (ORIGINAL) ====================
  const exportarCSV = (tipo, datos) => {
    let csv = '';
    let filename = '';

    switch(tipo) {
      case 'socios':
        csv = 'Nombre,DNI,Lote,Teléfono,Estado,Cuota,Pagado\n';
        datos.lista.forEach(s => {
          csv += `${s.nombre},${s.dni},${s.lote},${s.telefono},${s.estado},${s.cuota},${s.pagado}\n`;
        });
        filename = 'reporte-socios';
        break;

      case 'morosos':
        csv = 'Nombre,DNI,Lote,Cuota,Pagado,Deuda\n';
        datos.lista.forEach(s => {
          csv += `${s.nombre},${s.dni},${s.lote},${s.cuota},${s.pagado},${s.deuda}\n`;
        });
        filename = 'reporte-morosos';
        break;

      case 'financiero':
        csv = 'Fecha,Socio,Concepto,Tipo,Monto\n';
        datos.ultimosAportes.forEach(a => {
          const socio = socios.find(s => s.id === a.socio_id);
          csv += `${a.fecha},${socio?.nombre || 'N/A'},${a.concepto},${a.tipo},${a.monto}\n`;
        });
        filename = 'reporte-financiero';
        break;

      case 'asistencias':
        csv = 'Nombre,DNI,Lote,Asistencias,Total Reuniones,Porcentaje\n';
        datos.asistenciasPorSocio.forEach(s => {
          csv += `${s.nombre},${s.dni},${s.lote},${s.asistencias},${s.totalReuniones},${s.porcentaje}%\n`;
        });
        filename = 'reporte-asistencias';
        break;

      default:
        return { success: false, error: 'Tipo de reporte no válido' };
    }

    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exportando CSV:', error);
      return { success: false, error };
    }
  };

  // ==================== NUEVAS FUNCIONES: EXPORTAR A PDF ====================
  const exportarSociosPDF = (filtro = 'todos') => {
    const sociosFiltrados = filtro === 'todos' 
      ? socios 
      : socios.filter(s => s.estado === filtro);
    pdfService.generarListaSociosPDF(sociosFiltrados, filtro);
  };

  const exportarMorososPDF = () => {
    const morosos = socios.filter(s => s.cuota > s.pagado && s.estado === 'activo');
    pdfService.generarListaSociosPDF(morosos, 'morosos');
  };

  const exportarFinancieroPDF = (mes, año) => {
    const movimientosMes = libroCaja.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === año;
    });

    const ingresos = movimientosMes
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    
    const egresos = movimientosMes
      .filter(m => m.tipo === 'egreso')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);

    const balance = {
      ingresos,
      egresos,
      balance: ingresos - egresos
    };

    pdfService.generarReporteFinancieroPDF(mes, año, movimientosMes, balance);
  };

  const exportarAsistenciasPDF = () => {
    const sociosActivos = socios.filter(s => s.estado === 'activo');
    pdfService.generarReporteAsistenciaPDF(reuniones, sociosActivos);
  };

  const exportarEstadoCuentaPDF = (socioId) => {
    const socio = socios.find(s => s.id === socioId);
    if (!socio) {
      alert('Socio no encontrado');
      return;
    }
    const aportesSocio = aportes.filter(a => a.socio_id === socioId);
    pdfService.generarEstadoCuentaPDF(socio, aportesSocio);
  };

  // ==================== NUEVAS FUNCIONES: EXPORTAR A EXCEL ====================
  const exportarSociosExcel = () => {
    excelService.exportarSociosExcel(socios);
  };

  const exportarAportesExcel = () => {
    excelService.exportarAportesExcel(aportes, socios);
  };

  const exportarLibroCajaExcel = () => {
    excelService.exportarLibroCajaExcel(libroCaja);
  };

  const exportarReunionesExcel = () => {
    excelService.exportarReunionesExcel(reuniones, socios);
  };

  const exportarProyectosExcel = () => {
    excelService.exportarProyectosExcel(proyectos);
  };

  const exportarAsistenciasExcel = () => {
    const sociosActivos = socios.filter(s => s.estado === 'activo');
    excelService.exportarAsistenciaExcel(reuniones, sociosActivos);
  };

  return {
    // Funciones originales
    generarReporteSocios,
    generarReporteMorosos,
    generarReporteFinanciero,
    generarReporteAsistencias,
    generarReporteProyectos,
    exportarCSV,
    
    // Nuevas funciones PDF
    exportarSociosPDF,
    exportarMorososPDF,
    exportarFinancieroPDF,
    exportarAsistenciasPDF,
    exportarEstadoCuentaPDF,
    
    // Nuevas funciones Excel
    exportarSociosExcel,
    exportarAportesExcel,
    exportarLibroCajaExcel,
    exportarReunionesExcel,
    exportarProyectosExcel,
    exportarAsistenciasExcel
  };
};