// src/services/excel/excelService.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Exportar lista de socios a Excel
 */
export const exportarSociosExcel = (socios) => {
  const data = socios.map(socio => ({
    'Nº Socio': socio.numero_socio,
    'Nombre': socio.nombre,
    'Apellido': socio.apellido,
    'DNI': socio.dni,
    'Email': socio.email || '-',
    'Teléfono': socio.telefono || '-',
    'Dirección': socio.direccion || '-',
    'Fecha Ingreso': formatDate(socio.fecha_ingreso),
    'Estado': socio.estado,
    'Cuota Mensual': socio.cuota,
    'Total Pagado': socio.pagado,
    'Saldo Pendiente': socio.cuota - socio.pagado
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Socios');

  // Ajustar anchos de columna
  const colWidths = [
    { wch: 10 }, // Nº Socio
    { wch: 20 }, // Nombre
    { wch: 20 }, // Apellido
    { wch: 12 }, // DNI
    { wch: 25 }, // Email
    { wch: 15 }, // Teléfono
    { wch: 30 }, // Dirección
    { wch: 15 }, // Fecha Ingreso
    { wch: 10 }, // Estado
    { wch: 15 }, // Cuota
    { wch: 15 }, // Pagado
    { wch: 18 }  // Saldo
  ];
  ws['!cols'] = colWidths;

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Socios_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar aportes/pagos a Excel
 */
export const exportarAportesExcel = (aportes, socios) => {
  const data = aportes.map(aporte => {
    const socio = socios.find(s => s.id === aporte.socio_id);
    return {
      'Fecha': formatDate(aporte.fecha),
      'Socio': socio ? `${socio.nombre} ${socio.apellido}` : '-',
      'DNI': socio?.dni || '-',
      'Concepto': aporte.concepto,
      'Monto': aporte.monto,
      'Estado': aporte.estado,
      'Observaciones': aporte.observaciones || '-'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Aportes');

  ws['!cols'] = [
    { wch: 15 },
    { wch: 30 },
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 40 }
  ];

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Aportes_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar libro de caja a Excel
 */
export const exportarLibroCajaExcel = (movimientos) => {
  const data = movimientos.map(mov => ({
    'Fecha': formatDate(mov.fecha),
    'Tipo': mov.tipo.toUpperCase(),
    'Categoría': mov.categoria,
    'Concepto': mov.concepto,
    'Monto': mov.monto,
    'Observaciones': mov.observaciones || '-'
  }));

  // Calcular totales
  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);
  
  const totalEgresos = movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);
  
  const balance = totalIngresos - totalEgresos;

  // Agregar fila de totales
  data.push({});
  data.push({
    'Fecha': '',
    'Tipo': '',
    'Categoría': '',
    'Concepto': 'TOTAL INGRESOS',
    'Monto': totalIngresos,
    'Observaciones': ''
  });
  data.push({
    'Fecha': '',
    'Tipo': '',
    'Categoría': '',
    'Concepto': 'TOTAL EGRESOS',
    'Monto': totalEgresos,
    'Observaciones': ''
  });
  data.push({
    'Fecha': '',
    'Tipo': '',
    'Categoría': '',
    'Concepto': 'BALANCE',
    'Monto': balance,
    'Observaciones': ''
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Libro de Caja');

  ws['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 20 },
    { wch: 35 },
    { wch: 15 },
    { wch: 40 }
  ];

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `LibroCaja_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reuniones a Excel
 */
export const exportarReunionesExcel = (reuniones, socios) => {
  const data = reuniones.map(reunion => {
    const asistentes = reunion.asistentes?.length || 0;
    const porcentaje = socios.length > 0 ? ((asistentes / socios.length) * 100).toFixed(1) : 0;
    
    return {
      'Fecha': formatDate(reunion.fecha),
      'Hora': reunion.hora || '-',
      'Lugar': reunion.lugar || '-',
      'Tema': reunion.tema,
      'Estado': reunion.estado,
      'Asistentes': asistentes,
      '% Asistencia': `${porcentaje}%`,
      'Acuerdos': reunion.acuerdos || '-'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reuniones');

  ws['!cols'] = [
    { wch: 15 },
    { wch: 10 },
    { wch: 25 },
    { wch: 35 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 50 }
  ];

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Reuniones_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar proyectos a Excel
 */
export const exportarProyectosExcel = (proyectos) => {
  const data = proyectos.map(proyecto => ({
    'Nombre': proyecto.nombre,
    'Descripción': proyecto.descripcion || '-',
    'Fecha Inicio': formatDate(proyecto.fecha_inicio),
    'Fecha Fin': proyecto.fecha_fin ? formatDate(proyecto.fecha_fin) : 'En curso',
    'Presupuesto': proyecto.presupuesto || 0,
    'Gastado': proyecto.gastado || 0,
    'Balance': (proyecto.presupuesto || 0) - (proyecto.gastado || 0),
    'Estado': proyecto.estado,
    'Responsable': proyecto.responsable || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Proyectos');

  ws['!cols'] = [
    { wch: 30 },
    { wch: 50 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 25 }
  ];

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Proyectos_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de asistencia detallado
 */
export const exportarAsistenciaExcel = (reuniones, socios) => {
  const reunionesFinalizadas = reuniones.filter(r => r.estado === 'finalizada');
  const sociosActivos = socios.filter(s => s.estado === 'activo');

  const data = sociosActivos.map(socio => {
    const asistencias = reunionesFinalizadas.filter(r => 
      r.asistentes?.includes(socio.id)
    ).length;
    const totalReuniones = reunionesFinalizadas.length;
    const porcentaje = totalReuniones > 0 ? ((asistencias / totalReuniones) * 100).toFixed(1) : 0;

    return {
      'Nº Socio': socio.numero_socio,
      'Nombre': socio.nombre,
      'Apellido': socio.apellido,
      'Asistencias': asistencias,
      'Total Reuniones': totalReuniones,
      '% Asistencia': `${porcentaje}%`,
      'Ausencias': totalReuniones - asistencias
    };
  });

  // Ordenar por porcentaje de asistencia
  data.sort((a, b) => parseFloat(b['% Asistencia']) - parseFloat(a['% Asistencia']));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');

  ws['!cols'] = [
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 }
  ];

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
};