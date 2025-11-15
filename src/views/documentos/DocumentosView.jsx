// src/views/documentos/DocumentosView.jsx
import React, { useRef } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocumentos } from '../../hooks/useDocumentos';
import {
  Button,
  SearchBox,
  Table,
  StatCard,
  Loading
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatFileSize, formatDate, getFileIcon } from '../../utils/formatters';

/**
 * Vista de Documentos - Gestión de archivos y documentos
 */
const DocumentosView = () => {
  const { isAdmin } = useAuth();
  const fileInputRef = useRef(null);
  const {
    filteredDocumentos,
    searchTerm,
    setSearchTerm,
    uploading,
    totalDocumentos,
    documentosDelMes,
    tamanoTotalFormateado,
    subirDocumento,
    eliminarDocumento,
    descargarDocumento
  } = useDocumentos();

  // Manejar click en botón subir
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Manejar selección de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await subirDocumento(file, '');
    
    // Limpiar input
    e.target.value = '';
  };

  // Eliminar documento
  const handleDelete = async (id, url) => {
    await eliminarDocumento(id, url);
  };

  // Descargar documento
  const handleDownload = (url, nombre) => {
    descargarDocumento(url, nombre);
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'nombre',
      label: 'Documento',
      render: (nombre, row) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getFileIcon(row.tipo)}</span>
          <span className="font-semibold">{nombre}</span>
        </div>
      )
    },
    {
      key: 'tamano',
      label: 'Tamaño',
      render: (tamano) => formatFileSize(tamano)
    },
    {
      key: 'fecha_subida',
      label: 'Fecha de subida',
      render: (fecha) => formatDate(fecha)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, doc) => (
        <div className="flex gap-2">
          <Button
            variant="icon-edit"
            onClick={() => handleDownload(doc.url, doc.nombre)}
            title="Descargar"
          >
            <Download size={18} />
          </Button>
          {isAdmin && (
            <Button
              variant="icon-delete"
              onClick={() => handleDelete(doc.id, doc.url)}
              title="Eliminar"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Documentos"
        actions={
          isAdmin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <Button
                variant="primary"
                icon={<Plus size={20} />}
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir Documento'}
              </Button>
            </>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total documentos"
          value={totalDocumentos}
          iconColor="blue"
        />

        <StatCard
          label="Espacio usado"
          value={tamanoTotalFormateado}
          iconColor="orange"
        />

        <StatCard
          label="Este mes"
          value={documentosDelMes}
          iconColor="green"
        />
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <SearchBox
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar documentos..."
        />
      </div>

      {/* Loading */}
      {uploading && (
        <div className="mb-6">
          <Loading message="Subiendo documento..." />
        </div>
      )}

      {/* Tabla de documentos */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredDocumentos}
          emptyMessage="No hay documentos subidos"
        />
      </div>
    </div>
  );
};

export default DocumentosView;