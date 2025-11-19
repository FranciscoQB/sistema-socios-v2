// src/views/reportes/ReportesView.jsx
import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  BarChart3, 
  Calendar, 
  Download, 
  FileText, 
  FileSpreadsheet 
} from 'lucide-react';
import { useReportes } from '../../hooks/useReportes';
import { useSocios } from '../../hooks/useSocios';
import {
  Button,
  Card,
  Modal,
  ModalFooter,
  Table,
  Badge,
  StatCard,
  Select,
  Input
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/formatters';

/**
 * Vista de Reportes - Generación de reportes y análisis
 */
const ReportesView = () => {
  const { socios } = useSocios();
  const {
    generarReporteSocios,
    generarReporteMorosos,
    generarReporteFinanciero,
    generarReporteAsistencias,
    exportarCSV,
    // Nuevas funciones PDF
    exportarSociosPDF,
    exportarMorososPDF,
    exportarFinancieroPDF,
    exportarAsistenciasPDF,
    // Nuevas funciones Excel
    exportarSociosExcel,
    exportarAportesExcel,
    exportarLibroCajaExcel,
    exportarReunionesExcel,
    exportarProyectosExcel,
    exportarAsistenciasExcel
  } = useReportes();

  const [reporteActivo, setReporteActivo] = useState(null);
  const [reporteData, setReporteData] = useState(null);
  
  // Filtros para reportes
  const [filtros, setFiltros] = useState({
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear(),
    estadoSocio: 'todos'
  });

  // Abrir reporte
  const abrirReporte = (tipo) => {
    let data;
    switch (tipo) {
      case 'socios':
        data = generarReporteSocios();
        break;
      case 'morosos':
        data = generarReporteMorosos();
        break;
      case 'financiero':
        data = generarReporteFinanciero();
        break;
      case 'asistencias':
        data = generarReporteAsistencias();
        break;
      default:
        return;
    }
    setReporteData(data);
    setReporteActivo(tipo);
  };

  // Cerrar reporte
  const cerrarReporte = () => {
    setReporteActivo(null);
    setReporteData(null);
  };

  // Exportar reporte CSV (función original)
  const handleExportarCSV = () => {
    exportarCSV(reporteActivo, reporteData);
  };

  // NUEVAS FUNCIONES: Exportar a PDF
  const handleExportarPDF = () => {
    switch (reporteActivo) {
      case 'socios':
        exportarSociosPDF(filtros.estadoSocio);
        break;
      case 'morosos':
        exportarMorososPDF();
        break;
      case 'financiero':
        exportarFinancieroPDF(filtros.mes, filtros.año);
        break;
      case 'asistencias':
        exportarAsistenciasPDF();
        break;
      default:
        break;
    }
  };

  // NUEVAS FUNCIONES: Exportar a Excel
  const handleExportarExcel = () => {
    switch (reporteActivo) {
      case 'socios':
        exportarSociosExcel();
        break;
      case 'morosos':
        exportarSociosExcel(); // Exporta todos, luego se puede filtrar
        break;
      case 'financiero':
        exportarAportesExcel();
        break;
      case 'asistencias':
        exportarAsistenciasExcel();
        break;
      default:
        break;
    }
  };

  // Imprimir reporte
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      <PageHeader 
        title="Reportes" 
        subtitle="Genera reportes detallados en PDF, Excel o CSV"
      />

      {/* Filtros globales */}
      <Card className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros de Reportes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Mes"
            value={filtros.mes}
            onChange={(e) => setFiltros({ ...filtros, mes: parseInt(e.target.value) })}
            options={[
              { value: 1, label: 'Enero' },
              { value: 2, label: 'Febrero' },
              { value: 3, label: 'Marzo' },
              { value: 4, label: 'Abril' },
              { value: 5, label: 'Mayo' },
              { value: 6, label: 'Junio' },
              { value: 7, label: 'Julio' },
              { value: 8, label: 'Agosto' },
              { value: 9, label: 'Septiembre' },
              { value: 10, label: 'Octubre' },
              { value: 11, label: 'Noviembre' },
              { value: 12, label: 'Diciembre' }
            ]}
          />

          <Input
            label="Año"
            type="number"
            value={filtros.año}
            onChange={(e) => setFiltros({ ...filtros, año: parseInt(e.target.value) })}
            min="2020"
            max="2030"
          />

          <Select
            label="Estado de Socio"
            value={filtros.estadoSocio}
            onChange={(e) => setFiltros({ ...filtros, estadoSocio: e.target.value })}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'activo', label: 'Activos' },
              { value: 'inactivo', label: 'Inactivos' }
            ]}
          />
        </div>
      </Card>

      {/* Grid de reportes disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Reporte de Socios */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => abrirReporte('socios')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Reporte de Socios
            </h3>
            <Users size={32} className="text-green-700 opacity-30" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Lista completa de socios activos e inactivos
          </p>
          <Button variant="primary" className="w-full">
            Ver Reporte
          </Button>
        </Card>

        {/* Reporte de Morosos */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => abrirReporte('morosos')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Reporte de Morosos
            </h3>
            <DollarSign size={32} className="text-green-700 opacity-30" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Socios con cuotas pendientes de pago
          </p>
          <Button variant="primary" className="w-full">
            Ver Reporte
          </Button>
        </Card>

        {/* Estado Financiero */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => abrirReporte('financiero')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Estado Financiero
            </h3>
            <BarChart3 size={32} className="text-green-700 opacity-30" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Ingresos, egresos y balance general
          </p>
          <Button variant="primary" className="w-full">
            Ver Reporte
          </Button>
        </Card>

        {/* Reporte de Asistencias */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => abrirReporte('asistencias')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Reporte de Asistencias
            </h3>
            <Calendar size={32} className="text-green-700 opacity-30" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Historial de asistencia por socio
          </p>
          <Button variant="primary" className="w-full">
            Ver Reporte
          </Button>
        </Card>
      </div>

      {/* Sección de Exportaciones Rápidas */}
      <Card title="Exportaciones Rápidas">
        <p className="text-sm text-gray-600 mb-4">
          Exporta datos directamente sin previsualización
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            variant="secondary"
            size="small"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportarSociosExcel}
          >
            Lista de Socios (Excel)
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportarAportesExcel}
          >
            Aportes (Excel)
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportarLibroCajaExcel}
          >
            Libro de Caja (Excel)
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportarReunionesExcel}
          >
            Reuniones (Excel)
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportarProyectosExcel}
          >
            Proyectos (Excel)
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FileText size={16} />}
            onClick={() => exportarSociosPDF('todos')}
          >
            Lista Socios (PDF)
          </Button>
        </div>
      </Card>

      {/* Modal de Reporte */}
      {reporteActivo && reporteData && (
        <Modal
          isOpen={!!reporteActivo}
          onClose={cerrarReporte}
          title={
            reporteActivo === 'socios' ? 'Reporte de Socios' :
            reporteActivo === 'morosos' ? 'Reporte de Morosos' :
            reporteActivo === 'financiero' ? 'Estado Financiero' :
            'Reporte de Asistencias'
          }
          size="xlarge"
        >
          {/* Acciones MEJORADAS con más opciones */}
          <div className="flex gap-3 pb-4 border-b border-gray-200 mb-6">
            <Button
              variant="primary"
              size="small"
              icon={<FileText size={16} />}
              onClick={handleExportarPDF}
            >
              Exportar PDF
            </Button>
            <Button
              variant="primary"
              size="small"
              icon={<FileSpreadsheet size={16} />}
              onClick={handleExportarExcel}
            >
              Exportar Excel
            </Button>
            <Button
              variant="secondary"
              size="small"
              icon={<Download size={16} />}
              onClick={handleExportarCSV}
            >
              Exportar CSV
            </Button>
            <Button
              variant="secondary"
              size="small"
              icon={<FileText size={16} />}
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
          </div>

          {/* Contenido del reporte */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* REPORTE DE SOCIOS */}
            {reporteActivo === 'socios' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard label="Total" value={reporteData.total} />
                  <StatCard
                    label="Activos"
                    value={reporteData.activos}
                    iconColor="green"
                  />
                  <StatCard
                    label="Inactivos"
                    value={reporteData.inactivos}
                    iconColor="red"
                  />
                </div>

                <Table
                  columns={[
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'dni', label: 'DNI' },
                    { key: 'lote', label: 'Lote' },
                    { key: 'telefono', label: 'Teléfono' },
                    {
                      key: 'estado',
                      label: 'Estado',
                      render: (estado) => (
                        <Badge variant={estado === 'activo' ? 'green' : 'red'}>
                          {estado}
                        </Badge>
                      )
                    },
                    {
                      key: 'cuota',
                      label: 'Cuota',
                      render: (cuota) => formatCurrency(cuota)
                    },
                    {
                      key: 'pagado',
                      label: 'Pagado',
                      render: (pagado) => formatCurrency(pagado)
                    }
                  ]}
                  data={reporteData.lista}
                />
              </div>
            )}

            {/* REPORTE DE MOROSOS */}
            {reporteActivo === 'morosos' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Socios Morosos"
                    value={reporteData.cantidad}
                    iconColor="red"
                  />
                  <StatCard
                    label="Deuda Total"
                    value={formatCurrency(reporteData.totalDeuda)}
                    iconColor="orange"
                  />
                  <StatCard
                    label="Promedio Deuda"
                    value={formatCurrency(reporteData.deudaPromedio)}
                  />
                </div>

                {reporteData.cantidad > 0 ? (
                  <Table
                    columns={[
                      { key: 'nombre', label: 'Nombre' },
                      { key: 'dni', label: 'DNI' },
                      { key: 'lote', label: 'Lote' },
                      {
                        key: 'cuota',
                        label: 'Cuota',
                        render: (cuota) => formatCurrency(cuota)
                      },
                      {
                        key: 'pagado',
                        label: 'Pagado',
                        render: (pagado) => formatCurrency(pagado)
                      },
                      {
                        key: 'deuda',
                        label: 'Deuda',
                        render: (deuda) => (
                          <span className="font-bold text-red-600">
                            {formatCurrency(deuda)}
                          </span>
                        )
                      }
                    ]}
                    data={reporteData.lista}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      ¡Excelente! No hay socios con deudas pendientes.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* REPORTE FINANCIERO */}
            {reporteActivo === 'financiero' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Total Ingresos"
                    value={formatCurrency(reporteData.totalIngresos)}
                    iconColor="green"
                  />
                  <StatCard
                    label="Por Cobrar"
                    value={formatCurrency(reporteData.pendiente)}
                    iconColor="orange"
                  />
                  <StatCard
                    label="% Recaudación"
                    value={`${reporteData.porcentajeRecaudacion}%`}
                    iconColor="blue"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Últimos Aportes
                </h3>
                <Table
                  columns={[
                    { key: 'fecha', label: 'Fecha' },
                    {
                      key: 'socio_id',
                      label: 'Socio',
                      render: (socioId) => {
                        const socio = socios.find(s => s.id === socioId);
                        return socio?.nombre || 'N/A';
                      }
                    },
                    { key: 'concepto', label: 'Concepto' },
                    {
                      key: 'tipo',
                      label: 'Tipo',
                      render: (tipo) => <Badge variant="blue">{tipo}</Badge>
                    },
                    {
                      key: 'monto',
                      label: 'Monto',
                      render: (monto) => (
                        <span className="font-bold">
                          {formatCurrency(monto)}
                        </span>
                      )
                    }
                  ]}
                  data={reporteData.ultimosAportes}
                />
              </div>
            )}

            {/* REPORTE DE ASISTENCIAS */}
            {reporteActivo === 'asistencias' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Reuniones Realizadas"
                    value={reporteData.totalReuniones}
                    iconColor="blue"
                  />
                  <StatCard
                    label="Asistencia Promedio"
                    value={`${reporteData.promedioGeneral}%`}
                    iconColor="green"
                  />
                  <StatCard
                    label="Total Socios"
                    value={reporteData.asistenciasPorSocio.length}
                  />
                </div>

                <Table
                  columns={[
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'dni', label: 'DNI' },
                    { key: 'lote', label: 'Lote' },
                    { key: 'asistencias', label: 'Asistencias' },
                    { key: 'totalReuniones', label: 'Total Reuniones' },
                    {
                      key: 'porcentaje',
                      label: 'Porcentaje',
                      render: (porcentaje) => (
                        <Badge
                          variant={
                            porcentaje >= 80
                              ? 'green'
                              : porcentaje >= 50
                              ? 'blue'
                              : 'red'
                          }
                        >
                          {porcentaje}%
                        </Badge>
                      )
                    }
                  ]}
                  data={reporteData.asistenciasPorSocio}
                />
              </div>
            )}
          </div>

          <ModalFooter>
            <Button variant="primary" onClick={cerrarReporte}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default ReportesView;