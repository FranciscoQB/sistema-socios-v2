// src/views/aportes/AportesView.jsx
import React, { useState } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAportes } from '../../hooks/useAportes';
import { useSocios } from '../../hooks/useSocios';
import {
  Button,
  Table,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select,
  StatCard
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDate, getTodayDate } from '../../utils/formatters';
import { TIPOS_APORTE } from '../../utils/constants';

/**
 * Vista de Aportes - Gestión de aportes y pagos
 */
const AportesView = () => {
  const { isAdmin } = useAuth();
  const { socios } = useSocios();
  const {
    filteredAportes,
    totalRecaudado,
    totalDelMes,
    saveAporte,
    deleteAporte,
    getAporteWithSocio
  } = useAportes();

  const [showModal, setShowModal] = useState(false);

  // Abrir modal
  const openModal = () => {
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Guardar aporte
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const aporteData = {
      id: Date.now(),
      socio_id: parseInt(formData.get('socio_id')),
      fecha: formData.get('fecha'),
      monto: parseFloat(formData.get('monto')),
      concepto: formData.get('concepto'),
      tipo: formData.get('tipo')
    };

    const { success } = await saveAporte(aporteData);
    if (success) {
      closeModal();
    }
  };

  // Eliminar aporte
  const handleDelete = async (id) => {
    await deleteAporte(id);
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'fecha',
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
      key: 'tipo',
      label: 'Tipo',
      render: (tipo) => <Badge variant="blue">{tipo}</Badge>
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (monto) => (
        <span className="font-bold">{formatCurrency(monto)}</span>
      )
    }
  ];

  // Agregar columna de acciones si es admin
  if (isAdmin) {
    columns.push({
      key: 'acciones',
      label: 'Acciones',
      render: (_, aporte) => (
        <div className="flex gap-2">
          <Button
            variant="icon-edit"
            onClick={() => {}}
            title="Descargar recibo"
          >
            <Download size={18} />
          </Button>
          <Button
            variant="icon-delete"
            onClick={() => handleDelete(aporte.id)}
            title="Eliminar"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )
    });
  }

  return (
    <div>
      <PageHeader
        title="Gestión de Aportes"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={openModal}
            >
              Registrar Aporte
            </Button>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total recaudado"
          value={formatCurrency(totalRecaudado)}
          iconColor="green"
        />

        <StatCard
          label="Recaudado este mes"
          value={formatCurrency(totalDelMes)}
          iconColor="blue"
        />

        <StatCard
          label="Aportes este mes"
          value={filteredAportes.length}
          iconColor="orange"
        />
      </div>

      {/* Tabla de aportes */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredAportes}
          emptyMessage="No hay aportes registrados"
        />
      </div>

      {/* Modal de Aporte */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Registrar Aporte"
          size="medium"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Select
                label="Socio"
                name="socio_id"
                placeholder="Seleccione un socio"
                options={socios.map(s => ({
                  value: s.id,
                  label: `${s.nombre} - ${s.lote}`
                }))}
                required
              />

              <Input
                label="Fecha"
                name="fecha"
                type="date"
                defaultValue={getTodayDate()}
                required
              />

              <Input
                label="Monto (S/)"
                name="monto"
                type="number"
                step="0.01"
                required
              />

              <Select
                label="Tipo"
                name="tipo"
                options={[
                  { value: TIPOS_APORTE.CUOTA, label: 'Cuota mensual' },
                  { value: TIPOS_APORTE.EXTRAORDINARIO, label: 'Aporte extraordinario' },
                  { value: TIPOS_APORTE.MULTA, label: 'Multa' },
                  { value: TIPOS_APORTE.OTRO, label: 'Otro' }
                ]}
                required
              />

              <Input
                label="Concepto"
                name="concepto"
                required
              />
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Registrar
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AportesView;