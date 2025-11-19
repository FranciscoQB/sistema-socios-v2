// src/views/recibos/RecibosView.jsx
import React, { useState } from 'react';
import { Download, XCircle, Plus, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecibos } from '../../hooks/useRecibos';
import { useSocios } from '../../hooks/useSocios';
import { useApp } from '../../context/AppContext';
import {
  Button,
  Table,
  Badge,
  Select,
  StatCard,
  Modal,
  ModalFooter,
  Input
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generarReciboPDF } from '../../services/pdf/reciboGenerator';

/**
 * Vista de Recibos - Gestión de recibos de pago
 */
const RecibosView = () => {
  const { isAdmin } = useAuth();
  const { socios } = useSocios();
  const { aportes } = useApp();
  const {
    filteredRecibos,
    filterEstado,
    setFilterEstado,
    totalRecibos,
    recibosEmitidos,
    recibosAnulados,
    generarRecibo,
    anularRecibo,
    getReciboCompleto
  } = useRecibos();

  const [showModal, setShowModal] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState('');
  const [selectedAporte, setSelectedAporte] = useState('');
  const [aportesDelSocio, setAportesDelSocio] = useState([]);

  // Abrir modal para crear recibo
  const openModal = () => {
    setSelectedSocio('');
    setSelectedAporte('');
    setAportesDelSocio([]);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSocio('');
    setSelectedAporte('');
    setAportesDelSocio([]);
  };

  // Cuando selecciona un socio, cargar sus aportes sin recibo
  const handleSocioChange = (socioId) => {
    setSelectedSocio(socioId);
    setSelectedAporte('');

    if (socioId) {
      // Filtrar aportes del socio que no tengan recibo
      const aportesDelSocio = aportes.filter(a => 
        a.socio_id === parseInt(socioId) && 
        !filteredRecibos.some(r => r.aporte_id === a.id)
      );
      setAportesDelSocio(aportesDelSocio);
    } else {
      setAportesDelSocio([]);
    }
  };

  // Crear recibo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAporte) {
      alert('Seleccione un aporte');
      return;
    }

    const { success } = await generarRecibo(parseInt(selectedAporte));
    if (success) {
      closeModal();
    }
  };

  // Anular recibo
  const handleAnular = async (id) => {
    await anularRecibo(id);
  };

  // Descargar recibo en PDF
  const handleDescargar = (recibo) => {
    try {
      const reciboCompleto = getReciboCompleto(recibo.id);
      
      if (!reciboCompleto || !reciboCompleto.socio) {
        alert('No se pudo cargar la información completa del recibo');
        return;
      }

      generarReciboPDF(reciboCompleto);
    } catch (error) {
      console.error('Error descargando recibo:', error);
      alert('Error al generar el PDF del recibo');
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'numero_recibo',
      label: 'N° Recibo',
      render: (numero) => (
        <span className="font-bold text-blue-600">{numero}</span>
      )
    },
    {
      key: 'fecha_emision',
      label: 'Fecha',
      render: (fecha) => formatDate(fecha)
    },
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
      key: 'monto',
      label: 'Monto',
      render: (monto) => (
        <span className="font-bold">{formatCurrency(monto)}</span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado) => (
        <Badge variant={estado === 'emitido' ? 'green' : 'red'}>
          {estado === 'emitido' ? 'Emitido' : 'Anulado'}
        </Badge>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, recibo) => (
        <div className="flex gap-2">
          {recibo.estado === 'emitido' && (
            <>
              <Button
                variant="icon-edit"
                onClick={() => handleDescargar(recibo)}
                title="Descargar PDF"
              >
                <Download size={18} />
              </Button>
              {isAdmin && (
                <Button
                  variant="icon-delete"
                  onClick={() => handleAnular(recibo.id)}
                  title="Anular"
                >
                  <XCircle size={18} />
                </Button>
              )}
            </>
          )}
          {recibo.estado === 'anulado' && (
            <span className="text-sm text-red-600 font-medium">Anulado</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Gestión de Recibos"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={openModal}
            >
              Emitir Recibo
            </Button>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Recibos"
          value={totalRecibos}
          icon={<FileText size={24} />}
          iconColor="blue"
        />

        <StatCard
          label="Emitidos"
          value={recibosEmitidos}
          icon={<FileText size={24} />}
          iconColor="green"
        />

        <StatCard
          label="Anulados"
          value={recibosAnulados}
          icon={<XCircle size={24} />}
          iconColor="orange"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <Select
              label="Estado"
              name="filterEstado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'emitido', label: 'Emitidos' },
                { value: 'anulado', label: 'Anulados' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabla de recibos */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredRecibos}
          emptyMessage="No hay recibos registrados"
        />
      </div>

      {/* Modal de Emitir Recibo */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Emitir Recibo"
          size="medium"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Select
                label="Seleccionar Socio"
                name="socio"
                value={selectedSocio}
                onChange={(e) => handleSocioChange(e.target.value)}
                options={[
                  { value: '', label: 'Seleccione un socio' },
                  ...socios
                    .filter(s => s.estado === 'activo')
                    .map(s => ({
                      value: s.id,
                      label: `${s.nombre} - Lote ${s.lote}`
                    }))
                ]}
                required
              />

              {selectedSocio && (
                <Select
                  label="Seleccionar Aporte"
                  name="aporte"
                  value={selectedAporte}
                  onChange={(e) => setSelectedAporte(e.target.value)}
                  options={[
                    { value: '', label: 'Seleccione un aporte' },
                    ...aportesDelSocio.map(a => ({
                      value: a.id,
                      label: `${formatDate(a.fecha)} - ${a.concepto} - ${formatCurrency(a.monto)}`
                    }))
                  ]}
                  required
                />
              )}

              {selectedSocio && aportesDelSocio.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Este socio no tiene aportes sin recibo.
                  </p>
                </div>
              )}

              {selectedAporte && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">
                    ℹ️ Se generará un recibo para el aporte seleccionado
                  </p>
                </div>
              )}
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={!selectedAporte}
              >
                Emitir Recibo
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecibosView;