// src/views/socios/SociosView.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocios } from '../../hooks/useSocios';
import {
  Button,
  SearchBox,
  Table,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/formatters';
import { ESTADOS_SOCIO } from '../../utils/constants';

/**
 * Vista de Socios - Gestión de socios
 */
const SociosView = () => {
  const { isAdmin } = useAuth();
  const {
    filteredSocios,
    searchTerm,
    setSearchTerm,
    saveSocio,
    deleteSocio
  } = useSocios();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Abrir modal
  const openModal = (socio = null) => {
    setEditingItem(socio);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
  };

  // Guardar socio
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const socioData = {
      id: editingItem ? editingItem.id : Date.now(),
      nombre: formData.get('nombre'),
      dni: formData.get('dni'),
      telefono: formData.get('telefono'),
      lote: formData.get('lote'),
      estado: formData.get('estado'),
      cuota: parseFloat(formData.get('cuota')),
      pagado: editingItem ? editingItem.pagado : 0
    };

    const { success } = await saveSocio(socioData, !!editingItem);
    if (success) {
      closeModal();
    }
  };

  // Eliminar socio
  const handleDelete = async (id) => {
    await deleteSocio(id);
  };

  // Columnas de la tabla
  const columns = [
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
  ];

  // Agregar columna de acciones si es admin
  if (isAdmin) {
    columns.push({
      key: 'acciones',
      label: 'Acciones',
      render: (_, socio) => (
        <div className="flex gap-2">
          <Button
            variant="icon-edit"
            onClick={() => openModal(socio)}
            title="Editar"
          >
            <Edit2 size={18} />
          </Button>
          <Button
            variant="icon-delete"
            onClick={() => handleDelete(socio.id)}
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
        title="Gestión de Socios"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => openModal()}
            >
              Agregar Socio
            </Button>
          )
        }
      />

      {/* Buscador */}
      <div className="mb-6">
        <SearchBox
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, DNI o lote..."
        />
      </div>

      {/* Tabla de socios */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredSocios}
          emptyMessage="No se encontraron socios"
        />
      </div>

      {/* Modal de Socio */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? 'Editar Socio' : 'Nuevo Socio'}
          size="medium"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Nombre completo"
                name="nombre"
                defaultValue={editingItem?.nombre}
                required
              />

              <Input
                label="DNI"
                name="dni"
                defaultValue={editingItem?.dni}
                maxLength={8}
                required
              />

              <Input
                label="Teléfono"
                name="telefono"
                defaultValue={editingItem?.telefono}
                required
              />

              <Input
                label="Lote"
                name="lote"
                defaultValue={editingItem?.lote}
                required
              />

              <Select
                label="Estado"
                name="estado"
                defaultValue={editingItem?.estado || ESTADOS_SOCIO.ACTIVO}
                options={[
                  { value: ESTADOS_SOCIO.ACTIVO, label: 'Activo' },
                  { value: ESTADOS_SOCIO.INACTIVO, label: 'Inactivo' }
                ]}
                required
              />

              <Input
                label="Cuota mensual (S/)"
                name="cuota"
                type="number"
                step="0.01"
                defaultValue={editingItem?.cuota || 50}
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
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SociosView;