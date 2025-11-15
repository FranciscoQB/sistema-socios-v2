// src/views/asistencia/AsistenciaView.jsx
import React, { useState } from 'react';
import { Plus, Calendar, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReuniones } from '../../hooks/useReuniones';
import { useSocios } from '../../hooks/useSocios';
import {
  Button,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select,
  StatCard,
  Card
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatDate, getTodayDate } from '../../utils/formatters';
import { TIPOS_REUNION, ESTADOS_REUNION } from '../../utils/constants';

/**
 * Vista de Asistencia - Gestión de reuniones y control de asistencia
 */
const AsistenciaView = () => {
  const { isAdmin } = useAuth();
  const { socios, getSociosActivos } = useSocios();
  const {
    filteredReuniones,
    totalReuniones,
    reunionesProgramadas,
    reunionesFinalizadas,
    promedioAsistencia,
    saveReunion,
    deleteReunion,
    toggleAsistencia,
    finalizarReunion,
    getAsistentesInfo,
    getAusentesInfo
  } = useReuniones();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'reunion', 'asistencia', 'ver-asistencia'
  const [reunionActual, setReunionActual] = useState(null);

  const sociosActivos = getSociosActivos();

  // Abrir modal
  const openModal = (type, reunion = null) => {
    setModalType(type);
    setEditingItem(reunion);
    setReunionActual(reunion);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalType('');
    setEditingItem(null);
    setReunionActual(null);
    setShowModal(false);
  };

  // Guardar reunión
  const handleSubmitReunion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const reunionData = {
      id: editingItem ? editingItem.id : Date.now(),
      fecha: formData.get('fecha'),
      hora: formData.get('hora'),
      tema: formData.get('tema'),
      tipo: formData.get('tipo'),
      asistentes: editingItem ? editingItem.asistentes : [],
      estado: editingItem ? editingItem.estado : ESTADOS_REUNION.PROGRAMADA
    };

    const { success } = await saveReunion(reunionData, !!editingItem);
    if (success) {
      closeModal();
    }
  };

  // Eliminar reunión
  const handleDelete = async (id) => {
    await deleteReunion(id);
  };

  // Toggle asistencia
  const handleToggleAsistencia = async (reunionId, socioId) => {
    await toggleAsistencia(reunionId, socioId);
  };

  // Finalizar reunión
  const handleFinalizar = async (reunionId) => {
    const { success } = await finalizarReunion(reunionId);
    if (success) {
      closeModal();
    }
  };

  return (
    <div>
      <PageHeader
        title="Control de Asistencia"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => openModal('reunion')}
            >
              Nueva Reunión
            </Button>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total de reuniones"
          value={totalReuniones}
          iconColor="blue"
        />

        <StatCard
          label="Reuniones finalizadas"
          value={reunionesFinalizadas}
          iconColor="green"
        />

        <StatCard
          label="Asistencia promedio"
          value={`${promedioAsistencia}%`}
          iconColor="orange"
        />
      </div>

      {/* Lista de reuniones */}
      <div className="space-y-4">
        {filteredReuniones.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No hay reuniones registradas. Crea una nueva reunión para comenzar.
            </p>
          </Card>
        ) : (
          filteredReuniones
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .map((reunion) => {
              const asistentes = reunion.asistentes || [];
              const porcentaje = sociosActivos.length > 0
                ? Math.round((asistentes.length / sociosActivos.length) * 100)
                : 0;

              return (
                <Card key={reunion.id}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {reunion.tema}
                      </h3>
                      <div className="flex flex-wrap gap-3 items-center">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar size={16} />
                          {formatDate(reunion.fecha)} - {reunion.hora}
                        </span>
                        <Badge
                          variant={
                            reunion.estado === 'finalizada' ? 'green' : 'blue'
                          }
                        >
                          {reunion.estado === 'finalizada'
                            ? 'Finalizada'
                            : 'Programada'}
                        </Badge>
                        <Badge
                          variant={
                            reunion.tipo === 'ordinaria' ? 'gray' : 'orange'
                          }
                        >
                          {reunion.tipo === 'ordinaria'
                            ? 'Ordinaria'
                            : 'Extraordinaria'}
                        </Badge>
                      </div>

                      {/* Estadísticas de asistencia */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {asistentes.length}
                          </p>
                          <p className="text-xs text-gray-600">Asistentes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {sociosActivos.length - asistentes.length}
                          </p>
                          <p className="text-xs text-gray-600">Ausentes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {porcentaje}%
                          </p>
                          <p className="text-xs text-gray-600">Porcentaje</p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2">
                      {reunion.estado === 'programada' && isAdmin && (
                        <>
                          <Button
                            variant="primary"
                            size="small"
                            icon={<CheckCircle size={16} />}
                            onClick={() => openModal('asistencia', reunion)}
                          >
                            Registrar
                          </Button>
                          <Button
                            variant="icon-edit"
                            onClick={() => openModal('reunion', reunion)}
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Button>
                        </>
                      )}

                      {reunion.estado === 'finalizada' && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => openModal('ver-asistencia', reunion)}
                        >
                          Ver asistentes
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          variant="icon-delete"
                          onClick={() => handleDelete(reunion.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
        )}
      </div>

      {/* Modal de Reunión */}
      {showModal && modalType === 'reunion' && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? 'Editar Reunión' : 'Nueva Reunión'}
          size="medium"
        >
          <form onSubmit={handleSubmitReunion}>
            <div className="space-y-4">
              <Input
                label="Tema de la reunión"
                name="tema"
                defaultValue={editingItem?.tema}
                required
              />

              <Select
                label="Tipo"
                name="tipo"
                defaultValue={editingItem?.tipo || TIPOS_REUNION.ORDINARIA}
                options={[
                  { value: TIPOS_REUNION.ORDINARIA, label: 'Ordinaria' },
                  { value: TIPOS_REUNION.EXTRAORDINARIA, label: 'Extraordinaria' }
                ]}
                required
              />

              <Input
                label="Fecha"
                name="fecha"
                type="date"
                defaultValue={editingItem?.fecha || getTodayDate()}
                required
              />

              <Input
                label="Hora"
                name="hora"
                type="time"
                defaultValue={editingItem?.hora || '19:00'}
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

      {/* Modal de Asistencia */}
      {showModal && modalType === 'asistencia' && reunionActual && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Registrar Asistencia"
          size="large"
        >
          <div className="space-y-4">
            {/* Info de la reunión */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Reunión:</strong> {reunionActual.tema}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fecha:</strong> {formatDate(reunionActual.fecha)} -{' '}
                {reunionActual.hora}
              </p>
            </div>

            {/* Lista de socios */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {sociosActivos.map((socio) => {
                const isPresente = (reunionActual.asistentes || []).includes(
                  socio.id
                );

                return (
                  <div
                    key={socio.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {socio.nombre}
                      </p>
                      <p className="text-sm text-gray-600">Lote: {socio.lote}</p>
                    </div>

                    <Button
                      variant={isPresente ? 'primary' : 'secondary'}
                      size="small"
                      icon={
                        isPresente ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )
                      }
                      onClick={() =>
                        handleToggleAsistencia(reunionActual.id, socio.id)
                      }
                      className={
                        isPresente
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }
                    >
                      {isPresente ? 'Presente' : 'Ausente'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => handleFinalizar(reunionActual.id)}
            >
              Finalizar Reunión
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Modal Ver Asistencia */}
      {showModal && modalType === 'ver-asistencia' && reunionActual && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Lista de Asistentes"
          size="large"
        >
          <div className="space-y-4">
            {/* Info de la reunión */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Reunión:</strong> {reunionActual.tema}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fecha:</strong> {formatDate(reunionActual.fecha)} -{' '}
                {reunionActual.hora}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Asistentes:</strong> {(reunionActual.asistentes || []).length} /{' '}
                {sociosActivos.length}
              </p>
            </div>

            {/* Grid de presentes y ausentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Presentes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-green-500">
                  Presentes ({getAsistentesInfo(reunionActual.id).length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {getAsistentesInfo(reunionActual.id).map((socio) => (
                    <div
                      key={socio.id}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircle size={20} className="text-green-700" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {socio.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          Lote: {socio.lote}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ausentes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-red-500">
                  Ausentes ({getAusentesInfo(reunionActual.id).length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {getAusentesInfo(reunionActual.id).map((socio) => (
                    <div
                      key={socio.id}
                      className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <XCircle size={20} className="text-red-700" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {socio.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          Lote: {socio.lote}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ModalFooter>
            <Button variant="primary" onClick={closeModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default AsistenciaView;