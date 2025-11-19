// src/services/pdf/pdfService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ASOCIACION_INFO } from '../../utils/constants';

/**
 * Configuración base para todos los PDFs
 */
const addHeader = (doc, title) => {
  // Nombre de la asociación
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(ASOCIACION_INFO.nombre, 105, 20, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(ASOCIACION_INFO.ubicacion, 105, 27, { align: 'center' });
  
  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(20, 33, 190, 33);
  
  // Título del documento
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(title, 105, 43, { align: 'center' });
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Página ${i} de ${pageCount} | Generado: ${formatDate(new Date())}`,
      105,
      287,
      { align: 'center' }
    );
  }
};

/**
 * Generar lista de socios en PDF
 */
export const generarListaSociosPDF = (socios, filtro = 'todos') => {
  const doc = new jsPDF();
  
  const titulo = filtro === 'activo' ? 'LISTA DE SOCIOS ACTIVOS' : 
                 filtro === 'inactivo' ? 'LISTA DE SOCIOS INACTIVOS' : 
                 filtro === 'morosos' ? 'LISTA DE SOCIOS MOROSOS' :
                 'LISTA COMPLETA DE SOCIOS';
  
  addHeader(doc, titulo);
  
  let yPos = 55;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Total de socios: ${socios.length}`, 20, yPos);
  doc.text(`Fecha: ${formatDate(new Date())}`, 150, yPos);
  
  yPos += 10;
  
  const sociosData = socios.map(s => [
    s.nombre,
    s.dni,
    s.lote,
    s.telefono || '-',
    formatCurrency(s.cuota),
    formatCurrency(s.pagado),
    s.estado
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Nombre', 'DNI', 'Lote', 'Teléfono', 'Cuota', 'Pagado', 'Estado']],
    body: sociosData,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34], fontSize: 9 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 22 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 20 }
    }
  });
  
  addFooter(doc);
  
  doc.save(`Lista_Socios_${filtro}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Generar reporte financiero en PDF
 */
export const generarReporteFinancieroPDF = (mes, año, movimientos, balance) => {
  const doc = new jsPDF();
  
  addHeader(doc, `REPORTE FINANCIERO - ${mes}/${año}`);
  
  let yPos = 55;
  
  // Resumen general
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('RESUMEN DEL PERÍODO', 20, yPos);
  
  yPos += 10;
  
  doc.autoTable({
    startY: yPos,
    body: [
      ['Total Ingresos:', formatCurrency(balance.ingresos)],
      ['Total Egresos:', formatCurrency(balance.egresos)],
      ['Balance:', formatCurrency(balance.balance)]
    ],
    theme: 'plain',
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', cellWidth: 70 }
    },
    didParseCell: function(data) {
      if (data.row.index === 2) {
        data.cell.styles.fillColor = balance.balance >= 0 ? [34, 139, 34] : [220, 53, 69];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Detalle de movimientos - Ingresos
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('INGRESOS', 20, yPos);
  
  yPos += 10;
  
  const ingresos = movimientos.filter(m => m.tipo === 'ingreso');
  const ingresosData = ingresos.map(m => [
    formatDate(m.fecha),
    m.concepto,
    formatCurrency(m.monto),
    m.categoria || '-'
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Fecha', 'Concepto', 'Monto', 'Categoría']],
    body: ingresosData.length > 0 ? ingresosData : [['No hay ingresos registrados', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 20, right: 20 }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Detalle de movimientos - Egresos
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('EGRESOS', 20, yPos);
  
  yPos += 10;
  
  const egresos = movimientos.filter(m => m.tipo === 'egreso');
  const egresosData = egresos.map(m => [
    formatDate(m.fecha),
    m.concepto,
    formatCurrency(m.monto),
    m.categoria || '-'
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Fecha', 'Concepto', 'Monto', 'Categoría']],
    body: egresosData.length > 0 ? egresosData : [['No hay egresos registrados', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69] },
    margin: { left: 20, right: 20 }
  });
  
  addFooter(doc);
  
  doc.save(`Reporte_Financiero_${mes}_${año}.pdf`);
};

/**
 * Generar reporte de asistencia en PDF
 */
export const generarReporteAsistenciaPDF = (reuniones, socios) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'REPORTE DE ASISTENCIA A REUNIONES');
  
  let yPos = 55;
  
  // Resumen general
  const reunionesFinalizadas = reuniones.filter(r => r.estado === 'finalizada');
  const totalReuniones = reunionesFinalizadas.length;
  const sociosActivos = socios.filter(s => s.estado === 'activo');
  
  doc.setFontSize(10);
  doc.text(`Total de reuniones realizadas: ${totalReuniones}`, 20, yPos);
  yPos += 7;
  doc.text(`Total de socios activos: ${sociosActivos.length}`, 20, yPos);
  
  yPos += 15;
  
  // Calcular asistencia por socio
  const asistenciaPorSocio = sociosActivos.map(socio => {
    const asistencias = reunionesFinalizadas.filter(r => 
      r.asistentes?.includes(socio.id)
    ).length;
    const porcentaje = totalReuniones > 0 ? ((asistencias / totalReuniones) * 100).toFixed(1) : 0;
    
    return [
      socio.nombre,
      socio.dni,
      socio.lote,
      asistencias,
      totalReuniones,
      `${porcentaje}%`
    ];
  });
  
  // Ordenar por porcentaje descendente
  asistenciaPorSocio.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
  
  doc.autoTable({
    startY: yPos,
    head: [['Socio', 'DNI', 'Lote', 'Asistió', 'Total', '% Asistencia']],
    body: asistenciaPorSocio,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 20, right: 20 }
  });
  
  addFooter(doc);
  
  doc.save(`Reporte_Asistencia_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Generar estado de cuenta de un socio
 */
export const generarEstadoCuentaPDF = (socio, aportes) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'ESTADO DE CUENTA');
  
  let yPos = 55;
  
  // Información del socio
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DATOS DEL SOCIO', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Nombre: ${socio.nombre}`, 20, yPos);
  yPos += 7;
  doc.text(`DNI: ${socio.dni}`, 20, yPos);
  yPos += 7;
  doc.text(`Lote: ${socio.lote}`, 20, yPos);
  yPos += 7;
  doc.text(`Estado: ${socio.estado.toUpperCase()}`, 20, yPos);
  
  yPos += 15;
  
  // Resumen financiero
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('RESUMEN FINANCIERO', 20, yPos);
  
  yPos += 10;
  
  const cuotaMensual = socio.cuota;
  const totalPagado = socio.pagado;
  const saldo = cuotaMensual - totalPagado;
  
  doc.autoTable({
    startY: yPos,
    body: [
      ['Cuota Mensual:', formatCurrency(cuotaMensual)],
      ['Total Pagado:', formatCurrency(totalPagado)],
      ['Saldo Pendiente:', formatCurrency(saldo)]
    ],
    theme: 'plain',
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', cellWidth: 70 }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Historial de pagos
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('HISTORIAL DE PAGOS', 20, yPos);
  
  yPos += 10;
  
  const aportesData = aportes.map(aporte => [
    formatDate(aporte.fecha),
    aporte.concepto,
    formatCurrency(aporte.monto),
    aporte.tipo
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Fecha', 'Concepto', 'Monto', 'Tipo']],
    body: aportesData.length > 0 ? aportesData : [['No hay pagos registrados', '', '', '']],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 20, right: 20 }
  });
  
  addFooter(doc);
  
  doc.save(`Estado_Cuenta_${socio.nombre}_${socio.dni}.pdf`);
};