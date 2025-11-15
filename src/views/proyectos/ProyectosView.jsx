// src/views/proyectos/ProyectosView.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProyectos } from '../../hooks/useProyectos';
import {
  Button,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select,
  Card
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/formatters';
import { ESTADOS_PROYECTO } from '../../utils/constants';

/**
 * Vista de Proyectos - Gestión de proyectos de la asociación
 */
const ProyectosView = () => {
  const { isAdmin } = useAuth();
  const {
    filteredProyectos,
    saveProyecto,
    deleteProyecto
  } = useProyectos();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Abrir modal
  const openModal = (proyecto = null) => {
    setEditingItem(proyecto);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
  };

  // Guardar proyecto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const proyectoData = {
      id: editingItem ? editingItem.id : Date.now(),
      nombre: formData.get('nombre'),
      estado: formData.get('estado'),
      presupuesto: parseFloat(formData.get('presupuesto')),
      avance: parseInt(formData.get('avance'))
    };

    const { success } = await saveProyecto(proyectoData, !!editingItem);
    if (success) {
      closeModal();
    }
  };

  // Eliminar proyecto
  const handleDelete = async (id) => {
    await deleteProyecto(id);
  };

  // Obtener color del badge según estado
  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case ESTADOS_PROYECTO.COMPLETADO:
        return 'green';
      case ESTADOS_PROYECTO.EN_PROCESO:
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Obtener label del estado
  const getEstadoLabel = (estado) => {
    switch (estado) {
      case ESTADOS_PROYECTO.COMPLETADO:
        return 'Completado';
      case ESTADOS_PROYECTO.EN_PROCESO:
        return 'En proceso';
      default:
        return 'Planificado';
    }
  };

  return (
    <div>
      <PageHeader
        title="Proyectos"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => openModal()}
            >
              Nuevo Proyecto
            </Button>
          )
        }
      />

      {/* Lista de proyectos */}
      <div className="space-y-4">
        {filteredProyectos.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No hay proyectos registrados.
            </p>
          </Card>
        ) : (
          filteredProyectos.map((proyecto) => (
            <Card key={proyecto.id}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {proyecto.nombre}
                    </h3>
                    <Badge variant={getEstadoBadgeVariant(proyecto.estado)}>
                      {getEstadoLabel(proyecto.estado)}
                    </Badge>
                  </div>

                  {/* Progreso */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Avance: {proyecto.avance}%
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        Presupuesto: {formatCurrency(proyecto.presupuesto)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-700 h-full rounded-full transition-all duration-300"
                        style={{ width: `${proyecto.avance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="icon-edit"
                      onClick={() => openModal(proyecto)}
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button
                      variant="icon-delete"
                      onClick={() => handleDelete(proyecto.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Proyecto */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          size="medium"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Nombre del proyecto"
                name="nombre"
                defaultValue={editingItem?.nombre}
                required
              />

              <Select
                label="Estado"
                name="estado"
                defaultValue={
                  editingItem?.estado || ESTADOS_PROYECTO.PLANIFICADO
                }
                options={[
                  {
                    value: ESTADOS_PROYECTO.PLANIFICADO,
                    label: 'Planificado'
                  },
                  {
                    value: ESTADOS_PROYECTO.EN_PROCESO,
                    label: 'En proceso'
                  },
                  {
                    value: ESTADOS_PROYECTO.COMPLETADO,
                    label: 'Completado'
                  }
                ]}
                required
              />

              <Input
                label="Presupuesto (S/)"
                name="presupuesto"
                type="number"
                step="0.01"
                defaultValue={editingItem?.presupuesto}
                required
              />

              <Input
                label="Avance (%)"
                name="avance"
                type="number"
                min="0"
                max="100"
                defaultValue={editingItem?.avance || 0}
                required
              />
            </div>

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={closeModal}>
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

export default ProyectosView;